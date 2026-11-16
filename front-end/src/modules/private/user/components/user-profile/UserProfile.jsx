import { useState, useEffect } from "react";

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
          return setError("Nome inválido");
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

      setError(
        "Não foi possível atualizar os dados. Verifique se realizou alguma alteração.",
      );
    } catch (erro) {
      if (erro.message === "Telefone inválido") {
        return setError("Telefone inválido");
      }

      if (erro.message === "Estado não selecionado") {
        return setError("Selecione o estado da cidade");
      }

      if (erro.message === "Cidade inválida") {
        return setError("Selecione uma cidade disponível na lista");
      }

      console.error("Erro ao atualizar perfil:", erro);

      setError("Não foi possível salvar as alterações.");
    }
  }

  return (
    <section className="user__profile">
      <header className="user__profile__intro">
        <div>
          <span className="user__profile__eyebrow">MINHA CONTA</span>

          <h1 className="user__profile__text">Meu perfil</h1>

          <p className="user__profile__subtitle">
            Gerencie suas informações pessoais, preferências e segurança da sua
            conta.
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
                Informações pessoais
              </h2>

              <p className="user__profile__header__description">
                Atualize seus dados de identificação e contato.
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
              <h2 className="user__profile__header__subtitle">Segurança</h2>

              <p className="user__profile__header__description">
                Gerencie o acesso e a proteção da sua conta.
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
              <h2 className="user__profile__header__subtitle">Preferências</h2>

              <p className="user__profile__header__description">
                Personalize sua experiência na plataforma.
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
                Zona de perigo
              </h2>

              <p className="user__profile__header__description">
                Ações importantes relacionadas à sua conta.
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
          <span>Salvar alterações</span>
        </button>

        <button
          type="button"
          className="user__profile__cancel__button"
          onClick={() => window.location.reload()}
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}

export default UserProfile;
