import { useTranslation } from "react-i18next";

export default function ComingSoon({ title, endpoints = [] }) {
  const { t } = useTranslation();

  return (
    <div className="page">
      <h1>{title}</h1>
      <div className="panel">
        <p>{t("common.comingSoonMessage")}</p>
        {endpoints.length > 0 && (
          <>
            <p className="endpoints-label">{t("common.backendEndpoints")}</p>
            <ul className="endpoints-list">
              {endpoints.map((ep) => (
                <li key={ep}>
                  <code>{ep}</code>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
