import "./hero.css";
import { useEffect, useState } from "react";
import { NavLink, useOutletContext } from "react-router";
import direitawhite from "../../../assets/icons/home/direita-white.svg";
import direitablack from "../../../assets/icons/home/direita-black.svg";
import localizacao from "../../../assets/icons/buscarObjetos/pin-gray.svg";
import calendar from "../../../assets/icons/buscarObjetos/calendar-gray.svg";
import warningRed from "../../../assets/icons/buscarObjetos/warning-red.svg";
import checkGreen from "../../../assets/icons/buscarObjetos/check-green.svg";
import hourglassOrange from "../../../assets/icons/buscarObjetos/hourglass-orange.svg";
import { hoje, ontem } from "../../../utils/date/date.js";
import { objects as buscarObjetos } from "../../buscar-objetos/buscarObjetos.service.js";
import { formatarLocalizacao } from "../../../utils/location/localizacao.js";
import { resolverUrlImagem } from "../../../utils/images/urlImagem.js";
// import cadastrodevolucao from "../../../assets/icons/home/cadastroadevolucao.png";
// import comoencontramos from "../../../assets/icons/home/comoencontramos.png";
import lupa from "../../../assets/icons/home/lupa.png";
import lupablack from "../../../assets/icons/home/lupablack.png";
// import comoencontramosblack from "../../../assets/icons/home/comoencontramosblack.png";
// import cadastrodevolucaoblack from "../../../assets/icons/home/cadastroadevolucaoblack.png";
import Loading from "../../../components/loading/Loading.jsx";
import EstadoErroObjetos from "../components/EstadoErroObjetos/EstadoErroObjetos.jsx";
import EstadoVazioObjetos from "../components/EstadoVazioObjetos/EstadoVazioObjetos.jsx";
import FluxoFuncionamento from "../components/FluxoFuncionamento/FluxoFuncionamento.jsx";
import CardDicas from "../components/CardDicas/CardDicas.jsx";

