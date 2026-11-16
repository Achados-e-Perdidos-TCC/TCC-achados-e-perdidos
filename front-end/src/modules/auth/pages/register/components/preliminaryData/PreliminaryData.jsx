import { useState } from "react";
import { NavLink } from "react-router";
import { IMaskInput } from "react-imask";

import {
  verificaEmailSenha,
  verificaTelefone,
  verificaSenhaCadastro,
  validaCidade,
} from "../../../../../../utils/inputs/inputs.js";

import "./preliminaryData.css";

import cidadesBrasil from "../../../../../../utils/json/cidade-estados.json";

import emailGray from "../../../../../../assets/icons/login/email-gray.png";
import lockGray from "../../../../../../assets/icons/login/lock-gray.png";
import personGray from "../../../../../../assets/icons/register/person-gray.png";
import phoneGray from "../../../../../../assets/icons/register/phone-gray.png";
import infoBlue from "../../../../../../assets/icons/register/info-blue.png";
import pinGray from "../../../../../../assets/icons/buscarObjetos/pin-gray.svg";
import openEyeGray from "../../../../../../assets/icons/login/open-eye-gray.png";
import closeEyeGray from "../../../../../../assets/icons/login/close-eye-gray.png";

/* ========================================
   CIDADES
======================================== */

const todasAsCidades = cidadesBrasil.estados.flatMap((estado) =>
  estado.cidades.map((cidade) => ({
    cidade,
    estado: estado.sigla,
  })),
);

