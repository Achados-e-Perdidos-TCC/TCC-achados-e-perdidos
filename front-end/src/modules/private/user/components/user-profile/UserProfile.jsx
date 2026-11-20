import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  updateProfile,
  updatePreferences,
  imageUpload,
} from "../../../../auth/auth.service.js";

import {
  validaCidade,
  verificaTelefone,
} from "../../../../../utils/inputs/inputs.js";

import FormInfos from "./components/formInfos/FormInfos.jsx";
import SecurityLinks from "./components/securityLinks/SecurityLinks.jsx";
import UserPreferences from "./components/userPreferences/UserPreferences.jsx";
import DangerZone from "./components/dangerZone/DangerZone.jsx";
import PhotoCard from "./components/photoCard/PhotoCard.jsx";

import cidadesBrasil from "../../../../../utils/json/cidade-estados.json";

import "./UserProfile.css";

import userBlue from "../../../../../assets/icons/register/user-blue.png";
import configBlue from "../../../../../assets/icons/userArea/config-blue.png";
import shieldBlue from "../../../../../assets/icons/userArea/protect-blue.png";
import dangerRed from "../../../../../assets/icons/userArea/danger-red.png";
import saveWhite from "../../../../../assets/icons/userArea/save-white.png";

function UserProfile({ userInfos }) {
  const { t } = useTranslation();

  const [inputNameState, setInputNameState] = useState(userInfos.name ?? "");
  const [inputEmailState, setInputEmailState] = useState(userInfos.email ?? "");
  const [inputTelephoneState, setInputTelephoneState] = useState(
    userInfos.phone ?? "",
  );

  const [inputCityState, setInputCityState] = useState(userInfos.city ?? "");
  const [inputState, setInputState] = useState("");

  const [ativo1, setAtivo1] = useState(
    userInfos.preferences?.notificationsEnabled ?? true,
  );

  const [showEmailOnItems, setShowEmailOnItems] = useState(
    userInfos.preferences?.showEmailOnItems ?? true,
  );

  const [avatar, setAvatar] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [error, setError] = useState();

  const todasAsCidades = [];

  cidadesBrasil.estados.forEach((estado) => {
    estado.cidades.forEach((cidade) => {
      todasAsCidades.push({
        cidade,
        estado: estado.sigla,
      });
    });
  });

  useEffect(() => {
    if (userInfos.city) {
      const estadoEncontrado = cidadesBrasil.estados.find((estado) =>
        estado.cidades.includes(userInfos.city),
      );

      if (estadoEncontrado) {
        setInputState(estadoEncontrado.sigla);
      }
    }
  }, [userInfos.city]);

  async function changeDataAccount() {
    try {
      setError(undefined);

      let alterou = false;

      const dadosPessoaisAlterados =
        inputNameState !== userInfos.name ||
        inputTelephoneState !== userInfos.phone ||
        inputCityState !== userInfos.city ||
        photo;

      const preferenciasAlteradas =
        ativo1 !== (userInfos.preferences?.notificationsEnabled ?? true) ||
        showEmailOnItems !== (userInfos.preferences?.showEmailOnItems ?? true);

      if (dadosPessoaisAlterados) {
        if (
          inputNameState.trim().length < 3 ||
          inputNameState.trim().length > 100
        ) {
          return setError(t("errors.invalidName"));
        }

        verificaTelefone(inputTelephoneState);
        validaCidade(inputCityState, inputState, todasAsCidades);

        let avatarAtualizado = userInfos.avatarUrl;

        if (photo) {
          const image = await imageUpload(photo);
          avatarAtualizado = image.url;
        }

        await updateProfile(
          inputNameState,
          inputTelephoneState,
          inputCityState,
          avatarAtualizado,
        );

        alterou = true;
      }

      if (preferenciasAlteradas) {
        await updatePreferences({
          notificationsEnabled: ativo1,
          showEmailOnItems,
        });

        alterou = true;
      }

      if (alterou) {
        return window.location.reload();
      }

      setError(t("account.profile.updateFailed"));
    } catch (erro) {
      if (erro.message === "Telefone inválido") {
        return setError(t("errors.invalidPhone"));
      }

      if (erro.message === "Estado não selecionado") {
        return setError(t("errors.stateNotSelected"));
      }

      if (erro.message === "Cidade inválida") {
        return setError(t("errors.invalidCity"));
      }

      console.error("Erro ao atualizar perfil:", erro);

      setError(t("account.profile.saveFailed"));
    }
  }

  return (
    <section className="user__profile">
      <header className="user__profile__intro">
        <div>
          <span className="user__profile__eyebrow">
            {t("account.profile.eyebrow")}
          </span>

          <h1 className="user__profile__text">{t("account.profile.title")}</h1>

          <p className="user__profile__subtitle">
            {t("account.profile.subtitle")}
          </p>
        </div>
      </header>

      <div className="user__profile__photo">
        <PhotoCard
          userInfos={userInfos}
          photo={photo}
          setPhoto={setPhoto}
          avatar={avatar}
          setAvatar={setAvatar}
          setError={setError}
        />
      </div>

      <div className="user__profile__container__contents">
        <section className="user__profile__container__default">
          <div className="user__profile__header">
            <div className="user__profile__icon">
              <img className="user__profile__user" src={userBlue} alt="" />
            </div>

            <div>
              <h2 className="user__profile__header__subtitle">
                {t("account.profile.personalInfoTitle")}
              </h2>

              <p className="user__profile__header__description">
                {t("account.profile.personalInfoSubtitle")}
              </p>
            </div>
          </div>

          <FormInfos
            inputState={inputState}
            inputCityState={inputCityState}
            inputEmailState={inputEmailState}
            setInputNameState={setInputNameState}
            inputNameState={inputNameState}
            inputTelephoneState={inputTelephoneState}
            setInputCityState={setInputCityState}
            setInputEmailState={setInputEmailState}
            setInputTelephoneState={setInputTelephoneState}
            setInputState={setInputState}
            todasAsCidades={todasAsCidades}
          />
        </section>

        <section className="user__profile__container__default">
          <div className="user__profile__header">
            <div className="user__profile__icon">
              <img className="user__profile__shield" src={shieldBlue} alt="" />
            </div>

            <div>
              <h2 className="user__profile__header__subtitle">
                {t("account.profile.securityTitle")}
              </h2>

              <p className="user__profile__header__description">
                {t("account.profile.securitySubtitle")}
              </p>
            </div>
          </div>

          <SecurityLinks />
        </section>

        <section className="user__profile__container__default">
          <div className="user__profile__header">
            <div className="user__profile__icon">
              <img className="user__profile__bell" src={configBlue} alt="" />
            </div>

            <div>
              <h2 className="user__profile__header__subtitle">
                {t("account.profile.preferencesTitle")}
              </h2>

              <p className="user__profile__header__description">
                {t("account.profile.preferencesSubtitle")}
              </p>
            </div>
          </div>

          <UserPreferences
            ativo1={ativo1}
            showEmailOnItems={showEmailOnItems}
            setAtivo1={setAtivo1}
            setShowEmailOnItems={setShowEmailOnItems}
          />
        </section>

        <section className="user__profile__container__default user__profile__container__default__danger">
          <div className="user__profile__header">
            <div className="user__profile__icon user__profile__icon--danger">
              <img className="user__profile__danger" src={dangerRed} alt="" />
            </div>

            <div>
              <h2 className="user__profile__header__subtitle user__profile__header__subtitle__danger">
                {t("account.profile.dangerTitle")}
              </h2>

              <p className="user__profile__header__description">
                {t("account.profile.dangerSubtitle")}
              </p>
            </div>
          </div>

          <DangerZone />
        </section>
      </div>

      {error && (
        <p className="user__error__message" role="alert">
          {error}
        </p>
      )}

      <div className="user__profile__buttons">
        <button
          type="button"
          className="user__profile__save__button"
          onClick={changeDataAccount}
        >
          <img className="user__profile__save" src={saveWhite} alt="" />
          <span>{t("common.saveChanges")}</span>
        </button>

        <button
          type="button"
          className="user__profile__cancel__button"
          onClick={() => window.location.reload()}
        >
          {t("common.cancel")}
        </button>
      </div>
    </section>
  );
}

export default UserProfile;
