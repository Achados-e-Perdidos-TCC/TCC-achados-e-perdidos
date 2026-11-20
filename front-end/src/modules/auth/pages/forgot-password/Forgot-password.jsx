import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../contexts/authContexts/AuthContext.jsx";
import { NavLink } from "react-router";

import { verificaEmailSenha } from "../../../../utils/inputs/inputs.js";
import { forgetPassword } from "../../auth.service.js";

import Logado from "../register/components/logado/Logado.jsx";

import "./forgot-password.css";

import logo from "../../../../assets/logo_iniciais.png";
import emailGray from "../../../../assets/icons/login/email-gray.png";
import sentWhite from "../../../../assets/icons/esqueciSenha/sent-white.png";

function EsqueciSenha() {
  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  const [inputEmailState, setInputEmailState] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  async function recuperarSenha(evento) {
    evento.preventDefault();

    if (loading) return;

    setError(null);
    setSuccess(null);

    const email = inputEmailState.trim().toLowerCase();

    try {
      // Validação do e-mail
      verificaEmailSenha(email);

      setLoading(true);

      // Chamada à API
      await forgetPassword({ email });

      setSuccess(t("auth.forgot.success"));
    } catch (erro) {
      if (erro.message === "Credenciais inválidas") {
        setError(t("errors.invalidCredentials"));
      } else if (erro.message === "Email inválido") {
        setError(t("auth.forgot.emailInvalid"));
      } else if (erro.message === "campos precisam estar preenchidos") {
        setError(t("auth.forgot.emailRequired"));
      } else {
        setError(t("auth.forgot.unexpected"));
      }
    } finally {
      setLoading(false);
    }
  }

  function alterarEmail(evento) {
    setInputEmailState(evento.target.value);

    if (error) setError(null);
    if (success) setSuccess(null);
  }

  return (
    <section className="esqueci__senha">
      {isAuthenticated ? (
        <Logado />
      ) : (
        <div className="esqueci__container__form">
          {/* LOGO */}

          <img
            className="esqueci__logo"
            src={logo}
            alt="Achados e Devolvidos"
          />

          {/* CABEÇALHO */}

          <div className="esqueci__header">
            <h1 className="esqueci__form__title">{t("auth.forgot.title")}</h1>

            <p className="esqueci__form__subtitle">{t("auth.forgot.intro")}</p>
          </div>

          {/* FORMULÁRIO */}

          <form
            className="esqueci__form"
            method="post"
            noValidate
            onSubmit={recuperarSenha}
          >
            {/* MENSAGEM DE SUCESSO */}

            {success && (
              <div
                className="esqueci__feedback esqueci__feedback--success"
                role="status"
                aria-live="polite"
              >
                <p className="esqueci__success__message">{success}</p>
              </div>
            )}

            {/* MENSAGEM DE ERRO */}

            {error && (
              <div
                className="esqueci__feedback esqueci__feedback--error"
                role="alert"
              >
                <p className="esqueci__error__message">{error}</p>
              </div>
            )}

            {/* CAMPO DE E-MAIL */}

            <div className="esqueci__container__inputs">
              <div className="esqueci__input__group">
                <label className="esqueci__label" htmlFor="email">
                  {t("auth.forgot.email")}
                </label>

                <div className="esqueci__input__email">
                  <img
                    className="esqueci__email__icon"
                    src={emailGray}
                    alt=""
                  />

                  <input
                    id="email"
                    className="esqueci__input"
                    type="email"
                    name="email"
                    placeholder={t("auth.login.emailPlaceholder")}
                    autoComplete="email"
                    value={inputEmailState}
                    onChange={alterarEmail}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* BOTÃO */}

            <button
              className="esqueci__form__button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="esqueci__loading" aria-hidden="true" />

                  <span>{t("auth.forgot.sending")}</span>
                </>
              ) : (
                <>
                  <img
                    className="esqueci__image__sent"
                    src={sentWhite}
                    alt=""
                  />

                  <span>{t("auth.forgot.submit")}</span>
                </>
              )}
            </button>
          </form>

          {/* DIVISÓRIA */}

          <div className="esqueci__divider" />

          {/* VOLTAR PARA LOGIN */}

          <div className="esqueci__container__com__conta">
            <p className="esqueci__sem__conta__text">
              {t("auth.forgot.remembered")}
            </p>

            <NavLink to="/auth/login" end className="esqueci__navlink">
              {t("auth.forgot.signIn")}
            </NavLink>
          </div>
        </div>
      )}
    </section>
  );
}

export default EsqueciSenha;
