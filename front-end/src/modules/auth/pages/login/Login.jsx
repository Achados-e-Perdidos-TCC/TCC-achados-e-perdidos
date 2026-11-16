import { useContext, useState } from "react";
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
        setError("Credenciais inválidas");
      } else if (erro.message === "Email inválido") {
        setError("Email inválido");
      } else if (erro.message === "Senha inválida") {
        setError("Senha inválida");
      } else if (erro.message === "campos precisam estar preenchidos") {
        setError("Todos os campos precisam estar preenchidos");
      } else {
        setError(
          "Ocorreu um erro inesperado. Verifique se os dados informados estão corretos e tente novamente mais tarde.",
        );
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
            <h1 className="login__form__title">Bem-vindo de volta!</h1>

            <p className="login__form__subtitle">Faça login para continuar</p>
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
                  E-mail
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
                    placeholder="Seu@email.com"
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
                  Senha
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
                    placeholder="Sua senha"
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
                    aria-label={eyeState ? "Mostrar senha" : "Ocultar senha"}
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

                <label htmlFor="lembrarUsuario">Lembrar de mim</label>
              </div>

              <NavLink
                to="/auth/forgot-password"
                end
                className="login__navlink"
              >
                Esqueci minha senha
              </NavLink>
            </div>

            <button className="login__form__button" type="submit">
              <img
                className="login__image__entrar"
                src={entrarWhite}
                alt=""
                aria-hidden="true"
              />

              <span>Entrar</span>
            </button>
          </form>

          <hr className="login__divider" />

          <div className="login__container__sem__conta">
            <p className="login__sem__conta__text">Ainda não tem uma conta?</p>

            <NavLink to="/auth/register" end className="login__navlink">
              Criar conta
            </NavLink>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;
