import { hoje, ontem } from "../../../../../utils/date/date";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import "./userNotifications.css";

import {
  notification as getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  userInformation,
} from "../../../private.service";

import magnifyingGlassWhite from "../../../../../assets/icons/userArea/magnifyingglass-white.png";
import editProfileWhite from "../../../../../assets/icons/userArea/editprofile-white.png";
import pencilWhite from "../../../../../assets/icons/userArea/pencil-white.png";
import emailBlue from "../../../../../assets/icons/userArea/email-blue.png";

function UserNotifications({ setNotifications }) {
  const { t } = useTranslation();

  const [carregando, setCarregando] = useState(true);
  const [notifications, setNotificationsState] = useState([]);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [erro, setErro] = useState(false);
  const [marcandoTodas, setMarcandoTodas] = useState(false);

  useEffect(() => {
    async function findMyNotifications() {
      try {
        setCarregando(true);
        setErro(false);

        const usuario = await userInformation();

        if (!usuario.preferences?.notificationsEnabled) {
          setNotificationEnabled(false);
          setNotificationsState([]);
          return;
        }

        setNotificationEnabled(true);

        const resposta = await getNotifications();

        setNotificationsState(Array.isArray(resposta) ? resposta : []);
      } catch (error) {
        setErro(true);
        setNotificationsState([]);
      } finally {
        setCarregando(false);
      }
    }

    findMyNotifications();
  }, []);

  useEffect(() => {
    const notificationsDisplayed = notifications.filter(
      (value) => value.read === false,
    ).length;

    setNotifications(notificationsDisplayed);
  }, [notifications, setNotifications]);

  async function handleReadNotification(id) {
    try {
      await markNotificationAsRead(id);

      setNotificationsState((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Não foi possível marcar a notificação como lida.", error);
    }
  }

  async function handleReadAllNotifications() {
    if (marcandoTodas || notifications.every((value) => value.read)) return;

    try {
      setMarcandoTodas(true);

      await markAllNotificationsAsRead();

      setNotificationsState((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (error) {
      console.error(
        "Não foi possível marcar todas as notificações como lidas.",
        error,
      );
    } finally {
      setMarcandoTodas(false);
    }
  }

  const notificationsByDate = notifications.reduce((value, array) => {
    if (!array.createdAt) return value;

    const date = array.createdAt.slice(0, 10);

    if (!value[date]) {
      value[date] = [];
    }

    value[date].push(array);

    return value;
  }, {});

  function renderNotifications() {
    return Object.entries(notificationsByDate).map(([data, grupo]) => (
      <div key={data} className="user__notifications__principal__container">
        <h2 className="notification__dateTime">
          {data === hoje()
            ? t("common.today")
            : data === ontem()
              ? t("common.yesterday")
              : `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`}
        </h2>

        <div className="user__notifications__list">
          {grupo.map((value) => (
            <button
              key={value.id}
              type="button"
              className={`user__notifications__container ${
                value.read === false ? "read__pending" : ""
              }`}
              onClick={() => {
                if (value.read === false) {
                  handleReadNotification(value.id);
                }
              }}
              aria-label={t("account.notifications.aria", {
                title: value.title,
                status:
                  value.read === false
                    ? t("account.notifications.unread")
                    : t("account.notifications.read"),
              })}
            >
              <div className="user__notifications__content">
                {value.type === "PROFILE_UPDATED" ? (
                  <img
                    className="notification__img notification__green__bg"
                    src={editProfileWhite}
                    alt=""
                  />
                ) : value.type === "ITEM_UPDATED" ? (
                  <img
                    className="notification__img notification__orange__bg"
                    src={pencilWhite}
                    alt=""
                  />
                ) : value.type === "POSSIBLE_MATCH" ? (
                  <img
                    className="notification__img notification__blue__bg"
                    src={magnifyingGlassWhite}
                    alt=""
                  />
                ) : null}

                <div className="notification__content">
                  <h3 className="notification__content__title">
                    {value.title}
                  </h3>

                  <p className="notification__content__subtitle">
                    {value.message}
                  </p>
                </div>
              </div>

              <div className="user__notifications__extra__infos">
                <p className="notification__content__hour">
                  {value.createdAt
                    ? new Date(value.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </p>

                <span
                  className={
                    value.read === false
                      ? "notification__pending"
                      : "notification__no__pending"
                  }
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    ));
  }

  const possuiNotificacoesNaoLidas = notifications.some(
    (value) => value.read === false,
  );

  return (
    <div className="user__notifications">
      <div className="user__notifications__header__container">
        <div>
          <h1 className="user__notifications__text">
            {t("account.notifications.title")}
          </h1>

          <p className="user__notifications__subtitle">
            {t("account.notifications.subtitle")}
          </p>
        </div>

        <button
          type="button"
          className="user__notifications__read"
          onClick={handleReadAllNotifications}
          disabled={!possuiNotificacoesNaoLidas || marcandoTodas}
        >
          <img className="notifications__email" src={emailBlue} alt="" />

          <span>
            {marcandoTodas
              ? t("account.notifications.updating")
              : t("account.notifications.markAllRead")}
          </span>
        </button>
      </div>

      <div className="user__notifications__body">
        {carregando ? (
          <div className="user__notifications__state">
            <p>{t("account.notifications.loading")}</p>
          </div>
        ) : erro ? (
          <div className="user__notifications__state">
            <p>{t("account.notifications.loadError")}</p>
          </div>
        ) : !notificationEnabled ? (
          <div className="user__notifications__state">
            <p>{t("account.notifications.disabled")}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="user__notifications__state">
            <p>{t("account.notifications.empty")}</p>
          </div>
        ) : (
          renderNotifications()
        )}
      </div>
    </div>
  );
}

export default UserNotifications;
