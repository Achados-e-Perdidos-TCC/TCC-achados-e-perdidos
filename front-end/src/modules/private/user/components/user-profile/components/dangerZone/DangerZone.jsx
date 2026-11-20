import { useState, useContext } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import { logout, deleteAccount } from "../../../../../private.service";
import { AuthContext } from "../../../../../../../contexts/authContexts/AuthContext.jsx";

import "./dangerZone.css";

function DangerZone() {
  const { t } = useTranslation();

  const { setIsAuthenticated } = useContext(AuthContext);
  const [attempts, setAttempts] = useState(0);

  function userLogout() {
    logout();
    setIsAuthenticated(false);
  }

  async function deleteUserAccount() {
    if (attempts === 0) {
      setAttempts(1);
      return;
    }

    await deleteAccount();
    setIsAuthenticated(false);
  }

  return (
    <div className="user__danger__zone">
      <div className="user__danger__container">
        <div className="user__danger__content">
          <h3 className="user__danger__title">{t("account.danger.logout")}</h3>

          <p className="user__danger__subtitle">
            {t("account.danger.logoutDescription")}
          </p>
        </div>

        <NavLink
          className="user__danger__button"
          to="/"
          end
          onClick={userLogout}
        >
          {t("account.danger.logout")}
        </NavLink>
      </div>

      <div className="user__danger__divider" />

      {attempts === 1 && (
        <div className="user__delete__confirmation">
          <span className="user__delete__confirmation__icon">!</span>

          <div className="user__delete__confirmation__content">
            <strong className="user__delete__confirmation__title">
              {t("account.danger.confirmQuestion")}
            </strong>

            <p className="user__delete__confirmation__subtitle">
              {t("account.danger.confirmWarning")}
            </p>
          </div>
        </div>
      )}

      <div className="user__danger__container">
        <div className="user__danger__content">
          <h3 className="user__danger__title">
            {t("account.danger.deleteAccount")}
          </h3>

          <p className="user__danger__subtitle">
            {t("account.danger.deleteDescription")}
          </p>
        </div>

        <button
          className={`user__danger__button ${
            attempts === 1 ? "user__danger__button--confirm" : ""
          }`}
          type="button"
          onClick={deleteUserAccount}
        >
          {attempts === 1
            ? t("account.danger.confirmDelete")
            : t("account.danger.deleteAccount")}
        </button>
      </div>
    </div>
  );
}

export default DangerZone;