function PreliminaryData({ proximaPagina, error, setInput }) {
  const [obrigatorio, setObrigatorio] = useState(false);
  const [eyeState, setEyeState] = useState(true);
  const [requisitosSenhaPreenchido, setRequisitosSenhaPreenchido] =
    useState(false);

  const [inputNameState, setInputNameState] = useState("");
  const [inputEmailState, setInputEmailState] = useState("");
  const [inputPasswordState, setInputPasswordState] = useState("");
  const [inputTelephoneState, setInputTelephoneState] = useState("");

  const [inputCityState, setInputCityState] = useState("");
  const [inputState, setInputState] = useState("");

  const [cidadesFiltradas, setCidadesFiltradas] = useState([]);

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [autorizaCompartilharEmail, setAutorizaCompartilharEmail] =
    useState(false);

  const requisitosSenha = {
    tamanho: inputPasswordState.length >= 8,
    maiuscula: /[A-Z]/.test(inputPasswordState),
    minuscula: /[a-z]/.test(inputPasswordState),
    numero: /[0-9]/.test(inputPasswordState),
    especial: /[^A-Za-z0-9]/.test(inputPasswordState),
  };

  /* ========================================
     CIDADES
  ======================================== */

  function filtrarCidades(valor, estado = inputState) {
    if (!valor.trim()) {
      setCidadesFiltradas([]);
      return;
    }

    const resultado = todasAsCidades.filter((cidade) => {
      const mesmaCidade = cidade.cidade
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .startsWith(
          valor
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        );

      const mesmoEstado = estado ? cidade.estado === estado : true;

      return mesmaCidade && mesmoEstado;
    });

    setCidadesFiltradas(resultado);
  }

  function buscarCidades(valor) {
    setInputCityState(valor);
    filtrarCidades(valor);
  }

  function selecionarCidade(cidade) {
    setInputCityState(cidade.cidade);
    setInputState(cidade.estado);
    setCidadesFiltradas([]);
  }

  function alterarEstado(valor) {
    setInputState(valor);
    filtrarCidades(inputCityState, valor);
  }

  /* ========================================
     VALIDAÇÃO E CONTINUAÇÃO
  ======================================== */

  function continuarCriacaoConta() {
    try {
      error(null);

      if (
        !inputEmailState.trim() ||
        !inputPasswordState.trim() ||
        !inputNameState.trim()
      ) {
        setObrigatorio(true);
        return;
      }

      if (
        inputNameState.trim().length < 3 ||
        inputNameState.trim().length > 100
      ) {
        return error("Nome inválido");
      }

      validaCidade(inputCityState, inputState, todasAsCidades);

      if (inputTelephoneState) {
        verificaTelefone(inputTelephoneState);
      }

      if (!aceitouTermos) {
        return error(
          "Você precisa aceitar os Termos de Uso e a Política de Privacidade.",
        );
      }

      verificaEmailSenha(
        inputEmailState.trim().toLowerCase(),
        inputPasswordState,
      );

      verificaSenhaCadastro(inputPasswordState);

      setInput({
        name: inputNameState.trim(),
        email: inputEmailState.trim().toLowerCase(),
        password: inputPasswordState,
        telefone: inputTelephoneState || "",
        city: inputCityState || "",
        avatarUrl: "",
      });

      setObrigatorio(false);

      return proximaPagina(2);
    } catch (erro) {
      const mensagensErro = {
        "Credenciais inválidas": "Credenciais inválidas",
        "Email inválido": "Email inválido",
        "Senha inválida": "Senha inválida",
        "Telefone inválido": "Telefone inválido",
        "Estado não selecionado": "Selecione o estado da cidade",
        "Cidade inválida": "Selecione uma cidade disponível na lista",
      };

      return error(
        mensagensErro[erro.message] ||
          "Ocorreu um erro inesperado. Verifique se os dados informados estão corretos e tente novamente mais tarde.",
      );
    }
  }

  /* ========================================
     VISIBILIDADE DA SENHA
  ======================================== */

  function alternarVisibilidadeSenha() {
    setEyeState((estadoAtual) => !estadoAtual);
  }

  return (
    <div className="register__container__inputs">
      {/* NOME COMPLETO */}

      <div className="register__campo">
        <label className="register__label" htmlFor="nome">
          Nome completo
        </label>

        {obrigatorio && !inputNameState.trim() && (
          <span className="register__obrigatorio__message">Obrigatório</span>
        )}

        <div className="register__input__container">
          <img className="register__icon" src={personGray} alt="" />

          <input
            id="nome"
            name="nome"
            className="register__input"
            type="text"
            placeholder="Ex: João da Silva"
            autoComplete="name"
            value={inputNameState}
            onChange={(evento) => setInputNameState(evento.target.value)}
          />
        </div>
      </div>

      {/* E-MAIL */}

      <div className="register__campo">
        <label className="register__label" htmlFor="email">
          E-mail
        </label>

        {obrigatorio && !inputEmailState.trim() && (
          <span className="register__obrigatorio__message">Obrigatório</span>
        )}

        <div className="register__input__container">
          <img className="register__icon" src={emailGray} alt="" />

          <input
            id="email"
            name="email"
            className="register__input"
            type="email"
            placeholder="Ex: joao@email.com"
            autoComplete="email"
            value={inputEmailState}
            onChange={(evento) => setInputEmailState(evento.target.value)}
          />
        </div>
      </div>

      {/* SENHA */}

      <div className="register__campo">
        <label className="register__label" htmlFor="password">
          Senha
        </label>

        {obrigatorio && !inputPasswordState.trim() && (
          <span className="register__obrigatorio__message">Obrigatório</span>
        )}

        <div className="register__input__container">
          <img className="register__icon" src={lockGray} alt="" />

          <input
            id="password"
            name="password"
            className="register__input"
            type={eyeState ? "password" : "text"}
            placeholder="Sua senha"
            autoComplete="new-password"
            value={inputPasswordState}
            onChange={(evento) => setInputPasswordState(evento.target.value)}
            onFocus={() => setRequisitosSenhaPreenchido(true)}
            onBlur={() => setRequisitosSenhaPreenchido(false)}
          />

          <button
            className="register__eye__button"
            type="button"
            onClick={alternarVisibilidadeSenha}
            aria-label={eyeState ? "Mostrar senha" : "Ocultar senha"}
          >
            <img
              className="register__eye__icon"
              src={eyeState ? openEyeGray : closeEyeGray}
              alt=""
            />
          </button>
        </div>

        {requisitosSenhaPreenchido && (
          <div className="register__password__requerimentos">
            <p
              className={
                requisitosSenha.tamanho
                  ? "requisito__cumprido"
                  : "requisito__pendente"
              }
            >
              • Pelo menos 8 caracteres
            </p>

            <p
              className={
                requisitosSenha.maiuscula
                  ? "requisito__cumprido"
                  : "requisito__pendente"
              }
            >
              • Uma letra maiúscula
            </p>

            <p
              className={
                requisitosSenha.minuscula
                  ? "requisito__cumprido"
                  : "requisito__pendente"
              }
            >
              • Uma letra minúscula
            </p>

            <p
              className={
                requisitosSenha.numero
                  ? "requisito__cumprido"
                  : "requisito__pendente"
              }
            >
              • Um número
            </p>

            <p
              className={
                requisitosSenha.especial
                  ? "requisito__cumprido"
                  : "requisito__pendente"
              }
            >
              • Um caractere especial
            </p>
          </div>
        )}
      </div>

      {/* TELEFONE */}

      <div className="register__campo">
        <label className="register__label" htmlFor="telefone">
          Telefone
        </label>

        <div className="register__input__container">
          <img className="register__icon" src={phoneGray} alt="" />

          <IMaskInput
            id="telefone"
            name="telefone"
            className="register__input"
            mask="(00) 00000-0000"
            placeholder="Ex: (11) 99999-9999"
            type="tel"
            autoComplete="tel"
            value={inputTelephoneState}
            onAccept={(valor) => setInputTelephoneState(valor)}
          />
        </div>
      </div>

      {/* LOCALIZAÇÃO */}

      <div className="register__campo register__campo__cidade">
        <label className="register__label" htmlFor="cidade">
          Cidade
        </label>

        <div className="register__input__container">
          <img className="register__icon" src={pinGray} alt="" />

          <input
            id="cidade"
            name="cidade"
            className="register__input"
            type="text"
            placeholder="Sua cidade"
            autoComplete="address-level2"
            value={inputCityState}
            onChange={(evento) => buscarCidades(evento.target.value)}
            aria-autocomplete="list"
            aria-expanded={cidadesFiltradas.length > 0}
          />

          <select
            value={inputState}
            className="register__estado"
            aria-label="Estado"
            onChange={(evento) => alterarEstado(evento.target.value)}
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
          <div className="register__container__sugestoes" role="listbox">
            {cidadesFiltradas.map((cidade) => (
              <button
                className="register__cidades__sugestoes"
                type="button"
                key={`${cidade.cidade}-${cidade.estado}`}
                onClick={() => selecionarCidade(cidade)}
                role="option"
                aria-selected={false}
              >
                <span>{cidade.cidade}</span>
                <span className="register__cidade__uf">{cidade.estado}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONSENTIMENTOS */}

      <div className="register__consentimentos">
        <label className="register__consentimento">
          <input
            type="checkbox"
            checked={aceitouTermos}
            onChange={(evento) => setAceitouTermos(evento.target.checked)}
          />

          <span>
            Li e aceito os <NavLink to="/termos-de-uso">Termos de Uso</NavLink>{" "}
            e a{" "}
            <NavLink to="/politica-de-privacidade">
              Política de Privacidade
            </NavLink>
            .
          </span>
        </label>

        <label className="register__consentimento register__consentimento__email">
          <input
            type="checkbox"
            checked={autorizaCompartilharEmail}
            onChange={(evento) =>
              setAutorizaCompartilharEmail(evento.target.checked)
            }
          />

          <span>
            Autorizo que meu e-mail seja disponibilizado para contato quando
            alguém encontrar um objeto que publiquei na plataforma.
          </span>
        </label>
      </div>

      {/* AVISO SOBRE O E-MAIL */}

      <div className="register__container__info">
        <img className="info__image" src={infoBlue} alt="" />

        <p className="info__subtitle">
          Seu e-mail poderá ser exibido na página pública de objetos para
          permitir contato. Essa autorização é opcional.
        </p>
      </div>

      {/* CONTINUAR */}

      <button
        className="register__form__button"
        type="button"
        onClick={continuarCriacaoConta}
      >
        Continuar
      </button>

      <hr className="register__divider" />

      {/* LOGIN */}

      <div className="register__container__com__conta">
        <p className="register__com__conta__text">Já possui uma conta?</p>

        <NavLink to="/auth/login" end className="register__navlink">
          Entrar
        </NavLink>
      </div>
    </div>
  );
}

export default PreliminaryData;
