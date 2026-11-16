import { useEffect, useState } from "react";

import "./imagesCard.css";

import arrowButton from "../../../../assets/icons/detalhesObjeto/arrow-gray.svg";
import imageOpcional from "../../../../assets/icons/noImage/no-picture.svg";

import { resolverUrlImagem } from "../../../../utils/images/urlImagem.js";

function ImagesCard({ objeto }) {
  const imagemPrincipal = objeto?.imagemPrincipal
    ? resolverUrlImagem(objeto.imagemPrincipal)
    : "";

  const imagensRecebidas = Array.isArray(objeto?.imagensSecundarias)
    ? objeto.imagensSecundarias
    : [];

  const imagensSecundarias = [
    ...new Set(
      [objeto?.imagemPrincipal, ...imagensRecebidas]
        .filter(Boolean)
        .map(resolverUrlImagem)
        .filter(Boolean),
    ),
  ];

  const [imagemExibida, setImagemExibida] = useState(
    imagemPrincipal || imageOpcional,
  );

  const [inicio, setInicio] = useState(0);

  const quantidadeVisivel = 4;
  const existemMaisImagens = imagensSecundarias.length > quantidadeVisivel;

  // Atualiza a galeria quando outro objeto é carregado.
  useEffect(() => {
    setImagemExibida(imagemPrincipal || imageOpcional);
    setInicio(0);
  }, [imagemPrincipal]);

  // Exibe a imagem selecionada.
  function alternarImagem(imagem) {
    setImagemExibida(imagem);
  }

  // Volta uma posição na galeria.
  function mostrarImagensAnteriores() {
    setInicio((valorAtual) => Math.max(0, valorAtual - 1));
  }

  // Avança uma posição na galeria.
  function mostrarProximasImagens() {
    setInicio((valorAtual) =>
      Math.min(
        Math.max(0, imagensSecundarias.length - quantidadeVisivel),
        valorAtual + 1,
      ),
    );
  }

  const imagensVisiveis = imagensSecundarias.slice(
    inicio,
    inicio + quantidadeVisivel,
  );

  return (
    <div className="images-card">
      <div className="container__images">
        {/* Imagem principal */}
        <img
          className={!imagemPrincipal ? "image__opcional" : "imagem__principal"}
          src={imagemExibida}
          alt={objeto?.nome || "Imagem do objeto"}
        />

        {/* Miniaturas */}
        <div
          className={
            existemMaisImagens
              ? "imagens__secundarias__ilimitadas"
              : "imagens__secundarias__limitadas"
          }
        >
          {/* Imagens anteriores */}
          {existemMaisImagens && (
            <button
              className="arrow__button"
              type="button"
              onClick={mostrarImagensAnteriores}
              disabled={inicio === 0}
              aria-label="Mostrar imagens anteriores"
            >
              <img
                className="arrow__button__icon voltar"
                src={arrowButton}
                alt=""
              />
            </button>
          )}

          {/* Miniaturas disponíveis */}
          {imagensVisiveis.map((imagem, index) => (
            <button
              key={`${imagem}-${index}`}
              className="imagem__secundaria__botao"
              type="button"
              onClick={() => alternarImagem(imagem)}
              aria-label={`Exibir imagem ${inicio + index + 1}`}
              aria-pressed={imagemExibida === imagem}
            >
              <img
                className={
                  imagemExibida === imagem
                    ? "imagem__secundaria card__ativo"
                    : "imagem__secundaria"
                }
                src={imagem}
                alt={`Foto adicional ${inicio + index + 1} do objeto`}
              />
            </button>
          ))}

          {/* Próximas imagens */}
          {existemMaisImagens && (
            <button
              className="arrow__button"
              type="button"
              onClick={mostrarProximasImagens}
              disabled={inicio >= imagensSecundarias.length - quantidadeVisivel}
              aria-label="Mostrar próximas imagens"
            >
              <img className="arrow__button__icon" src={arrowButton} alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImagesCard;
