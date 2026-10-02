"""
Behavioral Analytics Engine
============================
Builds on top of the existing monitoring tables (FocusSession, ActivityLog,
ApplicationUsage, ScreenTimeEvent, TaskSwitchEvent, NotificationLog) to
produce four kinds of analysis:

    - Attention Pattern Analysis
    - Focus Session Analysis
    - Productivity Trend Analysis
    - Distraction Frequency Analysis

The "AI analysis" layer (`BehavioralAI`) is a set of deterministic
statistical/heuristic algorithms: least-squares trend detection, z-score
anomaly detection, hour-of-day pattern histograms, and rule-based pattern
classification, plus template-based narrative summaries. This keeps the
engine fully self-contained with no external API dependency. If you later
want an LLM-generated narrative instead of the templated `summary` field,
that's the one seam to swap out (e.g. wrap `summary` generation with a call
to the Anthropic API) — every other function stays unchanged.
"""

import statistics
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.crud import behavioral_insight as behavioral_insight_crud
from app.models.application_usage import ApplicationUsage
from app.models.focus_session import FocusSession
from app.models.notification_log import NotificationLog
from app.models.screen_time_event import ScreenTimeEvent
from app.models.task_switch_event import TaskSwitchEvent
from app.services.ai_insight_service import generate_ai_insight

DEFAULT_PRODUCTIVE_CATEGORIES = {"work", "productivity", "development", "study", "coding", "writing"}


def _period_bounds(
    start_date: date | None, end_date: date | None, default_days: int = 7
) -> tuple[datetime, datetime]:
    """Normalize an optional date range into UTC datetime bounds [start, end)."""
    if end_date is None:
        end_date = date.today()
    if start_date is None:
        start_date = end_date - timedelta(days=default_days - 1)

    start = datetime.combine(start_date, datetime.min.time(), tzinfo=timezone.utc)
    end = datetime.combine(end_date, datetime.min.time(), tzinfo=timezone.utc) + timedelta(days=1)
    return start, end


# ---------------------------------------------------------------------------
# Core statistical / "AI" building blocks, shared by every analyzer
# ---------------------------------------------------------------------------

class BehavioralAI:
    @staticmethod
    def linear_trend(values: list[float]) -> dict[str, Any]:
        """Least-squares slope of a series, plus a direction label."""
        n = len(values)
        if n < 2:
            return {"slope": 0.0, "direction": "insufficient_data", "confidence": 0.0}

        xs = list(range(n))
        mean_x = statistics.mean(xs)
        mean_y = statistics.mean(values)
        numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, values))
        denominator = sum((x - mean_x) ** 2 for x in xs)
        slope = numerator / denominator if denominator else 0.0

        spread = statistics.pstdev(values) if n > 1 else 0.0
        confidence = round(min(1.0, abs(slope) / spread), 2) if spread else (1.0 if slope == 0 else 0.5)

        if abs(slope) < 0.01 * (mean_y or 1):
            direction = "stable"
        elif slope > 0:
            direction = "improving"
        else:
            direction = "declining"

        return {"slope": round(slope, 4), "direction": direction, "confidence": confidence}

    @staticmethod
    def detect_anomalies(values: list[float], z_threshold: float = 1.5) -> list[int]:
        """Indices of values deviating more than z_threshold std-devs from the mean."""
        if len(values) < 3:
            return []
        mean = statistics.mean(values)
        stdev = statistics.pstdev(values)
        if stdev == 0:
            return []
        return [i for i, v in enumerate(values) if abs((v - mean) / stdev) >= z_threshold]

    @staticmethod
    def hourly_histogram(timestamps: list[datetime]) -> dict[int, int]:
        histogram: dict[int, int] = defaultdict(int)
        for ts in timestamps:
            histogram[ts.hour] += 1
        return dict(sorted(histogram.items()))

    @staticmethod
    def peak_hours(histogram: dict[int, int], top_n: int = 3) -> list[int]:
        return [hour for hour, _ in sorted(histogram.items(), key=lambda kv: kv[1], reverse=True)[:top_n]]

    @staticmethod
    def classify_scale(score: float, bands: list[tuple[float, str]]) -> str:
        """Map a 0-100 score onto ordered (threshold, label) bands, highest first.
        e.g. [(80, 'excellent'), (60, 'good'), (40, 'moderate'), (0, 'poor')]."""
        for threshold, label in bands:
            if score >= threshold:
                return label
        return bands[-1][1]


