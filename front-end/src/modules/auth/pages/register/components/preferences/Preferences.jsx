import { useState } from "react";
import { useOutletContext } from "react-router";

import "./preferences.css";

import arrowBlack from "../../../../../../assets/icons/register/arrow-black.png";
import arrowWhite from "../../../../../../assets/icons/register/arrow-white.png";

function Preferences({ proximaPagina, criarConta, error }) {
  const { tema } = useOutletContext();

  const [ativo1, setAtivo1] = useState(true);
  const [ativo3, setAtivo3] = useState(false);

  const [criandoConta, setCriandoConta] = useState(false);

  const preferencias = [
    {
      id: 1,
      titulo: "Notificações",
      descricao:
        "Receba atualizações importantes sobre sua conta e suas atividades na plataforma.",
      ativo: ativo1,
      alterar: setAtivo1,
      icone: "bell",
    },
    {
      id: 3,
      titulo: "Exibir meu e-mail nos objetos",
      descricao:
        "Permita que outras pessoas visualizem seu e-mail nos anúncios de objetos publicados por você.",
      ativo: ativo3,
      alterar: setAtivo3,
      icone: "mail",
    },
  ];

  function voltarPagina() {
    if (criandoConta) return;

    error(null);
    proximaPagina(2);
  }

  async function finalizarCadastro() {
    if (criandoConta) return;

    error(null);
    setCriandoConta(true);

    const dadosPreferencias = {
      notificationsEnabled: ativo1,
      showEmailOnItems: ativo3,
    };

    try {
      const resultado = await criarConta(dadosPreferencias);

      // Se a função de cadastro retornar false,
      // significa que o cadastro não foi concluído.
      if (resultado === false) return;

      proximaPagina(4);
    } catch (err) {
      console.error("Erro ao finalizar cadastro:", err);

      error(
        err?.message || "Não foi possível criar sua conta. Tente novamente.",
      );
    } finally {
      setCriandoConta(false);
    }
  }

  function IconePreferencia({ tipo }) {
    if (tipo === "bell") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );
    }

    if (tipo === "search") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
          <path d="M8.5 10.8h4.6" />
          <path d="M10.8 8.5v4.6" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    );
  }

  return (
    <div className="preferences">
      <div className="preferences__list">
        {preferencias.map((preferencia) => (
          <div
            className={`preferences__card ${
              preferencia.ativo ? "preferences__card--active" : ""
            }`}
            key={preferencia.id}
          >
            <div className="preferences__card-icon">
              <IconePreferencia tipo={preferencia.icone} />
            </div>

            <div className="preferences__card-content">
              <h3 className="preferences__card-title">{preferencia.titulo}</h3>

              <p className="preferences__card-description">
                {preferencia.descricao}
              </p>
            </div>

            <button
              className={`preferences__switch ${
                preferencia.ativo ? "preferences__switch--active" : ""
              }`}
              type="button"
              role="switch"
              aria-checked={preferencia.ativo}
              aria-label={preferencia.titulo}
              disabled={criandoConta}
              onClick={() => preferencia.alterar((valorAtual) => !valorAtual)}
            >
              <span className="preferences__switch-thumb" />
            </button>
          </div>
        ))}
      </div>

      {/* AVISO */}

      <div className="preferences__notice">
        <div className="preferences__notice-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
          </svg>
        </div>

        <p>
          Você poderá alterar essas preferências posteriormente nas
          configurações da sua conta.
        </p>
      </div>

      {/* BOTÕES */}

      <div className="preferences__buttons">
        <button
          className="register__button__voltar"
          type="button"
          onClick={voltarPagina}
          disabled={criandoConta}
        >
          <img src={tema === "light" ? arrowBlack : arrowWhite} alt="" />

          <span>Voltar</span>
        </button>

        <button
          className="register__button__continuar"
          type="button"
          onClick={finalizarCadastro}
          disabled={criandoConta}
        >
          <span>
            {criandoConta ? "Criando conta..." : "Finalizar cadastro"}
          </span>

          {!criandoConta && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}

          {criandoConta && (
            <span className="preferences__loading" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Preferences;
