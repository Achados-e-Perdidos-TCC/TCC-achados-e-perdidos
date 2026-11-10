import "./EstadoVazioObjetos.css";

function EstadoVazioObjetos() {
  return (
    <div className="estado-objetos estado-objetos-vazio" role="status">
      <div className="estado-objetos-vazio-icone">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m3 7 9-4 9 4-9 4-9-4Z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
          <path d="m7.5 5 9 4" />
        </svg>
      </div>

      <h3>Nenhum objeto por aqui ainda.</h3>

      <p>
        Ainda não temos objetos cadastrados recentemente. Assim que houver novos
        registros, eles aparecerão aqui.
      </p>
    </div>
  );
}

export default EstadoVazioObjetos;
