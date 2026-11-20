import "./EstadoErroObjetos.css";

import { useTranslation } from "react-i18next";

function EstadoErroObjetos() {
  const { t } = useTranslation();

  return (
    <div className="estado-objetos estado-objetos-erro" role="alert">
      <div className="estado-objetos-icone">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2L12 3Z" />
          <path d="M12 9v5" />
          <path d="M12 17h.01" />
        </svg>
      </div>

      <h3>{t("home.error.title")}</h3>

      <p>{t("home.error.description")}</p>
    </div>
  );
}

export default EstadoErroObjetos;
