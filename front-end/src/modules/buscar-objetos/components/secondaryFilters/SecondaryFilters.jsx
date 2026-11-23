import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { useFilter } from "../../../../hooks/filters/filterHook.jsx";
import "./secondaryFilters.css";

import todosWhite from "../../../../assets/icons/buscarObjetos/grid-white.png";
import perdidosWhite from "../../../../assets/icons/buscarObjetos/warning-white.png";
import encontradosWhite from "../../../../assets/icons/buscarObjetos/lupa-white.svg";
import starWhite from "../../../../assets/icons/buscarObjetos/star-white.png";

import todosBlack from "../../../../assets/icons/buscarObjetos/grid-black.png";
import perdidosBlack from "../../../../assets/icons/buscarObjetos/warning-black.png";
import encontradosBlack from "../../../../assets/icons/buscarObjetos/lupa-black.svg";

import filtros from "./secondaryFilters.json";

const icons = {
  todosWhite,
  perdidosWhite,
  encontradosWhite,
  starWhite,
  todosBlack,
  perdidosBlack,
  encontradosBlack,
};

// "categoria" continua em português porque é usada na lógica do filtro;
// aqui só mapeamos para a chave de tradução exibida na tela.
const chavesTraducao = {
  Todos: "search.secondary.all",
  Perdidos: "search.secondary.lost",
  Encontrados: "search.secondary.found",
};

function SecondaryFilters() {
  const { tema } = useOutletContext();
  const { t } = useTranslation();

  const { state, dispatch } = useFilter();
  const ativo = state.secondaryFilters;

  function alternarAtivo(value) {
    dispatch({ type: "add", value: value.toUpperCase() });
  }

  return (
    <div
      className="filter"
      role="group"
      aria-label={t("search.publicationType")}
    >
      {filtros.map((valor) => {
        const selecionado = ativo === valor.categoria.toUpperCase();
        const icone =
          tema === "light" ? icons[valor.iconBlack] : icons[valor.iconWhite];

        return (
          <div key={valor.id}>
            <div className="input__container">
              <button
                type="button"
                className={
                  selecionado
                    ? "button__secondary__filter secondary__active"
                    : "button__secondary__filter"
                }
                aria-pressed={selecionado}
                onClick={() => alternarAtivo(valor.categoria)}
              >
                <img className="icon__secondary__filter" src={icone} alt="" />
                <span className="text__secondary__filters">
                  {t(chavesTraducao[valor.categoria] ?? valor.categoria)}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SecondaryFilters;
