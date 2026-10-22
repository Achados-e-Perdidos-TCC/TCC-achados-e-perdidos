import { useState } from "react";
import "./CadastrarObjeto.css";

function Icon({ children, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const icons = {
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <path d="M2 13h20" />
    </>
  ),
  handHeart: (
    <>
      <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
      <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 15 6 6" />
      <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  upload: (
    <>
      <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

export default function CadastrarObjeto() {
  const [status, setStatus] = useState("lost"); // "lost" | "found"
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [descricao, setDescricao] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // evita recarregar a página
    console.log({
      status,
      tipo,
      categoria,
      localizacao,
      data,
      horario,
      descricao,
      caracteristicas,
    });
  }

  return (
    <main className="cadastrar-page">
      <h1 className="page__title">Cadastrar objeto</h1>
      <p className="page__subtitle">
        Conte alguns detalhes para ajudarmos a encontrar uma possível correspondência.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        {/* ---------- O que aconteceu? ---------- */}
        <h2 className="card__heading">O que aconteceu?</h2>

        <div className="options">
          <label className={`option ${status === "lost" ? "option--active" : ""}`}>
            <input
              type="radio"
              name="status"
              value="lost"
              checked={status === "lost"}
              onChange={() => setStatus("lost")}
            />
            <span className="option__icon option__icon--blue">
              <Icon>{icons.briefcase}</Icon>
            </span>
            <span>
              <strong className="option__title">Perdi um objeto</strong>
              <span className="option__desc">Meu objeto foi perdido.</span>
            </span>
          </label>

          <label className={`option ${status === "found" ? "option--active" : ""}`}>
            <input
              type="radio"
              name="status"
              value="found"
              checked={status === "found"}
              onChange={() => setStatus("found")}
            />
            <span className="option__icon option__icon--green">
              <Icon>{icons.handHeart}</Icon>
            </span>
            <span>
              <strong className="option__title">Encontrei um objeto</strong>
              <span className="option__desc">
                Encontrei um objeto e quero devolver.
              </span>
            </span>
          </label>
        </div>

        {/* ---------- Tipo, Categoria, Localização ---------- */}
        <div className="grid grid--3">
          <div className="field">
            <label htmlFor="tipo">Tipo de objeto</label>
            <div className="control">
              <Icon>{icons.search}</Icon>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="" disabled>Selecione o tipo de objeto</option>
                <option value="carteira">Carteira</option>
                <option value="celular">Celular</option>
                <option value="chaves">Chaves</option>
              </select>
              <Icon className="control__chevron">{icons.chevron}</Icon>
            </div>
          </div>

          <div className="field">
            <label htmlFor="categoria">Categoria</label>
            <div className="control">
              <Icon>{icons.grid}</Icon>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="" disabled>Selecione a categoria</option>
                <option value="documentos">Documentos</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="acessorios">Acessórios</option>
              </select>
              <Icon className="control__chevron">{icons.chevron}</Icon>
            </div>
          </div>

          <div className="field">
            <label htmlFor="localizacao">Localização</label>
            <div className="control">
              <Icon>{icons.pin}</Icon>
              <input
                id="localizacao"
                type="text"
                placeholder="Ex.: São Paulo, Centro..."
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ---------- Data e Horário ---------- */}
        <div className="grid grid--2">
          <div className="field">
            <label htmlFor="data">Data</label>
            <div className="control">
              <Icon>{icons.calendar}</Icon>
              <input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="horario">Horário</label>
            <div className="control">
              <Icon>{icons.clock}</Icon>
              <input
                id="horario"
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ---------- Upload da foto ---------- */}
        <div className="field">
          <span className="field__label">Adicione uma foto do objeto</span>
          <label className="upload">
            <input type="file" accept="image/png, image/jpeg" hidden />
            <span className="upload__icon">
              <Icon>{icons.upload}</Icon>
            </span>
            <span>
              <strong>Arraste uma imagem ou clique para selecionar</strong>
              <small>Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB</small>
            </span>
          </label>
        </div>

        {/* ---------- Descrição ---------- */}
        <div className="field">
          <label htmlFor="descricao">Descreva o objeto</label>
          <div className="textarea">
            <textarea
              id="descricao"
              maxLength={500}
              placeholder="Descreva o objeto com o máximo de detalhes possível..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <span className="textarea__counter">{descricao.length}/500</span>
          </div>
        </div>

        {/* ---------- Características ---------- */}
        <div className="field">
          <label htmlFor="caracteristicas">
            Alguma característica específica? <span className="optional">(opcional)</span>
          </label>
          <div className="textarea">
            <textarea
              id="caracteristicas"
              maxLength={300}
              placeholder="Ex.: cor, marcas, logo, avarias, número de série, etc."
              value={caracteristicas}
              onChange={(e) => setCaracteristicas(e.target.value)}
            />
            <span className="textarea__counter">{caracteristicas.length}/300</span>
          </div>
        </div>

        {/* ---------- Botões ---------- */}
        <div className="actions">
          <button type="button" className="btn btn--outline btn--lg">
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary btn--lg">
            Cadastrar objeto
            <Icon>{icons.arrowRight}</Icon>
          </button>
        </div>
      </form>
    </main>
  );
}