import "./hero.css";

import { useEffect, useState } from "react";
import { NavLink, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";

import direitawhite from "../../../assets/icons/home/direita-white.svg";
import direitablack from "../../../assets/icons/home/direita-black.svg";

import localizacao from "../../../assets/icons/buscarObjetos/pin-gray.svg";
import calendar from "../../../assets/icons/buscarObjetos/calendar-gray.svg";

import warningRed from "../../../assets/icons/buscarObjetos/warning-red.svg";
import checkGreen from "../../../assets/icons/buscarObjetos/check-green.svg";
import hourglassOrange from "../../../assets/icons/buscarObjetos/hourglass-orange.svg";

import { hoje, ontem } from "../../../utils/date/date.js";
import { objects as buscarObjetos } from "../../buscar-objetos/buscarObjetos.service.js";

import { formatarLocalizacao } from "../../../utils/location/localizacao.js";
import { resolverUrlImagem } from "../../../utils/images/urlImagem.js";
import { obterIconeCategoria } from "../../../utils/categories/categoriaIcone.js";

import Loading from "../../../components/loading/Loading.jsx";
import EstadoErroObjetos from "../components/EstadoErroObjetos/EstadoErroObjetos.jsx";
import EstadoVazioObjetos from "../components/EstadoVazioObjetos/EstadoVazioObjetos.jsx";
import FluxoFuncionamento from "../components/FluxoFuncionamento/FluxoFuncionamento.jsx";
import CardDicas from "../components/CardDicas/CardDicas.jsx";

function Hero() {
  const { tema } = useOutletContext();
  const { t } = useTranslation();

  const [objetos, setObjetos] = useState([]);
  const [carregandoObjetos, setCarregandoObjetos] = useState(true);
  const [erroObjetos, setErroObjetos] = useState(false);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarObjetosRecentes() {
      try {
        const resultado = await buscarObjetos();

        if (componenteAtivo) {
          setObjetos(Array.isArray(resultado) ? resultado.slice(0, 4) : []);
        }
      } catch (error) {
        console.error("Erro ao carregar objetos recentes:", error);

        if (componenteAtivo) {
          setErroObjetos(true);
        }
      } finally {
        if (componenteAtivo) {
          setCarregandoObjetos(false);
        }
      }
    }

    carregarObjetosRecentes();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  const imagemHero = tema === "light" ? direitawhite : direitablack;

  return (
    <main className="home">
      {/* HERO PRINCIPAL */}

      <section className="home-hero">
        <div className="home-hero__conteudo">
          <div className="home-hero__etiqueta">
            <span className="home-hero__etiqueta-ponto" />
            {t("home.hero.tag")}
          </div>

          <h1>
            {t("home.hero.titlePrefix")}{" "}
            <span className="home-hero__destaque">
              {t("home.hero.titleHighlight1")}
            </span>{" "}
            {t("home.hero.titleMiddle")}{" "}
            <span className="home-hero__destaque home-hero__destaque--verde">
              {t("home.hero.titleHighlight2")}
            </span>
          </h1>

          <p className="home-hero__descricao">{t("home.hero.description")}</p>

          <div className="home-hero__acoes">
            <NavLink
              className="home-botao home-botao--primario"
              to="/cadastrar-objetos"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {t("home.hero.lostButton")}
            </NavLink>

            <NavLink
              className="home-botao home-botao--secundario"
              to="/cadastrar-objetos"
            >
              {t("home.hero.foundButton")}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          </div>

          <div className="home-hero__confianca">
            <span className="home-hero__confianca-icone">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span>{t("home.hero.trust")}</span>
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__visual-fundo" />

          <div className="home-hero__visual-brilho" />

          <img
            className="home-hero__imagem"
            src={imagemHero}
            alt={t("home.hero.imageAlt")}
          />

          <div className="home-hero__selo">
            <span className="home-hero__selo-icone">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m16 16 4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span>
              <strong>{t("home.hero.badgeTitle")}</strong>
              <small>{t("home.hero.badgeSubtitle")}</small>
            </span>
          </div>
        </div>
      </section>

      {/* BUSCA */}

      <section className="home-busca">
        <div className="home-busca__icone">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle
              cx="21"
              cy="21"
              r="13"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="m31 31 10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="home-busca__conteudo">
          <span className="home-secao__sobretitulo">
            {t("home.search.eyebrow")}
          </span>

          <h2>{t("home.search.title")}</h2>

          <p>{t("home.search.description")}</p>
        </div>

        <NavLink className="home-busca__botao" to="/buscar-objetos">
          {t("home.search.button")}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </NavLink>
      </section>

      {/* COMO FUNCIONA */}

      <section className="home-funcionamento">
        <div className="home-secao__cabecalho">
          <div>
            <span className="home-secao__sobretitulo">
              {t("home.how.eyebrow")}
            </span>

            <h2>{t("home.how.title")}</h2>

            <p>{t("home.how.description")}</p>
          </div>
        </div>

        <div className="home-funcionamento__conteudo">
          <FluxoFuncionamento />
          <CardDicas />
        </div>
      </section>

      {/* OBJETOS RECENTES */}

      <section className="home-recentes">
        <div className="home-secao__cabecalho home-recentes__cabecalho">
          <div>
            <span className="home-secao__sobretitulo">
              {t("home.recent.eyebrow")}
            </span>

            <h2>{t("home.recent.title")}</h2>

            <p>{t("home.recent.description")}</p>
          </div>

          <NavLink className="home-recentes__ver-todos" to="/buscar-objetos">
            {t("home.recent.seeAll")}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavLink>
        </div>

        <div className="home-recentes__lista">
          {carregandoObjetos ? (
            <Loading />
          ) : erroObjetos ? (
            <EstadoErroObjetos />
          ) : objetos.length === 0 ? (
            <EstadoVazioObjetos />
          ) : (
            objetos.map((objeto) => {
              const status = (objeto.status || "").trim().toUpperCase();

              const nome = objeto.nome || t("home.item.unnamed");

              const descricao =
                objeto.descricao || t("home.item.noDescription");

              const data = objeto.data?.data?.trim() || "";
              const hora = objeto.data?.hora?.trim() || "";

              const localizacaoFormatada = formatarLocalizacao(
                objeto.localizacao,
              );

              return (
                <NavLink
                  className="home-objeto"
                  key={objeto.id}
                  to={`/buscar-objetos/${objeto.id}`}
                >
                  <div className="home-objeto__imagem-wrap">
                    {objeto.imagemPrincipal ? (
                      <img
                        className="home-objeto__imagem"
                        src={resolverUrlImagem(objeto.imagemPrincipal)}
                        alt={nome}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="home-objeto__placeholder"
                        aria-label={t("home.item.noImage")}
                      >
                        <svg viewBox="0 0 48 48" fill="none">
                          <rect
                            x="7"
                            y="9"
                            width="34"
                            height="30"
                            rx="5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <circle
                            cx="18"
                            cy="19"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <path
                            d="m9 34 10-10 7 7 5-5 8 8"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="home-objeto__conteudo">
                    <div className="home-objeto__tags">
                      <span
                        className={`home-objeto__status home-objeto__status--${classeStatus(status)}`}
                      >
                        <img src={verificaIconStatus(status)} alt="" />
                        {textoStatus(status, t)}
                      </span>

                      <span className="home-objeto__categoria">
                        <img
                          src={obterIconeCategoria(objeto.categoria)}
                          alt=""
                        />
                        {objeto.categoria || t("home.item.categoryFallback")}
                      </span>
                    </div>

                    <h3>{nome}</h3>

                    <p className="home-objeto__descricao">
                      {descricao.length > 105
                        ? `${descricao.slice(0, 105)}...`
                        : descricao}
                    </p>

                    <div className="home-objeto__informacoes">
                      <span>
                        <img src={localizacao} alt="" />
                        {localizacaoFormatada || t("home.item.noLocation")}
                      </span>

                      <span>
                        <img src={calendar} alt="" />
                        {dataFormatada(data, hora, t)}
                      </span>
                    </div>
                  </div>
                </NavLink>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

function verificaIconStatus(status) {
  if (status === "PERDIDO") return warningRed;
  if (status === "ENCONTRADO") return checkGreen;

  return hourglassOrange;
}

function classeStatus(status) {
  if (status === "PERDIDO") return "perdido";
  if (status === "ENCONTRADO") return "encontrado";

  return "analise";
}

function textoStatus(status, t) {
  if (status === "PERDIDO") return t("home.item.status.lost");
  if (status === "ENCONTRADO") return t("home.item.status.found");
  if (status === "ANALISE" || status === "EM_ANALISE") {
    return t("home.item.status.inAnalysis");
  }

  return t("home.item.status.inAnalysis");
}

function dataFormatada(data, hora, t) {
  if (!data) return t("home.item.noDate");

  if (data === hoje()) {
    return `${t("home.item.today")}${hora ? `, ${hora}` : ""}`;
  }

  if (data === ontem()) {
    return `${t("home.item.yesterday")}${hora ? `, ${hora}` : ""}`;
  }

  const dataLegivel = `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;

  return hora ? `${dataLegivel}, ${hora}` : dataLegivel;
}

export default Hero;
