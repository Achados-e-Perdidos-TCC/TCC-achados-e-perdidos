import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import "./contaCriada.css";

import success from "../../../../../../assets/icons/register/success.png";

function ContaCriada() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="conta__criada">
      {/* ILUSTRAÇÃO */}

      <div className="success__image-container">
        <img
          className="success__image"
          src={success}
          alt={t("auth.register.created.title")}
        />
      </div>

      {/* MENSAGEM */}

      <div className="success__content">
        <h1 className="success__title">{t("auth.register.created.title")}</h1>

        <p className="success__subtitle">{t("auth.register.created.text")}</p>
      </div>

      {/* AÇÕES */}

      <div className="success__actions">
        <button
          className="success__button"
          type="button"
          onClick={() => navigate("/user-area")}
        >
          {t("common.goToProfile")}
        </button>

        <button
          className="success__return__link"
          type="button"
          onClick={() => navigate("/")}
        >
          {t("common.backHome")}
        </button>
      </div>
    </div>
  );
}

export default ContaCriada;
