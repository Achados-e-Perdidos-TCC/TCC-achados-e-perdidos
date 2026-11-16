import { useEffect, useState } from "react";

import { userInformation } from "../../private.service.js";

import "./user.css";

import Sidebar from "../components/sidebar/Sidebar.jsx";
import UserObjects from "../components/user-objects/UserObjects.jsx";
import UserProfile from "../components/user-profile/UserProfile.jsx";
import UserNotifications from "../components/user-notifications/UserNotifications.jsx";
import Loading from "../../../../pages/errors/loading/Loading.jsx";

function User() {
  const [userInfos, setUserInfos] = useState(null);
  const [notifications, setNotifications] = useState(0);

  const [pageActive, setPageActive] = useState(() => {
    const savedPage = localStorage.getItem("lastUserPage");
    return savedPage ? Number(savedPage) : 1;
  });

  const [open, setOpen] = useState(() => {
    const sideOpen = localStorage.getItem("sidebarPreference");

    return sideOpen === null ? true : sideOpen === "true";
  });

  useEffect(() => {
    async function getUserInformation() {
      try {
        const data = await userInformation();
        setUserInfos(data);
      } catch (error) {
        console.error("Erro ao carregar informações do usuário:", error);
      }
    }

    getUserInformation();
  }, []);

  useEffect(() => {
    localStorage.setItem("lastUserPage", pageActive);
  }, [pageActive]);

  useEffect(() => {
    localStorage.setItem("sidebarPreference", open);
  }, [open]);

  if (!userInfos) {
    return <Loading />;
  }

  return (
    <section className="user__area">
      <aside className="user__area__sidebar">
        <Sidebar
          userInfos={userInfos}
          pageActive={pageActive}
          setPageActive={setPageActive}
          notifications={notifications}
          open={open}
          setOpen={setOpen}
        />
      </aside>

      <main className="user__area__content">
        <div
          className={`user__area__profile ${
            pageActive === 1 ? "" : "user__none"
          }`}
        >
          <UserProfile userInfos={userInfos} />
        </div>

        <div
          className={`user__area__objects ${
            pageActive === 2 ? "" : "user__none"
          }`}
        >
          <UserObjects open={open} />
        </div>

        <div
          className={`user__area__objects ${
            pageActive === 3 ? "" : "user__none"
          }`}
        >
          <UserNotifications setNotifications={setNotifications} />
        </div>
      </main>
    </section>
  );
}

export default User;
