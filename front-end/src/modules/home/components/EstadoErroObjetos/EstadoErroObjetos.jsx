import "./EstadoErroObjetos.css";

function EstadoErroObjetos() {
  return (
    <div className="estado-objetos estado-objetos-erro" role="alert">
      <div className="estado-objetos-icone">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2L12 3Z" />
          <path d="M12 9v5" />
          <path d="M12 17h.01" />
        </svg>
      </div>

      <h3>Ops! Algo deu errado.</h3>

      <p>
        Não foi possível carregar os objetos recentes. Tente novamente mais
        tarde.
      </p>
    </div>
  );
}

export default EstadoErroObjetos;
