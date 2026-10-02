import { useTranslation } from "react-i18next";
import { Bell, GitBranch, MessageSquareWarning, BatteryLow, Gauge, TrendingDown, AlertTriangle, Flame, Compass, ListChecks, CalendarDays } from "lucide-react";
import InsightCard from "../components/InsightCard";
import ListCard from "../components/ListCard";

export default function AIEngine() {
  const { t } = useTranslation();

  return (
    <div className="page page-wide">
      <h1>{t("aiEngine.title")}</h1>
      <p className="page-subtitle">{t("aiEngine.subtitle")}</p>

      <div className="section-block">
        <div className="section-title">{t("aiEngine.distractionDetectionSystem")}</div>
        <div className="grid-2">
          <InsightCard
            icon={Bell}
            title={t("aiEngine.frequentInterruptions")}
            endpoint="/ai/interruptions"
            scoreKey="distractions_per_day"
            patternKey="pattern_label"
          />
          <InsightCard
            icon={GitBranch}
            title={t("aiEngine.contextSwitching")}
            endpoint="/ai/context-switching"
            scoreKey="switches_per_day"
            patternKey="severity"
          />
          <InsightCard
            icon={MessageSquareWarning}
            title={t("aiEngine.notificationImpact")}
            endpoint="/ai/notification-impact"
            scoreKey="estimated_completion_impact"
          />
          <InsightCard
            icon={BatteryLow}
            title={t("aiEngine.focusLoss")}
            endpoint="/ai/focus-loss"
            scoreKey="focus_loss_rate"
          />
        </div>
      </div>

      <div className="section-block">
        <div className="section-title">{t("aiEngine.aiBasedFocusScoring")}</div>
        <div className="grid-2">
          <InsightCard
            icon={Gauge}
            title={t("aiEngine.focusScores")}
            endpoint="/ai/focus-scores"
            scoreKey="average_daily_focus_score"
          />
        </div>
      </div>

      <div className="section-block">
        <div className="section-title">{t("aiEngine.predictiveAnalytics")}</div>
        <div className="grid-2">
          <InsightCard
            icon={TrendingDown}
            title={t("aiEngine.focusDegradationPrediction")}
            endpoint="/ai/focus-degradation-prediction"
            scoreKey="degradation_risk"
          />
          <InsightCard
            icon={AlertTriangle}
            title={t("aiEngine.productivityRisk")}
            endpoint="/ai/productivity-risk"
            scoreKey="productivity_risk_level"
          />
          <InsightCard
            icon={Flame}
            title={t("aiEngine.attentionFatigue")}
            endpoint="/ai/attention-fatigue"
          />
        </div>
      </div>

      <div className="section-block">
        <div className="section-title">{t("aiEngine.insightGeneration")}</div>
        <div className="grid-2">
          <InsightCard
            icon={Compass}
            title={t("aiEngine.attentionLeaks")}
            endpoint="/ai/attention-leaks"
            scoreKey="attention_stability_score"
          />
          <ListCard
            icon={ListChecks}
            title={t("aiEngine.personalizedInsights")}
            endpoint="/ai/personalized-insights"
            listKey="prioritized_insights"
          />
          <InsightCard
            icon={CalendarDays}
            title={t("aiEngine.dailyPerformanceSummary")}
            endpoint="/ai/daily-summary"
            scoreKey="overall_score"
          />
        </div>
      </div>
    </div>
  );
}
