import { useEffect } from "react";
import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";

import { loadAvatar } from "../../../../../private.service.js";

import "./photoCard.css";

import userBlue from "../../../../../../../assets/icons/register/user-blue.png";
import calendarGray from "../../../../../../../assets/icons/userArea/calendar-gray.png";
import pencilBlack from "../../../../../../../assets/icons/userArea/pencil-black.png";
import pencilWhite from "../../../../../../../assets/icons/userArea/pencil-white.png";

function PhotoCard({
  userInfos,
  photo,
  setPhoto,
  avatar,
  setAvatar,
  setError,
}) {
  const { t } = useTranslation();

  const { tema } = useOutletContext();

  useEffect(() => {
    async function findAvatar() {
      if (!userInfos.avatarUrl) return;

      try {
        const avatarUrl = await loadAvatar(userInfos.avatarUrl);
        setAvatar(avatarUrl);
      } catch {
        setError(true);
      }
    }

    findAvatar();
  }, [userInfos.avatarUrl, setAvatar, setError]);

  function formattedDate() {
    const months = t("common.months", { returnObjects: true });

    const date = userInfos.createdAt;

    if (!date) return "";

    const formattedMonth = months[Number(date.slice(5, 7)) - 1];
    const formattedYear = date.slice(0, 4);

    return t("account.profile.monthYear", {
      month: formattedMonth,
      year: formattedYear,
    });
  }

  function formattedNameMobile() {
    const nameParts = userInfos.name.trim().split(" ");
    return nameParts.slice(0, 2).join(" ");
  }

  const displayedAvatar = photo
    ? URL.createObjectURL(photo)
    : avatar || userBlue;

  return (
    <div className="user__profile__photo__container">
      <div className="user__profile__photo__content">
        <img
          className={photo || avatar ? "user__com__foto" : "user__sem__foto"}
          src={displayedAvatar}
          alt={t("account.profile.photoTitle")}
        />

        <div className="user__profile__texts__content">
          <h1 className="user__profile__name user__no__responsive">
            {userInfos.name}
          </h1>

          <p className="user__profile__email user__no__responsive">
            {userInfos.email}
          </p>

          <h1 className="user__profile__name user__responsive">
            {formattedNameMobile()}
          </h1>

          <p className="user__profile__email user__responsive">
            {userInfos.email.length > 27
              ? `${userInfos.email.slice(0, 27)}...`
              : userInfos.email}
          </p>

          <div className="user__profile__photo__calendar__content">
            <img
              className="user__profile__calendar"
              src={calendarGray}
              alt=""
            />

            <p>{t("account.profile.memberSince", { date: formattedDate() })}</p>
          </div>
        </div>
      </div>

      <div className="user__profile__edit__photo__container">
        <div className="user__profile__edit__photo__content">
          <img
            className="user__profile__pencil"
            src={tema === "light" ? pencilBlack : pencilWhite}
            alt=""
          />

          <label htmlFor="uploadimage" className="user__profile__photo__upload">
            {t("account.profile.editPhoto")}
          </label>

          <input
            id="uploadimage"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];

              if (selectedFile) {
                setPhoto(selectedFile);
              }
            }}
            hidden
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoCard;
