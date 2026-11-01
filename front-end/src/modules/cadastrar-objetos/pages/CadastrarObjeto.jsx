import { useEffect, useRef, useState } from "react";
import "./CadastrarObjeto.css";
import cidadesBrasil from "../../../utils/json/cidade-estados.json";
import { categories } from "../../buscar-objetos/buscarObjetos.service.js";
import { cadastrarObjeto } from "../cadastraObjeto.service.js";

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
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
};

const MAX_FOTOS = 6;
const MAX_TAMANHO_FOTO = 5 * 1024 * 1024;

const TIPOS_FOTO_PERMITIDOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function obterDataLocalISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function CadastrarObjeto() {
  const [confirmacaoContatoAberta, setConfirmacaoContatoAberta] =
    useState(false);

  const [cadastrando, setCadastrando] = useState(false);

  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState("");

  const [status, setStatus] = useState("");
  const [nomeObjeto, setNomeObjeto] = useState("");
  const [categoria, setCategoria] = useState("");

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const [descricao, setDescricao] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");

  const [fotos, setFotos] = useState([]);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [erroFotos, setErroFotos] = useState("");

  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const inputFotosRef = useRef(null);
  const previewsCriadasRef = useRef(new Set());
  const dataMaxima = obterDataLocalISO();

  useEffect(() => {
    return () => {
      previewsCriadasRef.current.forEach((url) =>
        URL.revokeObjectURL(url)
      );

      previewsCriadasRef.current.clear();
    };
  }, []);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const resultado = await categories();

        setCategoriasDisponiveis(
          Array.isArray(resultado) ? resultado : []
        );
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);

        setErroCategorias("Não foi possível carregar as categorias.");
      } finally {
        setCarregandoCategorias(false);
      }
    }

    carregarCategorias();
  }, []);

  const estadoSelecionado = cidadesBrasil.estados.find(
    (item) => item.sigla === estado
  );

  const cidadesDisponiveis = estadoSelecionado?.cidades ?? [];

  const bairrosDisponiveis =
    estadoSelecionado?.bairrosPorCidade?.[cidade] ?? [];

  // O backend recebe a localização em um único texto (locationText).
  // O bairro é opcional para municípios sem bairros disponíveis na base.
  const localizacao =
    cidade && estadoSelecionado
      ? `${bairro ? `${bairro}, ` : ""}${cidade} - ${estadoSelecionado.sigla}`
      : "";

  function handleSelecionarFotos(e) {
    const arquivosSelecionados = Array.from(e.target.files ?? []);

    if (arquivosSelecionados.length === 0) return;

    const arquivosValidos = [];
    const problemas = [];

    arquivosSelecionados.forEach((arquivo) => {
      if (!TIPOS_FOTO_PERMITIDOS.has(arquivo.type)) {
        problemas.push("Use imagens JPEG, PNG, WEBP ou GIF.");
        return;
      }

      if (arquivo.size > MAX_TAMANHO_FOTO) {
        problemas.push("Cada imagem pode ter no máximo 5 MB.");
        return;
      }

      arquivosValidos.push(arquivo);
    });

    const vagasDisponiveis = MAX_FOTOS - fotos.length;

    const arquivosAdicionados = arquivosValidos.slice(
      0,
      vagasDisponiveis
    );

    if (arquivosAdicionados.length > 0) {
      const novasFotos = arquivosAdicionados.map((arquivo) => {
        const preview = URL.createObjectURL(arquivo);

        previewsCriadasRef.current.add(preview);

        return { arquivo, preview };
      });

      setFotos((atuais) => [...atuais, ...novasFotos]);
      setErroFotos("");
    }

    if (arquivosValidos.length > vagasDisponiveis) {
      problemas.push(
        `Você pode adicionar no máximo ${MAX_FOTOS} fotos.`
      );
    }

    setErroFotos(problemas.join(" "));
    e.target.value = "";
  }

  function removerFotoAtual() {
    const fotoRemovida = fotos[fotoAtual];

    if (fotoRemovida) {
      URL.revokeObjectURL(fotoRemovida.preview);
      previewsCriadasRef.current.delete(fotoRemovida.preview);
    }

    const fotosAtualizadas = fotos.filter(
      (_, indice) => indice !== fotoAtual
    );

    setFotos(fotosAtualizadas);

    setFotoAtual(
      Math.max(0, Math.min(fotoAtual, fotosAtualizadas.length - 1))
    );

    if (fotosAtualizadas.length === 0) {
      setErroFotos("Adicione pelo menos uma foto do objeto.");
    } else {
      setErroFotos("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (data && data > dataMaxima) return;

    if (fotos.length === 0) {
      setErroFotos("Adicione pelo menos uma foto do objeto.");
      return;
    }

    setMensagemErro("");
    setMensagemSucesso("");
    setConfirmacaoContatoAberta(true);
  }

  async function confirmarCienciaContato() {
    if (cadastrando) return;

    setMensagemErro("");
    setMensagemSucesso("");

    try {
      setCadastrando(true);

      await cadastrarObjeto({
        title: nomeObjeto.trim(),
        type: status === "lost" ? "PERDIDO" : "ENCONTRADO",
        categoryId: categoria,
        localizacao,
        data,
        horario,
        descricao,
        caracteristicas,
        fotos: fotos.map(({ arquivo }) => arquivo),
      });

      // Fecha a tela de ciência e abre a confirmação de sucesso.
      setConfirmacaoContatoAberta(false);
      setMensagemSucesso("Objeto cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar objeto:", error);

      setMensagemErro(
        error.message ||
        "Não foi possível cadastrar o objeto. Tente novamente."
      );
    } finally {
      setCadastrando(false);
    }
  }

  function limparFormulario() {
    // Revoga as URLs temporárias das imagens.
    previewsCriadasRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    previewsCriadasRef.current.clear();

    // Limpa os campos do formulário.
    setStatus("");
    setNomeObjeto("");
    setCategoria("");
    setEstado("");
    setCidade("");
    setBairro("");
    setData("");
    setHorario("");
    setDescricao("");
    setCaracteristicas("");

    // Limpa as fotos.
    setFotos([]);
    setFotoAtual(0);
    setErroFotos("");

    if (inputFotosRef.current) {
      inputFotosRef.current.value = "";
    }

    // Fecha a confirmação de sucesso.
    setMensagemSucesso("");
    setMensagemErro("");
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
          <label
            className={`option ${status === "lost" ? "option--active" : ""
              }`}
          >
            <input
              type="radio"
              name="status"
              value="lost"
              checked={status === "lost"}
              onChange={() => setStatus("lost")}
              required
            />

            <span className="option__icon option__icon--blue">
              <Icon>{icons.briefcase}</Icon>
            </span>

            <span>
              <strong className="option__title">
                Perdi um objeto
              </strong>

              <span className="option__desc">
                Meu objeto foi perdido.
              </span>
            </span>
          </label>

          <label
            className={`option ${status === "found" ? "option--active" : ""
              }`}
          >
            <input
              type="radio"
              name="status"
              value="found"
              checked={status === "found"}
              onChange={() => setStatus("found")}
              required
            />

            <span className="option__icon option__icon--green">
              <Icon>{icons.handHeart}</Icon>
            </span>

            <span>
              <strong className="option__title">
                Encontrei um objeto
              </strong>

              <span className="option__desc">
                Encontrei um objeto e quero devolver.
              </span>
            </span>
          </label>
        </div>

        {/* ---------- Tipo e Categoria ---------- */}
        <div className="grid grid--2">
          <div className="field">
            <label htmlFor="nomeObjeto">Nome do objeto</label>

            <div className="control">
              <Icon>{icons.search}</Icon>

              <input
                id="nomeObjeto"
                name="title"
                type="text"
                placeholder="Ex.: Carteira preta, Samsung Galaxy..."
                value={nomeObjeto}
                onChange={(e) => setNomeObjeto(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="categoria">Categoria</label>

            <div className="control">
              <Icon>{icons.grid}</Icon>

              <select
                id="categoria"
                name="categoryId"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                disabled={carregandoCategorias || !!erroCategorias}
              >
                <option value="" disabled>
                  {carregandoCategorias
                    ? "Carregando categorias..."
                    : "Selecione a categoria"}
                </option>

                {categoriasDisponiveis.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">
                {icons.chevron}
              </Icon>
            </div>

            {erroCategorias && (
              <small role="alert">{erroCategorias}</small>
            )}
          </div>
        </div>

        {/* ---------- Localização: Estado, Cidade e Bairro ---------- */}
        <div className="grid grid--3">
          <div className="field">
            <label htmlFor="estado">Estado</label>

            <div className="control">
              <Icon>{icons.pin}</Icon>

              <select
                id="estado"
                value={estado}
                required
                onChange={(e) => {
                  setEstado(e.target.value);
                  setCidade("");
                  setBairro("");
                }}
              >
                <option value="" disabled>
                  Selecione o estado
                </option>

                {cidadesBrasil.estados.map((item) => (
                  <option key={item.sigla} value={item.sigla}>
                    {item.nome}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">
                {icons.chevron}
              </Icon>
            </div>
          </div>

          <div className="field">
            <label htmlFor="cidade">Cidade</label>

            <div className="control">
              <Icon>{icons.pin}</Icon>

              <select
                id="cidade"
                value={cidade}
                disabled={!estado}
                required
                onChange={(e) => {
                  setCidade(e.target.value);
                  setBairro("");
                }}
              >
                <option value="" disabled>
                  {estado
                    ? "Selecione a cidade"
                    : "Selecione primeiro o estado"}
                </option>

                {cidadesDisponiveis.map((nomeCidade) => (
                  <option key={nomeCidade} value={nomeCidade}>
                    {nomeCidade}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">
                {icons.chevron}
              </Icon>
            </div>
          </div>

          <div className="field">
            <label htmlFor="bairro">Bairro</label>

            <div className="control">
              <Icon>{icons.pin}</Icon>

              <select
                id="bairro"
                value={bairro}
                disabled={!cidade || bairrosDisponiveis.length === 0}
                onChange={(e) => setBairro(e.target.value)}
              >
                <option value="" disabled>
                  {!cidade
                    ? "Selecione primeiro a cidade"
                    : bairrosDisponiveis.length === 0
                      ? "Sem bairros disponíveis"
                      : "Selecione o bairro"}
                </option>

                {bairrosDisponiveis.map((nomeBairro) => (
                  <option key={nomeBairro} value={nomeBairro}>
                    {nomeBairro}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">
                {icons.chevron}
              </Icon>
            </div>

            {cidade && bairrosDisponiveis.length === 0 && (
              <small>
                Não há bairros disponíveis para esta cidade. A localização será registrada com cidade e estado.
              </small>
            )}
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
                lang="pt-BR"
                max={dataMaxima}
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
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
                lang="pt-BR"
                step="60"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* ---------- Fotos do objeto ---------- */}
        <div className="field">
          <span className="field__label">
            Fotos do objeto (mínimo 1 e máximo 6)
          </span>

          <input
            ref={inputFotosRef}
            id="fotos"
            className="upload__input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleSelecionarFotos}
          />

          {fotos.length === 0 ? (
            <label className="upload" htmlFor="fotos">
              <span className="upload__icon">
                <Icon>{icons.upload}</Icon>
              </span>

              <span>
                <strong>
                  Clique para selecionar as fotos do objeto
                </strong>

                <small>
                  JPEG, PNG, WEBP ou GIF. Até 5 MB por foto.
                </small>
              </span>
            </label>
          ) : (
            <div className="photo-carousel">
              <div className="photo-carousel__stage">
                <img
                  className="photo-carousel__image"
                  src={fotos[fotoAtual]?.preview}
                  alt={`Foto ${fotoAtual + 1} do objeto`}
                />

                {fotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="photo-carousel__arrow photo-carousel__arrow--previous"
                      aria-label="Ver foto anterior"
                      onClick={() =>
                        setFotoAtual(
                          (indice) =>
                            (indice - 1 + fotos.length) % fotos.length
                        )
                      }
                    >
                      <Icon>{icons.chevronLeft}</Icon>
                    </button>

                    <button
                      type="button"
                      className="photo-carousel__arrow photo-carousel__arrow--next"
                      aria-label="Ver próxima foto"
                      onClick={() =>
                        setFotoAtual(
                          (indice) => (indice + 1) % fotos.length
                        )
                      }
                    >
                      <Icon>{icons.chevronRight}</Icon>
                    </button>
                  </>
                )}

                <span className="photo-carousel__counter">
                  {fotoAtual + 1} / {fotos.length}
                </span>

                <button
                  type="button"
                  className="photo-carousel__remove"
                  aria-label="Remover foto selecionada"
                  onClick={removerFotoAtual}
                >
                  <Icon>{icons.trash}</Icon>
                  <span>Remover</span>
                </button>
              </div>

              <div className="photo-carousel__footer">
                <span className="photo-carousel__summary">
                  {fotos.length} de {MAX_FOTOS} fotos selecionadas
                </span>

                <button
                  type="button"
                  className="btn btn--outline photo-carousel__add"
                  onClick={() => inputFotosRef.current?.click()}
                  disabled={fotos.length >= MAX_FOTOS}
                >
                  <Icon>{icons.plus}</Icon>
                  Adicionar fotos
                </button>
              </div>
            </div>
          )}

          {erroFotos && (
            <small className="upload__error" role="alert">
              {erroFotos}
            </small>
          )}
        </div>

        {/* ---------- Descrição ---------- */}
        <div className="field">
          <label htmlFor="descricao">Descreva o objeto</label>

          <div className="textarea">
            <textarea
              id="descricao"
              maxLength={100}
              placeholder="Descreva o objeto com o máximo de detalhes possível..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />

            <span className="textarea__counter">
              {descricao.length}/100
            </span>
          </div>
        </div>

        {/* ---------- Características ---------- */}
        <div className="field">
          <label htmlFor="caracteristicas">
            Alguma característica específica?{" "}
            <span className="optional">(opcional)</span>
          </label>

          <div className="textarea">
            <textarea
              id="caracteristicas"
              maxLength={50}
              placeholder="Ex.: cor, marcas, logo, avarias, número de série, etc."
              value={caracteristicas}
              onChange={(e) => setCaracteristicas(e.target.value)}
            />

            <span className="textarea__counter">
              {caracteristicas.length}/50
            </span>
          </div>
        </div>

        {/* ---------- Botões ---------- */}
        <div className="actions">
          <button
            type="button"
            className="btn btn--outline btn--lg"
            onClick={limparFormulario}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn--primary btn--lg"
          >
            Cadastrar objeto
            <Icon>{icons.arrowRight}</Icon>
          </button>
        </div>
      </form>

      {/* ---------- Modal original de ciência dos termos ---------- */}
      {confirmacaoContatoAberta && (
        <div className="confirmation-overlay">
          <section
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-busy={cadastrando}
          >
            <div className="confirmation-modal__icon">
              <Icon>{icons.shield}</Icon>
            </div>

            <h2 id="confirmation-title">
              Antes de publicar seu objeto
            </h2>

            <p>
              Você está ciente de que outras pessoas poderão ter
              informações sobre o objeto cadastrado e poderão entrar
              em contato com você por meio das informações
              disponibilizadas na plataforma?
            </p>

            <p className="confirmation-modal__notice">
              Ao continuar, você confirma que está ciente dessa possibilidade.
            </p>

            {mensagemErro && (
              <p
                className="cadastro-feedback cadastro-feedback--erro"
                role="alert"
              >
                {mensagemErro}
              </p>
            )}

            <div className="confirmation-modal__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setConfirmacaoContatoAberta(false)}
                disabled={cadastrando}
              >
                Voltar e revisar cadastro
              </button>

              <button
                type="button"
                className="btn btn--primary"
                onClick={confirmarCienciaContato}
                disabled={cadastrando}
              >
                {cadastrando
                  ? "Publicando..."
                  : "Estou ciente, continuar"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ---------- Segunda tela: cadastro concluído ---------- */}
      {mensagemSucesso && (
        <div className="confirmation-overlay">
          <section
            className="confirmation-modal confirmation-modal--success"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
          >
            <div className="confirmation-modal__icon">
              <Icon>{icons.shield}</Icon>
            </div>

            <h2 id="success-title">
              Objeto cadastrado com sucesso!
            </h2>

            <p>
              Seu objeto foi publicado e já está disponível na plataforma.
            </p>

            <div className="confirmation-modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={limparFormulario}
              >
                Concluir
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}