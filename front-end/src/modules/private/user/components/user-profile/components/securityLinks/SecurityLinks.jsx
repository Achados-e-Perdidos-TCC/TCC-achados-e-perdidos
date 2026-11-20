import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import "./securityLinks.css";

import padlockBlue from "../../../../../../../assets/icons/userArea/padlock-blue.png";
import arrowGray from "../../../../../../../assets/icons/detalhesObjeto/arrow-gray.svg";

function SecurityLinks() {
  const { t } = useTranslation();

  return (
    <div className="user__security">
      <NavLink
        className="user__security__links__container"
        to="/user-area/change-password"
      >
        <div className="user__security__links__content">
          <img className="user__security__img" src={padlockBlue} alt="" />

          <div className="user__security__text">
            <h4 className="user__security__title">
              {t("account.security.changePassword")}
            </h4>

            <p className="user__security__subtitle">
              {t("account.security.changePasswordDescription")}
            </p>
          </div>
        </div>

        <img className="user__security__arrow" src={arrowGray} alt="" />
      </NavLink>
    </div>
  );
}

export default SecurityLinks;
