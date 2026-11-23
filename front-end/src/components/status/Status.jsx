import { useTranslation } from "react-i18next";
import "./status.css";

import warningRed from "../../assets/icons/buscarObjetos/warning-red.svg";
import checkGreen from "../../assets/icons/buscarObjetos/check-green.svg";
import hourglassOrange from "../../assets/icons/buscarObjetos/hourglass-orange.svg";

const chavesStatus = {
  PERDIDO: "common.status.lost",
  ENCONTRADO: "common.status.found",
  ANALISE: "common.status.inAnalysis",
  INATIVO: "common.status.inactive",
};

function Status(objeto) {
  const { t } = useTranslation();

  const objetoEncontrado = objeto.objeto;

  function verificaIconStatus(status) {
    if (status === "PERDIDO") {
      return warningRed;
    }
    if (status === "ENCONTRADO") {
      return checkGreen;
    }
    if (status === "ANALISE") {
      return hourglassOrange;
    }
  }

  function adicionaClassNameStatus(status) {
    if (status === "PERDIDO") {
      return "status__red";
    }
    if (status === "ENCONTRADO") {
      return "status__green";
    }
    if (status === "ANALISE") {
      return "status__orange";
    }
  }

  function textoStatus(status) {
    return chavesStatus[status]
      ? t(chavesStatus[status]).toUpperCase()
      : status;
  }

  return (
    <div className="status__principal">
      <div
        className={adicionaClassNameStatus(
          objetoEncontrado.status.trim().toUpperCase(),
        )}
      >
        <img
          className="image__principal"
          src={verificaIconStatus(objetoEncontrado.status.trim().toUpperCase())}
        />
        <span>{textoStatus(objetoEncontrado.status.trim().toUpperCase())}</span>
      </div>
    </div>
  );
}

export default Status;
