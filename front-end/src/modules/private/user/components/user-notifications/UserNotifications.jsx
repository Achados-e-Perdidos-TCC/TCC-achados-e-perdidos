import { hoje, ontem } from "../../../../../utils/date/date";
import { useEffect, useState } from "react";

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
  const [carregando, setCarregando] = useState(true);
  const [notifications, setNotificationsState] = useState([]);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function findMyNotifications() {
      try {
        setCarregando(true);
        setErro(false);

        const usuario = await userInformation();

        // Verifica se o usuário habilitou as notificações
        if (!usuario.preferences.notificationsEnabled) {
          setNotificationEnabled(false);
          setNotificationsState([]);
          setNotifications(0);
          return;
        }

        const resposta = await getNotifications();

        // Proteção: garante que o estado sempre receba um array
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

  // Atualiza a quantidade de notificações não lidas no componente pai
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
    } catch (error) {}
  }

  async function handleReadAllNotifications() {
    try {
      await markAllNotificationsAsRead();

      setNotificationsState((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (error) {}
  }

  // Agrupa as notificações por data
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
    const grupos = [];

    for (const data in notificationsByDate) {
      grupos.push(
        <div key={data} className="user__notifications__principal__container">
          <h2 className="notification__dateTime">
            {data === hoje()
              ? "Hoje"
              : data === ontem()
                ? "Ontem"
                : `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`}
          </h2>

          {notificationsByDate[data].map((value) => (
            <div
              key={value.id}
              onClick={() => handleReadNotification(value.id)}
            >
              <div
                className={`user__notifications__container ${
                  value.read === false ? "read__pending" : ""
                }`}
              >
                <div className="user__notifications__content">
                  {value.type === "PROFILE_UPDATED" ? (
                    <img
                      className="notification__img notification__green__bg"
                      src={editProfileWhite}
                    />
                  ) : value.type === "ITEM_UPDATED" ? (
                    <img
                      className="notification__img notification__orange__bg"
                      src={pencilWhite}
                    />
                  ) : value.type === "POSSIBLE_MATCH" ? (
                    <img
                      className="notification__img notification__blue__bg"
                      src={magnifyingGlassWhite}
                    />
                  ) : (
                    ""
                  )}

                  <div>
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
                    {new Date(value.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {value.read === false ? (
                    <span className="notification__pending"></span>
                  ) : (
                    <span className="notification__no__pending"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>,
      );
    }

    return grupos;
  }

  return (
    <div className="user__notifications">
      <div className="user__notifications__header__container">
        <div>
          <h1 className="user__notifications__text">Notificações</h1>

          <p className="user__notifications__subtitle">
            Acompanhe as novidades sobre seus objetos e interações.{" "}
          </p>
        </div>

        <div
          className="user__notifications__read"
          onClick={handleReadAllNotifications}
        >
          <img className="notifications__email" src={emailBlue} />

          <p>Marcar todas como lidas</p>
        </div>
      </div>

      <div>
        {carregando ? (
          <p>Carregando notificações...</p>
        ) : erro ? (
          <p>Não foi possível carregar as notificações.</p>
        ) : !notificationEnabled ? (
          <p>Você desativou as notificações nas suas preferências.</p>
        ) : notifications.length === 0 ? (
          <p>Você não possui notificações.</p>
        ) : (
          renderNotifications()
        )}
      </div>
    </div>
  );
}

export default UserNotifications;
