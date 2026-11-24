import { useTranslation } from "react-i18next";

import "./helpCenter.css";
import { useState } from "react";

const CONTACT_EMAIL = "email@exemplo.com";

function HelpCenter() {
  const { t } = useTranslation();
  const items = t("help.items", { returnObjects: true });

  const [disabled, setDisabled] = useState(false);

  return (
    <section className="legal">
      <article className="legal__card">
        <span className="legal__eyebrow">{t("help.eyebrow")}</span>
        <h1 className="legal__title">{t("help.title")}</h1>
        <p className="legal__updated">{t("help.subtitle")}</p>

        <div className="help__list">
          {Array.isArray(items) &&
            items.map((item) => (
              <details key={item.q} className="help__item">
                <summary className="help__question">{item.q}</summary>
                <p className="help__answer">{item.a}</p>
              </details>
            ))}
        </div>

        <div className="help__contact">
          <h2>{t("help.contactTitle")}</h2>
          <p>{t("help.contactText")}</p>
          <div
            className={`legal__back ${disabled ? "legal__desativado" : ""}`}
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={() => {
              setDisabled(true);
            }}
          >
            {disabled ? t("help.contactButtonInfo") : t("help.contactButton")}
          </div>
        </div>
      </article>
    </section>
  );
}

export default HelpCenter;
