import { useTranslation } from "react-i18next";
import "./Loading.css";

function Loading() {
  const { t } = useTranslation();

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <span className="loading-text">{t("common.loading")}</span>
    </div>
  );
}

export default Loading;
