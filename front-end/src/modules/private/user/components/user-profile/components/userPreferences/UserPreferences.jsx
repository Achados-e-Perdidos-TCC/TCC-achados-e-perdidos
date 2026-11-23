import { useState } from "react";
import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";

import "./userPreferences.css";

function UserPreferences({
  ativo1,
  showEmailOnItems,
  setAtivo1,
  setShowEmailOnItems,
}) {
  const { t } = useTranslation();

  const [temaAberto, setTemaAberto] = useState(false);

  const { tema, setTema } = useOutletContext();

  return (
    <div className="user__profile__preferences">
      {/* Notificações */}
      <div className="user__profile__preferences__container">
        <div className="user__profile__preferences__info">
          <h4 className="user__profile__preferences__title">
            {t("account.preferences.receiveNotifications")}
          </h4>

          <p className="user__profile__preferences__subtitle">
            {t("account.preferences.receiveNotificationsDescription")}
          </p>
        </div>

        <button
          type="button"
          className={`preference__button ${ativo1 ? "ativo1" : ""}`}
          onClick={() => setAtivo1(!ativo1)}
          aria-label={t("account.preferences.toggleNotifications")}
          aria-pressed={ativo1}
        >
          <span />
        </button>
      </div>

      <hr />

      {/* Divulgação do e-mail */}
      <div className="user__profile__preferences__container">
        <div className="user__profile__preferences__info">
          <h4 className="user__profile__preferences__title">
            {t("account.preferences.showEmail")}
          </h4>

          <p className="user__profile__preferences__subtitle">
            {t("account.preferences.showEmailDescription")}
          </p>
        </div>

        <button
          type="button"
          className={`preference__button ${showEmailOnItems ? "ativo3" : ""}`}
          onClick={() => setShowEmailOnItems(!showEmailOnItems)}
          aria-label={t("account.preferences.toggleShowEmail")}
          aria-pressed={showEmailOnItems}
        >
          <span />
        </button>
      </div>

      <hr />

      {/* Tema */}
      <div className="user__profile__preferences__container user__profile__preferences__theme">
        <div className="user__profile__select__container">
          <div>
            <h4 className="user__profile__preferences__title">
              {t("account.preferences.themeTitle")}
            </h4>

            <p className="user__profile__preferences__subtitle">
              {t("account.preferences.themeDescription")}
            </p>
          </div>

          <div className="custom__select">
            <button
              type="button"
              className={`custom__select__button ${
                !temaAberto ? "select__button__off" : "select__button__on"
              }`}
              onClick={() => setTemaAberto(!temaAberto)}
              aria-expanded={temaAberto}
            >
              <span>
                {tema === "light"
                  ? t("account.preferences.themeLight")
                  : t("account.preferences.themeDark")}
              </span>
            </button>

            {temaAberto && (
              <div className="custom-select__options">
                <button
                  type="button"
                  className="custom-select__option"
                  onClick={() => {
                    setTema("light");
                    setTemaAberto(false);
                  }}
                >
                  {t("account.preferences.themeLight")}
                </button>

                <button
                  type="button"
                  className="custom-select__option"
                  onClick={() => {
                    setTema("dark");
                    setTemaAberto(false);
                  }}
                >
                  {t("account.preferences.themeDark")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPreferences;
