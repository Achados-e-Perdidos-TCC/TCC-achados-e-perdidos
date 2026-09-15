import { useFilter } from '../../../../hooks/buscarObjetos/filterHook.jsx';
import { NavLink } from 'react-router';

import './principalCards.css';

import pinGray from '../../../../assets/icons/buscarObjetos/pin-gray.svg';
import calendarGray from '../../../../assets/icons/buscarObjetos/calendar-gray.svg';
import warningRed from '../../../../assets/icons/buscarObjetos/warning-red.svg';
import checkGreen from '../../../../assets/icons/buscarObjetos/check-green.svg';
import hourglassOrange from '../../../../assets/icons/buscarObjetos/hourglass-orange.svg';
import arrowBlue from '../../../../assets/icons/buscarObjetos/arrow-blue.svg';

// falta adicionar logica de filtrar por periodo

// Vai receber de buscarObjetos.jsx depois
const objetos = [
    {
        id: 1,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'PERDIDO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Jardim São Sebastião',
        cidade: 'São José do Vale do Rio Preto',
        dataOcorrencia: '14/09/2026, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'tacos',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: '14/09/2026, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'eletronicos',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Carteira de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'RJ',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Bola de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'sapucaia do sul',
        cidade: 'Rio grande do sul',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Carteira de Basquete Poker',
        status: 'ENCONTRADO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: 'Hoje, 12:30'
    },
    {
        id: 2,
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrY_4KkPEHad6YFRowx4F7glLuwXbCigLZPQVC0I1P1pF5EFCB5zYq-8c&s=10',
        nome: 'Carteira de Basquete Poker',
        status: 'PERDIDO',
        categoria: 'Bolas',
        icon_url: 'https://img.icons8.com/?size=100&id=kK2OkfQGPS4B&format=png&color=737373',
        descricaoBreve: 'Iphone 13 azul com pequenos sinais de uso, encontrada próxima ao Posto 8 da praia de Ipanema verde',
        endereco: 'Ipanema',
        cidade: 'Rio de Janeiro',
        dataOcorrencia: 'Hoje, 12:30'
    }

]

function PrincipalCards({/* objetos */ inicio, fim, resultadosExibidos }) {

    let cardsExibidos = 0

    const { state } = useFilter();
    const { primaryFilters, secondaryFilters } = state;

    function objetosAprovados(objetos){

        const filtrosAprovados = {}
        const categorias = ['OBJETO', 'LOCALIZAÇÃO', 'CATEGORIA', 'PERÍODO'];

        categorias.map((valorCategorias) => {

            if (!primaryFilters[valorCategorias]) { return }

            if (valorCategorias === 'LOCALIZAÇÃO') {

                const termosBusca = primaryFilters[valorCategorias].toUpperCase().split(' ');
                const cidadeObjeto = objetos.cidade.toUpperCase();
                const enderecoObjeto = objetos.endereco.toUpperCase();

                // every funciona igual o filter, a diferenca é que o filter retorna um novo array, o every retorna um boolean
                const objetosEncontrados = termosBusca.every((valorEncontrados) => {
                    return cidadeObjeto.includes(valorEncontrados) || enderecoObjeto.includes(valorEncontrados);
                });

                filtrosAprovados[valorCategorias] = objetosEncontrados

            } else if (valorCategorias === 'CATEGORIA') {

                const termosBusca = primaryFilters[valorCategorias].toUpperCase();
                const nomeDoObjeto = objetos.categoria.toUpperCase();

                if (nomeDoObjeto.includes(termosBusca)) { filtrosAprovados[valorCategorias] = false }
                if (nomeDoObjeto.includes(termosBusca)) { filtrosAprovados[valorCategorias] = true }

            } else if (valorCategorias === 'OBJETO'){

                const termosBusca = primaryFilters[valorCategorias].toUpperCase().split(' ');
                const nomeDoObjeto = objetos.nome.toUpperCase();

                
                const objetosEncontrados = termosBusca.every((valorEncontrados) => {
                    return nomeDoObjeto.includes(valorEncontrados);
                })
                
                filtrosAprovados[valorCategorias] = objetosEncontrados

            } else {

                // montar logica de periodo após req ao banco estiver funcionando
                
                const termosBusca = primaryFilters[valorCategorias].toUpperCase();
                const nomeDoObjeto = objetos.dataOcorrencia.toUpperCase();

                // const objetosEncontrados = termosBusca.every((valorEncontrados) => {
                //     return nomeDoObjeto.includes(valorEncontrados);
                // })

                // Aprovados[valorCategorias] = objetosEncontrados
            }

        });

        return filtrosAprovados
    }

    function filtros(objetos) {
        
        const resultadoFiltros = objetosAprovados(objetos); 
        
        const aprovados = []
        const preenchidos = []
        
        for (let camposPreenchidos in primaryFilters) { 
            if (primaryFilters[camposPreenchidos]) { preenchidos.push(camposPreenchidos) };
        }
        
        for (let ResultadosAprovados in resultadoFiltros) { 
            if (resultadoFiltros[ResultadosAprovados]) { aprovados.push(ResultadosAprovados) }; 
        }
        
        // if a quantidade de objetos preenchidos for a mesma de objetos aprovados, então ele filtra
        // se não tiver nenhum preenchido nem aprovado ele filtra pelos secondaryFilters direto
        if (preenchidos.length === aprovados.length) {
            if (!secondaryFilters || secondaryFilters === 'TODOS') { return (objetos) }
            if (objetos.status === secondaryFilters.slice(0, 7)) { return (objetos) }
            if (objetos.status === secondaryFilters.slice(0, 10)) { return (objetos) }

            // logica dos mais recentes e relevantes
        }
    }

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

    return (
        <div>
            {objetos.filter((valor) => { return filtros(valor) }).slice(inicio, fim).map((valor) => {
                cardsExibidos++

                return (

                    <div className='card__principal'>
                        <img className='image__card ' src={valor.imagem} />

                        <div className='principal__meio'>

                            <div className='principal__encima'>

                                <h1 className='titulo__principal'>{ valor.nome.length < 35 ? valor.nome : `${valor.nome.slice(0, 35)}...` }</h1>
                                <h1 className='titulo__responsive'>{ valor.nome.length < 25 ? valor.nome : `${valor.nome.slice(0, 25)}...`}</h1>

                                <div className='categoria__status'>
                                    <div className='status__principal'>
                                        <div className={adicionaClassNameStatus(valor.status)} >

                                            <img className="image__principal" src={verificaIconStatus(valor.status)} />
                                            <span>{valor.status}</span>

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
                                        <p className='endereco__principal'>{valor.cidade.length + valor.endereco.length < 50 ? `${valor.cidade}, ${valor.endereco}` : `${valor.cidade}, ${valor.endereco}`.slice(0, 50) + `...`}</p>
                                        <span className='endereco__responsive'>{valor.cidade.length + valor.endereco.length < 32 ? `${valor.cidade}, ${valor.endereco}` : `${valor.cidade}, ${valor.endereco}`.slice(0, 32) + `...`}</span>
                                    </div>

                                    <p className='divisoria'>|</p>

                                    <div className='hora__principal'>
                                        <img src={calendarGray} />
                                        <span>{valor.dataOcorrencia}</span>
                                    </div>
                                </div>

                                <p className='descricao__principal'>{valor.descricaoBreve}</p>

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
            {resultadosExibidos(cardsExibidos)}
        </div>
    )
}

export default PrincipalCards;