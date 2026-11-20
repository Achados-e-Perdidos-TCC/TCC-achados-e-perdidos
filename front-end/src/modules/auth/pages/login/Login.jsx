import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../contexts/authContexts/AuthContext.jsx";
import { NavLink } from "react-router";
import { verificaEmailSenha } from "../../../../utils/inputs/inputs.js";
import { login } from "../../auth.service.js";

import Logado from "../register/components/logado/Logado.jsx";

import "./login.css";

import logo from "../../../../assets/logo_iniciais.png";
import emailGray from "../../../../assets/icons/login/email-gray.png";
import lockGray from "../../../../assets/icons/login/lock-gray.png";
import openEyeGray from "../../../../assets/icons/login/open-eye-gray.png";
import closeEyeGray from "../../../../assets/icons/login/close-eye-gray.png";
import entrarWhite from "../../../../assets/icons/login/entrar-white.png";

function Login() {
  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  const [eyeState, setEyeState] = useState(true);
  const [inputEmailState, setInputEmailState] = useState("");
  const [inputPasswordState, setInputPasswordState] = useState("");
  const [lembrarUsuario, setLembrarUsuario] = useState(false);
  const [error, setError] = useState(null);

  function setarEyeState() {
    setEyeState((estadoAtual) => !estadoAtual);
  }

  async function logarUsuario(evento) {
    evento.preventDefault();

    try {
      setError(null);

      verificaEmailSenha(inputEmailState.toLowerCase(), inputPasswordState);

      await login(
        inputEmailState.toLowerCase(),
        inputPasswordState,
        lembrarUsuario,
      );

      window.location.href = "/user-area";
    } catch (erro) {
      if (erro.message === "Credenciais inválidas") {
        setError(t("errors.invalidCredentials"));
      } else if (erro.message === "Email inválido") {
        setError(t("errors.invalidEmail"));
      } else if (erro.message === "Senha inválida") {
        setError(t("errors.invalidPassword"));
      } else if (erro.message === "campos precisam estar preenchidos") {
        setError(t("errors.requiredFields"));
      } else {
        setError(t("errors.unexpected"));
      }
    }
  }

  return (
    <section className="login">
      {isAuthenticated ? (
        <Logado />
      ) : (
        <div className="login__container__form">
          <img className="login__logo" src={logo} alt="Achados e Devolvidos" />

          <div className="login__header">
            <h1 className="login__form__title">{t("auth.login.title")}</h1>

            <p className="login__form__subtitle">{t("auth.login.subtitle")}</p>
          </div>

          <form className="login__form" noValidate onSubmit={logarUsuario}>
            <div
              className={error ? "login__error" : "login__no__error"}
              aria-live="polite"
            >
              <p className="login__error__message">{error}</p>
            </div>

            <div className="login__container__inputs">
              <div className="login__field">
                <label className="login__label" htmlFor="email">
                  {t("auth.login.email")}
                </label>

                <div className="login__input__email">
                  <img
                    className="login__email__icon"
                    src={emailGray}
                    alt=""
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    name="email"
                    className="login__input"
                    type="email"
                    placeholder={t("auth.login.emailPlaceholder")}
                    autoComplete="email"
                    value={inputEmailState}
                    onChange={(evento) =>
                      setInputEmailState(evento.target.value)
                    }
                  />
                </div>
              </div>

              <div className="login__field">
                <label className="login__label" htmlFor="password">
                  {t("auth.login.password")}
                </label>

                <div className="login__input__password">
                  <img
                    className="login__password__icon"
                    src={lockGray}
                    alt=""
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    name="password"
                    className="login__input"
                    type={eyeState ? "password" : "text"}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    autoComplete="current-password"
                    value={inputPasswordState}
                    onChange={(evento) =>
                      setInputPasswordState(evento.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="login__eye__button"
                    onClick={setarEyeState}
                    aria-label={
                      eyeState
                        ? t("common.showPassword")
                        : t("common.hidePassword")
                    }
                  >
                    <img
                      className="login__eye__icon"
                      src={eyeState ? openEyeGray : closeEyeGray}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="login__container__esqueci__senha">
              <div className="login__container__checkbox">
                <input
                  id="lembrarUsuario"
                  className="login__input__checkbox"
                  type="checkbox"
                  checked={lembrarUsuario}
                  onChange={(evento) =>
                    setLembrarUsuario(evento.target.checked)
                  }
                />

                <label htmlFor="lembrarUsuario">
                  {t("auth.login.remember")}
                </label>
              </div>

              <NavLink
                to="/auth/forgot-password"
                end
                className="login__navlink"
              >
                {t("auth.login.forgot")}
              </NavLink>
            </div>

            <button className="login__form__button" type="submit">
              <img
                className="login__image__entrar"
                src={entrarWhite}
                alt=""
                aria-hidden="true"
              />

              <span>{t("auth.login.submit")}</span>
            </button>
          </form>

          <hr className="login__divider" />

          <div className="login__container__sem__conta">
            <p className="login__sem__conta__text">
              {t("auth.login.noAccount")}
            </p>

            <NavLink to="/auth/register" end className="login__navlink">
              {t("auth.login.createAccount")}
            </NavLink>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;
