import "./ComoFunciona.css";
import { NavLink } from "react-router";

import signing from "../../../assets/icons/comoFunciona/signing.png";
import zoom from "../../../assets/icons/comoFunciona/zoom.png";
import connection from "../../../assets/icons/comoFunciona/connection.png";
import notification from "../../../assets/icons/comoFunciona/notification.png";

import {
    IconRelogio,
    IconEscudo,
    IconMensagem,
    IconAdicionar,
} from "../components/icons/ComoFuncionaIcons.jsx";
import lupaGray from "../../../assets/icons/comoFunciona/lupa-gray.svg";
import arrowBlue from "../../../assets/icons/buscarObjetos/arrow-blue.svg";

const passos = [
    {
        numero: "01",
        titulo: "Você cadastra",
        descricao: "Registre um objeto perdido ou encontrado.",
        icone: signing,
    },
    {
        numero: "02",
        titulo: "Analisamos",
        descricao: "Nosso sistema compara características e informações.",
        icone: zoom,
    },
    {
        numero: "03",
        titulo: "Conectamos",
        descricao: "Encontramos possíveis correspondências entre os registros.",
        icone: connection,
    },
    {
        numero: "04",
        titulo: "Notificamos",
        descricao: "Quando encontramos algo relevante, avisamos você.",
        icone: notification,
    },
];

const motivos = [
    {
        icone: <img className="motivo__icone" src={lupaGray} alt="" />,
        titulo: "Busca inteligente",
        descricao: "Nossa tecnologia analisa detalhes e aumenta as chances de encontrar o que você procura.",
    },
    {
        icone: <IconRelogio className="motivo__icone motivo__icone--svg" />,
        titulo: "Monitoramento contínuo",
        descricao: "Novos registros são verificados constantemente, mesmo após a publicação.",
    },
    {
        icone: <IconEscudo className="motivo__icone motivo__icone--svg" />,
        titulo: "Privacidade e segurança",
        descricao: "Seus dados são protegidos e compartilhados apenas quando há uma correspondência.",
    },
    {
        icone: <IconMensagem className="motivo__icone motivo__icone--svg" />,
        titulo: "Comunicação segura",
        descricao: "Converse diretamente com a pessoa que encontrou ou perdeu o objeto, de forma segura e organizada.",
    },
];


function ComoFunciona() {
    return (
        <section className="como__funciona">

            <div className="como__funciona__cabecalho">
                <h1 className="title__como__funciona">Como funciona</h1>
                <p className="subtitle subtitle__description">
                    Encontrar ou devolver um objeto ficou mais simples.
                    <br />
                </p>
            </div>

            <div className="como__funciona__passos">
                {passos.map((passo, indice) => (

                    <div className="passo__wrapper" key={passo.numero}>
                        <div className="passo__card container__card">
                            <span className="passo__numero">{passo.numero}</span>
                            <img className="passo__icone" src={passo.icone} alt={passo.titulo} />
                            <h2 className="passo__titulo">{passo.titulo}</h2>
                            <p className="subtitle">{passo.descricao}</p>
                        </div>

                        {indice < passos.length - 1 && (
                            <img className="passo__seta" src={arrowBlue} alt="" />
                        )}
                    </div>
                ))}
            </div>

            <div className="como__funciona__cta">
                <NavLink id="btn_buscar" to="/buscar-objetos">
                    Buscar objetos
                </NavLink>
            </div>


            <div className="como__funciona__motivos">
                <h2 className="motivos__titulo">Por que usar o Achados e Devolvidos?</h2>

                <div className="motivos__grid">
                    {motivos.map((motivo) => (
                        <div className="motivo__card container__card" key={motivo.titulo}>
                            {motivo.icone}
                            <h3 className="motivo__card__titulo">{motivo.titulo}</h3>
                            <p className="subtitle">{motivo.descricao}</p>
                        </div>
                    ))}
                </div>
            </div>


            <div className="como__funciona__cta">
                <NavLink id="btn_cadastrar_objeto" to="/cadastrar-objeto">
                    <IconAdicionar className="cta__icone" />
                    Cadastrar meu objeto
                </NavLink>
            </div>

        </section>
    );
}

export default ComoFunciona;