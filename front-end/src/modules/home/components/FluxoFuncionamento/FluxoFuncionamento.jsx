import "./FluxoFuncionamento.css";

function FluxoFuncionamento() {
  const etapas = [
    {
      id: 1,
      titulo: "Cadastro",
      descricao: "Você cadastra um objeto perdido ou encontrado na plataforma.",
      icone: (
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M18 8h21l9 9v11"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M39 8v10h10"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M18 8a4 4 0 0 0-4 4v40a4 4 0 0 0 4 4h22"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M23 28h17M23 36h14M23 44h11"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle
            cx="44"
            cy="46"
            r="8"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            d="m50 52 7 7"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      id: 2,
      titulo: "Análise",
      descricao:
        "Você analisa os objetos cadastrados e procura possíveis correspondências.",
      icone: (
        <svg viewBox="0 0 64 64" fill="none">
          <circle
            cx="27"
            cy="27"
            r="16"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="m39 39 14 14"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      id: 3,
      titulo: "Contato",
      descricao:
        "Encontrou uma possível correspondência? Envie um e-mail para quem cadastrou o objeto.",
      icone: (
        <svg viewBox="0 0 64 64" fill="none">
          <rect
            x="9"
            y="15"
            width="46"
            height="34"
            rx="5"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            d="m11 19 21 17 21-17"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="fluxo-funcionamento">
      <div className="fluxo-funcionamento__card">
        {/* Cabeçalho do card */}

        <div className="fluxo-funcionamento__cabecalho">
          <div className="fluxo-funcionamento__icone-cabecalho">
            <svg viewBox="0 0 64 64" fill="none">
              <path
                d="M16 9h26l9 9v31a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5Z"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M42 9v11h9"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M21 27h22M21 35h18M21 43h12"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="fluxo-funcionamento__texto-cabecalho">
            <h2>Do cadastro ao contato</h2>

            <p>Todo o processo é simples e seguro. Veja como funciona:</p>
          </div>
        </div>

        {/* Etapas do funcionamento */}

        <div className="fluxo-funcionamento__etapas">
          {etapas.map((etapa, indice) => (
            <div className="fluxo-funcionamento__grupo" key={etapa.id}>
              <div className="fluxo-funcionamento__etapa">
                <div className="fluxo-funcionamento__icone">{etapa.icone}</div>

                <h3>{etapa.titulo}</h3>

                <p>{etapa.descricao}</p>
              </div>

              {/* Seta entre as etapas */}

              {indice < etapas.length - 1 && (
                <div className="fluxo-funcionamento__seta" aria-hidden="true">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FluxoFuncionamento;
