import "./EstadoVazioObjetos.css";

import { useTranslation } from "react-i18next";

function EstadoVazioObjetos() {
  const { t } = useTranslation();

  return (
    <div className="estado-objetos estado-objetos-vazio" role="status">
      <div className="estado-objetos-vazio-icone">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m3 7 9-4 9 4-9 4-9-4Z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
          <path d="m7.5 5 9 4" />
        </svg>
      </div>

      <h3>{t("home.empty.title")}</h3>

      <p>{t("home.empty.description")}</p>
    </div>
  );
}

export default EstadoVazioObjetos;
