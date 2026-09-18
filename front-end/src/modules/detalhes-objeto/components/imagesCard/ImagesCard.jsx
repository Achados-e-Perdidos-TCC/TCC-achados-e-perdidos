import { useState } from 'react';

import './imagesCard.css';

import arrowButton from '../../../../assets/icons/detalhesObjeto/arrow-gray.svg';

function ImagesCards(objeto) {

    // temporario
    const objetoEncontrado = objeto.objeto[0]

    const [imagemExibida, setImagemExibida] = useState(objetoEncontrado.imagemPrincipal);
    const [imagensSecundarias, setImagensSecundarias] = useState(objetoEncontrado.imagensSecundarias);

    function alternarImagem(imagemClicada) {

        setImagensSecundarias((imagensAtuais) => {

            const novasImagens = [...imagensAtuais];
            const posicao = novasImagens.indexOf(imagemClicada);

            novasImagens[posicao] = imagemExibida;

            return novasImagens;
        })

        setImagemExibida(imagemClicada);
    }

    const [inicio, setInicio] = useState(0);
    const [fim, setFim] = useState(4);

    function setarInicio() {
        setInicio((valorInicial) => { return valorInicial <= 0 ? 0 : valorInicial - 1 });
        setFim((valorFinal) => { return valorFinal <= 4 ? 4 : valorFinal - 1 });
    }

    function setarFim() {
        setFim((valorFinal) => { return valorFinal >= imagensSecundarias.length ? imagensSecundarias.length : valorFinal + 1 })
        setInicio((valorInicial) => { return fim >= imagensSecundarias.length ? valorInicial : valorInicial + 1 })
    }

    return (
        <div>
            <div className='container__images'>
                <img className='imagem__principal' src={imagemExibida} />

                <div className={imagensSecundarias.length <= 4 ? 'imagens__secundarias__limitadas' : 'imagens__secundarias__ilimitadas'}>

                    <div className={imagensSecundarias.length <= 4 || inicio <= 0 ? 'button__desativo' : 'button__ativo'}>
                        <div className='arrow__button' onClick={() => { setarInicio() }}>
                            <img className='arrow__button__icon voltar' src={arrowButton} />
                        </div>
                    </div>

                    {imagensSecundarias.slice(inicio, fim).map((imagens) => {
                        return (
                            <div onClick={() => { alternarImagem(imagens) }}>
                                <img className='imagem__secundaria' src={imagens} />
                            </div>
                        )
                    })}

                    <div className={imagensSecundarias.length <= 4 ? 'button__desativo' : 'button__ativo'}>
                        <div className='arrow__button' onClick={() => { setarFim() }}>
                            <img className='arrow__button__icon' src={arrowButton} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImagesCards;