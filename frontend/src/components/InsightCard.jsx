import { useFetch } from "../hooks/useFetch";
import { useTranslation } from "react-i18next";
import { translatePattern } from "../utils/translatePattern";

export default function InsightCard({ title, endpoint, scoreKey, patternKey, icon: Icon }) {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useFetch(endpoint);

  const scoreValue = data && scoreKey ? data[scoreKey] : undefined;
  const displayScore =
    typeof scoreValue === "string" ? translatePattern(t, scoreValue) : scoreValue;

  return (
    <div className="panel insight-card">
      <div className="insight-card-header">
        <h2>
          {Icon && <Icon size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />}
          {title}
        </h2>
        {data && scoreKey && scoreValue !== undefined && scoreValue !== null && (
          <div className="mini-score">{displayScore}</div>
        )}
      </div>
      {loading && <p className="empty-note">{t("common.loading")}</p>}
      {error && (
        <p className="empty-note">
          {t("common.couldNotLoadInsight")}{" "}
          <button className="btn-ghost btn-inline" onClick={refetch}>
            {t("common.retry")}
          </button>
        </p>
      )}
      {data && (
        <>
          {patternKey && data[patternKey] && (
            <span className="pattern-badge">{translatePattern(t, data[patternKey])}</span>
          )}
          <p className="insight-summary">{data.summary}</p>
        </>
      )}
    </div>
  );
}