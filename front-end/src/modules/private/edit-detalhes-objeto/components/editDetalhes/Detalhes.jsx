import { hoje, ontem } from "../../../../../utils/date/date.js";

import "./detalhes.css";

import Status from "../../../../../components/status/Status.jsx";

import pinGray from "../../../../../assets/icons/buscarObjetos/pin-gray.svg";
import calendarGray from "../../../../../assets/icons/buscarObjetos/calendar-gray.svg";
import gridGray from "../../../../../assets/icons/buscarObjetos/grid-gray.svg";
import circuloBlue from "../../../../../assets/icons/detalhesObjeto/circulo-blue.png";

const icons = [gridGray, pinGray, calendarGray];
const infos = ["Categorias", "Localização", "Data"];

function Detalhes({ objeto, edit }) {
  // Recebe diretamente o objeto retornado pela API.
  const objetoEncontrado = objeto;

  const localizacao = objetoEncontrado.localizacao ?? {};
  const dataObjeto = objetoEncontrado.data ?? {};

  const cidadeEstado = [localizacao.estado, localizacao.cidade]
    .filter(Boolean)
    .join(" - ");

  const localizacaoFormatada =
    [cidadeEstado, localizacao.endereco].filter(Boolean).join(", ") ||
    "Localização não informada";

  function dataFormatada(data, hora) {
    if (!data) return "Data não informada";

    if (data === hoje()) return `Hoje, ${hora ?? ""}`;
    if (data === ontem()) return `Ontem, ${hora ?? ""}`;

    return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}, ${hora ?? ""}`;
  }

  const descricao = objetoEncontrado.descricao ?? "";

  const descricaoInfo = [
    objetoEncontrado.categoria ?? "Não informada",
    localizacaoFormatada,
    dataFormatada(dataObjeto.data, dataObjeto.hora),
  ];

  const informacoesAdicionais = [
    {
      titulo: "Categoria",
      valor: objetoEncontrado.categoria ?? "Não informada",
    },
    {
      titulo: "Localização",
      valor: localizacao.endereco ?? "Não informada",
    },
    {
      titulo: "Cidade",
      valor: localizacao.cidade ?? "Não informada",
    },
    {
      titulo: "Estado",
      valor: localizacao.estado ?? "Não informado",
    },
    {
      titulo: "Data",
      valor: dataObjeto.data ?? "Não informada",
    },
    {
      titulo: "Horário",
      valor: dataObjeto.hora ?? "Não informado",
    },
  ];

  return (
    <div className="detalhes">
      <div>
        <div className="status__detalhes">
          <Status objeto={objetoEncontrado} />
        </div>

        {edit ? (
          <input
            type="text"
            defaultValue={objetoEncontrado.nome ?? ""}
            className="detalhes__titulo__input"
          />
        ) : (
          <h1 className="detalhes__titulo">
            {objetoEncontrado.nome ?? "Objeto sem nome"}
          </h1>
        )}

        <p className="detalhes__descricao">
          {descricao.slice(0, 70)}
          {descricao.length > 70 ? "..." : ""}
        </p>

        <p className="detalhes__descricao responsive">
          Informações para identificação do objeto.
        </p>

        <div className="detalhes__infos">
          {icons.map((valor, index) => (
            <div key={valor} className="infos__icons">
              <img className="icons" src={valor} />

              <div>
                <span className="infos__categoria">{infos[index]}</span>

                <p className="infos__text">{descricaoInfo[index]}</p>

                <p className="responsive infos__text">
                  {descricaoInfo[index].slice(0, 17)}
                  {descricaoInfo[index].length > 17 ? "..." : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card__infos">
        <h2 className="detalhes__objeto__title">Detalhes do objeto</h2>

        <div>
          <p className="detalhes__objeto__subtitle">Descrição Completa</p>

          {edit ? (
            <textarea
              defaultValue={descricao}
              className="detalhes__descricao__input"
            />
          ) : (
            <p className="detalhes__descricao__completa">
              {descricao || "Nenhuma descrição informada."}
            </p>
          )}
        </div>

        <hr />

        <div>
          <p className="detalhes__objeto__subtitle">Informações</p>

          {informacoesAdicionais.map((valor) => (
            <div key={valor.titulo} className="informacoes__adicionais">
              <img className="circulo__blue" src={circuloBlue} />

              <p className="detalhes__descricao__adicional">{valor.titulo}:</p>

              {edit ? (
                valor.titulo === "Data" || valor.titulo === "Horário" ? (
                  <p className="detalhes__descricao__adicional">
                    {valor.valor}
                  </p>
                ) : (
                  <input
                    type="text"
                    defaultValue={valor.valor}
                    className="detalhes__principal__input"
                  />
                )
              ) : (
                <p className="detalhes__descricao__adicional">{valor.valor}</p>
              )}
            </div>
          ))}
        </div>

        <hr />

        <div>
          <p className="detalhes__objeto__subtitle">
            Complemento de localização
          </p>

          {edit ? (
            <textarea
              defaultValue={localizacao.complemento ?? ""}
              className="detalhes__complemento__input"
            />
          ) : (
            <p className="detalhes__descricao__complemento">
              {localizacao.complemento || "Nenhum complemento informado."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detalhes;
