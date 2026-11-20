import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../contexts/authContexts/AuthContext.jsx";

import {
  imageUpload,
  register,
  updateProfile,
  updatePreferences,
} from "../../auth.service.js";

import Circles from "./components/circles/Circles.jsx";
import PreliminaryData from "./components/preliminaryData/PreliminaryData.jsx";
import Perfil from "./components/perfil/Perfil.jsx";
import Preferences from "./components/preferences/Preferences.jsx";
import ContaCriada from "./components/conta-criada/ContaCriada.jsx";
import Logado from "./components/logado/Logado.jsx";

import "./register.css";

import logo from "../../../../assets/logo_iniciais.png";

function Register() {
  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  const [paginaActive, setPaginaActive] = useState(1);

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    telefone: "",
    city: "",
    avatarUrl: "",
  });

  const [error, setError] = useState(null);

  function passarPagina(valor) {
    setPaginaActive(valor);
    setError(null);
  }

  async function criarConta(preferences) {
    await register(input.name, input.email, input.password);

    let avatarUrl = "";

    if (input.avatarUrl) {
      const foto = await imageUpload(input.avatarUrl);
      avatarUrl = foto.url;
    }

    await updateProfile(input.name, input.telefone, input.city, avatarUrl);

    await updatePreferences(preferences);
  }

  return (
    <section className="register">
      {isAuthenticated && paginaActive !== 4 ? (
        <Logado />
      ) : (
        <div className="register__container__form">
          <img
            className={paginaActive === 4 ? "register__none" : "register__logo"}
            src={logo}
            alt="Achados e Devolvidos"
          />

          {paginaActive === 1 && (
            <div className="register__cabecalho">
              <h1 className="register__form__title">
                {t("auth.register.title")}
              </h1>

              <p className="register__form__subtitle">
                {t("auth.register.subtitle")}
              </p>
            </div>
          )}

          {paginaActive === 2 && (
            <div className="register__cabecalho">
              <h1 className="register__form__title personalize__perfil__title">
                {t("auth.register.profileTitle")}
              </h1>

              <p className="register__form__subtitle personalize__perfil__subtitle">
                {t("auth.register.profileSubtitle")}
              </p>
            </div>
          )}

          {paginaActive === 3 && (
            <div className="register__cabecalho">
              <h1 className="register__form__title preferencias__title">
                {t("auth.register.preferencesTitle")}
              </h1>

              <p className="register__form__subtitle preferencias__subtitle">
                {t("auth.register.preferencesSubtitle")}
              </p>
            </div>
          )}

          {paginaActive !== 4 && (
            <div className="register__etapas">
              <Circles paginaAtual={paginaActive} />
            </div>
          )}

          <form
            className="register__form"
            noValidate
            onSubmit={(evento) => evento.preventDefault()}
          >
            <div
              className={error ? "register__error" : "register__no__error"}
              role="alert"
              aria-live="polite"
            >
              <p className="register__error__message">{error}</p>
            </div>

            <div
              className={
                paginaActive === 1 ? "register__inputs" : "register__none"
              }
            >
              <PreliminaryData
                proximaPagina={passarPagina}
                error={setError}
                setInput={setInput}
              />
            </div>

            <div
              className={
                paginaActive === 2 ? "register__inputs" : "register__none"
              }
            >
              <Perfil
                proximaPagina={passarPagina}
                error={setError}
                setInput={setInput}
              />
            </div>

            <div
              className={
                paginaActive === 3 ? "register__inputs" : "register__none"
              }
            >
              <Preferences
                proximaPagina={passarPagina}
                error={setError}
                criarConta={criarConta}
              />
            </div>

            <div
              className={
                paginaActive === 4 ? "register__inputs" : "register__none"
              }
            >
              <ContaCriada />
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Register;
