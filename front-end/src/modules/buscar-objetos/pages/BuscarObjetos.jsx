import { useState, useEffect } from "react";
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
            <span className="busca__eyebrow">ENCONTRE O QUE PROCURA</span>

            <h1 className="title__buscar">Buscar objetos</h1>

            <p className="subtitle subtitle__description">
              Encontre objetos perdidos ou descubra se alguém encontrou aquilo
              que você procura.
            </p>
          </div>

          <div className="busca__resumo">
            <div className="busca__resumo__icone">
              <img src={sumaryIcon} alt="" />
            </div>

            <div className="busca__resumo__informacoes">
              <span className="busca__resumo__numero">{total}</span>

              <span className="busca__resumo__descricao">
                objetos encontrados
              </span>
            </div>
          </div>
        </header>

        {/* Filtros principais */}
        <section className="busca__filtros container__card">
          <div className="busca__secao__titulo">
            <div>
              <h2>Encontre um objeto</h2>
              <p>Utilize os filtros para refinar sua pesquisa.</p>
            </div>
          </div>

          <div className="busca__filtros__conteudo">
            <PrimaryFilters />
          </div>

          <div className="busca__filtros__divisor" />

          <div className="busca__filtros__status">
            <span className="busca__filtros__label">Tipo de publicação</span>

            <SecondaryFilters />
          </div>
        </section>

        {/* Resultados */}
        <section className="busca__resultados container__card">
          <div className="busca__resultados__header">
            <div className="busca__resultados__titulo">
              <div>
                <h2>Resultados da busca</h2>

                <p>Objetos relacionados aos filtros selecionados</p>
              </div>

              <span className="busca__resultados__contador">
                {totalEncontrados} resultados
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="principal__cards">
            {carregando ? (
              <Loading />
            ) : erro ? (
              <div className="busca__estado">
                <h3>Não foi possível carregar os objetos</h3>
                <p>
                  Ocorreu um problema ao buscar as publicações. Tente novamente
                  mais tarde.
                </p>
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
                Mostrando <strong>{exibidos}</strong> de{" "}
                <strong>{total}</strong> resultados
              </span>

              <div className="paginas__principal">
                <button
                  type="button"
                  className="button__arrow"
                  disabled={paginaAtual <= 1}
                  onClick={() => alternarPagina(Math.max(1, paginaAtual - 1))}
                  aria-label="Página anterior"
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
                  aria-label="Próxima página"
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