# ---------------------------------------------------------------------------
# Attention Pattern Analysis
# ---------------------------------------------------------------------------

class AttentionPatternAnalyzer:
    @staticmethod
    def analyze(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date)

        switches = (
            db.query(TaskSwitchEvent)
            .filter(
                TaskSwitchEvent.user_id == user_id,
                TaskSwitchEvent.switched_at >= start,
                TaskSwitchEvent.switched_at < end,
            )
            .order_by(TaskSwitchEvent.switched_at)
            .all()
        )
        screen_events = (
            db.query(ScreenTimeEvent)
            .filter(
                ScreenTimeEvent.user_id == user_id,
                ScreenTimeEvent.captured_at >= start,
                ScreenTimeEvent.captured_at < end,
            )
            .all()
        )

        num_days = max(1, (end - start).days)
        switch_timestamps = [s.switched_at for s in switches]
        gaps_minutes = [
            (curr - prev).total_seconds() / 60 for prev, curr in zip(switch_timestamps, switch_timestamps[1:])
        ]

        avg_gap = round(statistics.mean(gaps_minutes), 2) if gaps_minutes else None
        switches_per_day = round(len(switches) / num_days, 2)

        histogram = BehavioralAI.hourly_histogram(switch_timestamps)
        peak_hours = BehavioralAI.peak_hours(histogram)

        task_pairs = Counter((s.previous_task or "unknown", s.next_task or "unknown") for s in switches)
        top_task_pairs = [{"from": a, "to": b, "count": c} for (a, b), c in task_pairs.most_common(5)]

        avg_window_duration = (
            round(statistics.mean([e.duration_seconds or 0 for e in screen_events]) / 60, 2)
            if screen_events
            else None
        )

        # Fewer switches per day + longer average gap between switches => higher stability.
        stability_score = max(
            0.0,
            min(
                100.0,
                round(100 - switches_per_day * 4 - (0 if avg_gap is None else max(0, 20 - avg_gap)), 2),
            ),
        )
        pattern_label = BehavioralAI.classify_scale(
            stability_score,
            [(75, "stable"), (50, "moderate"), (25, "scattered"), (0, "highly_fragmented")],
        )

        summary = (
            f"Recorded {len(switches)} task switches over {num_days} day(s) "
            f"({switches_per_day}/day). Attention pattern classified as '{pattern_label}'."
        )
        if peak_hours:
            summary += f" Most switching activity occurs around hour(s) {peak_hours} (24h)."

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "total_task_switches": len(switches),
            "switches_per_day": switches_per_day,
            "average_gap_between_switches_minutes": avg_gap,
            "average_screen_window_minutes": avg_window_duration,
            "peak_distraction_hours": peak_hours,
            "hourly_switch_histogram": histogram,
            "top_task_transitions": top_task_pairs,
            "attention_stability_score": stability_score,
            "pattern_label": pattern_label,
            "summary": summary,
        }


# ---------------------------------------------------------------------------
# Focus Session Analysis
# ---------------------------------------------------------------------------

