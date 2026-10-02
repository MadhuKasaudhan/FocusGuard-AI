import { useFetch } from "../hooks/useFetch";
import { useTranslation } from "react-i18next";

function renderItem(item) {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    return Object.entries(item)
      .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
      .join(" · ");
  }
  return String(item);
}

export default function ListCard({ title, endpoint, listKey, icon: Icon }) {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useFetch(endpoint);
  const items = data?.[listKey] || [];

  return (
    <div className="panel insight-card">
      <div className="insight-card-header">
        <h2>
          {Icon && <Icon size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />}
          {title}
        </h2>
      </div>

      {loading && <p className="empty-note">{t("common.loading")}</p>}
      {error && (
        <p className="empty-note">
          {t("common.couldNotLoadData")} {" "}
          <button className="btn-ghost btn-inline" onClick={refetch}>
            {t("common.retry")}
          </button>
        </p>
      )}

      {data && items.length > 0 && (
        <ul className="suggestion-list">
          {items.map((item, i) => (
            <li key={i}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
      {data && items.length === 0 && <p className="empty-note">{t("common.nothingToShowYet")}</p>}
      {data?.summary && <p className="insight-summary">{data.summary}</p>}
      {data?.recommendation && <p className="insight-summary">{data.recommendation}</p>}
    </div>
  );
}
