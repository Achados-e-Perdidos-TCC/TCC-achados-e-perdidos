import { useFilter } from '../../../../hooks/filters/filterHook.jsx'; 
import { useEffect, useRef} from 'react'; 
import { NavLink } from 'react-router';

import { hoje, ontem } from '../../../../utils/date/date.js'; 
import filtros from '../../../../utils/filters/filtrarObjetos.js'; 

import NoImage from './components/noImage/NoImage.jsx'; 

import './principalCards.css';
import Status from '../../../../components/status/Status.jsx'; 
import NotObjects from '../../../../pages/errors/notObjects/NotObjects.jsx';

import pinGray from '../../../../assets/icons/buscarObjetos/pin-gray.svg';
import calendarGray from '../../../../assets/icons/buscarObjetos/calendar-gray.svg';
import arrowBlue from '../../../../assets/icons/buscarObjetos/arrow-blue.svg';

// falta adicionar logica de filtrar por periodo

// Vai receber de buscarObjetos.jsx depois
// import objetos from './objetos.json'; 

function PrincipalCards({ objetos, inicio, fim, resultadosExibidos, resultadoTotalEncontrados }) {

    const { state } = useFilter();
    const { primaryFilters, secondaryFilters } = state;
    const objetosFiltrados = objetos.filter((valor) => { return filtros(valor, primaryFilters, secondaryFilters) });

    let cardsExibidos = 0;
    const totalEncontrados = objetosFiltrados.length; 

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

    function dataFormatada(data, hora){
        if (data === hoje()) { return `Hoje, ${hora}`}
        if (data === ontem()) { return `Ontem, ${hora}`}

        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}, ${hora}`; 
    }

    return (
        <div>
            { objetosFiltrados.length === 0 ? <NotObjects /> : objetosFiltrados.slice(inicio, fim).map((valor) => {
                cardsExibidos++

                const nome = valor.nome || 'Objeto sem nome'; //obrigatorio
                const descricao = valor.descricao || 'Sem descrição disponível'; //obrigatorio

                const cidade = valor.localizacao.cidade || ''; //obrigatorio
                const endereco = valor.localizacao.endereco || ''; //obrigatorio
                const estado = valor.localizacao.estado || ''; //obrigatorio

                const data = valor.data.data.trim() ; 
                const hora = valor.data.hora.trim();

                return (
                    <div className='card__principal' key={valor.id}>
                        { valor.imagemPrincipal === null ? <NoImage /> : <img className='principal__cards__image__card ' src={valor.imagemPrincipal} />}

                        <div className='principal__meio'>

                            <div className='principal__encima'>

                                <h1 className='titulo__principal'>{ nome.length < 35 ? nome : `${nome.slice(0, 35)}...` }</h1>
                                <h1 className='titulo__responsive'>{ nome.length < 25 ? nome : `${nome.slice(0, 25)}...`}</h1>

                                <div className='categoria__status'>
                                    <Status objeto={valor}/>

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
                                        {!cidade || !endereco || !estado ? <p className='endereco__principal'>Endereço não informado</p> : 
                                        <p className='endereco__principal'>{estado.length + cidade.length + endereco.length < 50 ? `${estado} - ${cidade}, ${endereco}` : `${estado} - ${cidade}, ${endereco}`.slice(0, 50) + `...`}</p>}

                                        {!cidade || !endereco || !estado ? <p className='endereco__responsive'>Endereço não informado</p> : 
                                        <span className='endereco__responsive'>{estado.length + cidade.length + endereco.length < 27 ? `${estado} - ${cidade}, ${endereco}` : `${estado} - ${cidade}, ${endereco}`.slice(0, 27) + `...`}</span>}
                                        
                                    </div>

                                    <p className='divisoria'>|</p>

                                    <div className='hora__principal'>
                                        <img src={calendarGray} />
                                        <span>{dataFormatada(data.trim(), hora.trim())}</span>
                                    </div>
                                    
                                </div>

                                <p className='descricao__principal'>{descricao.length < 102 ? descricao : `${descricao.slice(0, 102)}...`}</p>

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