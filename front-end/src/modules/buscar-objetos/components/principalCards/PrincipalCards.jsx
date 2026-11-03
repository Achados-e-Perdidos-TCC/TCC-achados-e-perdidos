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
import { formatarLocalizacao } from '../../../../utils/location/localizacao.js';
import { resolverUrlImagem } from '../../../../utils/images/urlImagem.js';

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

                const textoLocalizacao = formatarLocalizacao(valor.localizacao);

                const data = valor.data.data.trim() ; 
                const hora = valor.data.hora.trim();

                return (
                    <div className='card__principal' key={valor.id}>
                        { !valor.imagemPrincipal ? <NoImage /> : <img className='principal__cards__image__card ' src={resolverUrlImagem(valor.imagemPrincipal)} alt={nome} />}

                        <div className='principal__meio'>

                           <div className='principal__meio'>

    {/* Parte superior: título, status e categoria */}
    <div className='principal__encima'>

        <h1 className='titulo__principal'>
            {nome.length < 35 ? nome : `${nome.slice(0, 35)}...`}
        </h1>

        <h1 className='titulo__responsive'>
            {nome.length < 25 ? nome : `${nome.slice(0, 25)}...`}
        </h1>

        <div className='categoria__status'>
            <Status objeto={valor}/>

            <div className='categoria__principal'>
                <img
                    className='icon__categoria'
                    src={valor.icon_url}
                    alt=""
                />
                <span>{valor.categoria}</span>
            </div>
        </div>

        {/* Localização e data abaixo do status */}
        <div className='data__hora'>

            <div className='data__principal'>
                <img src={pinGray} alt="" />

                {!textoLocalizacao ? (
                    <p className='endereco__principal'>
                        Localização não informada
                    </p>
                ) : (
                    <p className='endereco__principal'>
                        {textoLocalizacao.length < 50
                            ? textoLocalizacao
                            : `${textoLocalizacao.slice(0, 50)}...`}
                    </p>
                )}

                <span className='endereco__responsive'>
                    {!textoLocalizacao
                        ? 'Localização não informada'
                        : textoLocalizacao.length < 27
                            ? textoLocalizacao
                            : `${textoLocalizacao.slice(0, 27)}...`}
                </span>
            </div>

            <div className='hora__principal'>
                <img src={calendarGray} alt="" />
                <span>{dataFormatada(data, hora)}</span>
            </div>

        </div>
    </div>

    {/* Parte central: descrição */}
    <div className='principal__embaixo'>

        <div className='busca__descricao'>
            <span className='busca__descricao__titulo'>
                Descrição
            </span>

            <p className='descricao__principal'>
                {descricao.length < 102
                    ? descricao
                    : `${descricao.slice(0, 102)}...`}
            </p>
        </div>

        {/* Botão responsivo */}
        <div className='button__responsive'>
            <NavLink
                className='detalhes__principal'
                to={`/buscar-objetos/${valor.id}`}
            >
                Ver detalhes
            </NavLink>

            <img
                className='arrow__button__principal'
                src={arrowBlue}
                alt=""
            />
        </div>

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