function Hero() {
  const { tema } = useOutletContext();
  const [objetos, setObjetos] = useState([]);
  const [carregandoObjetos, setCarregandoObjetos] = useState(true);
  const [erroObjetos, setErroObjetos] = useState(false);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarObjetosRecentes() {
      try {
        const resultado = await buscarObjetos();

        if (componenteAtivo) {
          setObjetos(Array.isArray(resultado) ? resultado.slice(0, 4) : []);
        }
      } catch (error) {
        console.error("Erro ao carregar objetos recentes:", error);

        if (componenteAtivo) {
          setErroObjetos(true);
        }
      } finally {
        if (componenteAtivo) {
          setCarregandoObjetos(false);
        }
      }
    }

    carregarObjetosRecentes();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  return (
    <section className="hero">
      {/* Lado Esquerdo */}

      <div className="hero-content ">
        <h1 className="no__responsive">
          Seu objeto pode estar
          <br />
          mais <span id="perto">perto</span> do que você
          <br />
          <span id="imagina">imagina.</span>
        </h1>

        <h1 className="responsive__hero">
          Seu objeto pode estar
          <br />
          mais <span id="perto">perto</span> do que você
          <span id="imagina">imagina.</span>
        </h1>

        <p>
          Cadastre o que você perdeu ou encontrou.
          <br />
          Nós ajudamos você a encontrar o que procura.
        </p>

        <div className="hero-buttons">
          <NavLink id="btn_perdiObjeto" to="/cadastrar-objetos">
            Perdi um objeto
          </NavLink>

          <NavLink id="btn_encontreiObjeto" to="/cadastrar-objetos">
            Encontrei um objeto
          </NavLink>
        </div>
      </div>

      {/* Lado Direito */}

      <div className="hero-imagem ">
        {tema === "light" ? (
          <img src={direitawhite} alt="Direita-white" />
        ) : (
          <img src={direitablack} alt="Direitablack" />
        )}
      </div>

      {/* Campo de Busca*/}

      <div className="hero-busca">
        <h2>O que você está procurando?</h2>

        <div>
          {tema === "light" ? (
            <img src={lupa} alt="lupa" />
          ) : (
            <img src={lupablack} alt="lupablack" />
          )}
        </div>

        <p className="no__responsive">
          Encontre objetos cadastrados e veja possíveis correspondências com o
          que você perdeu.
        </p>

        <p className="responsive">
          Encontre objetos cadastrados e veja possíveis correspondências
        </p>

        <div>
          <NavLink id="btn_buscar" to="/buscar-objetos">
            Buscar
          </NavLink>
        </div>
      </div>

      {/* Seção de Cadastro e Como Encontramos */}

      <div className="cadastro-ComoEncontramos">
        <FluxoFuncionamento />
        <CardDicas />
      </div>

      {/*Seção obejtos recentes*/}

      <div className="objetos-recentes">
        <h2>Objetos recentemente cadastrados</h2>
        <NavLink to="/buscar-objetos" end>
          Ver todos →
        </NavLink>
      </div>

      <div className="objetos-lista">
        {carregandoObjetos ? (
          <Loading />
        ) : erroObjetos ? (
          <EstadoErroObjetos />
        ) : objetos.length === 0 ? (
          <EstadoVazioObjetos />
        ) : (
          objetos.map((objeto) => {
            const status = (objeto.status || "").trim().toUpperCase();
            const nome = objeto.nome || "Objeto sem nome";
            const descricao = objeto.descricao || "Sem descrição disponível";
            const data = objeto.data?.data?.trim() || "";
            const hora = objeto.data?.hora?.trim() || "";
            const localizacaoFormatada = formatarLocalizacao(
              objeto.localizacao,
            );

            return (
              <div className="objeto-card card__principal" key={objeto.id}>
                {objeto.imagemPrincipal ? (
                  <img
                    className="image__card"
                    src={resolverUrlImagem(objeto.imagemPrincipal)}
                    alt={nome}
                  />
                ) : (
                  <div
                    className="image__card"
                    aria-label="Imagem não disponível"
                  />
                )}

                <div className="principal__meio">
                  <div className="principal__encima">
                    <h3 className="titulo__principal">
                      {nome.length < 35 ? nome : `${nome.slice(0, 35)}...`}
                    </h3>

                    <div className="categoria__status">
                      <div className="status__principal">
                        <div className={adicionaClassNameStatus(status)}>
                          <img
                            className="image__principal"
                            src={verificaIconStatus(status)}
                            alt=""
                          />
                          <span>{status}</span>
                        </div>
                      </div>

                      <div className="categoria__principal">
                        <img
                          className="icon__categoria"
                          src={objeto.icon_url}
                          alt=""
                        />
                        <span>{objeto.categoria || "Outros"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="principal__embaixo">
                    <div className="data__hora">
                      <div className="data__principal">
                        <img src={localizacao} alt="Localização" />
                        <span>
                          {localizacaoFormatada || "Localização não informada"}
                        </span>
                      </div>

                      <div className="hora__principal">
                        <img src={calendar} alt="Data" />
                        <span>{dataFormatada(data, hora)}</span>
                      </div>
                    </div>

                    <p className="descricao__principal">
                      {descricao.length < 102
                        ? descricao
                        : `${descricao.slice(0, 102)}...`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function verificaIconStatus(status) {
  if (status === "PERDIDO") return warningRed;
  if (status === "ENCONTRADO") return checkGreen;
  if (status === "ANALISE" || status === "EM_ANALISE") return hourglassOrange;
  return hourglassOrange;
}

function adicionaClassNameStatus(status) {
  if (status === "PERDIDO") return "status__red";
  if (status === "ENCONTRADO") return "status__green";
  if (status === "ANALISE" || status === "EM_ANALISE") return "status__orange";
  return "status__orange";
}

function dataFormatada(data, hora) {
  if (!data) return "Data não informada";
  if (data === hoje()) return `Hoje${hora ? `, ${hora}` : ""}`;
  if (data === ontem()) return `Ontem${hora ? `, ${hora}` : ""}`;

  const dataLegivel = `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
  return hora ? `${dataLegivel}, ${hora}` : dataLegivel;
}

export default Hero;
