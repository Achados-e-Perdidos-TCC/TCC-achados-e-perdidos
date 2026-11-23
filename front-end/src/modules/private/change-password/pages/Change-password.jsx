import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../contexts/authContexts/context.js";
import { NavLink, useNavigate } from "react-router";

import { verificaSenhaCadastro } from "../../../../utils/inputs/inputs.js";
import { changeNewUserPassword } from "../../private.service.js";

import "./change-password.css";

import logo from "../../../../assets/logo_iniciais.png";

// "texto" guarda a chave de tradução; o texto é traduzido na renderização.
const REQUISITOS_SENHA = [
  {
    id: "tamanho",
    texto: "passwordRules.length",
    validar: (senha) => senha.length >= 8,
  },
  {
    id: "maiuscula",
    texto: "passwordRules.uppercase",
    validar: (senha) => /[A-Z]/.test(senha),
  },
  {
    id: "minuscula",
    texto: "passwordRules.lowercase",
    validar: (senha) => /[a-z]/.test(senha),
  },
  {
    id: "numero",
    texto: "passwordRules.number",
    validar: (senha) => /[0-9]/.test(senha),
  },
  {
    id: "especial",
    texto: "passwordRules.special",
    validar: (senha) => /[^A-Za-z0-9]/.test(senha),
  },
];

// As chaves continuam em português: são as mensagens lançadas pela lógica/validações.
// Os valores são chaves de tradução.
const MENSAGENS_ERRO = {
  "Credenciais inválidas": "errors.invalidCredentials",
  "Senha inválida": "account.changePassword.invalidNewPassword",
  "Senha atual incorreta": "account.changePassword.wrongCurrent",
  "A senha precisa ser diferente": "account.changePassword.samePassword",
  "campos precisam estar preenchidos": "account.changePassword.requiredFields",
};

function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setIsAuthenticated } = useContext(AuthContext);

  const timeoutRef = useRef(null);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const requisitosSenha = REQUISITOS_SENHA.map((requisito) => ({
    ...requisito,
    cumprido: requisito.validar(novaSenha),
  }));

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function changeUserPassword(evento) {
    evento.preventDefault();

    if (carregando) return;

    setError(null);
    setSuccess(null);

    try {
      if (!senhaAtual || !novaSenha) {
        throw new Error("campos precisam estar preenchidos");
      }

      if (novaSenha === senhaAtual) {
        throw new Error("A senha precisa ser diferente");
      }

      verificaSenhaCadastro(novaSenha);

      setCarregando(true);

      await changeNewUserPassword(senhaAtual, novaSenha);

      setSuccess(t("account.changePassword.success"));

      timeoutRef.current = setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        setIsAuthenticated(false);
        navigate("/auth/login");
      }, 3000);
    } catch (erro) {
      setError(
        t(MENSAGENS_ERRO[erro.message] ?? "account.changePassword.unexpected"),
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="esqueci__senha">
      <div className="esqueci__container__form">
        <img className="esqueci__logo" src={logo} alt="Achados e Devolvidos" />

        <div>
          <h1 className="esqueci__form__title">
            {t("account.changePassword.title")}
          </h1>

          <p className="esqueci__form__subtitle">
            {t("account.changePassword.subtitle")}
          </p>
        </div>

        <form
          className="esqueci__form"
          noValidate
          onSubmit={changeUserPassword}
        >
          {success && (
            <div className="esqueci__success" role="status">
              <p className="esqueci__success__message">{success}</p>
            </div>
          )}

          {error && (
            <div className="esqueci__error" role="alert">
              <p className="esqueci__error__message">{error}</p>
            </div>
          )}

          <div className="esqueci__container__inputs change__password__user">
            <div className="change__password__field">
              <label className="esqueci__label" htmlFor="oldPassword">
                {t("account.changePassword.currentPassword")}
              </label>

              <input
                id="oldPassword"
                className="esqueci__input__change"
                type="password"
                placeholder={t("account.changePassword.currentPlaceholder")}
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(evento) => setSenhaAtual(evento.target.value)}
                disabled={carregando || !!success}
              />
            </div>

            <div className="change__password__field">
              <label className="register__label" htmlFor="newPassword">
                {t("account.changePassword.newPassword")}
              </label>

              <input
                id="newPassword"
                className="esqueci__input__change"
                type="password"
                placeholder={t("account.changePassword.newPlaceholder")}
                autoComplete="new-password"
                value={novaSenha}
                onChange={(evento) => setNovaSenha(evento.target.value)}
                onFocus={() => setMostrarRequisitos(true)}
                onBlur={() => setMostrarRequisitos(false)}
                disabled={carregando || !!success}
              />

              {mostrarRequisitos && (
                <div className="register__password__requerimentos">
                  {requisitosSenha.map((requisito) => (
                    <p
                      key={requisito.id}
                      className={
                        requisito.cumprido
                          ? "requisito__cumprido"
                          : "requisito__pendente"
                      }
                    >
                      • {t(requisito.texto)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!success && (
            <button
              className="esqueci__form__button"
              type="submit"
              disabled={carregando}
            >
              <p>
                {carregando
                  ? t("account.changePassword.submitting")
                  : t("account.changePassword.submit")}
              </p>
            </button>
          )}
        </form>

        {!success && (
          <>
            <hr />

            <div className="esqueci__container__com__conta">
              <p className="esqueci__sem__conta__text">
                {t("account.changePassword.cancelPrompt")}
              </p>

              <NavLink to="/user-area" end className="esqueci__navlink">
                <p>{t("common.back")}</p>
              </NavLink>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ChangePassword;