class FocusSessionAnalyzer:
    @staticmethod
    def analyze(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date)

        sessions = (
            db.query(FocusSession)
            .filter(
                FocusSession.user_id == user_id,
                FocusSession.started_at >= start,
                FocusSession.started_at < end,
            )
            .order_by(FocusSession.started_at)
            .all()
        )

        total = len(sessions)
        completed = sum(1 for s in sessions if s.is_completed)
        completion_rate = round((completed / total) * 100, 2) if total else 0.0
        durations = [s.duration_minutes or 0 for s in sessions]

        avg_duration = round(statistics.mean(durations), 2) if durations else 0.0
        median_duration = round(statistics.median(durations), 2) if durations else 0.0
        consistency_stdev = round(statistics.pstdev(durations), 2) if len(durations) > 1 else 0.0
        consistency_score = max(
            0.0,
            min(100.0, round(100 - (consistency_stdev / avg_duration * 100 if avg_duration else 0), 2)),
        )

        completion_by_hour: dict[int, list[int]] = defaultdict(list)
        for s in sessions:
            completion_by_hour[s.started_at.hour].append(1 if s.is_completed else 0)
        best_hour = (
            max(completion_by_hour, key=lambda h: statistics.mean(completion_by_hour[h]))
            if completion_by_hour
            else None
        )

        trend = BehavioralAI.linear_trend([float(d) for d in durations]) if durations else {
            "slope": 0.0,
            "direction": "insufficient_data",
            "confidence": 0.0,
        }

        anomaly_indices = BehavioralAI.detect_anomalies([float(d) for d in durations])
        anomalous_sessions = [
            {"session_id": sessions[i].id, "duration_minutes": durations[i]} for i in anomaly_indices
        ]

        pattern_label = BehavioralAI.classify_scale(
            completion_rate,
            [(80, "highly_consistent"), (60, "consistent"), (40, "inconsistent"), (0, "erratic")],
        )

        summary = (
            f"{total} focus session(s) logged, {completed} completed ({completion_rate}%). "
            f"Average duration {avg_duration} min, trend is '{trend['direction']}'."
        )
        if best_hour is not None:
            summary += f" Sessions started around hour {best_hour}:00 tend to complete most often."

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "total_sessions": total,
            "completed_sessions": completed,
            "completion_rate": completion_rate,
            "average_duration_minutes": avg_duration,
            "median_duration_minutes": median_duration,
            "consistency_score": consistency_score,
            "best_focus_hour": best_hour,
            "duration_trend": trend,
            "anomalous_sessions": anomalous_sessions,
            "pattern_label": pattern_label,
            "summary": summary,
        }


# ---------------------------------------------------------------------------
# Productivity Trend Analysis
# ---------------------------------------------------------------------------

class ProductivityTrendAnalyzer:
    @staticmethod
    def analyze(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        productive_categories: set[str] | None = None,
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date, default_days=14)
        categories = {c.lower() for c in (productive_categories or DEFAULT_PRODUCTIVE_CATEGORIES)}

        sessions = (
            db.query(FocusSession)
            .filter(
                FocusSession.user_id == user_id,
                FocusSession.started_at >= start,
                FocusSession.started_at < end,
            )
            .all()
        )
        usage_entries = (
            db.query(ApplicationUsage)
            .filter(
                ApplicationUsage.user_id == user_id,
                ApplicationUsage.recorded_at >= start,
                ApplicationUsage.recorded_at < end,
            )
            .all()
        )

        daily_focus_minutes: dict[date, int] = defaultdict(int)
        daily_completed: dict[date, int] = defaultdict(int)
        daily_productive_minutes: dict[date, int] = defaultdict(int)
        daily_unproductive_minutes: dict[date, int] = defaultdict(int)

        for s in sessions:
            day = s.started_at.date()
            daily_focus_minutes[day] += s.duration_minutes or 0
            if s.is_completed:
                daily_completed[day] += 1

        for u in usage_entries:
            day = u.recorded_at.date()
            if (u.category or "").lower() in categories:
                daily_productive_minutes[day] += u.usage_minutes or 0
            else:
                daily_unproductive_minutes[day] += u.usage_minutes or 0

        all_days = sorted({start.date() + timedelta(days=i) for i in range((end - start).days)})
        daily_scores = []
        for day in all_days:
            focus_minutes = daily_focus_minutes.get(day, 0)
            productive_minutes = daily_productive_minutes.get(day, 0)
            unproductive_minutes = daily_unproductive_minutes.get(day, 0)
            completed = daily_completed.get(day, 0)

            score = min(
                100.0,
                round(
                    (focus_minutes / 480) * 60
                    + completed * 5
                    + max(0, (productive_minutes - unproductive_minutes) / 10),
                    2,
                ),
            )
            daily_scores.append(
                {
                    "date": day.isoformat(),
                    "productivity_score": score,
                    "focus_minutes": focus_minutes,
                    "completed_sessions": completed,
                    "productive_minutes": productive_minutes,
                    "unproductive_minutes": unproductive_minutes,
                }
            )

        scores_only = [d["productivity_score"] for d in daily_scores]
        trend = BehavioralAI.linear_trend(scores_only) if scores_only else {
            "slope": 0.0,
            "direction": "insufficient_data",
            "confidence": 0.0,
        }
        avg_score = round(statistics.mean(scores_only), 2) if scores_only else 0.0
        best_day = max(daily_scores, key=lambda d: d["productivity_score"], default=None)
        worst_day = min(daily_scores, key=lambda d: d["productivity_score"], default=None)

        total_productive = sum(daily_productive_minutes.values())
        total_unproductive = sum(daily_unproductive_minutes.values())

        summary = (
            f"Average daily productivity score over {len(all_days)} day(s) is {avg_score}, "
            f"trend is '{trend['direction']}'."
        )
        if best_day and worst_day:
            summary += (
                f" Best day: {best_day['date']} ({best_day['productivity_score']}). "
                f"Worst day: {worst_day['date']} ({worst_day['productivity_score']})."
            )

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "daily_scores": daily_scores,
            "average_productivity_score": avg_score,
            "trend": trend,
            "best_day": best_day,
            "worst_day": worst_day,
            "total_productive_minutes": total_productive,
            "total_unproductive_minutes": total_unproductive,
            "summary": summary,
        }


