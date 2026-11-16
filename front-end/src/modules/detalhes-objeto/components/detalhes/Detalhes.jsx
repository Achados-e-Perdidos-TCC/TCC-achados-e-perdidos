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

const iconesInformacoes = [
  {
    icone: gridGray,
    titulo: "Categorias",
  },
  {
    icone: pinGray,
    titulo: "Localização",
  },
  {
    icone: calendarGray,
    titulo: "Data",
  },
];

// Cabeçalho separado para permitir reposicionamento responsivo.
export function DetalhesCabecalho({ objeto }) {
  const nome = objeto?.nome || "Objeto sem nome";

  return (
    <div className="cabecalho__detalhes">
      <h1 className="detalhes__titulo">{nome}</h1>

      <p className="detalhes__descricao responsive">
        Informações para identificação do objeto.
      </p>

      <div className="status__detalhes">
        <Status objeto={objeto} />
      </div>
    </div>
  );
}

function Detalhes({ objeto }) {
  const objetoEncontrado = objeto ?? {};

  const localizacao = objetoEncontrado.localizacao ?? {};
  const dataObjeto = objetoEncontrado.data ?? {};

  const descricao = objetoEncontrado.descricao || "Descrição indisponível";

  const descricaoCompleta = objetoEncontrado.descricaoCompleta?.trim() || "";

  const cidade = localizacao.cidade || "Não informado";
  const endereco = localizacao.endereco || "";

  const estado = obterNomeCompletoEstado(localizacao.estado) || "Não informado";

  const localizacaoFormatada =
    formatarLocalizacao(localizacao) || "Localização não informada";

  // Formata a data de publicação do objeto.
  function dataFormatada(data) {
    if (!data) return "Data não informada";

    if (data === hoje()) return "Hoje";
    if (data === ontem()) return "Ontem";

    return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
  }

  // Informações resumidas exibidas acima dos detalhes completos.
  const descricaoInfo = [
    objetoEncontrado.categoria || "Não informada",
    localizacaoFormatada,
    dataFormatada(dataObjeto.data),
  ];

  // Informações complementares do objeto.
  const informacoesAdicionais = [
    `Categoria: ${objetoEncontrado.categoria || "Não informada"}`,
    ...(endereco ? [`Endereço: ${endereco}`] : []),
    `Cidade: ${cidade}`,
    `Estado: ${estado}`,
    `Data: ${dataFormatada(dataObjeto.data)}`,
    `Horário: ${dataObjeto.hora || "Não informado"}`,
  ];

  return (
    <div className="detalhes">
      {/* Categoria, localização e data */}
      <div className="detalhes__infos">
        {iconesInformacoes.map((informacao, index) => (
          <div key={informacao.titulo} className="infos__icons">
            <img className="icons" src={informacao.icone} alt="" />

            <div>
              <span className="infos__categoria">{informacao.titulo}</span>

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
        <h2 className="detalhes__objeto__title">Detalhes do objeto</h2>

        {/* Descrição */}
        <div className="detalhes__secao">
          <p className="detalhes__objeto__subtitle">Descrição Completa</p>

          <p className="detalhes__descricao__completa">{descricao}</p>
        </div>

        <hr />

        {/* Informações adicionais */}
        <div className="detalhes__secao">
          <p className="detalhes__objeto__subtitle">Informações</p>

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
              <p className="detalhes__objeto__subtitle">Observações</p>

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
