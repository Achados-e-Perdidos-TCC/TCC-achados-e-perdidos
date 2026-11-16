import { NavLink } from "react-router";
import "./notFound.css";

import findBlue from "../../../assets/icons/notFound/find-blue.png";
import houseWhite from "../../../assets/icons/notFound/house-white.png";
import notFoundBlue from "../../../assets/icons/notFound/notFound-blue.png";

function NotFound() {
  return (
    <main className="notfound">
      <section className="notfound__card">
        {/* ILUSTRAÇÃO */}

        <div className="notfound__illustration">
          <img
            className="notfound__image"
            src={notFoundBlue}
            alt="Ilustração representando uma página não encontrada"
          />
        </div>

        {/* TEXTOS */}

        <div className="notfound__texts">
          <span className="notfound__label">ERRO 404</span>

          <h1 className="notfound__title">Ops! Página não encontrada</h1>

          <p className="notfound__subtitle">
            Não conseguimos encontrar a página que você está procurando. Talvez
            ela tenha sido removida ou o endereço esteja incorreto.
          </p>
        </div>

        {/* AÇÕES */}

        <div className="notfound__actions">
          <NavLink
            className="notfound__button notfound__button--primary"
            to="/"
            end
          >
            <img src={houseWhite} alt="" />
            <span>Voltar para o início</span>
          </NavLink>

          <NavLink
            className="notfound__button notfound__button--secondary"
            to="/buscar-objetos"
            end
          >
            <img src={findBlue} alt="" />
            <span>Buscar objetos</span>
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
