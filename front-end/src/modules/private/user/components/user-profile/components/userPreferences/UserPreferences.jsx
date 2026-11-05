import { useState } from "react";
import { useOutletContext } from "react-router";

import "./userPreferences.css";

function UserPreferences({
  ativo1,
  showEmailOnItems,
  setAtivo1,
  setShowEmailOnItems,
}) {
  const [temaAberto, setTemaAberto] = useState(false);

  const { tema, setTema } = useOutletContext();

  return (
    <div className="user__profile__preferences">
      {/* Notificações */}
      <div className="user__profile__preferences__container">
        <div>
          <h4 className="user__profile__preferences__title">
            Receber Notificações
          </h4>

          <p className="user__profile__preferences__subtitle">
            Receba notificações sobre novidades da plataforma
          </p>
        </div>

        <button
          type="button"
          className={`preference__button ${ativo1 ? "ativo1" : ""}`}
          onClick={() => setAtivo1(!ativo1)}
          aria-label="Alternar notificações"
          aria-pressed={ativo1}
        >
          <span />
        </button>
      </div>

      <hr />

      {/* Divulgação do e-mail */}
      <div className="user__profile__preferences__container">
        <div>
          <h4 className="user__profile__preferences__title">
            Exibir meu e-mail nos objetos
          </h4>

          <p className="user__profile__preferences__subtitle">
            Permita que outras pessoas vejam seu e-mail ao acessar os detalhes
            dos objetos que você publicou.
          </p>
        </div>

        <button
          type="button"
          className={`preference__button ${showEmailOnItems ? "ativo3" : ""}`}
          onClick={() => setShowEmailOnItems(!showEmailOnItems)}
          aria-label="Alternar divulgação do e-mail nos objetos"
          aria-pressed={showEmailOnItems}
        >
          <span />
        </button>
      </div>

      <hr />

      {/* Tema */}
      <div className="user__profile__preferences__container">
        <div className="user__profile__select__container">
          <h4 className="user__profile__preferences__title preferences__theme__title">
            Tema
          </h4>

          <div className="custom__select">
            <button
              type="button"
              className={`custom__select__button ${
                !temaAberto ? "select__button__off" : "select__button__on"
              }`}
              onClick={() => setTemaAberto(!temaAberto)}
              aria-expanded={temaAberto}
            >
              <span>{tema === "light" ? "Claro" : "Escuro"}</span>
            </button>

            {temaAberto && (
              <div className="custom-select__options">
                <button
                  type="button"
                  className="custom-select__option"
                  onClick={() => {
                    setTema("light");
                    setTemaAberto(false);
                  }}
                >
                  Claro
                </button>

                <button
                  type="button"
                  className="custom-select__option"
                  onClick={() => {
                    setTema("dark");
                    setTemaAberto(false);
                  }}
                >
                  Escuro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPreferences;
