import { useFilter } from '../../../../hooks/filters/filterHook.jsx'; 
import { useEffect, useRef} from 'react'; 
import { NavLink } from 'react-router';

import { hoje, ontem } from '../../../../utils/date/date.js'; 
import filtros from '../../../../utils/filters/filtrarObjetos.js'; 

import './principalCards.css';

import pinGray from '../../../../assets/icons/buscarObjetos/pin-gray.svg';
import calendarGray from '../../../../assets/icons/buscarObjetos/calendar-gray.svg';
import warningRed from '../../../../assets/icons/buscarObjetos/warning-red.svg';
import checkGreen from '../../../../assets/icons/buscarObjetos/check-green.svg';
import hourglassOrange from '../../../../assets/icons/buscarObjetos/hourglass-orange.svg';
import arrowBlue from '../../../../assets/icons/buscarObjetos/arrow-blue.svg';

// falta adicionar logica de filtrar por periodo

// Vai receber de buscarObjetos.jsx depois
import objetos from './objetos.json'; 

function PrincipalCards({/* objetos */ inicio, fim, resultadosExibidos, resultadoTotalEncontrados }) {

    const { state } = useFilter();
    const { primaryFilters, secondaryFilters } = state;

    let cardsExibidos = 0;
    const totalEncontrados = objetos.filter((valor) => { return filtros(valor, primaryFilters, secondaryFilters) }).length; 

    // useRef = cria algo parecido com: { current: x } e guarda essa referencia, é usado tbm p/Acessar um elemento HTML diretamente
    // funciona de forma semelhante ao useState, mas a diferença é que uma mudança no useState causa uma nova renderização,
    // enquanto uma mudança no useRef não causa uma nova renderização.
    const ultimosCards = useRef(0);
    const ultimoTotal = useRef(0);

    useEffect(() => {   
        // Se a ultima referencia/valor do useRef for igual aos valores de cardsExibidos e totalEncontrados ele não atualiza, se for diferente, ele atualiza 
        if ( ultimosCards.current !== cardsExibidos || ultimoTotal.current !== totalEncontrados) {

            ultimosCards.current = cardsExibidos;
            ultimoTotal.current = totalEncontrados;

            resultadosExibidos(cardsExibidos);
            resultadoTotalEncontrados(totalEncontrados);
        }
    });

    function verificaIconStatus(status) {
        if (status === 'PERDIDO') { return warningRed }
        if (status === 'ENCONTRADO') { return checkGreen }
        if (status === 'ANALISE') { return hourglassOrange }
    }

    function adicionaClassNameStatus(status) {
        if (status === 'PERDIDO') { return 'status__red' }
        if (status === 'ENCONTRADO') { return 'status__green' }
        if (status === 'ANALISE') { return 'status__orange' }
    }

    function dataFormatada(data, hora){
        if (data === hoje()) { return `Hoje, ${hora}`}
        if (data === ontem()) { return `Ontem, ${hora}`}

        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}, ${hora}`; 
    }

    return (
        <div>
            {objetos.filter((valor) => { return filtros(valor, primaryFilters, secondaryFilters)}).slice(inicio, fim).map((valor) => {
                cardsExibidos++

                return (
                    <div className='card__principal' key={valor.id}>
                        <img className='image__card ' src={valor.imagemPrincipal} />

                        <div className='principal__meio'>

                            <div className='principal__encima'>

                                <h1 className='titulo__principal'>{ valor.nome.length < 35 ? valor.nome : `${valor.nome.slice(0, 35)}...` }</h1>
                                <h1 className='titulo__responsive'>{ valor.nome.length < 25 ? valor.nome : `${valor.nome.slice(0, 25)}...`}</h1>

                                <div className='categoria__status'>
                                    <div className='status__principal'>
                                        <div className={adicionaClassNameStatus(valor.status.trim().toUpperCase())} >

                                            <img className="image__principal" src={verificaIconStatus(valor.status.trim().toUpperCase())} />
                                            <span>{valor.status.trim().toUpperCase()}</span>

                                        </div>
                                    </div>

                                    <div className='categoria__principal'>
                                        <img className='icon__categoria' src={valor.icon_url} />
                                        <span>{valor.categoria}</span>
                                    </div>
                                </div>

                            </div>

                            <div className='principal__embaixo'>

                                <div className='data__hora'>

                                    <div className='data__principal'>
                                        <img src={pinGray} />
                                        <p className='endereco__principal'>{valor.localizacao.estado.length + valor.localizacao.cidade.length + valor.localizacao.endereco.length < 50 ? `${valor.localizacao.estado} - ${valor.localizacao.cidade}, ${valor.localizacao.endereco}` : `${valor.localizacao.estado} - ${valor.localizacao.cidade}, ${valor.localizacao.endereco}`.slice(0, 50) + `...`}</p>
                                        <span className='endereco__responsive'>{valor.localizacao.estado.length + valor.localizacao.cidade.length + valor.localizacao.endereco.length < 32 ? `${valor.localizacao.estado} - ${valor.localizacao.cidade}, ${valor.localizacao.endereco}` : `${valor.localizacao.estado} - ${valor.localizacao.cidade}, ${valor.localizacao.endereco}`.slice(0, 32) + `...`}</span>
                                    </div>

                                    <p className='divisoria'>|</p>

                                    <div className='hora__principal'>
                                        <img src={calendarGray} />
                                        <span>{dataFormatada(valor.data.data.trim(), valor.data.hora.trim())}</span>
                                    </div>
                                    
                                </div>

                                <p className='descricao__principal'>{valor.descricao < 102 ? valor.descricao : `${valor.descricao.slice(0, 102)}...`}</p>

                                <div className='button__responsive'>
                                    <NavLink className='detalhes__principal' to={`/buscar-objetos/${valor.id}`}>Ver detalhes</NavLink>
                                    <img className='arrow__button__principal' src={arrowBlue} alt="" />
                                </div>
                            </div>

                        </div>

                        <div className='principal__direita'>
                            <div className='button__principal'>
                                <NavLink className='detalhes__principal' to={`/buscar-objetos/${valor.id}`}>Ver detalhes</NavLink>
                                <img className='arrow__button__principal' src={arrowBlue} alt="" />
                            </div>
                        </div>
                    </div>

                )})}
        </div>
    )
}

export default PrincipalCards;