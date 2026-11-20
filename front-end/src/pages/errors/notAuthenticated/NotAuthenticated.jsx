import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import "./notAuthenticated.css";

import entrarWhite from "../../../assets/icons/login/entrar-white.png";
import addUserBlue from "../../../assets/icons/notAuthenticated/addUser-blue.png";
import lockedUserBlue from "../../../assets/icons/notAuthenticated/lockedUser-blue.png";

function NotAuthenticated() {
  const { t } = useTranslation();

  return (
    <div className="authenticated__container">
      <div className="authenticated__content">
        <div className="authenticated__upload__image__content">
          <img className="authenticated__upload__image" src={lockedUserBlue} />
        </div>

        <div className="authenticated__texts">
          <h1 className="authenticated__title">
            {t("pages.notAuthenticated.title")}
          </h1>
          <p className="authenticated__subtitle">
            {t("pages.notAuthenticated.text")}
          </p>
        </div>

        <div className="authenticated__container__buttons">
          <NavLink
            className="authenticated__form__button authenticated__button__blue"
            to="/auth/login"
            end
          >
            <img className="authenticated__img__button" src={entrarWhite} />
            <p>{t("pages.notAuthenticated.signIn")}</p>
          </NavLink>

          <NavLink
            className="authenticated__form__button authenticated__button__white"
            to="/auth/register"
            end
          >
            <img classname="authenticated__img__button" src={addUserBlue} />
            <p>{t("pages.notAuthenticated.createAccount")}</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default NotAuthenticated;
