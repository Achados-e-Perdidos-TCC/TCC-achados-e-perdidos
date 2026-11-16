import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../contexts/authContexts/AuthContext.jsx";
import { NavLink, useNavigate } from "react-router";

import { verificaSenhaCadastro } from "../../../../utils/inputs/inputs.js";
import { changeNewUserPassword } from "../../private.service.js";

import "./change-password.css";

import logo from "../../../../assets/logo_iniciais.png";

const REQUISITOS_SENHA = [
  {
    id: "tamanho",
    texto: "Pelo menos 8 caracteres",
    validar: (senha) => senha.length >= 8,
  },
  {
    id: "maiuscula",
    texto: "Uma letra maiúscula",
    validar: (senha) => /[A-Z]/.test(senha),
  },
  {
    id: "minuscula",
    texto: "Uma letra minúscula",
    validar: (senha) => /[a-z]/.test(senha),
  },
  {
    id: "numero",
    texto: "Um número",
    validar: (senha) => /[0-9]/.test(senha),
  },
  {
    id: "especial",
    texto: "Um caractere especial",
    validar: (senha) => /[^A-Za-z0-9]/.test(senha),
  },
];

const MENSAGENS_ERRO = {
  "Credenciais inválidas": "Credenciais inválidas.",
  "Senha inválida": "Nova senha inválida.",
  "Senha atual incorreta": "Senha atual incorreta.",
  "A senha precisa ser diferente": "As senhas não podem ser iguais.",
  "campos precisam estar preenchidos": "Os campos precisam estar preenchidos.",
};

function ChangePassword() {
  const navigate = useNavigate();
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

      setSuccess(
        "Senha alterada com sucesso! Você será redirecionado para a tela de login em instantes.",
      );

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
        MENSAGENS_ERRO[erro.message] ||
          "Ocorreu um erro inesperado. Verifique se os dados informados estão corretos.",
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
          <h1 className="esqueci__form__title">Altere sua senha</h1>

          <p className="esqueci__form__subtitle">
            Informe a senha atual e a sua nova senha.
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
                Senha atual
              </label>

              <input
                id="oldPassword"
                className="esqueci__input__change"
                type="password"
                placeholder="Sua senha atual"
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(evento) => setSenhaAtual(evento.target.value)}
                disabled={carregando || !!success}
              />
            </div>

            <div className="change__password__field">
              <label className="register__label" htmlFor="newPassword">
                Nova senha
              </label>

              <input
                id="newPassword"
                className="esqueci__input__change"
                type="password"
                placeholder="Sua nova senha"
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
                      • {requisito.texto}
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
              <p>{carregando ? "Alterando senha..." : "Alterar senha"}</p>
            </button>
          )}
        </form>

        {!success && (
          <>
            <hr />

            <div className="esqueci__container__com__conta">
              <p className="esqueci__sem__conta__text">
                Não deseja mais alterar?
              </p>

              <NavLink to="/user-area" end className="esqueci__navlink">
                <p>Voltar</p>
              </NavLink>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ChangePassword;
