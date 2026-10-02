import { useState, useEffect } from 'react'; 
import { NavLink } from 'react-router';

import { hoje, ontem } from '../../../../../utils/date/date.js'; 

import './userObjects.css';
import Status from '../../../../../components/status/Status.jsx'; 

import pinGray from '../../../../../assets/icons/buscarObjetos/pin-gray.svg';
import calendarGray from '../../../../../assets/icons/buscarObjetos/calendar-gray.svg';
import arrowBlue from '../../../../../assets/icons/buscarObjetos/arrow-blue.svg';
import arrowGray from '../../../../../assets/icons/buscarObjetos/arrow-gray.png'

// Vai receber de buscarObjetos.jsx depois
import objetos from './objetos.json'; 

function PrincipalCards() {

    function dataFormatada(data, hora){

        if (!hora) { return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`}

        if (data === hoje()) { return `Hoje, ${hora}`}
        if (data === ontem()) { return `Ontem, ${hora}`}

        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}, ${hora}`; 
    }

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPorPagina, setTotalPorPagina] = useState( window.innerWidth >= 960 && window.innerWidth <= 1032  ? 5 : window.innerWidth <= 768 ? 3 : 8  );

    useEffect(() => {

        function atualizarTotalPorPagina() { setTotalPorPagina( window.innerWidth >= 960 && window.innerWidth <= 1032  ? 5 : window.innerWidth <= 768 ? 3 : 8 ) }

        // Adiciona listener 
        window.addEventListener('resize', atualizarTotalPorPagina);

        // remove listener com callback para ser chamado só depois de desmotado o componente
        return () => { window.removeEventListener('resize', atualizarTotalPorPagina) };

    }, []);
    
    const total = objetos.length
    const totalDePaginas = [];
    const totalDePaginasNumerico = Math.ceil(total / totalPorPagina)
    
    for (let i = 1; i < totalDePaginasNumerico + 1; i++) { totalDePaginas.push(i) }
    
    let inicio = totalPorPagina * (paginaAtual - 1);
    let fim = inicio + totalPorPagina;
    
    function alternarPagina(pagina) { setPaginaAtual(pagina) }
    
    return (
        <div className='user__objects'>
            <div>
                <h1 className='user__objects__text'>Meus objetos</h1>
                <p className='user__objects__subtitle'>Gerencie os objetos que voce perdeu ou encontrou. </p>
            </div>

            <div className='user__objects__principal'>
                <span className='user__objects__text__principal'> {total} objetos encontrados </span>
            </div>

            <div className='user__container__card'>
                {objetos.slice(inicio, fim).map((valor) => {

                    return (
                        <div className='user__card__principal' key={valor.id}>
                            <img className='user__principal__cards__image__card' src={valor.imagemPrincipal} />

                            <div className='user__principal__meio'>

                                <div className='user__principal__encima'>

                                    <h1 className='user__titulo__principal'>{ valor.nome.length < 16 ? valor.nome : `${valor.nome.slice(0, 15)}...` }</h1>
                                    <h1 className='user__titulo__responsive'>{ valor.nome.length < 25 ? valor.nome : `${valor.nome.slice(0, 25)}...`}</h1>

                                    <div className='user__categoria__status'>
                                        <Status objeto={valor}/>
                                    </div>
                                </div>

                                <div className='user__principal__embaixo'>

                                    <div className='user__data__hora'>

                                        <div className='user__data__principal'>
                                            <img src={pinGray} />
                                            <p className='user__endereco__principal'>{valor.localizacao.estado.length + valor.localizacao.cidade.length < 20? `${valor.localizacao.estado} - ${valor.localizacao.cidade}` : `${valor.localizacao.estado} - ${valor.localizacao.cidade}`.slice(0, 20) + `...`}</p>
                                            <span className='user__endereco__responsive'>{valor.localizacao.estado.length + valor.localizacao.cidade.length < 27 ? `${valor.localizacao.estado} - ${valor.localizacao.cidade}` : `${valor.localizacao.estado} - ${valor.localizacao.cidade}`.slice(0, 27) + `...`}</span>
                                        </div>

                                        <div className='user__hora__principal'>
                                            <img src={calendarGray} />
                                            <span>{dataFormatada(valor.data.data.trim())}</span>
                                        </div>
                                        
                                    </div>

                                    <div className='user__button__responsive'>
                                        <NavLink className='user__detalhes__principal' to={`/buscar-objetos/${valor.id}`}>Ver detalhes</NavLink>
                                        <img className='user__arrow__button__principal' src={arrowBlue} alt="" />
                                    </div>

                                    <div className='user__principal__direita'>
                                        <div className='user__button__principal'>
                                            <NavLink className='user__detalhes__principal' to={`/buscar-objetos/${valor.id}`}>Ver detalhes</NavLink>
                                            <img className='user__arrow__button__principal' src={arrowBlue} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )})}
            </div>

                 <div className='user__principal__footer'>

                            <div className="user__paginas__principal">

                                <div onClick={() => paginaAtual <= 1 ? setPaginaAtual(1) : setPaginaAtual(paginaAtual - 1)} className='button user__button__arrow'>
                                    <img className='arrow__left' src={arrowGray} />
                                </div>

                                <div className='paginas__exibidas'>
                                    {totalDePaginas.slice(Math.floor((paginaAtual - 1) / 10) * 10, Math.floor((paginaAtual - 1) / 10) * 10 + 10).map((valor) => {
                                        return (<p key={valor}  onClick={() => { alternarPagina(valor) }} className={paginaAtual === valor ? 'user__paginas user__pagina__ativa' : 'user__paginas'}> {valor} </p>)
                                    })}
                                    <span>{totalDePaginas.length > 10 ? '...' : ''}</span>
                                </div>

                                <div className='user__paginas__responsivas'>
                                    {totalDePaginas.slice(Math.floor((paginaAtual - 1) / 5) * 5, Math.floor((paginaAtual - 1) / 5) * 5 + 5).map((valor) => {
                                        return (<p key={valor} onClick={() => { alternarPagina(valor) }} className={paginaAtual === valor ? 'user__paginas user__pagina__ativa' : 'user__paginas'}> {valor} </p>)
                                    })}
                                    <span>{totalDePaginas.length > 5 ? '...' : ''}</span>
                                </div>


                                <div onClick={() => paginaAtual >= totalDePaginasNumerico ? setPaginaAtual(totalDePaginasNumerico) : setPaginaAtual(paginaAtual + 1)} className='button user__button__arrow'>
                                    <img className='arrow__right' src={arrowGray} />
                                </div>
                            </div>
                        </div>
        </div>
    )
}

export default PrincipalCards;