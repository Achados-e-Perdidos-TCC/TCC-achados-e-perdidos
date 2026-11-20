import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import "./logado.css";

import logo from "../../../../../../assets/logo_iniciais.png";

function Logado() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="logado">
      {/* LOGO */}

      <img className="logado__logo" src={logo} alt="Achados e Devolvidos" />

      {/* MENSAGEM */}

      <div className="logado__conteudo">
        <h1 className="register__ja__logado">
          {t("auth.register.alreadyLoggedIn.title")}
        </h1>

        <p className="register__ja__logado__subtitle">
          {t("auth.register.alreadyLoggedIn.text")}
        </p>
      </div>

      {/* AÇÕES */}

      <div className="register__logado">
        <button
          className="logado__botao-principal"
          type="button"
          onClick={() => navigate("/user-area")}
        >
          {t("common.goToProfile")}
        </button>

        <button
          className="logado__botao-secundario"
          type="button"
          onClick={() => navigate("/")}
        >
          {t("common.backHome")}
        </button>
      </div>
    </div>
  );
}

export default Logado;
