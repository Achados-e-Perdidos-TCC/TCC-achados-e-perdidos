import "./hero.css";
import { NavLink, useOutletContext } from "react-router";
import direitawhite from "../../../assets/icons/home/direita-white.png";
import direitablack from "../../../assets/icons/home/direita-black.png";
import localizacao from "../../../assets/icons/buscarObjetos/pin-gray.svg"
import calendar from "../../../assets/icons/buscarObjetos/calendar-gray.svg"
import warningRed from "../../../assets/icons/buscarObjetos/warning-red.svg";
import checkGreen from "../../../assets/icons/buscarObjetos/check-green.svg";
import hourglassOrange from "../../../assets/icons/buscarObjetos/hourglass-orange.svg";
import { hoje, ontem } from "../../../utils/date/date.js";
import objetos from "../../buscar-objetos/components/principalCards/objetos.json";
import cadastrodevolucao from "../../../assets/icons/home/cadastroadevolucao.png";
import comoencontramos from "../../../assets/icons/home/comoencontramos.png";
import lupa from "../../../assets/icons/home/lupa.png"

function Hero() {
    const { tema } = useOutletContext();

    return (

        <section className="hero">

            {/* Lado Esquerdo */}

            <div className="hero-content">

                <h1>
                    Seu objeto pode estar
                    <br />
                    mais <span id="perto">perto</span> do que você
                    <br />
                    <span id="imagina">imagina.</span>
                </h1>

                <p>
                    Cadastre o que você perdeu ou encontrou.
                    <br />
                    Nós ajudamos você a encontrar o que procura.
                </p>

                <div className="hero-buttons">

                    <button id="btn_perdiObjeto">
                        Perdi um objeto
                    </button>

                    <button id="btn_encontreiObjeto">
                        Encontrei um objeto
                    </button>
                </div>

            </div>


            {/* Lado Direito */}

          <div className="hero-imagem">
            {tema === 'light' ? <img src={direitawhite} alt="Direita-white" /> : <img src={direitablack} alt="Direitablack" />}
          </div>

            {/* Campo de Busca*/}

        <div className="hero-busca"> 
            
            <h2>O que você está procurando?</h2>

            <div>
                {tema === 'light' ? <img src={lupa} alt="lupawhite" /> : <img src={lupa} alt="lupablack" />}
            </div>

           <p>Encontre objetos cadastrados e veja possíveis
            <br />
            correspondências com o que você perdeu.
           </p>
            
            <div>
                <NavLink id="btn_buscar" to="/buscar-objetos">
                    Buscar
                </NavLink>
            </div>

    </div>

            {/* Seção de Cadastro e Como Encontramos */}

        <div className="cadastro-ComoEncontramos">

            <div id="cadastrodevolucao">
                {tema === 'light' ? <img src={cadastrodevolucao} alt="cadastroadevolucaowhite" /> : <img src={cadastrodevolucao} alt="cadastroadevolucaoblack" />}
            </div>

            <div id="comoencontramos">
               {tema === 'light' ? <img src={comoencontramos} alt="estatisticasWhite" /> : <img src={comoencontramos} alt="estatisticasBlack" />}
            </div>
        </div>

            {/*Seção obejtos recentes*/}

        <div className="objetos-recentes">
            
            <h2>Objetos recentemente cadastrados</h2>
            <NavLink to="/buscar-objetos" end> 
            Ver todos →
            </NavLink>

        </div>

        <div className="objetos-lista">
            {objetos.slice(0, 4).map((objeto) => {
                const status = objeto.status.trim().toUpperCase();

                return (
                <div className="objeto-card card__principal" key={objeto.id}>
                    <img className="image__card" src={objeto.imagemPrincipal} alt={objeto.nome} />

                    <div className="principal__meio">
                        <div className="principal__encima">
                            <h3 className="titulo__principal">
                                {objeto.nome.length < 35 ? objeto.nome : `${objeto.nome.slice(0, 35)}...`}
                            </h3>

                            <div className="categoria__status">
                                <div className="status__principal">
                                    <div className={adicionaClassNameStatus(status)}>
                                        <img className="image__principal" src={verificaIconStatus(status)} alt="" />
                                        <span>{status}</span>
                                    </div>
                                </div>

                                <div className="categoria__principal">
                                    <img className="icon__categoria" src={objeto.icon_url} alt="" />
                                    <span>{objeto.categoria}</span>
                                </div>
                            </div>
                        </div>

                        <div className="principal__embaixo">
                            <div className="data__hora">
                                <div className="data__principal">
                                    <img src={localizacao} alt="Localização" />
                                    <span>{`${objeto.localizacao.estado} - ${objeto.localizacao.cidade}`}</span>
                                </div>

                                <p className="divisoria">|</p>

                                <div className="hora__principal">
                                    <img src={calendar} alt="Data" />
                                    <span>{dataFormatada(objeto.data.data.trim(), objeto.data.hora.trim())}</span>
                                </div>
                            </div>

                            <p className="descricao__principal">
                                {objeto.descricao.length < 102 ? objeto.descricao : `${objeto.descricao.slice(0, 102)}...`}
                            </p>
                        </div>
                    </div>

                </div>
                );
            })}
        </div>

        </section>
    );

    
}

function verificaIconStatus(status) {
    if (status === "PERDIDO") return warningRed;
    if (status === "ENCONTRADO") return checkGreen;
    if (status === "ANALISE") return hourglassOrange;
}

function adicionaClassNameStatus(status) {
    if (status === "PERDIDO") return "status__red";
    if (status === "ENCONTRADO") return "status__green";
    if (status === "ANALISE") return "status__orange";
}

function dataFormatada(data, hora) {
    if (data === hoje()) return `Hoje, ${hora}`;
    if (data === ontem()) return `Ontem, ${hora}`;

    return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}, ${hora}`;
}

export default Hero;