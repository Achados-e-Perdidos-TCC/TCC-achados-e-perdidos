import "./ComoFunciona.css";

const etapas = [
  {
    numero: "01",
    titulo: "Cadastre um objeto",
    descricao:
      "Perdeu ou encontrou algo? Registre o objeto com uma descrição, local e outras informações importantes.",
    tipo: "Cadastro",
  },
  {
    numero: "02",
    titulo: "Pesquise manualmente",
    descricao:
      "Explore os objetos cadastrados e utilize a busca para encontrar registros que correspondam ao que procura.",
    tipo: "Busca",
  },
  {
    numero: "03",
    titulo: "Confira os detalhes",
    descricao:
      "Compare as informações dos registros e verifique se encontrou o objeto que estava procurando.",
    tipo: "Identificação",
  },
];

function ComoFunciona() {
  return (
    <section className="como__funciona" id="como-funciona">
      <div className="como__funciona__container">
        <div className="como__funciona__header">
          <span className="como__funciona__eyebrow">SIMPLES E DIRETO</span>

          <h2>
            Como funciona o{" "}
            <span className="title__h2">
              Achados <span className="title__h2__e">e</span> Devolvidos?
            </span>
          </h2>

          <p>
            Encontrar ou cadastrar um objeto é simples. Tudo acontece em apenas
            três etapas.
          </p>
        </div>

        <div className="como__funciona__etapas">
          {etapas.map((etapa, index) => (
            <article
              className={`como__funciona__card ${
                index % 2 === 0 ? "card--azul" : "card--verde"
              }`}
              key={etapa.numero}
            >
              <div className="como__funciona__card__top">
                <span className="como__funciona__numero">{etapa.numero}</span>

                <span className="como__funciona__tipo">{etapa.tipo}</span>
              </div>

              <div className="como__funciona__card__content">
                <h3>{etapa.titulo}</h3>

                <p>{etapa.descricao}</p>
              </div>

              <div className="como__funciona__card__footer">
                <span className="como__funciona__indicador" />
                <span>Etapa {etapa.numero}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="como__funciona__footer">
          <span className="como__funciona__footer__icon">✓</span>

          <p>
            <strong>Você no controle.</strong> Cadastre e pesquise no seu
            próprio ritmo.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ComoFunciona;
