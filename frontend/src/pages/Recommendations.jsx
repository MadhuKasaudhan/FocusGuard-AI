import { useTranslation } from "react-i18next";
import { Lightbulb, TrendingUp, HeartPulse, Layers, Clock, Coffee, Sun } from "lucide-react";
import ListCard from "../components/ListCard";
import InsightCard from "../components/InsightCard";

export default function Recommendations() {
  const { t } = useTranslation();

  return (
    <div className="page page-wide">
      <h1>{t("recommendations.title")}</h1>
      <p className="page-subtitle">{t("recommendations.subtitle")}</p>

      <div className="section-block">
        <div className="section-title">{t("recommendations.recommendationEngine")}</div>
        <div className="grid-2">
          <ListCard
            icon={Lightbulb}
            title={t("recommendations.focusImprovementSuggestions")}
            endpoint="/recommendation/focus-improvements"
            listKey="suggestions"
          />
          <ListCard
            icon={TrendingUp}
            title={t("recommendations.personalizedProductivityTips")}
            endpoint="/recommendation/productivity-tips"
            listKey="tips"
          />
          <ListCard
            icon={HeartPulse}
            title={t("recommendations.attentionRecovery")}
            endpoint="/recommendation/attention-recovery"
            listKey="recommendations"
          />
          <InsightCard
            icon={Layers}
            title={t("recommendations.workPatternOptimization")}
            endpoint="/recommendation/work-pattern-optimization"
            scoreKey="recommended_work_block_minutes"
          />
        </div>
      </div>

      <div className="section-block">
        <div className="section-title">{t("recommendations.smartFocusPlanner")}</div>
        <div className="grid-2">
          <ListCard
            icon={Clock}
            title={t("recommendations.optimalWorkSessions")}
            endpoint="/recommendation/optimal-sessions"
            listKey="recommended_sessions"
          />
          <InsightCard
            icon={Coffee}
            title={t("recommendations.breakSchedule")}
            endpoint="/recommendation/break-schedule"
            scoreKey="recommended_break_minutes"
          />
          <ListCard
            icon={Sun}
            title={t("recommendations.highFocusTime")}
            endpoint="/recommendation/high-focus-time"
            listKey="high_focus_windows"
          />
        </div>
      </div>
    </div>
  );
}
