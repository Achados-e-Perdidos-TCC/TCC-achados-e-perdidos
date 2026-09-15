import { useState } from 'react';
import './buscarObjetos.css';

import FilterProvider from '../../../contexts/buscarObjetosContexts/filterContext.jsx';

import sumaryIcon from '../../../assets/icons/buscarObjetos/sumary.svg';
import arrowGray from '../../../assets/icons/buscarObjetos/arrow-gray.png'

import PrimaryFilters from '../components/primaryFilters/PrimaryFilters.jsx';
import SecondaryFilters from '../components/secondaryFilters/SecondaryFilters.jsx';
import PrincipalCards from '../components/principalCards/PrincipalCards.jsx';


function BuscarObjetos() {

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [exibidos, setExibidos] = useState(0)

    const total = 80 // Aqui vai o total de obj encontrados
    const totalPorPagina = 6;
    const totalDePaginas = [];
    const totalDePaginasNumerico = Math.ceil(total / totalPorPagina)

    for (let i = 1; i < totalDePaginasNumerico + 1; i++) {
        totalDePaginas.push(i)
    }

    let inicio = totalPorPagina * (paginaAtual - 1);
    let fim = inicio + totalPorPagina;

    function alternarPagina(pagina) { setPaginaAtual(pagina) }

    function resultadosExibidos(cards) { setExibidos(cards) }

    return (
        <FilterProvider >
            <section className="buscar__objetos">

                <div className="head">

                    <div className="left">
                        <h1 className="title__buscar">Buscar objetos</h1>
                        <p className="subtitle subtitle__description">Encontre objetos perdidos ou verifique se alguém encontrou oque você procura.</p>
                    </div>

                    <div className="right">
                        <div>
                            <h2 className="head__encontrados"> {total} </h2>
                            <p className="subtitle">objetos encontrados</p>
                        </div>

                        <img className="sumary__icon" src={sumaryIcon} />
                    </div>

                </div>

                <div className='container__card'>
                    {<PrimaryFilters key='' />}
                </div>

                <div className='container__card'>
                    <SecondaryFilters key='' />
                </div>

                <div className='principal container__card'>
                    <div className='container__principal'>

                        <div className='principal__cabecalho'>
                            <span className='text__principal'> {total} objetos encontrados </span>
                            <p className="subtitle">Resultados relacionados à sua busca</p>
                        </div>

                        <div className='principal__cards'>
                            <PrincipalCards key='' inicio={inicio} fim={fim} resultadosExibidos={resultadosExibidos} />
                        </div>

                        <div className='principal__footer'>
                            <span>mostrando {exibidos} de {total} resultados</span>

                            <div className="paginas__principal">

                                <div onClick={() => paginaAtual < 1 ? setPaginaAtual(1) : setPaginaAtual(paginaAtual - 1)} className='button button__arrow'>
                                    <img className='arrow__left' src={arrowGray} />
                                </div>

                                <div className='paginas__exibidas'>
                                    {totalDePaginas.slice(Math.floor((paginaAtual - 1) / 10) * 10, Math.floor((paginaAtual - 1) / 10) * 10 + 10).map((valor) => {
                                        return (<p onClick={() => { alternarPagina(valor) }} className={paginaAtual === valor ? 'paginas pagina__ativa' : 'paginas'}> {valor} </p>)
                                    })}
                                    <span>...</span>
                                </div>

                                <div className='paginas__responsivas'>
                                    {totalDePaginas.slice(Math.floor((paginaAtual - 1) / 5) * 5, Math.floor((paginaAtual - 1) / 5) * 5 + 5).map((valor) => {
                                        return (<p onClick={() => { alternarPagina(valor) }} className={paginaAtual === valor ? 'paginas pagina__ativa' : 'paginas'}> {valor} </p>)
                                    })}
                                    <span>...</span>
                                </div>


                                <div onClick={() => paginaAtual > totalDePaginasNumerico ? setPaginaAtual(totalDePaginasNumerico) : setPaginaAtual(paginaAtual + 1)} className='button button__arrow'>
                                    <img className='arrow__right' src={arrowGray} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FilterProvider>
    )
}

export default BuscarObjetos;