import "./ComoFunciona.css";
import { NavLink } from "react-router";

import signing from "../../../assets/icons/comoFunciona/signing.png";
import zoom from "../../../assets/icons/comoFunciona/zoom.png";
import connection from "../../../assets/icons/comoFunciona/connection.png";
import notification from "../../../assets/icons/comoFunciona/notification.png";

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
                {passos.map((passo) => (
                    <div className="passo__card container__card" key={passo.numero}>
                        <span className="passo__numero">{passo.numero}</span>
                        <img className="passo__icone" src={passo.icone} alt={passo.titulo} />
                        <h2 className="passo__titulo">{passo.titulo}</h2>
                        <p className="subtitle">{passo.descricao}</p>
                    </div>
                ))}
            </div>

            <div className="como__funciona__cta">
                <NavLink id="btn_buscar" to="/buscar-objetos">
                    Buscar objetos
                </NavLink>
            </div>

        </section>
    );
}

export default ComoFunciona;