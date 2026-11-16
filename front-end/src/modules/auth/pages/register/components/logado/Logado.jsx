import { useNavigate } from "react-router";

import "./logado.css";

import logo from "../../../../../../assets/logo_iniciais.png";

function Logado() {
  const navigate = useNavigate();

  return (
    <div className="logado">
      {/* LOGO */}

      <img className="logado__logo" src={logo} alt="Achados e Devolvidos" />

      {/* MENSAGEM */}

      <div className="logado__conteudo">
        <h1 className="register__ja__logado">Você já está logado!</h1>

        <p className="register__ja__logado__subtitle">
          Sua conta já está ativa. Você não precisa criar uma nova conta.
        </p>
      </div>

      {/* AÇÕES */}

      <div className="register__logado">
        <button
          className="logado__botao-principal"
          type="button"
          onClick={() => navigate("/user-area")}
        >
          Ir para meu perfil
        </button>

        <button
          className="logado__botao-secundario"
          type="button"
          onClick={() => navigate("/")}
        >
          Voltar para início
        </button>
      </div>
    </div>
  );
}

export default Logado;
