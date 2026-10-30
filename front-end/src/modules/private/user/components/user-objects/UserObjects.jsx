import { useState, useEffect } from "react";
import { NavLink } from "react-router";

import { hoje, ontem } from "../../../../../utils/date/date.js";

import "./userObjects.css";
import Status from "../../../../../components/status/Status.jsx";
import NotObjectsRegistered from "../../../../../pages/errors/notObjectsRegistered/NotObjectsRegistered.jsx";

import pinGray from "../../../../../assets/icons/buscarObjetos/pin-gray.svg";
import calendarGray from "../../../../../assets/icons/buscarObjetos/calendar-gray.svg";
import arrowBlue from "../../../../../assets/icons/buscarObjetos/arrow-blue.svg";
import arrowGray from "../../../../../assets/icons/buscarObjetos/arrow-gray.png";

import { myObjects } from "../../../private.service.js";

function UserObjects({ open }) {
  const [carregando, setCarregando] = useState(true);
  const [objetos, setObjetos] = useState([]);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function findMyObject() {
      try {
        setCarregando(true);
        setErro(false);

        const resposta = await myObjects();

        setObjetos(Array.isArray(resposta) ? resposta : []);
      } catch (error) {
        console.error("Erro ao buscar objetos:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    findMyObject();
  }, []);

  function dataFormatada(data, hora) {
    if (!data) return "Data não informada";

    if (!hora) {
      return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
    }

    if (data === hoje()) {
      return `Hoje, ${hora}`;
    }

    if (data === ontem()) {
      return `Ontem, ${hora}`;
    }

    return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}, ${hora}`;
  }

  const [paginaAtual, setPaginaAtual] = useState(1);

  const [totalPorPagina, setTotalPorPagina] = useState(
    window.innerWidth >= 960 && window.innerWidth <= 1032
      ? 5
      : window.innerWidth <= 768
        ? 3
        : 8,
  );

  useEffect(() => {
    function atualizarTotalPorPagina() {
      setTotalPorPagina(
        window.innerWidth >= 960 && window.innerWidth <= 1032
          ? 5
          : window.innerWidth <= 768
            ? 3
            : 8,
      );
    }

    window.addEventListener("resize", atualizarTotalPorPagina);

    return () => {
      window.removeEventListener("resize", atualizarTotalPorPagina);
    };
  }, []);

  const total = objetos.length;
  const totalDePaginasNumerico = Math.ceil(total / totalPorPagina);

  const totalDePaginas = Array.from(
    { length: totalDePaginasNumerico },
    (_, index) => index + 1,
  );

  const inicio = totalPorPagina * (paginaAtual - 1);
  const fim = inicio + totalPorPagina;

  function alternarPagina(pagina) {
    setPaginaAtual(pagina);
  }

  function formatarLocalizacao(localizacao) {
    const estado = localizacao?.estado;
    const cidade = localizacao?.cidade;

    const cidadeEstado = [estado, cidade].filter(Boolean).join(" - ");

    return cidadeEstado || localizacao?.endereco || "Localização não informada";
  }

  if (carregando) {
    return <div className="user__objects">Carregando objetos...</div>;
  }

  if (erro) {
    return (
      <div className="user__objects">
        Não foi possível carregar seus objetos.
      </div>
    );
  }

  return (
    <div className="user__objects">
      <div>
        <h1 className="user__objects__text">Meus objetos</h1>

        <p className="user__objects__subtitle">
          Gerencie os objetos que você perdeu ou encontrou.
        </p>
      </div>

      <div className="user__objects__principal">
        <span className="user__objects__text__principal">
          {total} objetos encontrados
        </span>
      </div>

      <div className={objetos.length === 0 ? "" : "user__container__card"}>
        {objetos.length === 0 ? (
          <NotObjectsRegistered />
        ) : (
          objetos.slice(inicio, fim).map((valor) => {
            const nome = valor.nome || "Objeto sem nome";
            const localizacao = formatarLocalizacao(valor.localizacao);
            const data = valor.data?.data;
            const hora = valor.data?.hora;

            return (
              <div className="user__card__principal" key={valor.id}>
                <img
                  className="user__principal__cards__image__card"
                  src={valor.imagemPrincipal || ""}
                  alt={nome}
                />

                <div className="user__principal__meio">
                  <div className="user__principal__encima">
                    <div className="user__titulo__container">
                      {open ? (
                        <h1 className="user__titulo__principal">
                          {nome.length < 15 ? nome : `${nome.slice(0, 15)}...`}
                        </h1>
                      ) : (
                        <h1 className="user__titulo__principal">
                          {nome.length < 50 ? nome : `${nome.slice(0, 15)}...`}
                        </h1>
                      )}

                      <h1 className="user__titulo__responsive">
                        {nome.length < 25 ? nome : `${nome.slice(0, 25)}...`}
                      </h1>

                      <div className="user__menu__editar">
                        <button
                          type="button"
                          className="user__menu__editar__botao"
                          aria-label="Opções do objeto"
                          title="Opções"
                        >
                          <span>⋮</span>
                        </button>

                        <div className="user__menu__editar__opcoes">
                          <NavLink to={`/buscar-objetos/${valor.id}?edit=true`}>
                            <span>Editar objeto</span>
                          </NavLink>
                        </div>
                      </div>
                    </div>

                    <div className="user__categoria__status">
                      <Status objeto={valor} />
                    </div>
                  </div>

                  <div className="user__principal__embaixo">
                    <div className="user__data__hora">
                      <div className="user__data__principal">
                        <img src={pinGray} alt="" />

                        <p className="user__endereco__principal">
                          {localizacao.length < 20
                            ? localizacao
                            : `${localizacao.slice(0, 20)}...`}
                        </p>

                        <span className="user__endereco__responsive">
                          {localizacao.length < 27
                            ? localizacao
                            : `${localizacao.slice(0, 27)}...`}
                        </span>
                      </div>

                      <div className="user__hora__principal">
                        <img src={calendarGray} alt="" />
                        <span>{dataFormatada(data, hora)}</span>
                      </div>
                    </div>

                    {/* Ações responsivas */}
                    <div className="user__button__responsive">
                      <NavLink
                        className="user__detalhes__principal"
                        to={`/buscar-objetos/${valor.id}`}
                      >
                        Ver detalhes
                      </NavLink>
                    </div>

                    {/* Ações para desktop */}
                    <div className="user__principal__direita">
                      <div className="user__principal__direita">
                        <NavLink
                          className="user__button__principal"
                          to={`/buscar-objetos/${valor.id}`}
                        >
                          <span className="user__detalhes__principal">
                            Ver detalhes
                          </span>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalDePaginasNumerico > 1 && (
        <div className="user__principal__footer">
          <div className="user__paginas__principal">
            <div
              onClick={() => alternarPagina(Math.max(1, paginaAtual - 1))}
              className="button user__button__arrow"
            >
              <img className="arrow__left" src={arrowGray} alt="Anterior" />
            </div>

            <div className="paginas__exibidas">
              {totalDePaginas
                .slice(
                  Math.floor((paginaAtual - 1) / 10) * 10,
                  Math.floor((paginaAtual - 1) / 10) * 10 + 10,
                )
                .map((valor) => (
                  <p
                    key={valor}
                    onClick={() => alternarPagina(valor)}
                    className={
                      paginaAtual === valor
                        ? "user__paginas user__pagina__ativa"
                        : "user__paginas"
                    }
                  >
                    {valor}
                  </p>
                ))}

              <span>{totalDePaginas.length > 10 ? "..." : ""}</span>
            </div>

            <div className="user__paginas__responsivas">
              {totalDePaginas
                .slice(
                  Math.floor((paginaAtual - 1) / 5) * 5,
                  Math.floor((paginaAtual - 1) / 5) * 5 + 5,
                )
                .map((valor) => (
                  <p
                    key={valor}
                    onClick={() => alternarPagina(valor)}
                    className={
                      paginaAtual === valor
                        ? "user__paginas user__pagina__ativa"
                        : "user__paginas"
                    }
                  >
                    {valor}
                  </p>
                ))}

              <span>{totalDePaginas.length > 5 ? "..." : ""}</span>
            </div>

            <div
              onClick={() =>
                alternarPagina(
                  Math.min(totalDePaginasNumerico, paginaAtual + 1),
                )
              }
              className="button user__button__arrow"
            >
              <img className="arrow__right" src={arrowGray} alt="Próxima" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserObjects;
