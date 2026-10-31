import { useState } from "react";

import "./imagesCard.css";

import arrowButton from "../../../../../assets/icons/detalhesObjeto/arrow-gray.svg";

function ImagesCards({ objeto, edit }) {
  // Agora recebemos um objeto diretamente, não um array.
  const imagensDisponiveis = [
    objeto?.imagemPrincipal,
    ...(objeto?.imagensSecundarias ?? []),
  ].filter(Boolean);

  const [imagemExibida, setImagemExibida] = useState(
    imagensDisponiveis[0] ?? "",
  );

  const [inicio, setInicio] = useState(0);
  const [fim, setFim] = useState(4);

  function alternarImagem(imagemClicada) {
    setImagemExibida(imagemClicada);
  }

  function setarInicio() {
    setInicio((valor) => Math.max(0, valor - 1));
    setFim((valor) => Math.max(4, valor - 1));
  }

  function setarFim() {
    setFim((valor) => Math.min(imagensDisponiveis.length, valor + 1));

    setInicio((valor) =>
      fim >= imagensDisponiveis.length ? valor : valor + 1,
    );
  }

  return (
    <div>
      <div className="container__images">
        {imagemExibida ? (
          <img
            className="imagem__principal"
            src={imagemExibida}
            alt={objeto?.nome ?? "Imagem do objeto"}
          />
        ) : (
          <div className="imagem__principal">Imagem não disponível</div>
        )}

        <div
          className={
            imagensDisponiveis.length <= 4
              ? "imagens__secundarias__limitadas"
              : "imagens__secundarias__ilimitadas"
          }
        >
          <div
            className={
              imagensDisponiveis.length <= 4 || inicio <= 0
                ? "button__desativo"
                : "button__ativo"
            }
          >
            <div className="arrow__button" onClick={setarInicio}>
              <img
                className="arrow__button__icon voltar"
                src={arrowButton}
                alt="Imagens anteriores"
              />
            </div>
          </div>

          {imagensDisponiveis.slice(inicio, fim).map((imagem, index) => (
            <div
              key={`${imagem}-${index}`}
              onClick={() => alternarImagem(imagem)}
            >
              <img
                className={
                  imagemExibida === imagem
                    ? "imagem__secundaria card__ativo"
                    : "imagem__secundaria"
                }
                src={imagem}
                alt={`Imagem ${index + 1} do objeto`}
              />
            </div>
          ))}

          <div
            className={
              imagensDisponiveis.length <= 4
                ? "button__desativo"
                : "button__ativo"
            }
          >
            <div className="arrow__button" onClick={setarFim}>
              <img
                className="arrow__button__icon"
                src={arrowButton}
                alt="Próximas imagens"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImagesCards;
