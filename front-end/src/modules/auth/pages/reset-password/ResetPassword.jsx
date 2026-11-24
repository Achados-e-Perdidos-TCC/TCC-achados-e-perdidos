import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import "./resetPassword.css";

import { verificaSenhaCadastro } from "../../../../utils/inputs/inputs.js";
import { REQUISITOS_SENHA } from "../../../../utils/passwordRules.js";
import { resetPassword } from "../../auth.service.js";

import logo from "../../../../assets/logo_iniciais.png";

function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const timeoutRef = useRef(null);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const requisitos = REQUISITOS_SENHA.map((r) => ({
    ...r,
    cumprido: r.validar(novaSenha),
  }));

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  async function enviar(evento) {
    evento.preventDefault();
    if (carregando) return;

    setError(null);

    try {
      if (!novaSenha || !confirmacao) throw new Error("required");
      if (novaSenha !== confirmacao) throw new Error("mismatch");

      verificaSenhaCadastro(novaSenha);

      setCarregando(true);
      await resetPassword(token, novaSenha);

      setSuccess(true);
      timeoutRef.current = setTimeout(() => navigate("/auth/login"), 3000);
    } catch (erro) {
      const mensagens = {
        required: "auth.reset.required",
        mismatch: "auth.reset.mismatch",
        "Senha inválida": "auth.reset.weak",
      };

      setError(t(mensagens[erro.message] ?? "auth.reset.invalidLink"));
    } finally {
      setCarregando(false);
    }
  }

  if (!token) {
    return (
      <section className="esqueci__senha">
        <div className="esqueci__container__form">
          <img
            className="esqueci__logo"
            src={logo}
            alt="Achados e Devolvidos"
          />

          <div className="esqueci__header">
            <h1 className="esqueci__form__title">{t("auth.reset.title")}</h1>
            <p className="esqueci__form__subtitle">
              {t("auth.reset.invalidLink")}
            </p>
          </div>

          <NavLink
            to="/auth/forgot-password"
            className="esqueci__navlink reset__newReq"
          >
            <p>{t("auth.reset.requestNew")}</p>
          </NavLink>
        </div>
      </section>
    );
  }

  return (
    <section className="esqueci__senha">
      <div className="esqueci__container__form">
        <img className="esqueci__logo" src={logo} alt="Achados e Devolvidos" />

        <div className="esqueci__header">
          <h1 className="esqueci__form__title">{t("auth.reset.title")}</h1>
          <p className="esqueci__form__subtitle">{t("auth.reset.subtitle")}</p>
        </div>

        <form className="esqueci__form" noValidate onSubmit={enviar}>
          {success && (
            <div
              className="esqueci__feedback esqueci__feedback--success"
              role="status"
            >
              <p className="esqueci__success__message">
                {t("auth.reset.success")}
              </p>
            </div>
          )}

          {error && (
            <div
              className="esqueci__feedback esqueci__feedback--error"
              role="alert"
            >
              <p className="esqueci__error__message">{error}</p>
            </div>
          )}

          <div className="esqueci__container__inputs change__password__user">
            <div className="change__password__field">
              <label className="esqueci__label" htmlFor="newPassword">
                {t("auth.reset.newPassword")}
              </label>
              <input
                id="newPassword"
                className="esqueci__input__change"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth.reset.placeholder")}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                onFocus={() => setMostrarRequisitos(true)}
                onBlur={() => setMostrarRequisitos(false)}
                disabled={carregando || success}
              />

              {mostrarRequisitos && (
                <div className="register__password__requerimentos">
                  {requisitos.map((r) => (
                    <p
                      key={r.id}
                      className={
                        r.cumprido
                          ? "requisito__cumprido"
                          : "requisito__pendente"
                      }
                    >
                      • {t(r.texto)}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="change__password__field">
              <label className="esqueci__label" htmlFor="confirmPassword">
                {t("auth.reset.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                className="esqueci__input__change"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth.reset.confirmPlaceholder")}
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                disabled={carregando || success}
              />
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
                  ? t("auth.reset.submitting")
                  : t("auth.reset.submit")}
              </p>
            </button>
          )}
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
