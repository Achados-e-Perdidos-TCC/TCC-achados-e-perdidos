import { useState, useEffect } from "react";
import { NavLink } from "react-router";

import { hoje, ontem } from "../../../../../utils/date/date.js";

import "./userObjects.css";

import Status from "../../../../../components/status/Status.jsx";
import NotObjectsRegistered from "../../../../../pages/errors/notObjectsRegistered/NotObjectsRegistered.jsx";

import pinGray from "../../../../../assets/icons/buscarObjetos/pin-gray.svg";
import calendarGray from "../../../../../assets/icons/buscarObjetos/calendar-gray.svg";
import arrowGray from "../../../../../assets/icons/buscarObjetos/arrow-gray.png";

import { myObjects } from "../../../private.service.js";
import { resolverUrlImagem } from "../../../../../utils/images/urlImagem.js";
import { obterNomeCompletoEstado } from "../../../../../utils/location/localizacao.js";

function UserObjects() {
  const [carregando, setCarregando] = useState(true);
  const [objetos, setObjetos] = useState([]);
  const [erro, setErro] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPorPagina, setTotalPorPagina] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768 ? 3 : 8,
  );

  const [menuAberto, setMenuAberto] = useState(null);

  useEffect(() => {
    async function findMyObject() {
      try {
        setCarregando(true);
        setErro(false);

        const resposta = await myObjects();

        const objetosAtivos = Array.isArray(resposta)
          ? resposta.filter((objeto) => objeto.status !== "INATIVO")
          : [];

        setObjetos(objetosAtivos);
      } catch (error) {
        console.error("Erro ao buscar objetos:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    findMyObject();
  }, []);

  useEffect(() => {
    function atualizarTotalPorPagina() {
      setTotalPorPagina(window.innerWidth <= 768 ? 3 : 8);
    }

    window.addEventListener("resize", atualizarTotalPorPagina);

    return () => {
      window.removeEventListener("resize", atualizarTotalPorPagina);
    };
  }, []);

  const total = objetos.length;
  const totalDePaginasNumerico = Math.ceil(total / totalPorPagina);

  useEffect(() => {
    if (paginaAtual > totalDePaginasNumerico && totalDePaginasNumerico > 0) {
      setPaginaAtual(totalDePaginasNumerico);
    }
  }, [paginaAtual, totalDePaginasNumerico]);

  function dataFormatada(data, hora) {
    if (!data) return "Data não informada";

    const dataConvertida = `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;

    if (!hora) return dataConvertida;

    if (data === hoje()) {
      return `Hoje, ${hora}`;
    }

    if (data === ontem()) {
      return `Ontem, ${hora}`;
    }

    return `${dataConvertida}, ${hora}`;
  }

  function formatarLocalizacao(localizacao) {
    const cidade = localizacao?.cidade?.trim();
    const estado = obterNomeCompletoEstado(localizacao?.estado);
    const endereco = localizacao?.endereco?.trim();

    const cidadeEstado = [cidade, estado].filter(Boolean).join(" - ");

    return (
      [cidadeEstado, endereco].filter(Boolean).join(", ") ||
      "Localização não informada"
    );
  }

  function alternarPagina(pagina) {
    setPaginaAtual(pagina);
    setMenuAberto(null);
  }

  function alternarMenu(id) {
    setMenuAberto((atual) => (atual === id ? null : id));
  }

  const inicio = totalPorPagina * (paginaAtual - 1);
  const objetosExibidos = objetos.slice(inicio, inicio + totalPorPagina);

  const totalDePaginas = Array.from(
    { length: totalDePaginasNumerico },
    (_, index) => index + 1,
  );

  const paginasVisiveis = totalDePaginas.slice(
    Math.floor((paginaAtual - 1) / (totalPorPagina <= 3 ? 5 : 10)) *
      (totalPorPagina <= 3 ? 5 : 10),
    Math.floor((paginaAtual - 1) / (totalPorPagina <= 3 ? 5 : 10)) *
      (totalPorPagina <= 3 ? 5 : 10) +
      (totalPorPagina <= 3 ? 5 : 10),
  );

  if (carregando) {
    return (
      <div className="user__objects user__objects--state">
        <p>Carregando seus objetos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="user__objects user__objects--state">
        <p>Não foi possível carregar seus objetos.</p>
      </div>
    );
  }

  return (
    <div className="user__objects">
      <div className="user__objects__header">
        <div>
          <h1 className="user__objects__text">Meus objetos</h1>

          <p className="user__objects__subtitle">
            Gerencie os objetos que você perdeu ou encontrou.
          </p>
        </div>
      </div>

      <div className="user__objects__principal">
        <span className="user__objects__text__principal">
          {total} {total === 1 ? "objeto cadastrado" : "objetos cadastrados"}
        </span>
      </div>

      {objetos.length === 0 ? (
        <NotObjectsRegistered />
      ) : (
        <div className="user__container__card">
          {objetosExibidos.map((valor) => {
            const nome = valor.nome || "Objeto sem nome";
            const localizacao = formatarLocalizacao(valor.localizacao);
            const imagemPrincipal = resolverUrlImagem(valor.imagemPrincipal);
            const data = valor.data?.data;
            const hora = valor.data?.hora;

            return (
              <article className="user__card__principal" key={valor.id}>
                <img
                  className="user__principal__cards__image__card"
                  src={imagemPrincipal}
                  alt={nome}
                />

                <div className="user__principal__meio">
                  <div className="user__principal__encima">
                    <div className="user__titulo__container">
                      <h2 className="user__titulo__principal" title={nome}>
                        {nome}
                      </h2>

                      <button
                        type="button"
                        className="user__menu__editar__botao"
                        aria-label={`Opções de ${nome}`}
                        aria-expanded={menuAberto === valor.id}
                        title="Opções do objeto"
                        onClick={() => alternarMenu(valor.id)}
                      >
                        <span>⋮</span>
                      </button>

                      {menuAberto === valor.id && (
                        <div className="user__menu__editar__opcoes">
                          <NavLink
                            to={`/user-area/editar-objeto/${valor.id}`}
                            onClick={() => setMenuAberto(null)}
                          >
                            Editar objeto
                          </NavLink>
                        </div>
                      )}
                    </div>

                    <div className="user__categoria__status">
                      <Status objeto={valor} />
                    </div>
                  </div>

                  <div className="user__principal__embaixo">
                    <div className="user__data__hora">
                      <div className="user__data__principal">
                        <img src={pinGray} alt="" />

                        <span
                          className="user__endereco__principal"
                          title={localizacao}
                        >
                          {localizacao}
                        </span>
                      </div>

                      <div className="user__hora__principal">
                        <img src={calendarGray} alt="" />

                        <span>{dataFormatada(data, hora)}</span>
                      </div>
                    </div>

                    <div className="user__button__responsive">
                      <NavLink to={`/buscar-objetos/${valor.id}`}>
                        Ver detalhes
                      </NavLink>
                    </div>

                    <div className="user__principal__direita">
                      <NavLink
                        className="user__button__principal"
                        to={`/buscar-objetos/${valor.id}`}
                      >
                        Ver detalhes
                        <span aria-hidden="true">→</span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalDePaginasNumerico > 1 && (
        <div className="user__principal__footer">
          <div className="user__paginas__principal">
            <button
              type="button"
              className="user__button__arrow"
              onClick={() => alternarPagina(Math.max(1, paginaAtual - 1))}
              disabled={paginaAtual === 1}
              aria-label="Página anterior"
            >
              <img className="arrow__left" src={arrowGray} alt="" />
            </button>

            <div className="paginas__exibidas">
              {paginasVisiveis.map((pagina) => (
                <button
                  type="button"
                  key={pagina}
                  onClick={() => alternarPagina(pagina)}
                  className={
                    paginaAtual === pagina
                      ? "user__paginas user__pagina__ativa"
                      : "user__paginas"
                  }
                  aria-current={paginaAtual === pagina ? "page" : undefined}
                >
                  {pagina}
                </button>
              ))}

              <span>
                {totalDePaginas.length > paginasVisiveis.length ? "..." : ""}
              </span>
            </div>

            <button
              type="button"
              className="user__button__arrow"
              onClick={() =>
                alternarPagina(
                  Math.min(totalDePaginasNumerico, paginaAtual + 1),
                )
              }
              disabled={paginaAtual === totalDePaginasNumerico}
              aria-label="Próxima página"
            >
              <img className="arrow__right" src={arrowGray} alt="" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserObjects;
