import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import "./notFound.css";

import findBlue from "../../../assets/icons/notFound/find-blue.png";
import houseWhite from "../../../assets/icons/notFound/house-white.png";
import notFoundBlue from "../../../assets/icons/notFound/notFound-blue.png";

function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="notfound">
      <section className="notfound__card">
        {/* ILUSTRAÇÃO */}

        <div className="notfound__illustration">
          <img
            className="notfound__image"
            src={notFoundBlue}
            alt={t("pages.notFound.illustrationAlt")}
          />
        </div>

        {/* TEXTOS */}

        <div className="notfound__texts">
          <span className="notfound__label">{t("pages.notFound.code")}</span>

          <h1 className="notfound__title">{t("pages.notFound.title")}</h1>

          <p className="notfound__subtitle">{t("pages.notFound.text")}</p>
        </div>

        {/* AÇÕES */}

        <div className="notfound__actions">
          <NavLink
            className="notfound__button notfound__button--primary"
            to="/"
            end
          >
            <img src={houseWhite} alt="" />
            <span>{t("pages.notFound.backHome")}</span>
          </NavLink>

          <NavLink
            className="notfound__button notfound__button--secondary"
            to="/buscar-objetos"
            end
          >
            <img src={findBlue} alt="" />
            <span>{t("pages.notFound.search")}</span>
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
