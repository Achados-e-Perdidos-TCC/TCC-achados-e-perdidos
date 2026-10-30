import { useState, useEffect } from "react";
import { useParams, NavLink, useOutletContext } from "react-router";

import "./detalhesObjeto.css";

import { objects } from "../detalhesObjeto.service.js";

import houseGray from "../../../assets/icons/detalhesObjeto/house-gray.svg";
import arrowGray from "../../../assets/icons/detalhesObjeto/arrow-gray.svg";
import arrowBlue from "../../../assets/icons/detalhesObjeto/arrow-blue.svg";
import chatWhite from "../../../assets/icons/detalhesObjeto/chat-white.svg";
import xBlack from "../../../assets/icons/detalhesObjeto/x-black.svg";
import xWhite from "../../../assets/icons/detalhesObjeto/x-white.png";

import ImagesCard from "../components/imagesCard/ImagesCard.jsx";
import Detalhes from "../components/detalhes/Detalhes.jsx";

function detalhesObjeto() {
  const params = useParams();
  const { tema } = useOutletContext();

  const [objetos, setObjetos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [informacoes, setInformacoes] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  useEffect(() => {
    async function Object() {
      try {
        const data = await objects(params.id);

        setObjetos(data);
      } catch (error) {
        setErro(error);
      } finally {
        setCarregando(false);
      }
    }

    Object();
  }, []);

  function validarFormulario() {
    if (!nome.trim()) {
      setErroEnvio("Informe seu nome.");
      return false;
    }

    if (!email.trim()) {
      setErroEnvio("Informe seu e-mail.");
      return false;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      setErroEnvio("Informe um endereço de e-mail válido.");
      return false;
    }

    if (!informacoes.trim()) {
      setErroEnvio("Descreva as informações que você possui sobre o objeto.");
      return false;
    }

    return true;
  }

  function enviarEmail(event) {
    event.preventDefault();

    setErroEnvio("");

    if (!validarFormulario()) return;

    const emailResponsavel = objetos?.emailResponsavel;

    if (!emailResponsavel) {
      setErroEnvio(
        "Não foi possível identificar o e-mail do responsável por este objeto.",
      );
      return;
    }

    const assunto = `Informações sobre o objeto: ${objetos.nome}`;

    const mensagem = `
        Olá!

        Tenho informações sobre o objeto "${objetos.nome}".

        Nome: ${nome}
        E-mail: ${email}

        Informações:
        ${informacoes}

        Link do objeto: ${window.location.href}
    `;

    const link = `mailto:${emailResponsavel}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;

    window.location.href = link;
    setModalAberto(false);
  }

  if (carregando) {
    return <p>Carregando objetos...</p>;
  }
  if (erro) {
    return <p>Não foi possível carregar os objetos.</p>;
  }

  return (
    <section className="detalhe__objetos">
      <div className="caminho__voltar">
        <div className="caminho">
          <img className="house__gray" src={houseGray} />
          <img src={arrowGray} />
          <p className="caminho__text">
            Buscar objetos / {`objetoEncontrado[0].name`}
          </p>
        </div>

        <div className="voltar__buscar">
          <NavLink className="voltar__navlink" to="/buscar-objetos" end>
            <img src={arrowBlue} />
            <p className="voltar__text"> voltar para Buscar Objetos </p>
          </NavLink>
        </div>
      </div>

      <div className="container__detalhes">
        <div className="esquerda">
          <ImagesCard objeto={objetos} />
        </div>

        <div className="direita">
          <Detalhes objeto={objetos} />
        </div>
      </div>

      <div className="container__botoes">
        <button
          className="botao__azul"
          type="button"
          onClick={() => {
            setErroEnvio("");
            setModalAberto(true);
          }}
        >
          <div className="botoes">
            <img src={chatWhite} />
            <p>Tenho informações sobre este objeto</p>
          </div>
        </button>
      </div>

      {/* modal */}

      {modalAberto && (
        <div
          className="modal__informacoes__overlay"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="modal__informacoes"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__informacoes__header">
              <h2>Tenho informações sobre este objeto</h2>

              <button
                className="modal__informacoes__fechar"
                type="button"
                onClick={() => setModalAberto(false)}
              >
                <img src={tema === "light" ? xBlack : xWhite} />
              </button>
            </div>

            <form className="formulario__informacoes" onSubmit={enviarEmail}>
              <div className="campo__informacoes">
                <label htmlFor="nome">Seu nome</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />
              </div>

              <div className="campo__informacoes">
                <label htmlFor="email">Seu e-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="campo__informacoes">
                <label htmlFor="informacoes">Suas informações</label>
                <textarea
                  id="informacoes"
                  placeholder="Descreva as informações que você tem sobre este objeto..."
                  value={informacoes}
                  onChange={(event) => setInformacoes(event.target.value)}
                />
              </div>

              {erroEnvio && (
                <p className="modal__informacoes__erro">{erroEnvio}</p>
              )}

              <div className="modal__informacoes__botoes">
                <button
                  className="botao__cancelar__informacoes"
                  type="button"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>

                <button className="botao__enviar__informacoes" type="submit">
                  Enviar informações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default detalhesObjeto;
