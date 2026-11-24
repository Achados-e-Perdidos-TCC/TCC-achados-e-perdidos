import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { obterIconeCategoria } from "../../../../../utils/categories/categoriaIcone.js";

import { panoramaDaPlataforma } from "./overview.service.js";
import { ehTipo, nomeDoDia, topPor, insights } from "./overview.utils.js";

import DonutChart from "./charts/DonutChart.jsx";
import BarList from "./charts/BarList.jsx";

import "./userOverview.css";

function UserOverview({ userInfos, setPageActive }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("pt") ? "pt-BR" : "en-IE";
  const minhaCidade = userInfos.city?.trim() || "";

  const [panorama, setPanorama] = useState(null);
  const [erro, setErro] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        const dados = await panoramaDaPlataforma(minhaCidade);

        if (cancelado) return;

        setPanorama(dados);
        setAtualizadoEm(new Date());
        setErro(false);
      } catch {
        if (!cancelado) setErro(true);
      }
    }

    carregar();

    return () => {
      cancelado = true;
    };
  }, [minhaCidade]);

  const carregando = !panorama && !erro;

  // ----- dados derivados -----

  const amostra = panorama?.amostra ?? [];
  const perdidos = panorama?.perdidos ?? 0;
  const encontrados = panorama?.encontrados ?? 0;
  const totalPlataforma = perdidos + encontrados;

  const amostraPerdidos = amostra.filter((o) => ehTipo(o, "PERDIDO"));

  const categorias = topPor(amostraPerdidos, (o) => o.categoria).map(
    (item) => ({
      ...item,
      icone: obterIconeCategoria(item.rotulo),
    }),
  );

  const quando = insights(amostraPerdidos);

  const cidade = panorama?.cidade;
  const totalCidade = (cidade?.perdidos ?? 0) + (cidade?.encontrados ?? 0);
  const participacao = totalPlataforma
    ? Math.round((totalCidade / totalPlataforma) * 1000) / 10
    : 0;

  const horaAtualizacao = atualizadoEm
    ? atualizadoEm.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const primeiroNome = userInfos.name.split(" ")[0];

  // ----- render -----

  return (
    <div className="overview">
      {/* HERO */}

      <section className="overview__hero">
        <div className="overview__hero-text">
          <span className="overview__live">
            <i />
            {t("account.overview.live")}
            {horaAtualizacao && ` · ${horaAtualizacao}`}
          </span>

          <div>
            <h1 className="overview__title">
              {t("account.overview.greeting", { name: primeiroNome })}
            </h1>
            <p className="overview__subtitle">
              {t("account.overview.heroText")}
            </p>
          </div>
        </div>

        <div className="overview__hero-total">
          <strong>{totalPlataforma.toLocaleString(locale)}</strong>
          <span>{t("account.overview.totalLabel")}</span>
        </div>
      </section>

      {carregando ? (
        <p className="overview__state">{t("account.overview.loading")}</p>
      ) : erro ? (
        <p className="overview__state">{t("account.overview.loadError")}</p>
      ) : totalPlataforma === 0 ? (
        <section className="overview__empty">
          <h2>{t("account.overview.empty.title")}</h2>
          <p>{t("account.overview.empty.text")}</p>
        </section>
      ) : (
        <>
          {/* INSIGHT */}

          {quando.diaSemana !== null && quando.hora !== null && (
            <div className="overview__insight">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p>
                <Trans
                  i18nKey="account.overview.insight"
                  values={{
                    day: nomeDoDia(quando.diaSemana, locale),
                    hour: `${String(quando.hora).padStart(2, "0")}:00`,
                  }}
                  components={{ b: <strong /> }}
                />
              </p>
            </div>
          )}

          {/* CARDS */}

          <div className="overview__grid">
            <section className="overview__card" style={{ "--i": 0 }}>
              <h2>{t("account.overview.donut.title")}</h2>
              <p className="overview__card-subtitle">
                {t("account.overview.donut.subtitle")}
              </p>

              <DonutChart
                perdidos={perdidos}
                encontrados={encontrados}
                labels={{
                  total: t("account.overview.donut.total"),
                  lost: t("account.overview.donut.lost"),
                  found: t("account.overview.donut.found"),
                }}
              />
            </section>

            <section className="overview__card" style={{ "--i": 1 }}>
              <h2>{t("account.overview.city.title")}</h2>

              {minhaCidade ? (
                <>
                  <p className="overview__card-subtitle">
                    {t("account.overview.city.subtitle", { city: minhaCidade })}
                  </p>

                  {totalCidade === 0 ? (
                    <p className="city__text">
                      {t("account.overview.city.none", { city: minhaCidade })}
                    </p>
                  ) : (
                    <div className="city">
                      <strong className="city__total">{totalCidade}</strong>

                      <div
                        className="city__split"
                        role="img"
                        aria-label={`${cidade.perdidos} / ${cidade.encontrados}`}
                      >
                        <span
                          className="city__split-lost"
                          style={{ flex: cidade.perdidos }}
                        />
                        <span
                          className="city__split-found"
                          style={{ flex: cidade.encontrados }}
                        />
                      </div>

                      <div className="city__legend">
                        <span>
                          <i className="donut__dot donut__dot--lost" />
                          {t("account.overview.donut.lost")} {cidade.perdidos}
                        </span>
                        <span>
                          <i className="donut__dot donut__dot--found" />
                          {t("account.overview.donut.found")}{" "}
                          {cidade.encontrados}
                        </span>
                      </div>

                      <p className="city__text">
                        {t("account.overview.city.share", {
                          percent: participacao,
                        })}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="city__empty">
                  <p className="overview__card-subtitle">
                    {t("account.overview.city.noCity")}
                  </p>

                  <button
                    type="button"
                    className="overview__btn"
                    onClick={() => setPageActive(1)}
                  >
                    {t("account.overview.city.cta")}
                  </button>
                </div>
              )}
            </section>

            <section className="overview__card" style={{ "--i": 2 }}>
              <h2>{t("account.overview.categories.title")}</h2>
              <p className="overview__card-subtitle">
                {t("account.overview.categories.subtitle")}
              </p>

              <BarList itens={categorias} />
            </section>
          </div>

          <p className="overview__footnote">
            {t("account.overview.footnote", { count: amostra.length })}
          </p>
        </>
      )}
    </div>
  );
}

export default UserOverview;
