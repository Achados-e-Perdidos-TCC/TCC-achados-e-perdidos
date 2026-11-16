import { useState } from "react";
import { IMaskInput } from "react-imask";

import cidadesBrasil from "../../../../../../../utils/json/cidade-estados.json";

import "./formInfos.css";

function FormInfos({
  inputState,
  inputCityState,
  inputEmailState,
  setInputNameState,
  inputNameState,
  inputTelephoneState,
  setInputCityState,
  setInputEmailState,
  setInputTelephoneState,
  setInputState,
  todasAsCidades,
}) {
  const [cidadesFiltradas, setCidadesFiltradas] = useState([]);

  function buscarCidades(valor) {
    setInputCityState(valor);

    if (valor.trim() === "") {
      setCidadesFiltradas([]);
      return;
    }

    const resultado = todasAsCidades.filter((cidade) => {
      const mesmaCidade = cidade.cidade
        .toLowerCase()
        .startsWith(valor.toLowerCase());

      const mesmoEstado = inputState ? cidade.estado === inputState : true;

      return mesmaCidade && mesmoEstado;
    });

    setCidadesFiltradas(resultado);
  }

  function selecionarCidade(cidade) {
    setInputCityState(cidade.cidade);
    setInputState(cidade.estado);
    setCidadesFiltradas([]);
  }

  return (
    <div className="user__profile__inputs__container">
      <div className="user__profile__field">
        <label className="user__profile__label" htmlFor="nome">
          Nome
        </label>

        <input
          id="nome"
          className="user__profile__input"
          type="text"
          value={inputNameState}
          onChange={(e) => setInputNameState(e.target.value)}
        />
      </div>

      <div className="user__profile__field">
        <label className="user__profile__label" htmlFor="email">
          E-mail
        </label>

        <input
          id="email"
          className="user__profile__input user__just__read"
          type="email"
          value={inputEmailState}
          onChange={(e) => setInputEmailState(e.target.value)}
          disabled
        />
      </div>

      <div className="user__profile__phone__city">
        <div className="user__profile__input__phone user__profile__field">
          <label className="user__profile__label" htmlFor="telefone">
            Telefone
          </label>

          <IMaskInput
            id="telefone"
            className="user__profile__input"
            mask="(00) 00000-0000"
            value={inputTelephoneState}
            placeholder="(00) 00000-0000"
            onAccept={(value) => setInputTelephoneState(value)}
          />
        </div>

        <div className="user__profile__input__city user__profile__field">
          <label className="user__profile__label" htmlFor="cidade">
            Cidade
          </label>

          <div className="user__profile__city__control">
            <input
              id="cidade"
              className="user__profile__input"
              type="text"
              value={inputCityState}
              onChange={(e) => buscarCidades(e.target.value)}
              autoComplete="off"
            />

            <select
              value={inputState}
              className="user__profile__estado"
              onChange={(event) => {
                setInputState(event.target.value);
                setCidadesFiltradas([]);
              }}
              aria-label="Estado"
            >
              <option value="">UF</option>

              {cidadesBrasil.estados.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.sigla}
                </option>
              ))}
            </select>
          </div>

          {cidadesFiltradas.length > 0 && (
            <div className="user__profile__container__sugestoes">
              {cidadesFiltradas.map((cidade) => (
                <button
                  className="user__profile__cidades__sugestoes"
                  type="button"
                  key={`${cidade.cidade}-${cidade.estado}`}
                  onClick={() => selecionarCidade(cidade)}
                >
                  <span>{cidade.cidade}</span>
                  <small>{cidade.estado}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormInfos;