# ---------------------------------------------------------------------------
# Distraction Frequency Analysis
# ---------------------------------------------------------------------------

class DistractionFrequencyAnalyzer:
    @staticmethod
    def analyze(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date)

        notifications = (
            db.query(NotificationLog)
            .filter(
                NotificationLog.user_id == user_id,
                NotificationLog.created_at >= start,
                NotificationLog.created_at < end,
            )
            .all()
        )
        switches = (
            db.query(TaskSwitchEvent)
            .filter(
                TaskSwitchEvent.user_id == user_id,
                TaskSwitchEvent.switched_at >= start,
                TaskSwitchEvent.switched_at < end,
            )
            .all()
        )

        num_days = max(1, (end - start).days)
        total_distractions = len(notifications) + len(switches)
        distractions_per_day = round(total_distractions / num_days, 2)

        all_timestamps = [n.created_at for n in notifications] + [s.switched_at for s in switches]
        histogram = BehavioralAI.hourly_histogram(all_timestamps)
        peak_hours = BehavioralAI.peak_hours(histogram)

        channel_breakdown = Counter(n.channel or "unknown" for n in notifications)

        daily_counts: dict[date, int] = defaultdict(int)
        for ts in all_timestamps:
            daily_counts[ts.date()] += 1
        all_days = sorted({start.date() + timedelta(days=i) for i in range(num_days)})
        series = [daily_counts.get(d, 0) for d in all_days]

        trend = BehavioralAI.linear_trend([float(v) for v in series]) if series else {
            "slope": 0.0,
            "direction": "insufficient_data",
            "confidence": 0.0,
        }
        anomaly_indices = BehavioralAI.detect_anomalies([float(v) for v in series])
        anomalous_days = [{"date": all_days[i].isoformat(), "count": series[i]} for i in anomaly_indices]

        frequency_score = max(0.0, min(100.0, round(100 - distractions_per_day * 5, 2)))
        pattern_label = BehavioralAI.classify_scale(
            frequency_score,
            [(80, "low_distraction"), (60, "moderate_distraction"), (40, "high_distraction"), (0, "severe_distraction")],
        )

        summary = (
            f"{total_distractions} distraction event(s) over {num_days} day(s) "
            f"({distractions_per_day}/day). Classified as '{pattern_label}'."
        )
        if peak_hours:
            summary += f" Distractions peak around hour(s) {peak_hours} (24h)."

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "total_distractions": total_distractions,
            "distractions_per_day": distractions_per_day,
            "peak_distraction_hours": peak_hours,
            "hourly_histogram": histogram,
            "channel_breakdown": dict(channel_breakdown),
            "daily_counts": [{"date": d.isoformat(), "count": c} for d, c in zip(all_days, series)],
            "trend": trend,
            "anomalous_days": anomalous_days,
            "distraction_control_score": frequency_score,
            "pattern_label": pattern_label,
            "summary": summary,
        }


