import "./objetoCard.css";
import { useTranslation } from "react-i18next";
import { IconImagemObjeto } from "../icons/ComoFuncionaIcons.jsx";

import pinGray from "../../../../assets/icons/buscarObjetos/pin-gray.svg";
import calendarGray from "../../../../assets/icons/buscarObjetos/calendar-gray.svg";

function ObjetoCard({ imagem, nome, status, localizacao, data, hora }) {
  const { t } = useTranslation();

  const ehPerdido = status === "perdido";

  return (
    <div
      className={`objeto__card ${ehPerdido ? "objeto__card--perdido" : "objeto__card--encontrado"}`}
    >
      <span className="objeto__badge">
        {ehPerdido ? t("howItWorks.cardLost") : t("howItWorks.cardFound")}
      </span>

      <div className="objeto__imagem">
        {imagem ? (
          <img src={imagem} alt={nome} />
        ) : (
          <IconImagemObjeto className="objeto__imagem__placeholder" />
        )}
      </div>

      <h3 className="objeto__nome">{nome}</h3>

      <div className="objeto__info">
        <img src={pinGray} alt="" />
        <span>{localizacao}</span>
      </div>

      <div className="objeto__info">
        <img src={calendarGray} alt="" />
        <span>
          {data}, {hora}
        </span>
      </div>
    </div>
  );
}

export default ObjetoCard;
