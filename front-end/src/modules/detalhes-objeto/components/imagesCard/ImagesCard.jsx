import { useState } from 'react';

import './imagesCard.css';

import arrowButton from '../../../../assets/icons/detalhesObjeto/arrow-gray.svg';
import imageOpcional from '../../../../assets/icons/noImage/no-picture.svg';
import { resolverUrlImagem } from '../../../../utils/images/urlImagem.js';

function ImagesCards({ objeto }) {
    const imagemPrincipal = resolverUrlImagem(objeto.imagemPrincipal);
    const imagensRecebidas = Array.isArray(objeto.imagensSecundarias)
        ? objeto.imagensSecundarias
        : [];

    const imagensSecundarias = [...new Set(
        [objeto.imagemPrincipal, ...imagensRecebidas]
            .filter(Boolean)
            .map(resolverUrlImagem)
    )];

    const [imagemExibida, setImagemExibida] = useState(imagemPrincipal || imageOpcional);
    const [inicio, setInicio] = useState(0);
    const [fim, setFim] = useState(4);

    function alternarImagem(imagemClicada) {
        setImagemExibida(imagemClicada);
    }

    function setarInicio() {
        setInicio((valorInicial) => Math.max(0, valorInicial - 1));
        setFim((valorFinal) => Math.max(4, valorFinal - 1));
    }

    function setarFim() {
        setFim((valorFinal) => Math.min(imagensSecundarias.length, valorFinal + 1));
        setInicio((valorInicial) =>
            fim >= imagensSecundarias.length ? valorInicial : valorInicial + 1
        );
    }

    return (
        <div>
            <div className='container__images'>
                <img
                    className={!imagemPrincipal ? 'image__opcional' : 'imagem__principal'}
                    src={imagemExibida}
                    alt={objeto.nome || 'Imagem do objeto'}
                />

                <div className={imagensSecundarias.length <= 4 ? 'imagens__secundarias__limitadas' : 'imagens__secundarias__ilimitadas'}>
                    <div className={imagensSecundarias.length <= 4 || inicio <= 0 ? 'button__desativo' : 'button__ativo'}>
                        <div className='arrow__button' onClick={setarInicio}>
                            <img className='arrow__button__icon voltar' src={arrowButton} alt="Imagens anteriores" />
                        </div>
                    </div>

                    {imagensSecundarias.slice(inicio, fim).map((imagem) => (
                        <div key={imagem} onClick={() => alternarImagem(imagem)}>
                            <img
                                className={imagemExibida === imagem ? 'imagem__secundaria card__ativo' : 'imagem__secundaria'}
                                src={imagem}
                                alt="Foto adicional do objeto"
                            />
                        </div>
                    ))}

                    <div className={imagensSecundarias.length <= 4 ? 'button__desativo' : 'button__ativo'}>
                        <div className='arrow__button' onClick={setarFim}>
                            <img className='arrow__button__icon' src={arrowButton} alt="Próximas imagens" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImagesCards;
