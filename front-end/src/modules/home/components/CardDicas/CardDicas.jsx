import "./CardDicas.css";

import { useTranslation } from "react-i18next";

function CardDicas() {
  const { t } = useTranslation();

  const dicas = [
    {
      id: 1,
      titulo: t("home.tips.photos.title"),
      descricao: t("home.tips.photos.description"),
      icone: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="8.5"
            cy="9"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="m4 17 5-5 3 3 3-4 5 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 2,
      titulo: t("home.tips.details.title"),
      descricao: t("home.tips.details.description"),
      icone: (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="10"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      ),
    },
    {
      id: 3,
      titulo: t("home.tips.contact.title"),
      descricao: t("home.tips.contact.description"),
      icone: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m4 7 8 6 8-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="card-dicas">
      <div className="card-dicas__cabecalho">
        <div className="card-dicas__icone-principal">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18h6M10 21h4M8.5 14.5a7 7 0 1 1 7 0c-.9.7-1.5 1.5-1.5 2.5h-4c0-1-.6-1.8-1.5-2.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h3>{t("home.tips.title")}</h3>
          <p>{t("home.tips.subtitle")}</p>
        </div>
      </div>

      <div className="card-dicas__lista">
        {dicas.map((dica) => (
          <div className="card-dicas__item" key={dica.id}>
            <div className="card-dicas__icone">{dica.icone}</div>

            <div className="card-dicas__texto">
              <h4>{dica.titulo}</h4>
              <p>{dica.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default CardDicas;
