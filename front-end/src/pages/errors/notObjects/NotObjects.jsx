import { useTranslation } from "react-i18next";
import "./notObjects.css";

import notFoundIllustration from "../../../assets/icons/notobjects/notFound-illustration.png";
import garbageWhite from "../../../assets/icons/notobjects/garbage-white.png";

function NotObjects() {
  const { t } = useTranslation();

  function limparFiltros() {
    window.location.reload();
  }

  return (
    <section className="notobjects">
      {/* ILUSTRAÇÃO */}

      <img
        className="notobjects__illustration"
        src={notFoundIllustration}
        alt={t("pages.noObjects.illustrationAlt")}
      />

      {/* TEXTOS */}

      <div className="notobjects__texts">
        <h2 className="notobjects__title">{t("pages.noObjects.title")}</h2>

        <p className="notobjects__subtitle">{t("pages.noObjects.text")}</p>
      </div>

      {/* AÇÃO */}

      <button
        className="notobjects__button"
        type="button"
        onClick={limparFiltros}
      >
        <img src={garbageWhite} alt="" />
        <span>{t("pages.noObjects.clear")}</span>
      </button>
    </section>
  );
}

export default NotObjects;
