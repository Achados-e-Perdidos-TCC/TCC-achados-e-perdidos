import { useNavigate } from "react-router";

import "./contaCriada.css";

import success from "../../../../../../assets/icons/register/success.png";

function ContaCriada() {
  const navigate = useNavigate();

  return (
    <div className="conta__criada">
      {/* ILUSTRAÇÃO */}

      <div className="success__image-container">
        <img
          className="success__image"
          src={success}
          alt="Conta criada com sucesso"
        />
      </div>

      {/* MENSAGEM */}

      <div className="success__content">
        <h1 className="success__title">Conta criada com sucesso!</h1>

        <p className="success__subtitle">
          Sua conta no Achados e Devolvidos foi criada. Agora você já pode
          explorar e usar o sistema.
        </p>
      </div>

      {/* AÇÕES */}

      <div className="success__actions">
        <button
          className="success__button"
          type="button"
          onClick={() => navigate("/user-area")}
        >
          Ir para meu perfil
        </button>

        <button
          className="success__return__link"
          type="button"
          onClick={() => navigate("/")}
        >
          Voltar para início
        </button>
      </div>
    </div>
  );
}

export default ContaCriada;
