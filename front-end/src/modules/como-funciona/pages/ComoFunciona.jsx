import "./ComoFunciona.css";

import { useTranslation } from "react-i18next";

const etapas = [
  { chave: "register" },
  { chave: "search" },
  { chave: "details" },
];

function ComoFunciona() {
  const { t } = useTranslation();

  return (
    <section className="como__funciona" id="como-funciona">
      <div className="como__funciona__container">
        <div className="como__funciona__header">
          <span className="como__funciona__eyebrow">
            {t("howItWorks.eyebrow")}
          </span>

          <h2>
            {t("howItWorks.howWork1")}{" "}
            <span className="title__h2">
              {t("howItWorks.brandPart1")}{" "}
              <span className="title__h2__e">{t("howItWorks.brandPart2")}</span>{" "}
              {t("howItWorks.brandPart3")}
            </span>{" "}
            {t("howItWorks.howWork2")}
          </h2>

          <p>{t("howItWorks.intro")}</p>
        </div>

        <div className="como__funciona__etapas">
          {etapas.map((etapa, index) => {
            const numero = t(`howItWorks.steps.${etapa.chave}.number`);

            return (
              <article
                className={`como__funciona__card ${
                  index % 2 === 0 ? "card--azul" : "card--verde"
                }`}
                key={numero}
              >
                <div className="como__funciona__card__top">
                  <span className="como__funciona__numero">{numero}</span>

                  <span className="como__funciona__tipo">
                    {t(`howItWorks.steps.${etapa.chave}.type`)}
                  </span>
                </div>

                <div className="como__funciona__card__content">
                  <h3>{t(`howItWorks.steps.${etapa.chave}.title`)}</h3>

                  <p>{t(`howItWorks.steps.${etapa.chave}.description`)}</p>
                </div>

                <div className="como__funciona__card__footer">
                  <span className="como__funciona__indicador" />
                  <span>{t("howItWorks.stepLabel", { number: numero })}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="como__funciona__footer">
          <span className="como__funciona__footer__icon">✓</span>

          <p>
            <strong>{t("howItWorks.control")}</strong>{" "}
            {t("howItWorks.controlText")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ComoFunciona;
