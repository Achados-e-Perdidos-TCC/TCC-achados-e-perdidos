import { hoje, ontem } from '../../../../utils/date/date.js'; 

import './detalhes.css'

import Status from '../../../../components/status/Status.jsx';

import pinGray from '../../../../assets/icons/buscarObjetos/pin-gray.svg';
import calendarGray from '../../../../assets/icons/buscarObjetos/calendar-gray.svg';
import gridGray from '../../../../assets/icons/buscarObjetos/grid-gray.svg';
import circuloBlue from '../../../../assets/icons/detalhesObjeto/circulo-blue.png'

const icons = [ gridGray, pinGray,  calendarGray ]
const infos = ['categorias', 'Localização', 'Data']

function Detalhes(objeto){

    let posicao = -1;
    const objetoEncontrado = objeto.objeto[0];
    const localizacaoFormatada = `${objetoEncontrado.localizacao.estado} - ${objetoEncontrado.localizacao.cidade}, ${objetoEncontrado.localizacao.endereco}`

    function dataFormatada(data, hora){
        if (data === hoje()) { return `Hoje, ${hora}`}
        if (data === ontem()) { return `Ontem, ${hora}`}
        
        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}, ${hora}`; 
    }

    const descricaoInfo = [objetoEncontrado.categoria, localizacaoFormatada, dataFormatada(objetoEncontrado.data.data, objetoEncontrado.data.hora)]

    
    const informacoesAdicionais = [ `Categoria: ${objetoEncontrado.categoria}`, `Localização: ${objetoEncontrado.localizacao.endereco}`,
    `Cidade: ${objetoEncontrado.localizacao.cidade}`, `Estado: ${objetoEncontrado.localizacao.estado}`, `Data: ${dataFormatada(objetoEncontrado.data.data).slice(0, 10)}`,
    `Horário: ${objetoEncontrado.data.hora}`
    ]

    return(
        <div className='detalhes'>

            <div>
                <div className={'status__detalhes'}>
                    <Status objeto={objetoEncontrado}/>
                </div>

                <h1 className='detalhes__titulo'>{objetoEncontrado.nome}</h1>
                <p className='detalhes__descricao'>{`${objetoEncontrado.descricao.slice(0, 70)}...`}</p>
                <p className='detalhes__descricao responsive'>{`Informações para identificação do objeto.`}</p>

                <div className='detalhes__infos'>
                    {icons.map((valor) => {
                        posicao++

                        return(
                            <div className='infos__icons'>

                                <img className="icons" src={valor} />

                                <div>
                                    <span className='infos__categoria'> {infos[posicao]} </span>
                                    <p className='infos__text'> {descricaoInfo[posicao]} </p>
                                    <p className='responsive infos__text'> {`${descricaoInfo[posicao].slice(0, 17)}...`} </p>
                                </div>
                                
                            </div>
                        )
                    })}
                </div>
            </div>

                <div className='card__infos'>
                    <h2 className='detalhes__objeto__title'>Detalhes do objeto</h2>

                    <div>
                        <p className='detalhes__objeto__subtitle'>Descrição Completa</p>
                        <p className='detalhes__descricao__completa'>{objetoEncontrado.descricao}</p>
                    </div>

                    <hr />

                    <div>
                        <p className='detalhes__objeto__subtitle'>Informações</p>
                        {
                            informacoesAdicionais.map((valor) => {
                                return ( 
                                    <div className='informacoes__adicionais'>
                                        <img className="circulo__blue" src={circuloBlue} />
                                        <p className='detalhes__descricao__adicional'> {valor} </p>
                                    </div>
                               ) 
                            })
                        }
                    </div>

                    <hr />

                    <div>
                        <p className='detalhes__objeto__subtitle'>Complemento de localização</p>
                        <p className='detalhes__descricao__complemento'>{objetoEncontrado.localizacao.complemento}</p>
                    </div>
                </div>
        </div>
    )
}


export default Detalhes;