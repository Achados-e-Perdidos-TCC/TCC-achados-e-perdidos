
import { hoje, ontem } from '../../../../utils/date/date.js';
import {
    formatarLocalizacao,
    obterNomeCompletoEstado
} from '../../../../utils/location/localizacao.js';

import './detalhes.css';

import Status from '../../../../components/status/Status.jsx';

import pinGray from '../../../../assets/icons/buscarObjetos/pin-gray.svg';
import calendarGray from '../../../../assets/icons/buscarObjetos/calendar-gray.svg';
import gridGray from '../../../../assets/icons/buscarObjetos/grid-gray.svg';
import circuloBlue from '../../../../assets/icons/detalhesObjeto/circulo-blue.png';

const icons = [gridGray, pinGray, calendarGray];
const infos = ['Categorias', 'Localização', 'Data'];

// Cabeçalho separado para permitir reposicionamento responsivo.
export function DetalhesCabecalho({ objeto }) {
    const nome = objeto?.nome || 'Objeto sem nome';

    return (
        <div className="cabecalho__detalhes">
            <h1 className="detalhes__titulo">{nome}</h1>

            <p className="detalhes__descricao responsive">
                Informações para identificação do objeto.
            </p>

            <div className="status__detalhes">
                <Status objeto={objeto} />
            </div>
        </div>
    );
}

function Detalhes({ objeto }) {
    const objetoEncontrado = objeto ?? {};

    const localizacao = objetoEncontrado.localizacao ?? {};
    const dataObjeto = objetoEncontrado.data ?? {};

    const descricao = objetoEncontrado.descricao || 'Descrição indisponível';

    const descricaoCompleta =
        objetoEncontrado.descricaoCompleta?.trim() || '';

    const cidade = localizacao.cidade || 'Não informado';
    const endereco = localizacao.endereco || '';
    const estado =
        obterNomeCompletoEstado(localizacao.estado) || 'Não informado';

    const localizacaoFormatada =
        formatarLocalizacao(localizacao) || 'Localização não informada';

    function dataFormatada(data) {
        if (!data) return 'Data não informada';
        if (data === hoje()) return 'Hoje';
        if (data === ontem()) return 'Ontem';

        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
    }

    const descricaoInfo = [
        objetoEncontrado.categoria || 'Não informada',
        localizacaoFormatada,
        dataFormatada(dataObjeto.data),
    ];

    const informacoesAdicionais = [
        `Categoria: ${objetoEncontrado.categoria || 'Não informada'}`,
        ...(endereco ? [`Endereço: ${endereco}`] : []),
        `Cidade: ${cidade}`,
        `Estado: ${estado}`,
        `Data: ${dataFormatada(dataObjeto.data)}`,
        `Horário: ${dataObjeto.hora || 'Não informado'}`,
    ];

    return (
        <div className="detalhes">
            <div className="detalhes__infos">
                {icons.map((valor, index) => (
                    <div key={valor} className="infos__icons">
                        <img className="icons" src={valor} alt="" />

                        <div>
                            <span className="infos__categoria">
                                {infos[index]}
                            </span>

                            <p className="infos__text">
                                {descricaoInfo[index]}
                            </p>

                            <p className="responsive infos__text">
                                {descricaoInfo[index].length > 17
                                    ? `${descricaoInfo[index].slice(0, 17)}...`
                                    : descricaoInfo[index]}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card__infos">
                <h2 className="detalhes__objeto__title">
                    Detalhes do objeto
                </h2>

                <div>
                    <p className="detalhes__objeto__subtitle">
                        Descrição Completa
                    </p>

                    <p className="detalhes__descricao__completa">
                        {descricao}
                    </p>

                    {descricaoCompleta && (
                        <>
                            <p className="detalhes__objeto__subtitle">
                                Características específicas
                            </p>

                            <p className="detalhes__descricao__completa">
                                {descricaoCompleta}
                            </p>
                        </>
                    )}
                </div>

                <hr />

                <div>
                    <p className="detalhes__objeto__subtitle">
                        Informações
                    </p>

                    {informacoesAdicionais.map((valor) => (
                        <div
                            key={valor}
                            className="informacoes__adicionais"
                        >
                            <img
                                className="circulo__blue"
                                src={circuloBlue}
                                alt=""
                            />

                            <p className="detalhes__descricao__adicional">
                                {valor}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Detalhes;