# ---------------------------------------------------------------------------
# Orchestration layer: runs analyzers and persists results as history
# ---------------------------------------------------------------------------

class BehavioralAnalyticsService:
    @staticmethod
    def attention_pattern_analysis(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        save: bool = True,
        use_ai: bool = False,
    ) -> dict[str, Any]:
        result = AttentionPatternAnalyzer.analyze(db, user_id, start_date, end_date)
        if use_ai:
            ai_summary = generate_ai_insight("attention_pattern", result)
            if ai_summary:
                result["ai_insight"] = ai_summary
        if save:
            start, end = _period_bounds(start_date, end_date)
            behavioral_insight_crud.create_insight(
                db,
                user_id=user_id,
                insight_type="attention_pattern",
                period_start=start,
                period_end=end,
                score=result["attention_stability_score"],
                pattern_label=result["pattern_label"],
                summary=result["summary"],
                metrics=result,
            )
        return result

    @staticmethod
    def focus_session_analysis(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        save: bool = True,
        use_ai: bool = False,
    ) -> dict[str, Any]:
        result = FocusSessionAnalyzer.analyze(db, user_id, start_date, end_date)
        if use_ai:
            ai_summary = generate_ai_insight("focus_session", result)
            if ai_summary:
                result["ai_insight"] = ai_summary
        if save:
            start, end = _period_bounds(start_date, end_date)
            behavioral_insight_crud.create_insight(
                db,
                user_id=user_id,
                insight_type="focus_session",
                period_start=start,
                period_end=end,
                score=result["completion_rate"],
                pattern_label=result["pattern_label"],
                summary=result["summary"],
                metrics=result,
            )
        return result

    @staticmethod
    def productivity_trend_analysis(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        productive_categories: set[str] | None = None,
        save: bool = True,
        use_ai: bool = False,
    ) -> dict[str, Any]:
        result = ProductivityTrendAnalyzer.analyze(db, user_id, start_date, end_date, productive_categories)
        if use_ai:
            ai_summary = generate_ai_insight("productivity_trend", result)
            if ai_summary:
                result["ai_insight"] = ai_summary
        if save:
            start, end = _period_bounds(start_date, end_date, default_days=14)
            behavioral_insight_crud.create_insight(
                db,
                user_id=user_id,
                insight_type="productivity_trend",
                period_start=start,
                period_end=end,
                score=result["average_productivity_score"],
                pattern_label=result["trend"]["direction"],
                summary=result["summary"],
                metrics=result,
            )
        return result

    @staticmethod
    def distraction_frequency_analysis(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        save: bool = True,
        use_ai: bool = False,
    ) -> dict[str, Any]:
        result = DistractionFrequencyAnalyzer.analyze(db, user_id, start_date, end_date)
        if use_ai:
            ai_summary = generate_ai_insight("distraction_frequency", result)
            if ai_summary:
                result["ai_insight"] = ai_summary
        if save:
            start, end = _period_bounds(start_date, end_date)
            behavioral_insight_crud.create_insight(
                db,
                user_id=user_id,
                insight_type="distraction_frequency",
                period_start=start,
                period_end=end,
                score=result["distraction_control_score"],
                pattern_label=result["pattern_label"],
                summary=result["summary"],
                metrics=result,
            )
        return result

    @staticmethod
    def full_report(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        save: bool = True,
        use_ai: bool = False,
    ) -> dict[str, Any]:
        return {
            "attention_pattern": BehavioralAnalyticsService.attention_pattern_analysis(
                db, user_id, start_date, end_date, save, use_ai
            ),
            "focus_session": BehavioralAnalyticsService.focus_session_analysis(
                db, user_id, start_date, end_date, save, use_ai
            ),
            "productivity_trend": BehavioralAnalyticsService.productivity_trend_analysis(
                db, user_id, start_date, end_date, save=save, use_ai=use_ai
            ),
            "distraction_frequency": BehavioralAnalyticsService.distraction_frequency_analysis(
                db, user_id, start_date, end_date, save, use_ai
            ),
        }