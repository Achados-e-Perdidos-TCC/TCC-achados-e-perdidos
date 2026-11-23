import { useTranslation } from "react-i18next";

import notFoundIllustration from "../../../assets/icons/notobjects/notFound-illustration.png";

import "./notObjectsRegistered.css";

function NotObjectsRegistered() {
  const { t } = useTranslation();

  return (
    <section className="notobjects-registered">
      {/* ILUSTRAÇÃO */}

      <img
        className="notobjects-registered__illustration"
        src={notFoundIllustration}
        alt={t("pages.noObjectsRegistered.illustrationAlt")}
      />

      {/* TEXTOS */}

      <div className="notobjects-registered__texts">
        <h2 className="notobjects-registered__title">
          {t("pages.noObjectsRegistered.title")}
        </h2>

        <p className="notobjects-registered__subtitle">
          {t("pages.noObjectsRegistered.text")}
        </p>
      </div>
    </section>
  );
}

export default NotObjectsRegistered;
