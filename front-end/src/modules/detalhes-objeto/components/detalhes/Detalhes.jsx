import { useTranslation } from "react-i18next";

import { hoje, ontem } from "../../../../utils/date/date.js";

import {
  formatarLocalizacao,
  obterNomeCompletoEstado,
} from "../../../../utils/location/localizacao.js";

import "./detalhes.css";

import Status from "../../../../components/status/Status.jsx";

import pinGray from "../../../../assets/icons/buscarObjetos/pin-gray.svg";
import calendarGray from "../../../../assets/icons/buscarObjetos/calendar-gray.svg";
import gridGray from "../../../../assets/icons/buscarObjetos/grid-gray.svg";
import circuloBlue from "../../../../assets/icons/detalhesObjeto/circulo-blue.png";

// "titulo" guarda a chave de tradução; o texto é traduzido na renderização.
const iconesInformacoes = [
  {
    icone: gridGray,
    titulo: "details.categories",
  },
  {
    icone: pinGray,
    titulo: "details.location",
  },
  {
    icone: calendarGray,
    titulo: "details.date",
  },
];

// Cabeçalho separado para permitir reposicionamento responsivo.
export function DetalhesCabecalho({ objeto }) {
  const { t } = useTranslation();

  const nome = objeto?.nome || t("common.unnamedItem");

  return (
    <div className="cabecalho__detalhes">
      <h1 className="detalhes__titulo">{nome}</h1>

      <p className="detalhes__descricao responsive">{t("details.subtitle")}</p>

      <div className="status__detalhes">
        <Status objeto={objeto} />
      </div>
    </div>
  );
}

function Detalhes({ objeto }) {
  const { t } = useTranslation();

  const objetoEncontrado = objeto ?? {};

  const localizacao = objetoEncontrado.localizacao ?? {};
  const dataObjeto = objetoEncontrado.data ?? {};

  const descricao =
    objetoEncontrado.descricao || t("details.descriptionUnavailable");

  const descricaoCompleta = objetoEncontrado.descricaoCompleta?.trim() || "";

  const cidade = localizacao.cidade || t("common.notInformedM");
  const endereco = localizacao.endereco || "";

  const estado =
    obterNomeCompletoEstado(localizacao.estado) || t("common.notInformedM");

  const localizacaoFormatada =
    formatarLocalizacao(localizacao) || t("common.noLocation");

  // Formata a data de publicação do objeto.
  function dataFormatada(data) {
    if (!data) return t("common.noDate");

    if (data === hoje()) return t("common.today");
    if (data === ontem()) return t("common.yesterday");

    return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
  }

  // Informações resumidas exibidas acima dos detalhes completos.
  const descricaoInfo = [
    objetoEncontrado.categoria || t("common.notInformedF"),
    localizacaoFormatada,
    dataFormatada(dataObjeto.data),
  ];

  // Informações complementares do objeto.
  const informacoesAdicionais = [
    t("details.categoryLabel", {
      value: objetoEncontrado.categoria || t("common.notInformedF"),
    }),
    ...(endereco ? [t("details.addressLabel", { value: endereco })] : []),
    t("details.cityLabel", { value: cidade }),
    t("details.stateLabel", { value: estado }),
    t("details.dateLabel", { value: dataFormatada(dataObjeto.data) }),
    t("details.timeLabel", {
      value: dataObjeto.hora || t("common.notInformedM"),
    }),
  ];

  return (
    <div className="detalhes">
      {/* Categoria, localização e data */}
      <div className="detalhes__infos">
        {iconesInformacoes.map((informacao, index) => (
          <div key={informacao.titulo} className="infos__icons">
            <img className="icons" src={informacao.icone} alt="" />

            <div>
              <span className="infos__categoria">{t(informacao.titulo)}</span>

              {/* Texto completo */}
              <p className="infos__text">
                {descricaoInfo[index].length >= 32
                  ? `${descricaoInfo[index].slice(0, 32)}...`
                  : descricaoInfo[index]}
              </p>

              {/* Texto resumido para telas menores */}
              <p className="responsive infos__text">
                {descricaoInfo[index].length > 17
                  ? `${descricaoInfo[index].slice(0, 17)}...`
                  : descricaoInfo[index]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Card de detalhes */}
      <div className="card__infos">
        <h2 className="detalhes__objeto__title">{t("details.title")}</h2>

        {/* Descrição */}
        <div className="detalhes__secao">
          <p className="detalhes__objeto__subtitle">
            {t("details.fullDescription")}
          </p>

          <p className="detalhes__descricao__completa">{descricao}</p>
        </div>

        <hr />

        {/* Informações adicionais */}
        <div className="detalhes__secao">
          <p className="detalhes__objeto__subtitle">
            {t("details.information")}
          </p>

          <div className="detalhes__lista">
            {informacoesAdicionais.map((informacao) => (
              <div key={informacao} className="informacoes__adicionais">
                <img className="circulo__blue" src={circuloBlue} alt="" />

                <p className="detalhes__descricao__adicional">{informacao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Observações opcionais */}
        {descricaoCompleta && (
          <>
            <hr />

            <div className="detalhes__secao">
              <p className="detalhes__objeto__subtitle">{t("details.notes")}</p>

              <p className="detalhes__descricao__completa">
                {descricaoCompleta}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Detalhes;
