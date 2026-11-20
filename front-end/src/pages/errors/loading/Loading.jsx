import { useTranslation } from "react-i18next";
import "./loading.css";

function Loading() {
  const { t } = useTranslation();

  return (
    <div className="loading__container">
      <div className="loading__content">
        <div className="spinner"></div>

        <div className="loading__content__texts">
          <h1 className="loading__title">{t("pages.profileLoading.title")}</h1>
          <p className="loading__subtitle">{t("pages.profileLoading.slow")}</p>
        </div>
      </div>
    </div>
  );
}

export default Loading;
