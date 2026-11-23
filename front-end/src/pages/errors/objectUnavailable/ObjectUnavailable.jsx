import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import "../notFound/notFound.css";

import findBlue from "../../../assets/icons/notFound/find-blue.png";
import houseWhite from "../../../assets/icons/notFound/house-white.png";
import notFoundBlue from "../../../assets/icons/notFound/notFound-blue.png";

function ObjectUnavailable() {
  const { t } = useTranslation();

  return (
    <section className="notfound">
      <div className="notfound__card">
        <div className="notfound__illustration">
          <img
            className="notfound__image"
            src={notFoundBlue}
            alt={t("pages.objectUnavailable.illustrationAlt")}
          />
        </div>

        <div className="notfound__texts">
          <span className="notfound__label">
            {t("pages.objectUnavailable.code")}
          </span>

          <h1 className="notfound__title">{t("details.loadError")}</h1>

          <p className="notfound__subtitle">
            {t("pages.objectUnavailable.text")}
          </p>
        </div>

        <div className="notfound__actions">
          <NavLink
            className="notfound__button notfound__button--primary"
            to="/buscar-objetos"
            end
          >
            <img src={findBlue} alt="" />
            <span>{t("pages.notFound.search")}</span>
          </NavLink>

          <NavLink
            className="notfound__button notfound__button--secondary"
            to="/"
            end
          >
            <img src={houseWhite} alt="" />
            <span>{t("pages.notFound.backHome")}</span>
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default ObjectUnavailable;
