import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { findOwnedObject } from "../../private.service.js";
import { categories } from "../../../buscar-objetos/buscarObjetos.service.js";

import cidadesBrasil from "../../../../utils/json/cidade-estados.json";
import { resolverUrlImagem } from "../../../../utils/images/urlImagem.js";

import { atualizarObjeto, excluirObjeto } from "../editarObjeto.service.js";

import "../../../cadastrar-objetos/pages/CadastrarObjeto.css";
import "./EditarObjeto.css";

const MAX_FOTOS = 6;
const MAX_TAMANHO_FOTO = 5 * 1024 * 1024;

const TIPOS_FOTO_PERMITIDOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const FORMULARIO_INICIAL = {
  tipo: "",
  nomeObjeto: "",
  categoriaId: "",
  estado: "",
  cidade: "",
  bairro: "",
  data: "",
  horario: "",
  descricao: "",
  caracteristicas: "",
  fotosExistentes: [],
};

function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function ModalConfirmacao({
  tipo = "normal",
  titulo,
  descricao,
  aviso,
  erro,
  carregando = false,
  textoCancelar,
  textoConfirmar,
  onCancelar,
  onConfirmar,
}) {
  const { t } = useTranslation();

  return (
    <div className="confirmation-overlay">
      <section
        className={`confirmation-modal confirmation-modal--${tipo}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-busy={carregando}
      >
        <div className="confirmation-modal__icon">
          {tipo === "danger" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m19 6-1 14H6L5 6" />
              <path d="M10 11v5" />
              <path d="M14 11v5" />
            </svg>
          ) : tipo === "success" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          )}
        </div>

        <h2 id="confirmation-title">{titulo}</h2>

        <p>{descricao}</p>

        {aviso && <p className="confirmation-modal__notice">{aviso}</p>}

        {erro && (
          <p className="cadastro-feedback cadastro-feedback--erro" role="alert">
            {erro}
          </p>
        )}

        <div className="confirmation-modal__actions">
          {onCancelar && (
            <button
              type="button"
              className="btn btn--outline"
              onClick={onCancelar}
              disabled={carregando}
            >
              {textoCancelar ?? t("common.cancel")}
            </button>
          )}

          {onConfirmar && (
            <button
              type="button"
              className={`btn ${tipo === "danger" ? "btn--danger" : "btn--primary"}`}
              onClick={onConfirmar}
              disabled={carregando}
            >
              {carregando ? t("edit.wait") : textoConfirmar}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function EditarObjeto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const inputFotosRef = useRef(null);
  const previewsCriadasRef = useRef(new Set());

  const [objeto, setObjeto] = useState(null);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);

  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);

  const [fotosNovas, setFotosNovas] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const [erro, setErro] = useState("");
  const [erroCategoria, setErroCategoria] = useState("");
  const [erroFotos, setErroFotos] = useState("");
  const [erroExclusao, setErroExclusao] = useState("");

  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  const estadoSelecionado = cidadesBrasil.estados.find(
    (item) => item.sigla === formulario.estado,
  );

  const cidadesDisponiveis = estadoSelecionado?.cidades ?? [];

  const bairrosDisponiveis =
    estadoSelecionado?.bairrosPorCidade?.[formulario.cidade] ?? [];

  const totalFotos = formulario.fotosExistentes.length + fotosNovas.length;

  const vagasDisponiveis = MAX_FOTOS - totalFotos;

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function liberarPreviews() {
    previewsCriadasRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    previewsCriadasRef.current.clear();
  }

  function handleSelecionarFotos(evento) {
    const arquivosSelecionados = Array.from(evento.target.files ?? []);

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

    const quantidadeDisponivel = Math.max(
      0,
      MAX_FOTOS - formulario.fotosExistentes.length - fotosNovas.length,
    );

    const arquivosAdicionados = arquivosValidos.slice(0, quantidadeDisponivel);

    if (arquivosAdicionados.length > 0) {
      const novasFotos = arquivosAdicionados.map((arquivo) => {
        const preview = URL.createObjectURL(arquivo);

        previewsCriadasRef.current.add(preview);

        return {
          arquivo,
          preview,
        };
      });

      setFotosNovas((atuais) => [...atuais, ...novasFotos]);
    }

    if (arquivosValidos.length > arquivosAdicionados.length) {
      problemas.push(t("form.errors.maxPhotos", { max: MAX_FOTOS }));
    }

    setErroFotos(problemas.join(" "));

    // Permite selecionar novamente o mesmo arquivo.
    evento.target.value = "";
  }

  function removerFotoExistente(indice) {
    const fotosAtualizadas = formulario.fotosExistentes.filter(
      (_, i) => i !== indice,
    );

    setFormulario((atual) => ({
      ...atual,
      fotosExistentes: fotosAtualizadas,
    }));

    const quantidadeRestante = fotosAtualizadas.length + fotosNovas.length;

    setErroFotos(quantidadeRestante === 0 ? t("form.errors.minOnePhoto") : "");
  }

  function removerFotoNova(preview) {
    URL.revokeObjectURL(preview);
    previewsCriadasRef.current.delete(preview);

    const fotosAtualizadas = fotosNovas.filter(
      (foto) => foto.preview !== preview,
    );

    setFotosNovas(fotosAtualizadas);

    const quantidadeRestante =
      formulario.fotosExistentes.length + fotosAtualizadas.length;

    setErroFotos(quantidadeRestante === 0 ? t("form.errors.minOnePhoto") : "");
  }

  function validarFormulario() {
    setMensagemErro("");
    setErroFotos("");

    if (!formulario.nomeObjeto.trim()) {
      setMensagemErro(t("edit.errors.nameRequired"));
      return false;
    }

    if (!formulario.categoriaId) {
      setMensagemErro(t("edit.errors.categoryRequired"));
      return false;
    }

    if (!formulario.estado || !formulario.cidade) {
      setMensagemErro(t("edit.errors.locationRequired"));
      return false;
    }

    if (!formulario.data || !formulario.horario) {
      setMensagemErro(t("edit.errors.dateRequired"));
      return false;
    }

    if (!formulario.descricao.trim()) {
      setMensagemErro(t("edit.errors.descriptionRequired"));
      return false;
    }

    if (totalFotos === 0) {
      setErroFotos(t("form.errors.minOnePhoto"));
      return false;
    }

    if (totalFotos > MAX_FOTOS) {
      setErroFotos(t("edit.errors.photoLimit", { max: MAX_FOTOS }));
      return false;
    }

    const estadoAtual = cidadesBrasil.estados.find(
      (item) => item.sigla === formulario.estado,
    );

    if (!estadoAtual) {
      setMensagemErro(t("edit.errors.invalidState"));
      return false;
    }

    return true;
  }

  function handleSolicitarSalvar(evento) {
    evento.preventDefault();

    if (salvando || excluindo) return;

    setMensagemErro("");
    setMensagemSucesso("");
    setErroFotos("");

    setModalSalvarAberto(true);
  }

  async function confirmarSalvar() {
    if (salvando || excluindo) return;

    if (!validarFormulario()) return;

    const estadoAtual = cidadesBrasil.estados.find(
      (item) => item.sigla === formulario.estado,
    );

    try {
      setSalvando(true);

      const objetoAtualizado = await atualizarObjeto(id, {
        title: formulario.nomeObjeto,
        categoryId: formulario.categoriaId,
        estado: estadoAtual.sigla,
        cidade: formulario.cidade,
        bairro: formulario.bairro || null,
        data: formulario.data,
        horario: formulario.horario,
        descricao: formulario.descricao,
        caracteristicas: formulario.caracteristicas,
        fotosExistentes: formulario.fotosExistentes,
        fotosNovas,
      });

      if (!objetoAtualizado) {
        throw new Error(t("edit.errors.confirmFailed"));
      }

      const imagensAtualizadas = Array.isArray(
        objetoAtualizado.imagensSecundarias,
      )
        ? objetoAtualizado.imagensSecundarias
        : objetoAtualizado.imagemPrincipal
          ? [objetoAtualizado.imagemPrincipal]
          : formulario.fotosExistentes;

      setObjeto(objetoAtualizado);

      setFormulario((atual) => ({
        ...atual,
        fotosExistentes: imagensAtualizadas,
        caracteristicas:
          objetoAtualizado.descricaoCompleta ?? atual.caracteristicas,
      }));

      fotosNovas.forEach((foto) => {
        URL.revokeObjectURL(foto.preview);
        previewsCriadasRef.current.delete(foto.preview);
      });

      setFotosNovas([]);
      setErroFotos("");
      setMensagemErro("");
      setModalSalvarAberto(false);

      setMensagemSucesso(t("edit.saved"));
    } catch (error) {
      console.error("Erro ao atualizar objeto:", error);

      setMensagemErro(error.message || t("edit.errors.saveFailed"));
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir() {
    if (excluindo || salvando) return;

    setErroExclusao("");

    try {
      setExcluindo(true);

      await excluirObjeto(id);

      setModalExclusaoAberto(false);

      localStorage.setItem("lastUserPage", "2");

      navigate("/user-area");
    } catch (error) {
      setErroExclusao(error.message || t("edit.errors.deleteFailed"));
    } finally {
      setExcluindo(false);
    }
  }

  function voltarParaMeusObjetos() {
    localStorage.setItem("lastUserPage", "2");
    navigate("/user-area");
  }

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");
        setErroCategoria("");
        setFotosNovas([]);
        setFormulario(FORMULARIO_INICIAL);

        liberarPreviews();

        const [objetoEncontrado, resultadoCategorias] = await Promise.all([
          findOwnedObject(id),
          categories(),
        ]);

        if (!componenteAtivo) return;

        if (!objetoEncontrado) {
          setObjeto(null);
          setErro(t("edit.errors.notFoundOrForbidden"));
          return;
        }

        const listaCategorias = Array.isArray(resultadoCategorias)
          ? resultadoCategorias
          : [];

        setObjeto(objetoEncontrado);
        setCategoriasDisponiveis(listaCategorias);

        const categoriaEncontrada = listaCategorias.find(
          (item) =>
            normalizarTexto(item.name) ===
            normalizarTexto(objetoEncontrado.categoria),
        );

        if (!categoriaEncontrada) {
          setErroCategoria(t("edit.errors.categoryNotIdentified"));
        }

        const tipoObjeto =
          objetoEncontrado.status === "PERDIDO"
            ? "lost"
            : objetoEncontrado.status === "ENCONTRADO"
              ? "found"
              : "";

        const imagensExistentes =
          Array.isArray(objetoEncontrado.imagensSecundarias) &&
          objetoEncontrado.imagensSecundarias.length > 0
            ? objetoEncontrado.imagensSecundarias
            : objetoEncontrado.imagemPrincipal
              ? [objetoEncontrado.imagemPrincipal]
              : [];

        setFormulario({
          tipo: tipoObjeto,
          nomeObjeto: objetoEncontrado.nome ?? "",
          categoriaId: categoriaEncontrada?.id ?? "",
          estado: objetoEncontrado.localizacao?.estado ?? "",
          cidade: objetoEncontrado.localizacao?.cidade ?? "",
          bairro: objetoEncontrado.localizacao?.endereco ?? "",
          data: objetoEncontrado.data?.data ?? "",
          horario: objetoEncontrado.data?.hora ?? "",
          descricao: objetoEncontrado.descricao ?? "",
          caracteristicas: objetoEncontrado.descricaoCompleta ?? "",
          fotosExistentes: imagensExistentes,
        });
      } catch (error) {
        console.error("Erro ao carregar objeto para edição:", error);

        if (componenteAtivo) {
          setErro(error.message || t("edit.errors.loadFailed"));
        }
      } finally {
        if (componenteAtivo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      componenteAtivo = false;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      previewsCriadasRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewsCriadasRef.current.clear();
    };
  }, []);

  if (carregando) {
    return (
      <main className="cadastrar-page editar-page">
        <div className="editar-loading">
          <span className="editar-loading__spinner" />
          <p>{t("edit.loading")}</p>
        </div>
      </main>
    );
  }

  if (erro || !objeto) {
    return (
      <main className="cadastrar-page editar-page">
        <section className="editar-estado">
          <h1>{t("edit.openError")}</h1>
          <p role="alert">{erro || t("edit.errors.notFound")}</p>

          <button
            type="button"
            className="btn btn--primary"
            onClick={voltarParaMeusObjetos}
          >
            {t("edit.backToMine")}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="cadastrar-page editar-page">
      <header className="editar-header">
        <div>
          <span className="editar-header__eyebrow">{t("edit.eyebrow")}</span>

          <h1 className="page__title">{t("edit.title")}</h1>

          <p className="page__subtitle">{t("edit.subtitle")}</p>
        </div>
      </header>

      <form className="card editar-form" onSubmit={handleSolicitarSalvar}>
        <section className="editar-section">
          <div className="editar-section__header">
            <div>
              <h2 className="card__heading">{t("edit.infoTitle")}</h2>
              <p>{t("edit.infoSubtitle")}</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="nomeObjeto">{t("form.itemName")}</label>

              <div className="control">
                <input
                  id="nomeObjeto"
                  type="text"
                  value={formulario.nomeObjeto}
                  onChange={(e) => atualizarCampo("nomeObjeto", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="categoria">{t("common.category")}</label>

              <div className="control">
                <select
                  id="categoria"
                  value={formulario.categoriaId}
                  onChange={(e) =>
                    atualizarCampo("categoriaId", e.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    {t("form.selectCategory")}
                  </option>

                  {categoriasDisponiveis.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {erroCategoria && (
                <small className="editar-field-error" role="alert">
                  {erroCategoria}
                </small>
              )}
            </div>
          </div>
        </section>

        <section className="editar-section">
          <div className="editar-section__header">
            <div>
              <h2 className="card__heading">{t("edit.locationTitle")}</h2>
              <p>{t("edit.locationSubtitle")}</p>
            </div>
          </div>

          <div className="grid grid--3">
            <div className="field">
              <label htmlFor="estado">{t("common.state")}</label>

              <div className="control">
                <select
                  id="estado"
                  value={formulario.estado}
                  onChange={(e) => {
                    setFormulario((atual) => ({
                      ...atual,
                      estado: e.target.value,
                      cidade: "",
                      bairro: "",
                    }));
                  }}
                  required
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
              </div>
            </div>

            <div className="field">
              <label htmlFor="cidade">{t("common.city")}</label>

              <div className="control">
                <select
                  id="cidade"
                  value={formulario.cidade}
                  disabled={!formulario.estado}
                  onChange={(e) => {
                    setFormulario((atual) => ({
                      ...atual,
                      cidade: e.target.value,
                      bairro: "",
                    }));
                  }}
                  required
                >
                  <option value="" disabled>
                    {t("form.selectCity")}
                  </option>

                  {cidadesDisponiveis.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="bairro">{t("common.neighborhood")}</label>

              <div className="control">
                <select
                  id="bairro"
                  value={formulario.bairro}
                  disabled={
                    !formulario.cidade || bairrosDisponiveis.length === 0
                  }
                  onChange={(e) => atualizarCampo("bairro", e.target.value)}
                >
                  <option value="">
                    {bairrosDisponiveis.length === 0
                      ? t("form.noNeighborhoods")
                      : t("form.selectNeighborhood")}
                  </option>

                  {formulario.bairro &&
                    !bairrosDisponiveis.includes(formulario.bairro) && (
                      <option value={formulario.bairro}>
                        {formulario.bairro}
                      </option>
                    )}

                  {bairrosDisponiveis.map((bairro) => (
                    <option key={bairro} value={bairro}>
                      {bairro}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="editar-section">
          <div className="editar-section__header">
            <div>
              <h2 className="card__heading">{t("edit.dateTimeTitle")}</h2>
              <p>{t("edit.dateTimeSubtitle")}</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="data">{t("common.date")}</label>

              <div className="control">
                <input
                  id="data"
                  type="date"
                  value={formulario.data}
                  onChange={(e) => atualizarCampo("data", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="horario">{t("common.time")}</label>

              <div className="control">
                <input
                  id="horario"
                  type="time"
                  value={formulario.horario}
                  onChange={(e) => atualizarCampo("horario", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        <section className="editar-section">
          <div className="editar-section__header editar-section__header--photos">
            <div>
              <h2 className="card__heading">{t("edit.photosTitle")}</h2>
              <p>{t("edit.photosSubtitle")}</p>
            </div>

            <span className="editar-fotos-counter">
              {t("form.selectedCount", { count: totalFotos, max: MAX_FOTOS })}
            </span>
          </div>

          <input
            ref={inputFotosRef}
            id="fotosObjeto"
            className="upload__input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleSelecionarFotos}
          />

          {totalFotos > 0 ? (
            <div className="editar-fotos-grid">
              {formulario.fotosExistentes.map((imagem, indice) => (
                <article
                  key={`existente-${indice}-${imagem}`}
                  className="editar-foto-item"
                >
                  <div className="editar-foto-item__image">
                    <img
                      src={resolverUrlImagem(imagem)}
                      alt={t("edit.existingPhoto", { n: indice + 1 })}
                      loading="lazy"
                    />
                  </div>

                  <div className="editar-foto-item__footer">
                    <span>{t("edit.existingPhoto", { n: indice + 1 })}</span>

                    <button
                      type="button"
                      className="editar-foto-remove"
                      onClick={() => removerFotoExistente(indice)}
                      aria-label={t("edit.removeExisting", { n: indice + 1 })}
                    >
                      {t("common.remove")}
                    </button>
                  </div>
                </article>
              ))}

              {fotosNovas.map((foto, indice) => (
                <article
                  key={foto.preview}
                  className="editar-foto-item editar-foto-item--new"
                >
                  <div className="editar-foto-item__image">
                    <img
                      src={foto.preview}
                      alt={t("edit.newPhoto", { n: indice + 1 })}
                    />
                  </div>

                  <div className="editar-foto-item__footer">
                    <span>{t("edit.newPhoto", { n: indice + 1 })}</span>

                    <button
                      type="button"
                      className="editar-foto-remove"
                      onClick={() => removerFotoNova(foto.preview)}
                      aria-label={t("edit.removeNew", { n: indice + 1 })}
                    >
                      {t("common.remove")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="editar-fotos-empty">
              <span className="editar-fotos-empty__icon">＋</span>
              <strong>{t("edit.noPhotos")}</strong>
              <p>{t("edit.noPhotosHint")}</p>
            </div>
          )}

          <div className="editar-fotos-footer">
            <span>{t("edit.uploadHint")}</span>

            <button
              type="button"
              className="btn btn--outline"
              onClick={() => inputFotosRef.current?.click()}
              disabled={vagasDisponiveis <= 0}
            >
              {t("edit.addPhotos")}
            </button>
          </div>

          {erroFotos && (
            <small className="upload__error" role="alert">
              {erroFotos}
            </small>
          )}
        </section>

        <section className="editar-section">
          <div className="editar-section__header">
            <div>
              <h2 className="card__heading">{t("edit.descriptionTitle")}</h2>
              <p>{t("edit.descriptionSubtitle")}</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="descricao">{t("edit.descriptionLabel")}</label>

            <div className="textarea">
              <textarea
                id="descricao"
                maxLength={500}
                value={formulario.descricao}
                onChange={(e) => atualizarCampo("descricao", e.target.value)}
                required
              />

              <span className="textarea__counter">
                {formulario.descricao.length}/500
              </span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="caracteristicas">
              {t("edit.notes")}{" "}
              <span className="optional">{t("common.optional")}</span>
            </label>

            <div className="textarea">
              <textarea
                id="caracteristicas"
                maxLength={100}
                value={formulario.caracteristicas}
                onChange={(e) =>
                  atualizarCampo("caracteristicas", e.target.value)
                }
              />

              <span className="textarea__counter">
                {formulario.caracteristicas.length}/100
              </span>
            </div>
          </div>
        </section>

        {mensagemErro && (
          <p className="cadastro-feedback cadastro-feedback--erro" role="alert">
            {mensagemErro}
          </p>
        )}

        <div className="actions editar-actions">
          <button
            type="button"
            className="btn btn--outline btn--lg"
            disabled={salvando || excluindo}
            onClick={voltarParaMeusObjetos}
          >
            {t("common.cancel")}
          </button>

          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={salvando || excluindo}
          >
            {t("common.saveChanges")}
          </button>

          <button
            type="button"
            className="btn btn--danger btn--lg"
            disabled={salvando || excluindo}
            onClick={() => {
              setErroExclusao("");
              setModalExclusaoAberto(true);
            }}
          >
            {t("edit.delete")}
          </button>
        </div>
      </form>

      {modalSalvarAberto && (
        <ModalConfirmacao
          titulo={t("edit.modals.saveTitle")}
          descricao={t("edit.modals.saveText")}
          aviso={t("edit.modals.saveNotice")}
          erro={mensagemErro || erroFotos}
          carregando={salvando}
          textoConfirmar={t("edit.modals.saveConfirm")}
          onCancelar={() => {
            setModalSalvarAberto(false);
            setMensagemErro("");
            setErroFotos("");
          }}
          onConfirmar={confirmarSalvar}
        />
      )}

      {modalExclusaoAberto && (
        <ModalConfirmacao
          tipo="danger"
          titulo={t("edit.modals.deleteTitle")}
          descricao={t("edit.modals.deleteText")}
          aviso={t("edit.modals.deleteNotice")}
          erro={erroExclusao}
          carregando={excluindo}
          textoConfirmar={t("edit.delete")}
          onCancelar={() => {
            setModalExclusaoAberto(false);
            setErroExclusao("");
          }}
          onConfirmar={handleExcluir}
        />
      )}

      {mensagemSucesso && (
        <ModalConfirmacao
          tipo="success"
          titulo={t("edit.modals.successTitle")}
          descricao={t("edit.modals.successText")}
          textoConfirmar={t("common.finish")}
          onConfirmar={() => {
            localStorage.setItem("lastUserPage", "1");
            navigate("/user-area");
          }}
        />
      )}
    </main>
  );
}

export default EditarObjeto;
