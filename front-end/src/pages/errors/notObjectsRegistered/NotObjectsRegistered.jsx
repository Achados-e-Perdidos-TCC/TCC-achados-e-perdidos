import notFoundIllustration from "../../../assets/icons/notobjects/notFound-illustration.png";

import "./notObjectsRegistered.css";

function NotObjectsRegistered() {
  return (
    <section className="notobjects-registered">
      {/* ILUSTRAÇÃO */}

      <img
        className="notobjects-registered__illustration"
        src={notFoundIllustration}
        alt="Ilustração representando a ausência de objetos cadastrados"
      />

      {/* TEXTOS */}

      <div className="notobjects-registered__texts">
        <h2 className="notobjects-registered__title">
          Ops! Você ainda não possui objetos cadastrados
        </h2>

        <p className="notobjects-registered__subtitle">
          Cadastre seu primeiro objeto para começar a visualizar e gerenciar
          seus registros por aqui.
        </p>
      </div>
    </section>
  );
}

export default NotObjectsRegistered;
