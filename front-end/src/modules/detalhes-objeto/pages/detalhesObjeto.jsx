import { useState, useEffect } from "react";
import { useParams, NavLink, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";

import "./detalhesObjeto.css";

import { objects } from "../detalhesObjeto.service.js";

import Loading from "../../../components/loading/Loading.jsx";
import ObjectUnavailable from "../../../pages/errors/objectUnavailable/ObjectUnavailable.jsx";

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
  const { id } = useParams();
  const { tema } = useOutletContext();
  const { t } = useTranslation();

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
    let ativo = true;

    async function carregarObjeto() {
      setCarregando(true);
      setErro(null);
      setObjetos(null);

      try {
        const data = await objects(id);

        if (ativo) {
          setObjetos(data);
        }
      } catch (error) {
        if (ativo) {
          setErro(error);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarObjeto();

    return () => {
      ativo = false;
    };
  }, [id]);

  // Controla o fechamento do modal e o scroll da página.
  useEffect(() => {
    if (!modalAberto) return;

    const overflowAnterior = document.body.style.overflow;

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setModalAberto(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [modalAberto]);

  // Abre o modal de contato.
  function abrirModal() {
    setErroEnvio("");
    setModalAberto(true);
  }

  // Fecha o modal de contato.
  function fecharModal() {
    setModalAberto(false);
  }

  // Valida os campos do formulário.
  function validarFormulario() {
    if (!nome.trim()) {
      setErroEnvio(t("details.contact.errors.nameRequired"));
      return false;
    }

    if (!email.trim()) {
      setErroEnvio(t("details.contact.errors.emailRequired"));
      return false;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email.trim())) {
      setErroEnvio(t("details.contact.errors.emailInvalid"));
      return false;
    }

    if (!informacoes.trim()) {
      setErroEnvio(t("details.contact.errors.infoRequired"));
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
      setErroEnvio(t("details.contact.errors.ownerEmailMissing"));
      return;
    }

    const nomeObjeto = objetos.nome;

    const assunto = objetoEncontrado
      ? t("details.contact.email.subjectInterest", { name: nomeObjeto })
      : t("details.contact.email.subjectInfo", { name: nomeObjeto });

    const mensagem = `${t("details.contact.email.greeting")}

${
  objetoEncontrado
    ? t("details.contact.email.bodyInterest", { name: nomeObjeto })
    : t("details.contact.email.bodyInfo", { name: nomeObjeto })
}

${t("details.contact.email.nameLine", { name: nome.trim() })}
${t("details.contact.email.emailLine", { email: email.trim() })}

${t("details.contact.email.messageLabel")}
${informacoes.trim()}

${t("details.contact.email.linkLine", { link: window.location.href })}`;

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

    fecharModal();
  }

  if (carregando) {
    return <Loading />;
  }

  if (erro || !objetos) {
    return <ObjectUnavailable />;
  }

  return (
    <section className="detalhe__objetos">
      {/* Caminho de navegação */}
      <div className="caminho__voltar">
        <div className="caminho">
          <img className="house__gray" src={houseGray} alt={t("header.home")} />

          <img src={arrowGray} alt="" />

          <p className="caminho__text">
            {t("header.search")} / {objetos.nome || t("details.foundBadge")}
          </p>
        </div>

        <div className="voltar__buscar">
          <NavLink className="voltar__navlink" to="/buscar-objetos" end>
            <img src={arrowBlue} alt="" />

            <p className="voltar__text">{t("details.backToSearch")}</p>
          </NavLink>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container__detalhes">
        {/* Galeria de imagens */}
        <div className="esquerda">
          <ImagesCard key={objetos.id} objeto={objetos} />
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
                onClick={abrirModal}
              >
                <div className="botoes">
                  <img src={chatWhite} alt="" />

                  <p>
                    {objetoEncontrado
                      ? t("details.contact.interestTitle")
                      : t("details.contact.infoTitle")}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de informações */}
      {modalAberto && (
        <div className="modal__informacoes__overlay" onClick={fecharModal}>
          <div
            className="modal__informacoes"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-informacoes-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__informacoes__header">
              <div>
                <h2 id="modal-informacoes-titulo">
                  {objetoEncontrado
                    ? t("details.contact.interestTitle")
                    : t("details.contact.infoTitle")}
                </h2>

                <p>
                  {objetoEncontrado
                    ? t("details.contact.interestDescription")
                    : t("details.contact.infoDescription")}
                </p>
              </div>

              <button
                className="modal__informacoes__fechar"
                type="button"
                onClick={fecharModal}
                aria-label={t("details.contact.closeModal")}
              >
                <img src={tema === "light" ? xBlack : xWhite} alt="" />
              </button>
            </div>

            {erroEnvio && (
              <p className="modal__informacoes__erro" role="alert">
                {erroEnvio}
              </p>
            )}

            <form className="formulario__informacoes" onSubmit={enviarEmail}>
              <div className="campo__informacoes">
                <label htmlFor="nome">{t("details.contact.yourName")}</label>

                <input
                  id="nome"
                  type="text"
                  placeholder={t("details.contact.namePlaceholder")}
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />
              </div>

              <div className="campo__informacoes">
                <label htmlFor="email">{t("details.contact.yourEmail")}</label>

                <input
                  id="email"
                  type="email"
                  placeholder={t("details.contact.emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="campo__informacoes">
                <label htmlFor="informacoes">
                  {objetoEncontrado
                    ? t("details.contact.yourMessage")
                    : t("details.contact.yourInfo")}
                </label>

                <textarea
                  id="informacoes"
                  placeholder={
                    objetoEncontrado
                      ? t("details.contact.messagePlaceholderInterest")
                      : t("details.contact.messagePlaceholderInfo")
                  }
                  value={informacoes}
                  onChange={(event) => setInformacoes(event.target.value)}
                />
              </div>

              <div className="modal__informacoes__botoes">
                <button
                  className="botao__cancelar__informacoes"
                  type="button"
                  onClick={fecharModal}
                >
                  {t("common.cancel")}
                </button>

                <button className="botao__enviar__informacoes" type="submit">
                  {objetoEncontrado
                    ? t("details.contact.sendMessage")
                    : t("details.contact.sendInfo")}
                </button>
              </div>

              <p className="aviso__email">{t("details.contact.gmailNote")}</p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default DetalhesObjeto;
