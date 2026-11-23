import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFilter } from "../../../hooks/filters/filterHook.jsx";
import "./primaryFilters.css";

import Dropdown from "../dropdown/Dropdown.jsx";
import DateRange from "../dateRange/DateRange.jsx";

import { categories } from "../../../modules/buscar-objetos/buscarObjetos.service.js";

import lupaIcon from "../../../assets/icons/buscarObjetos/lupa.svg";
import lupaGray from "../../../assets/icons/buscarObjetos/lupa-gray.svg";
import pinGray from "../../../assets/icons/buscarObjetos/pin-gray.svg";
import gridGray from "../../../assets/icons/buscarObjetos/grid-gray.svg";
import calendarGray from "../../../assets/icons/buscarObjetos/calendar-gray.svg";
import arrowGray from "../../../assets/icons/buscarObjetos/arrow-gray.png";
import closeGray from "../../../assets/icons/buscarObjetos/X-gray.png";

import filtros from "./primaryFilters.json";

const icons = {
  lupaGray,
  pinGray,
  gridGray,
  calendarGray,
};

// "categoria" continua em português porque é usada na lógica do filtro;
// aqui só mapeamos para as chaves de tradução exibidas na tela.
const chavesTraducao = {
  Objeto: {
    label: "search.filters.object",
    placeholder: "search.filters.objectPlaceholder",
  },
  Localização: {
    label: "search.filters.location",
    placeholder: "search.filters.locationPlaceholder",
  },
  Categoria: {
    label: "search.filters.category",
    placeholder: "search.filters.categoryPlaceholder",
  },
  Período: {
    label: "search.filters.period",
    placeholder: "search.filters.periodPlaceholder",
  },
};

function BasicFilters() {
  const { t } = useTranslation();
  const { state, dispatch } = useFilter();
  const [valorInput, setValorInput] = useState({});
  const [resetAnterior, setResetAnterior] = useState(state.resetKey);

  if (resetAnterior !== state.resetKey) {
    setResetAnterior(state.resetKey);
    setValorInput({});
  }

  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  function pegarValorInput(categoria, valor) {
    setValorInput((valorAnterior) => ({
      ...valorAnterior,
      [categoria.toUpperCase()]: String(valor ?? "")
        .trim()
        .toUpperCase(),
    }));
  }

  function filtrar() {
    dispatch({ type: "change", value: valorInput });
  }

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const resultado = await categories();

        if (!Array.isArray(resultado)) {
          console.error(
            "A API não retornou uma lista de categorias:",
            resultado,
          );
          setCategorias([]);
          return;
        }

        setCategorias(
          resultado.map((categoria) => ({
            id: categoria.id,
            nome: categoria.name,
          })),
        );
      } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
      } finally {
        setCarregandoCategorias(false);
      }
    }

    carregarCategorias();
  }, []);

  return (
    <div className="filter" key={state.resetKey}>
      {filtros.map((valor) => {
        const chaves = chavesTraducao[valor.categoria];
        const label = chaves ? t(chaves.label) : valor.categoria;
        const placeholder = chaves ? t(chaves.placeholder) : valor.placeholder;

        return (
          <div key={valor.id}>
            <label htmlFor={valor.categoria} className="text__filter">
              {" "}
              {label}{" "}
            </label>

            <div className="input__container">
              <div>
                {valor.categoria === "Categoria" ? (
                  <Dropdown
                    id={valor.categoria}
                    arrow={arrowGray}
                    close={closeGray}
                    options={categorias}
                    type={valor.type}
                    placeholder={
                      carregandoCategorias
                        ? t("search.filters.loadingCategories")
                        : placeholder
                    }
                    change={pegarValorInput}
                  />
                ) : valor.categoria === "Período" ? (
                  <DateRange
                    placeholder={placeholder}
                    arrow={arrowGray}
                    close={closeGray}
                    change={pegarValorInput}
                  />
                ) : (
                  <input
                    id={valor.categoria}
                    onChange={(e) => {
                      pegarValorInput(valor.categoria, e.target.value);
                    }}
                    className="input__filter"
                    type={valor.type}
                    placeholder={placeholder}
                  />
                )}

                <img className="icon__filter" src={icons[valor.icon]} />
              </div>
            </div>
          </div>
        );
      })}

      <div className="button__buscar__container">
        <button
          className="button__buscar"
          onClick={() => {
            filtrar();
          }}
        >
          <img className="lupa__icon" src={lupaIcon} alt="" />
          <span className="buscar__text">
            {t("search.filters.searchButton")}
          </span>
        </button>
      </div>
    </div>
  );
}

export default BasicFilters;
