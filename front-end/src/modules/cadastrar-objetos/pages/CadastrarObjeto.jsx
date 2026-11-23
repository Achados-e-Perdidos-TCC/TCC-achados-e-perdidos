import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./CadastrarObjeto.css";

import cidadesBrasil from "../../../utils/json/cidade-estados.json";
import { categories } from "../../buscar-objetos/buscarObjetos.service.js";
import { cadastrarObjeto } from "../cadastraObjeto.service.js";

function Icon({ children, className = "" }) {
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
  const { t } = useTranslation();

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

  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState("");

  const [fotos, setFotos] = useState([]);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [erroFotos, setErroFotos] = useState("");

  const [cadastrando, setCadastrando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erroData, setErroData] = useState("");

  const [confirmacaoContatoAberta, setConfirmacaoContatoAberta] =
    useState(false);

  const inputFotosRef = useRef(null);
  const modalConfirmacaoRef = useRef(null);
  const modalSucessoRef = useRef(null);

  const previewsCriadasRef = useRef(new Set());

  const dataMaxima = obterDataLocalISO();

  const estadoSelecionado = cidadesBrasil.estados.find(
    (item) => item.sigla === estado,
  );

  const cidadesDisponiveis = estadoSelecionado?.cidades ?? [];

  const bairrosDisponiveis =
    estadoSelecionado?.bairrosPorCidade?.[cidade] ?? [];

  useEffect(() => {
    return () => {
      previewsCriadasRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewsCriadasRef.current.clear();
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      try {
        const resultado = await categories();

        if (!ativo) return;

        setCategoriasDisponiveis(Array.isArray(resultado) ? resultado : []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);

        if (ativo) {
          setErroCategorias(t("errors.categoriesLoad"));
        }
      } finally {
        if (ativo) {
          setCarregandoCategorias(false);
        }
      }
    }

    carregarCategorias();

    return () => {
      ativo = false;
    };
  }, [t]);

  const modalAberto = confirmacaoContatoAberta || Boolean(mensagemSucesso);

  useEffect(() => {
    if (!modalAberto) return;

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const modalAtivo = mensagemSucesso
      ? modalSucessoRef.current
      : modalConfirmacaoRef.current;

    const primeiroBotao = modalAtivo?.querySelector("button");

    primeiroBotao?.focus();

    function handleEscape(event) {
      if (event.key !== "Escape") return;

      if (confirmacaoContatoAberta && !cadastrando) {
        setConfirmacaoContatoAberta(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modalAberto, confirmacaoContatoAberta, mensagemSucesso, cadastrando]);

  function handleSelecionarFotos(event) {
    const arquivosSelecionados = Array.from(event.target.files ?? []);

    if (arquivosSelecionados.length === 0) return;

    const arquivosValidos = [];
    const problemas = [];

    arquivosSelecionados.forEach((arquivo) => {
      if (!TIPOS_FOTO_PERMITIDOS.has(arquivo.type)) {
        problemas.push(t("form.errors.invalidFileType"));
        return;
      }

      if (arquivo.size > MAX_TAMANHO_FOTO) {
        problemas.push(t("form.errors.fileTooLarge"));
        return;
      }

      arquivosValidos.push(arquivo);
    });

    const vagasDisponiveis = MAX_FOTOS - fotos.length;

    const arquivosAdicionados = arquivosValidos.slice(0, vagasDisponiveis);

    if (arquivosAdicionados.length > 0) {
      const novasFotos = arquivosAdicionados.map((arquivo) => {
        const preview = URL.createObjectURL(arquivo);

        previewsCriadasRef.current.add(preview);

        return {
          arquivo,
          preview,
        };
      });

      setFotos((atuais) => [...atuais, ...novasFotos]);
      setErroFotos("");
    }

    if (arquivosValidos.length > vagasDisponiveis) {
      problemas.push(t("form.errors.maxPhotos", { max: MAX_FOTOS }));
    }

    if (arquivosAdicionados.length === 0 && problemas.length === 0) {
      problemas.push(t("form.errors.couldNotAdd"));
    }

    setErroFotos(problemas.join(" "));
    event.target.value = "";
  }

  function removerFotoAtual() {
    const fotoRemovida = fotos[fotoAtual];

    if (!fotoRemovida) return;

    URL.revokeObjectURL(fotoRemovida.preview);
    previewsCriadasRef.current.delete(fotoRemovida.preview);

    const fotosAtualizadas = fotos.filter((_, indice) => indice !== fotoAtual);

    setFotos(fotosAtualizadas);

    setFotoAtual((indiceAtual) => {
      if (fotosAtualizadas.length === 0) return 0;

      return Math.min(indiceAtual, fotosAtualizadas.length - 1);
    });

    setErroFotos(
      fotosAtualizadas.length === 0 ? t("form.errors.minOnePhoto") : "",
    );
  }

  function abrirSeletorFotos() {
    inputFotosRef.current?.click();
  }

  function navegarFotos(direcao) {
    setFotoAtual((indiceAtual) => {
      if (direcao === "anterior") {
        return (indiceAtual - 1 + fotos.length) % fotos.length;
      }

      return (indiceAtual + 1) % fotos.length;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMensagemErro("");
    setErroData("");

    if (data && data > dataMaxima) {
      setErroData(t("form.errors.futureDate"));
      return;
    }

    if (
      !status ||
      !nomeObjeto.trim() ||
      !categoria ||
      !estado ||
      !cidade ||
      !data ||
      !horario ||
      !descricao.trim()
    ) {
      setMensagemErro(t("form.errors.reviewRequired"));
      return;
    }

    if (erroCategorias || carregandoCategorias) {
      setMensagemErro(t("form.errors.waitCategories"));
      return;
    }

    if (fotos.length === 0) {
      setErroFotos(t("form.errors.minOnePhoto"));
      return;
    }

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
        estado: estadoSelecionado.sigla,
        cidade,
        bairro: bairro || null,
        data,
        horario,
        descricao,
        caracteristicas,
        fotos: fotos.map(({ arquivo }) => arquivo),
      });

      setConfirmacaoContatoAberta(false);
      setMensagemSucesso(t("form.success.title"));
    } catch (error) {
      console.error("Erro ao cadastrar objeto:", error);

      setMensagemErro(error.message || t("form.errors.submitFailed"));
    } finally {
      setCadastrando(false);
    }
  }

  function limparFormulario() {
    previewsCriadasRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    previewsCriadasRef.current.clear();

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

    setFotos([]);
    setFotoAtual(0);
    setErroFotos("");

    setErroData("");
    setMensagemErro("");
    setMensagemSucesso("");
    setConfirmacaoContatoAberta(false);

    if (inputFotosRef.current) {
      inputFotosRef.current.value = "";
    }
  }

  return (
    <main className="cadastrar-page">
      <header className="cadastrar-page__header">
        <h1 className="page__title">{t("form.title")}</h1>

        <p className="page__subtitle">{t("form.subtitle")}</p>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <section className="form-section">
          <h2 className="card__heading">{t("form.whatHappened")}</h2>

          <div className="options">
            <label
              className={`option ${status === "lost" ? "option--active" : ""}`}
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

              <span className="option__content">
                <strong className="option__title">{t("form.lostTitle")}</strong>

                <span className="option__desc">
                  {t("form.lostDescription")}
                </span>
              </span>
            </label>

            <label
              className={`option ${status === "found" ? "option--active" : ""}`}
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

              <span className="option__content">
                <strong className="option__title">
                  {t("form.foundTitle")}
                </strong>

                <span className="option__desc">
                  {t("form.foundDescription")}
                </span>
              </span>
            </label>
          </div>
        </section>

        <div className="grid grid--2">
          <div className="field">
            <label htmlFor="nomeObjeto">{t("form.itemName")}</label>

            <div className="control">
              <Icon>{icons.search}</Icon>

              <input
                id="nomeObjeto"
                name="title"
                type="text"
                placeholder={t("form.itemNamePlaceholder")}
                value={nomeObjeto}
                onChange={(event) => setNomeObjeto(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="categoria">{t("common.category")}</label>

            <div className="control">
              <Icon>{icons.grid}</Icon>

              <select
                id="categoria"
                name="categoryId"
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                required
                disabled={carregandoCategorias || Boolean(erroCategorias)}
              >
                <option value="" disabled>
                  {carregandoCategorias
                    ? t("form.loadingCategories")
                    : t("form.selectCategory")}
                </option>

                {categoriasDisponiveis.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">{icons.chevron}</Icon>
            </div>

            {erroCategorias && (
              <small className="field__error" role="alert">
                {erroCategorias}
              </small>
            )}
          </div>
        </div>

        <div className="grid grid--3">
          <div className="field">
            <label htmlFor="estado">{t("common.state")}</label>

            <div className="control">
              <Icon>{icons.pin}</Icon>

              <select
                id="estado"
                value={estado}
                required
                onChange={(event) => {
                  setEstado(event.target.value);
                  setCidade("");
                  setBairro("");
                }}
              >
                <option value="" disabled>
                  {t("form.selectState")}
                </option>

                {cidadesBrasil.estados.map((item) => (
                  <option key={item.sigla} value={item.sigla}>
                    {item.nome}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">{icons.chevron}</Icon>
            </div>
          </div>

          <div className="field">
            <label htmlFor="cidade">{t("common.city")}</label>

            <div className="control">
              <Icon>{icons.pin}</Icon>

              <select
                id="cidade"
                value={cidade}
                disabled={!estado}
                required
                onChange={(event) => {
                  setCidade(event.target.value);
                  setBairro("");
                }}
              >
                <option value="" disabled>
                  {estado ? t("form.selectCity") : t("form.selectStateFirst")}
                </option>

                {cidadesDisponiveis.map((nomeCidade) => (
                  <option key={nomeCidade} value={nomeCidade}>
                    {nomeCidade}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">{icons.chevron}</Icon>
            </div>
          </div>

          <div className="field">
            <label htmlFor="bairro">
              {t("common.neighborhood")}{" "}
              <span className="optional">{t("common.optional")}</span>
            </label>

            <div className="control">
              <Icon>{icons.pin}</Icon>

              <select
                id="bairro"
                value={bairro}
                disabled={!cidade || bairrosDisponiveis.length === 0}
                onChange={(event) => setBairro(event.target.value)}
              >
                <option value="">
                  {!cidade
                    ? t("form.selectCityFirst")
                    : bairrosDisponiveis.length === 0
                      ? t("form.noNeighborhoods")
                      : t("form.selectNeighborhood")}
                </option>

                {bairrosDisponiveis.map((nomeBairro) => (
                  <option key={nomeBairro} value={nomeBairro}>
                    {nomeBairro}
                  </option>
                ))}
              </select>

              <Icon className="control__chevron">{icons.chevron}</Icon>
            </div>

            {cidade && bairrosDisponiveis.length === 0 && (
              <small className="field__hint">
                {t("form.noNeighborhoodsHint")}
              </small>
            )}
          </div>
        </div>

        <div className="grid grid--2">
          <div className="field">
            <label htmlFor="data">{t("common.date")}</label>

            <div className={`control ${erroData ? "control--error" : ""}`}>
              <Icon>{icons.calendar}</Icon>

              <input
                id="data"
                type="date"
                lang="pt-BR"
                max={dataMaxima}
                value={data}
                onChange={(event) => {
                  setData(event.target.value);
                  setErroData("");
                }}
                required
              />
            </div>

            {erroData && (
              <small className="field__error" role="alert">
                {erroData}
              </small>
            )}
          </div>

          <div className="field">
            <label htmlFor="horario">{t("common.time")}</label>

            <div className="control">
              <Icon>{icons.clock}</Icon>

              <input
                id="horario"
                type="time"
                lang="pt-BR"
                step="60"
                value={horario}
                onChange={(event) => setHorario(event.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <section className="field">
          <div className="field__heading">
            <label htmlFor="fotos">{t("form.photos")}</label>

            <span className="field__hint">{t("form.photosHint")}</span>
          </div>

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

              <span className="upload__content">
                <strong>{t("form.uploadCta")}</strong>

                <small>{t("form.uploadHint")}</small>
              </span>
            </label>
          ) : (
            <div className="photo-carousel">
              <div className="photo-carousel__stage">
                <img
                  className="photo-carousel__image"
                  src={fotos[fotoAtual]?.preview}
                  alt={t("form.photoAlt", { n: fotoAtual + 1 })}
                />

                {fotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="photo-carousel__arrow photo-carousel__arrow--previous"
                      aria-label={t("form.previousPhoto")}
                      onClick={() => navegarFotos("anterior")}
                    >
                      <Icon>{icons.chevronLeft}</Icon>
                    </button>

                    <button
                      type="button"
                      className="photo-carousel__arrow photo-carousel__arrow--next"
                      aria-label={t("form.nextPhoto")}
                      onClick={() => navegarFotos("proxima")}
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
                  aria-label={t("form.removeSelectedPhoto")}
                  onClick={removerFotoAtual}
                >
                  <Icon>{icons.trash}</Icon>
                  <span>{t("common.remove")}</span>
                </button>
              </div>

              <div className="photo-carousel__footer">
                <span className="photo-carousel__summary">
                  {t("form.selectedCount", {
                    count: fotos.length,
                    max: MAX_FOTOS,
                  })}
                </span>

                <button
                  type="button"
                  className="btn btn--outline photo-carousel__add"
                  onClick={abrirSeletorFotos}
                  disabled={fotos.length >= MAX_FOTOS}
                >
                  <Icon>{icons.plus}</Icon>
                  {t("form.addPhotos")}
                </button>
              </div>
            </div>
          )}

          {erroFotos && (
            <small className="field__error" role="alert">
              {erroFotos}
            </small>
          )}
        </section>

        <div className="field">
          <label htmlFor="descricao">{t("form.describeItem")}</label>

          <div className="textarea">
            <textarea
              id="descricao"
              maxLength={500}
              placeholder={t("form.describePlaceholder")}
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              required
            />

            <span className="textarea__counter">{descricao.length}/500</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="caracteristicas">
            {t("form.features")}{" "}
            <span className="optional">{t("common.optional")}</span>
          </label>

          <div className="textarea">
            <textarea
              id="caracteristicas"
              maxLength={100}
              placeholder={t("form.featuresPlaceholder")}
              value={caracteristicas}
              onChange={(event) => setCaracteristicas(event.target.value)}
            />

            <span className="textarea__counter">
              {caracteristicas.length}/100
            </span>
          </div>
        </div>

        {mensagemErro && (
          <p className="cadastro-feedback cadastro-feedback--erro" role="alert">
            {mensagemErro}
          </p>
        )}

        <div className="actions">
          <button
            type="button"
            className="btn btn--outline btn--lg"
            onClick={limparFormulario}
          >
            {t("common.cancel")}
          </button>

          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={cadastrando}
          >
            {t("form.submit")}
            <Icon>{icons.arrowRight}</Icon>
          </button>
        </div>
      </form>

      {confirmacaoContatoAberta && (
        <div className="confirmation-overlay">
          <section
            ref={modalConfirmacaoRef}
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
            aria-busy={cadastrando}
          >
            <div className="confirmation-modal__icon">
              <Icon>{icons.shield}</Icon>
            </div>

            <h2 id="confirmation-title">{t("form.confirm.title")}</h2>

            <p id="confirmation-description">{t("form.confirm.text")}</p>

            <p className="confirmation-modal__notice">
              {t("form.confirm.notice")}
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
                {t("form.confirm.backToReview")}
              </button>

              <button
                type="button"
                className="btn btn--primary"
                onClick={confirmarCienciaContato}
                disabled={cadastrando}
              >
                {cadastrando
                  ? t("form.confirm.publishing")
                  : t("form.confirm.confirm")}
              </button>
            </div>
          </section>
        </div>
      )}

      {mensagemSucesso && (
        <div className="confirmation-overlay">
          <section
            ref={modalSucessoRef}
            className="confirmation-modal confirmation-modal--success"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            aria-describedby="success-description"
          >
            <div className="confirmation-modal__icon">
              <Icon>{icons.shield}</Icon>
            </div>

            <h2 id="success-title">{t("form.success.title")}</h2>

            <p id="success-description">{t("form.success.text")}</p>

            <div className="confirmation-modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={limparFormulario}
              >
                {t("common.finish")}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
