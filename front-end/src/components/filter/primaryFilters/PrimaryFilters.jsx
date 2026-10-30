import { useEffect, useState } from "react";
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
import closeGray from "../../../assets/icons/buscarObjetos/x-gray.png";

import filtros from "./primaryFilters.json";

const icons = {
  lupaGray,
  pinGray,
  gridGray,
  calendarGray,
};

function BasicFilters() {
  const { dispatch } = useFilter();
  const [valorInput, setValorInput] = useState({});

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
    <div className="filter">
      {filtros.map((valor) => {
        return (
          <div key={valor.id}>
            <label htmlFor={valor.categoria} className="text__filter">
              {" "}
              {valor.categoria}{" "}
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
                        ? "Carregando categorias..."
                        : valor.placeholder
                    }
                    change={pegarValorInput}
                  />
                ) : valor.categoria === "Período" ? (
                  <DateRange
                    placeholder={valor.placeholder}
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
                    placeholder={valor.placeholder}
                  />
                )}

                <img className="icon__filter" src={icons[valor.icon]} />
              </div>
            </div>
          </div>
        );
      })}

      <div className="button__buscar">
        <button
          className="button buscar"
          onClick={() => {
            filtrar();
          }}
        >
          <img className="lupa__icon" src={lupaIcon} alt="" />
          <span className="buscar__text">buscar</span>
        </button>
      </div>
    </div>
  );
}

export default BasicFilters;
