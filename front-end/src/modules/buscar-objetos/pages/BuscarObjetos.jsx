import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import Loading from "../../../components/loading/Loading.jsx";
import "./buscarObjetos.css";

import FilterProvider from "../../../contexts/filterContexts/filterContext.jsx";

import { objects } from "../buscarObjetos.service.js";

import sumaryIcon from "../../../assets/icons/buscarObjetos/sumary.svg";
import arrowGray from "../../../assets/icons/buscarObjetos/arrow-gray.png";

import PrimaryFilters from "../../../components/filter/primaryFilters/PrimaryFilters.jsx";
import SecondaryFilters from "../components/secondaryFilters/SecondaryFilters.jsx";
import PrincipalCards from "../components/principalCards/PrincipalCards.jsx";

function BuscarObjetos() {
  const { t } = useTranslation();

  const [objetos, setObjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [exibidos, setExibidos] = useState(0);
  const [totalEncontrados, setTotalEncontrados] = useState(0);

  useEffect(() => {
    async function buscarObjetos() {
      try {
        setCarregando(true);
        setErro(null);

        const resposta = await objects();
        setObjetos(Array.isArray(resposta) ? resposta : []);
      } catch (error) {
        setErro(error);
      } finally {
        setCarregando(false);
      }
    }

    buscarObjetos();
  }, []);

  const total = totalEncontrados;
  const totalPorPagina = 6;
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

  function resultadosExibidos(cards) {
    setExibidos(cards);
  }

  function resultadoTotalEncontrados(cards) {
    setTotalEncontrados(cards);
  }

  return (
    <FilterProvider>
      <section className="buscar__objetos">
        {/* Cabeçalho */}
        <header className="busca__header">
          <div className="busca__header__texto">
            <span className="busca__eyebrow">{t("search.eyebrow")}</span>

            <h1 className="title__buscar">{t("search.title")}</h1>

            <p className="subtitle subtitle__description">
              {t("search.subtitle")}
            </p>
          </div>

          <div className="busca__resumo">
            <div className="busca__resumo__icone">
              <img src={sumaryIcon} alt="" />
            </div>

            <div className="busca__resumo__informacoes">
              <span className="busca__resumo__numero">{total}</span>

              <span className="busca__resumo__descricao">
                {t("search.foundLabel", { count: total })}
              </span>
            </div>
          </div>
        </header>

        {/* Filtros principais */}
        <section className="busca__filtros container__card">
          <div className="busca__secao__titulo">
            <div>
              <h2>{t("search.filtersTitle")}</h2>
              <p>{t("search.filtersSubtitle")}</p>
            </div>
          </div>

          <div className="busca__filtros__conteudo">
            <PrimaryFilters />
          </div>

          <div className="busca__filtros__divisor" />

          <div className="busca__filtros__status">
            <span className="busca__filtros__label">
              {t("search.publicationType")}
            </span>

            <SecondaryFilters />
          </div>
        </section>

        {/* Resultados */}
        <section className="busca__resultados container__card">
          <div className="busca__resultados__header">
            <div className="busca__resultados__titulo">
              <div>
                <h2>{t("search.resultsTitle")}</h2>

                <p>{t("search.resultsSubtitle")}</p>
              </div>

              <span className="busca__resultados__contador">
                {t("search.resultsCount", { count: totalEncontrados })}
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="principal__cards">
            {carregando ? (
              <Loading />
            ) : erro ? (
              <div className="busca__estado">
                <h3>{t("search.loadError")}</h3>
                <p>{t("search.loadErrorDescription")}</p>
              </div>
            ) : (
              <PrincipalCards
                objetos={objetos}
                inicio={inicio}
                fim={fim}
                resultadosExibidos={resultadosExibidos}
                resultadoTotalEncontrados={resultadoTotalEncontrados}
              />
            )}
          </div>

          {/* Paginação */}
          {!carregando && !erro && total > 0 && (
            <footer className="principal__footer">
              <span className="principal__footer__texto">
                <Trans
                  i18nKey="search.showing"
                  values={{ shown: exibidos, total }}
                  components={{ strong: <strong /> }}
                />
              </span>

              <div className="paginas__principal">
                <button
                  type="button"
                  className="button__arrow"
                  disabled={paginaAtual <= 1}
                  onClick={() => alternarPagina(Math.max(1, paginaAtual - 1))}
                  aria-label={t("common.previousPage")}
                >
                  <img className="arrow__left" src={arrowGray} alt="" />
                </button>

                <div className="paginas__exibidas">
                  {totalDePaginas
                    .slice(
                      Math.floor((paginaAtual - 1) / 10) * 10,
                      Math.floor((paginaAtual - 1) / 10) * 10 + 10,
                    )
                    .map((valor) => (
                      <button
                        type="button"
                        key={valor}
                        onClick={() => alternarPagina(valor)}
                        className={
                          paginaAtual === valor
                            ? "paginas pagina__ativa"
                            : "paginas"
                        }
                      >
                        {valor}
                      </button>
                    ))}

                  {totalDePaginas.length > 10 && <span>...</span>}
                </div>

                <button
                  type="button"
                  className="button__arrow"
                  disabled={paginaAtual >= totalDePaginasNumerico}
                  onClick={() =>
                    alternarPagina(
                      Math.min(totalDePaginasNumerico, paginaAtual + 1),
                    )
                  }
                  aria-label={t("common.nextPage")}
                >
                  <img className="arrow__right" src={arrowGray} alt="" />
                </button>
              </div>
            </footer>
          )}
        </section>
      </section>
    </FilterProvider>
  );
}

export default BuscarObjetos;
