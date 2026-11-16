import "./notObjects.css";

import notFoundIllustration from "../../../assets/icons/notobjects/notFound-illustration.png";
import garbageWhite from "../../../assets/icons/notobjects/garbage-white.png";

function NotObjects() {
  function limparFiltros() {
    window.location.reload();
  }

  return (
    <section className="notobjects">
      {/* ILUSTRAÇÃO */}

      <img
        className="notobjects__illustration"
        src={notFoundIllustration}
        alt="Ilustração representando uma busca sem resultados"
      />

      {/* TEXTOS */}

      <div className="notobjects__texts">
        <h2 className="notobjects__title">
          Ops! Não encontramos nenhum objeto
        </h2>

        <p className="notobjects__subtitle">
          Se você aplicou algum filtro, tente removê-lo para ampliar os
          resultados da sua busca.
        </p>
      </div>

      {/* AÇÃO */}

      <button
        className="notobjects__button"
        type="button"
        onClick={limparFiltros}
      >
        <img src={garbageWhite} alt="" />
        <span>Limpar filtros</span>
      </button>
    </section>
  );
}

export default NotObjects;
