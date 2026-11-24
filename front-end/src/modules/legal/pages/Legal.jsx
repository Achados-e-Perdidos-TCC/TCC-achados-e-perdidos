import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import "./legal.css";

function Legal({ type }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = t(`legal.${type}.sections`, { returnObjects: true });

  return (
    <section className="legal">
      <article className="legal__card">
        <span className="legal__eyebrow">{t("legal.eyebrow")}</span>
        <h1 className="legal__title">{t(`legal.${type}.title`)}</h1>
        <p className="legal__updated">{t("legal.updated")}</p>

        <p className="legal__notice" role="note">
          {t("legal.demoNotice")}
        </p>

        {Array.isArray(sections) &&
          sections.map((section, index) => (
            <div key={section.title} className="legal__section">
              <h2>
                {index + 1}. {section.title}
              </h2>
              <p>{section.text}</p>
            </div>
          ))}

        <button
          type="button"
          className="legal__back"
          onClick={() => navigate(-1)}
        >
          {t("common.back")}
        </button>
      </article>
    </section>
  );
}

export default Legal;
