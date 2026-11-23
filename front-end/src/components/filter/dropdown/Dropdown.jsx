import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./dropdown.css";

function Dropdown({ id, placeholder, options, arrow, close, change }) {
  const { t } = useTranslation();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  function alternarDropdown() {
    setDropdownVisible((aberto) => !aberto);
  }

  function selecionarOpcao(nome) {
    setSelectedOption(nome);
    change("CATEGORIA", nome);
    setDropdownVisible(false);
  }

  function limparOpcao() {
    setSelectedOption(null);
    change("CATEGORIA", "");
  }

  function fecharDropdown(evento) {
    if (!evento.currentTarget.contains(evento.relatedTarget)) {
      setDropdownVisible(false);
    }
  }

  function aoPressionarTecla(evento) {
    if (evento.key === "Escape") setDropdownVisible(false);
  }

  return (
    <div
      className="arrow__icon"
      tabIndex={-1}
      onBlur={fecharDropdown}
      onKeyDown={aoPressionarTecla}
    >
      <button
        id={id}
        className="input__filter button__filter"
        onClick={alternarDropdown}
        type="button"
        aria-haspopup="true"
        aria-expanded={dropdownVisible}
      >
        <span className={!selectedOption ? "category" : ""}>
          {selectedOption || placeholder}
        </span>
      </button>

      <img
        className={dropdownVisible ? "arrow up" : "arrow"}
        src={arrow}
        alt=""
      />

      <button
        type="button"
        className="x__button"
        onClick={limparOpcao}
        aria-label={t("search.filters.clearCategory")}
      >
        <img className="x" src={close} alt="" />
      </button>

      {dropdownVisible && (
        <div className="dropdown__content">
          {options.map((value) => (
            <button
              type="button"
              key={value.id}
              className="dropdown__itens"
              onClick={() => selecionarOpcao(value.nome)}
            >
              {value.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
