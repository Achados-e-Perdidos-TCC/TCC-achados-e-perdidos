import { useState, useEffect } from "react";
import { useParams, NavLink, useOutletContext } from "react-router";

import "./detalhesObjeto.css";

import { objects } from "../detalhesObjeto.service.js";

import Loading from "../../../components/loading/Loading.jsx";

import houseGray from "../../../assets/icons/detalhesObjeto/house-gray.svg";
import arrowGray from "../../../assets/icons/detalhesObjeto/arrow-gray.svg";
import arrowBlue from "../../../assets/icons/detalhesObjeto/arrow-blue.svg";
import chatWhite from "../../../assets/icons/detalhesObjeto/chat-white.svg";
import xBlack from "../../../assets/icons/detalhesObjeto/x-black.svg";
import xWhite from "../../../assets/icons/detalhesObjeto/x-white.png";

import ImagesCard from "../components/imagesCard/ImagesCard.jsx";

import Detalhes, {
  DetalhesCabecalho,
} from "../components/detalhes/Detalhes.jsx";

function DetalhesObjeto() {
  const params = useParams();
  const { tema } = useOutletContext();

  const [objetos, setObjetos] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [informacoes, setInformacoes] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  // Identifica se o objeto já foi encontrado.
  const objetoEncontrado = objetos?.status?.toUpperCase() === "ENCONTRADO";

  // Busca os dados do objeto.
  useEffect(() => {
    async function carregarObjeto() {
      try {
        const data = await objects(params.id);
        setObjetos(data);
      } catch (error) {
        setErro(error);
      } finally {
        setCarregando(false);
      }
    }

    carregarObjeto();
  }, [params.id]);

  // Valida os campos do formulário.
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

    if (!emailValido.test(email.trim())) {
      setErroEnvio("Informe um endereço de e-mail válido.");
      return false;
    }

    if (!informacoes.trim()) {
      setErroEnvio("Descreva as informações que você possui sobre o objeto.");
      return false;
    }

    return true;
  }

  // Prepara e abre o Gmail para enviar a mensagem.
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

    const nomeObjeto = objetos.nome;

    const assunto = objetoEncontrado
      ? `Tenho interesse no objeto: ${nomeObjeto}`
      : `Informações sobre o objeto: ${nomeObjeto}`;

    const mensagem = `Olá!

${
  objetoEncontrado
    ? `Tenho interesse no objeto "${nomeObjeto}" e gostaria de saber mais sobre ele.`
    : `Tenho informações sobre o objeto "${nomeObjeto}" e gostaria de ajudar na sua identificação e recuperação.`
}

Nome: ${nome.trim()}
E-mail: ${email.trim()}

Mensagem:
${informacoes.trim()}

Link do objeto: ${window.location.href}`;

    const parametros = new URLSearchParams({
      view: "cm",
      to: emailResponsavel,
      su: assunto,
      body: mensagem,
    });

    const link = `https://mail.google.com/mail/u/0/?${parametros.toString()}`;

    const largura = 850;
    const altura = 650;

    const esquerda = window.screenX + (window.outerWidth - largura) / 2;

    const topo = window.screenY + (window.outerHeight - altura) / 2;

    // Abre apenas uma janela do Gmail.
    window.open(
      link,
      "janelaEmail",
      `width=${largura},height=${altura},left=${esquerda},top=${topo},resizable=yes,scrollbars=yes`,
    );

    setModalAberto(false);
  }

  if (carregando) {
    return <Loading />;
  }

  if (erro || !objetos) {
    return <p>Não foi possível carregar o objeto.</p>;
  }

  return (
    <section className="detalhe__objetos">
      {/* Caminho de navegação */}
      <div className="caminho__voltar">
        <div className="caminho">
          <img className="house__gray" src={houseGray} alt="Início" />

          <img src={arrowGray} alt="" />

          <p className="caminho__text">
            Buscar objetos / {objetos.nome || "Objeto encontrado"}
          </p>
        </div>

        <div className="voltar__buscar">
          <NavLink className="voltar__navlink" to="/buscar-objetos" end>
            <img src={arrowBlue} alt="" />

            <p className="voltar__text">Voltar para Buscar Objetos</p>
          </NavLink>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container__detalhes">
        {/* Galeria de imagens */}
        <div className="esquerda">
          <ImagesCard objeto={objetos} />
        </div>

        {/* Coluna direita */}
        <div className="coluna__detalhes">
          {/* Nome e status */}
          <div className="topo__detalhes">
            <DetalhesCabecalho objeto={objetos} />
          </div>

          {/* Categoria, localização, data e descrição */}
          <div className="direita">
            <Detalhes objeto={objetos} />

            {/* Botão de contato */}
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
                  <img src={chatWhite} alt="" />

                  <p>
                    {objetoEncontrado
                      ? "Tenho interesse neste objeto"
                      : "Tenho informações sobre este objeto"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de informações */}
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
              <div>
                <h2>
                  {objetoEncontrado
                    ? "Tenho interesse neste objeto"
                    : "Tenho informações sobre este objeto"}
                </h2>

                <p>
                  {objetoEncontrado
                    ? "Gostaria de saber mais sobre este objeto? Envie uma mensagem ao responsável para obter mais informações."
                    : "Possui informações sobre este objeto? Envie uma mensagem ao responsável para ajudar na sua identificação e recuperação."}
                </p>
              </div>

              <button
                className="modal__informacoes__fechar"
                type="button"
                onClick={() => setModalAberto(false)}
              >
                <img src={tema === "light" ? xBlack : xWhite} alt="Fechar" />
              </button>
            </div>

            {erroEnvio && (
              <p className="modal__informacoes__erro">{erroEnvio}</p>
            )}

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
                <label htmlFor="informacoes">
                  {objetoEncontrado ? "Sua mensagem" : "Suas informações"}
                </label>

                <textarea
                  id="informacoes"
                  placeholder={
                    objetoEncontrado
                      ? "Escreva sua mensagem ou dúvida sobre este objeto..."
                      : "Descreva as informações que você tem sobre este objeto..."
                  }
                  value={informacoes}
                  onChange={(event) => setInformacoes(event.target.value)}
                />
              </div>

              <div className="modal__informacoes__botoes">
                <button
                  className="botao__cancelar__informacoes"
                  type="button"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>

                <button className="botao__enviar__informacoes" type="submit">
                  {objetoEncontrado ? "Enviar mensagem" : "Enviar informações"}
                </button>
              </div>

              <p className="aviso__email">
                A mensagem será aberta no seu próprio Gmail. O e-mail informado
                será usado apenas para identificação.
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default DetalhesObjeto;
