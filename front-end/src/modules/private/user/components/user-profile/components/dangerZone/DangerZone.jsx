import { useState, useContext } from "react";
import { NavLink } from "react-router";

import { logout, deleteAccount } from "../../../../../private.service";
import { AuthContext } from "../../../../../../../contexts/authContexts/AuthContext.jsx";

import "./dangerZone.css";

function DangerZone() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [attempts, setAttempts] = useState(0);

  function userLogout() {
    logout();
    setIsAuthenticated(false);
  }

  async function deleteUserAccount() {
    if (attempts === 0) {
      setAttempts(1);
      return;
    }

    await deleteAccount();
    setIsAuthenticated(false);
  }

  return (
    <div className="user__danger__zone">
      <div className="user__danger__container">
        <div className="user__danger__content">
          <h3 className="user__danger__title">Deslogar</h3>

          <p className="user__danger__subtitle">
            Você poderá entrar novamente quando quiser.
          </p>
        </div>

        <NavLink
          className="user__danger__button"
          to="/"
          end
          onClick={userLogout}
        >
          Deslogar
        </NavLink>
      </div>

      <div className="user__danger__divider" />

      {attempts === 1 && (
        <div className="user__delete__confirmation">
          <span className="user__delete__confirmation__icon">!</span>

          <div className="user__delete__confirmation__content">
            <strong className="user__delete__confirmation__title">
              Tem certeza que deseja excluir sua conta?
            </strong>

            <p className="user__delete__confirmation__subtitle">
              Essa ação não poderá ser desfeita.
            </p>
          </div>
        </div>
      )}

      <div className="user__danger__container">
        <div className="user__danger__content">
          <h3 className="user__danger__title">Excluir conta</h3>

          <p className="user__danger__subtitle">
            Esta ação é permanente e não pode ser desfeita.
          </p>
        </div>

        <button
          className={`user__danger__button ${
            attempts === 1 ? "user__danger__button--confirm" : ""
          }`}
          type="button"
          onClick={deleteUserAccount}
        >
          {attempts === 1 ? "Confirmar exclusão" : "Excluir conta"}
        </button>
      </div>
    </div>
  );
}

export default DangerZone;
