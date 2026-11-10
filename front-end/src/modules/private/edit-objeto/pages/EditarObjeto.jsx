import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { findOwnedObject } from "../../private.service.js";
import { categories } from "../../../buscar-objetos/buscarObjetos.service.js";

import cidadesBrasil from "../../../../utils/json/cidade-estados.json";
import "../../../cadastrar-objetos/pages/CadastrarObjeto.css";
import "./EditarObjeto.css";
import { resolverUrlImagem } from "../../../../utils/images/urlImagem.js";
import {
    atualizarObjeto,
    excluirObjeto,
} from "../editarObjeto.service.js";

const MAX_FOTOS = 6;
const MAX_TAMANHO_FOTO = 5 * 1024 * 1024;

const TIPOS_FOTO_PERMITIDOS = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

function normalizarTexto(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function EditarObjeto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [objeto, setObjeto] = useState(null);

    const [categoriasDisponiveis, setCategoriasDisponiveis] =
        useState([]);

    const [formulario, setFormulario] = useState({
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
    });

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [erroCategoria, setErroCategoria] = useState("");

    // Controle do processo de salvamento.
    const [salvando, setSalvando] = useState(false);

    // Controle do modal de confirmação de salvamento.
    const [modalSalvarAberto, setModalSalvarAberto] = useState(false);

    // Controle do modal de confirmação de exclusão.
    const [modalExclusaoAberto, setModalExclusaoAberto] =
        useState(false);

    // Controle da operação de exclusão.
    const [excluindo, setExcluindo] = useState(false);

    // Mensagem de erro da exclusão.
    const [erroExclusao, setErroExclusao] = useState("");

    // Mensagens de retorno da atualização.
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");

    // Novas imagens selecionadas pelo usuário.
    const [fotosNovas, setFotosNovas] = useState([]);

    // Mensagens de validação das fotografias.
    const [erroFotos, setErroFotos] = useState("");

    // Referência ao input de arquivos.
    const inputFotosRef = useRef(null);

    // Armazena as URLs temporárias das prévias.
    const previewsCriadasRef = useRef(new Set());

    function atualizarCampo(campo, valor) {
        setFormulario((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    }

    function handleSelecionarFotos(e) {
        const arquivosSelecionados = Array.from(
            e.target.files ?? []
        );

        if (arquivosSelecionados.length === 0) return;

        const arquivosValidos = [];
        const problemas = [];

        // Valida cada arquivo selecionado.
        arquivosSelecionados.forEach((arquivo) => {
            if (!TIPOS_FOTO_PERMITIDOS.has(arquivo.type)) {
                problemas.push(
                    "Use imagens JPEG, PNG, WEBP ou GIF."
                );
                return;
            }

            if (arquivo.size > MAX_TAMANHO_FOTO) {
                problemas.push(
                    "Cada imagem pode ter no máximo 5 MB."
                );
                return;
            }

            arquivosValidos.push(arquivo);
        });

        // Calcula quantas fotografias ainda podem ser adicionadas.
        const totalFotos =
            formulario.fotosExistentes.length + fotosNovas.length;

        const vagasDisponiveis = MAX_FOTOS - totalFotos;

        const arquivosAdicionados = arquivosValidos.slice(
            0,
            Math.max(0, vagasDisponiveis)
        );

        // Cria uma prévia para cada nova fotografia.
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

        // Informa os problemas encontrados durante a seleção.
        if (arquivosValidos.length > arquivosAdicionados.length) {
            problemas.push(
                `Você pode adicionar no máximo ${MAX_FOTOS} fotos.`
            );
        }

        setErroFotos(problemas.join(" "));

        // Permite selecionar novamente o mesmo arquivo.
        e.target.value = "";
    }


    // Remove uma fotografia que já estava cadastrada.
    function removerFotoExistente(indice) {
        const fotosAtualizadas = formulario.fotosExistentes.filter(
            (_, i) => i !== indice
        );

        setFormulario((atual) => ({
            ...atual,
            fotosExistentes: fotosAtualizadas,
        }));

        const totalFotos = fotosAtualizadas.length + fotosNovas.length;

        if (totalFotos === 0) {
            setErroFotos("Adicione pelo menos uma foto do objeto.");
        } else {
            setErroFotos("");
        }
    }


    // Remove uma fotografia recém-selecionada.
    function removerFotoNova(preview) {
        URL.revokeObjectURL(preview);

        previewsCriadasRef.current.delete(preview);

        const fotosAtualizadas = fotosNovas.filter(
            (foto) => foto.preview !== preview
        );

        setFotosNovas(fotosAtualizadas);

        const totalFotos =
            formulario.fotosExistentes.length + fotosAtualizadas.length;

        if (totalFotos === 0) {
            setErroFotos("Adicione pelo menos uma foto do objeto.");
        } else {
            setErroFotos("");
        }
    }

    const estadoSelecionado = cidadesBrasil.estados.find(
        (item) => item.sigla === formulario.estado
    );

    function handleSolicitarSalvar(e) {
        e.preventDefault();

        if (salvando || excluindo) return;

        setMensagemErro("");
        setMensagemSucesso("");
        setErroFotos("");

        setModalSalvarAberto(true);
    }

    async function confirmarSalvar() {
        if (salvando) return;

        if (salvando) return;

        setMensagemErro("");
        setMensagemSucesso("");

        // Validação dos campos obrigatórios.
        if (!formulario.nomeObjeto.trim()) {
            setMensagemErro("Informe o nome do objeto.");
            return;
        }

        if (!formulario.categoriaId) {
            setMensagemErro("Selecione uma categoria.");
            return;
        }

        if (!formulario.estado || !formulario.cidade) {
            setMensagemErro("Informe o estado e a cidade.");
            return;
        }

        if (!formulario.data || !formulario.horario) {
            setMensagemErro("Informe a data e o horário.");
            return;
        }

        if (!formulario.descricao.trim()) {
            setMensagemErro("A descrição do objeto é obrigatória.");
            return;
        }

        // Verifica a quantidade total de fotografias.
        const totalFotos =
            formulario.fotosExistentes.length + fotosNovas.length;

        if (totalFotos === 0) {
            setErroFotos("Adicione pelo menos uma foto do objeto.");
            return;
        }

        if (totalFotos > MAX_FOTOS) {
            setErroFotos("O limite é de seis fotografias.");
            return;
        }

        // Localiza o estado para montar o texto esperado pelo backend.
        const estadoAtual = cidadesBrasil.estados.find(
            (item) => item.sigla === formulario.estado
        );

        if (!estadoAtual) {
            setMensagemErro("Estado selecionado inválido.");
            return;
        }

        try {
            setSalvando(true);

            // Chama o serviço responsável pelo upload e pelo PATCH.
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

            // Recupera a lista definitiva de imagens retornada pelo backend.
            const imagensAtualizadas =
                Array.isArray(objetoAtualizado.imagensSecundarias)
                    ? objetoAtualizado.imagensSecundarias
                    : objetoAtualizado.imagemPrincipal
                        ? [objetoAtualizado.imagemPrincipal]
                        : formulario.fotosExistentes;

            setObjeto(objetoAtualizado);

            setFormulario((atual) => ({
                ...atual,
                fotosExistentes: imagensAtualizadas,
                caracteristicas:
                    objetoAtualizado.descricaoCompleta ?? "",
            }));

            // Libera as prévias das imagens que já foram enviadas.
            fotosNovas.forEach((foto) => {
                URL.revokeObjectURL(foto.preview);
                previewsCriadasRef.current.delete(foto.preview);
            });

            // As novas fotos agora são consideradas imagens cadastradas.
            setFotosNovas([]);
            setErroFotos("");

            setModalSalvarAberto(false);
            setMensagemSucesso(
                "seu objeto foi salvo com sucesso!"
            );

        } catch (error) {
            console.error("Erro ao atualizar objeto:", error);

            setMensagemErro(
                error.message ||
                "Não foi possível salvar as alterações. Tente novamente."
            );

        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluir() {
        if (excluindo || salvando) return;

        setErroExclusao("");

        try {
            setExcluindo(true);

            // Executa a exclusão do objeto no backend.
            await excluirObjeto(id);

            // Fecha o modal após a confirmação da API.
            setModalExclusaoAberto(false);

            // Retorna para a aba Meus objetos.
            localStorage.setItem("lastUserPage", "2");

            navigate("/user-area");

        } catch (error) {
            console.error("Erro ao excluir objeto:", error);

            setErroExclusao(
                error.message ||
                "Não foi possível excluir o objeto. Tente novamente."
            );

        } finally {
            setExcluindo(false);
        }
    }

    const cidadesDisponiveis = estadoSelecionado?.cidades ?? [];

    const bairrosDisponiveis =
        estadoSelecionado?.bairrosPorCidade?.[formulario.cidade] ?? [];

    useEffect(() => {
        let componenteAtivo = true;

        async function carregarDados() {
            try {
                setCarregando(true);
                setErro("");
                setErroCategoria("");

                // Busca o objeto e as categorias simultaneamente.
                const [objetoEncontrado, resultadoCategorias] =
                    await Promise.all([
                        findOwnedObject(id),
                        categories(),
                    ]);

                if (!componenteAtivo) return;

                // Verifica se o objeto pertence ao usuário autenticado.
                if (!objetoEncontrado) {
                    setObjeto(null);
                    setErro(
                        "Objeto não encontrado ou você não tem permissão para editá-lo."
                    );
                    return;
                }

                const listaCategorias = Array.isArray(resultadoCategorias)
                    ? resultadoCategorias
                    : [];

                setObjeto(objetoEncontrado);
                setCategoriasDisponiveis(listaCategorias);

                // O backend retorna o nome da categoria.
                // Aqui encontramos o ID correspondente.
                const categoriaEncontrada = listaCategorias.find(
                    (item) =>
                        normalizarTexto(item.name) ===
                        normalizarTexto(objetoEncontrado.categoria)
                );

                if (!categoriaEncontrada) {
                    setErroCategoria(
                        "Não foi possível identificar a categoria atual. Verifique as categorias disponíveis."
                    );
                }

                // O backend retorna PERDIDO ou ENCONTRADO.
                // O formulário utiliza lost ou found.
                const tipoObjeto =
                    objetoEncontrado.status === "PERDIDO"
                        ? "lost"
                        : objetoEncontrado.status === "ENCONTRADO"
                            ? "found"
                            : "";

                // Recupera todas as imagens existentes.
                const imagensExistentes =
                    Array.isArray(objetoEncontrado.imagensSecundarias) &&
                        objetoEncontrado.imagensSecundarias.length > 0
                        ? objetoEncontrado.imagensSecundarias
                        : objetoEncontrado.imagemPrincipal
                            ? [objetoEncontrado.imagemPrincipal]
                            : [];

                // Preenche os dados que serão utilizados pelo formulário.
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
                    caracteristicas:
                        objetoEncontrado.descricaoCompleta ?? "",

                    fotosExistentes: imagensExistentes,
                });

            } catch (error) {
                console.error("Erro ao carregar objeto para edição:", error);

                if (componenteAtivo) {
                    setErro(
                        error.message ||
                        "Não foi possível carregar os dados do objeto."
                    );
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
        return <p>Carregando dados do objeto...</p>;
    }

    if (erro || !objeto) {
        return (
            <section>
                <h1>Editar objeto</h1>
                <p role="alert">
                    {erro || "Objeto não encontrado."}
                </p>
            </section>
        );
    }

    return (
        <main className="cadastrar-page">
            <h1 className="page__title">Editar objeto</h1>

            <p className="page__subtitle">
                Atualize as informações do seu objeto cadastrado.
            </p>

            <form className="card" onSubmit={handleSolicitarSalvar}>
                <h2 className="card__heading">Informações do objeto</h2>

                {/* Nome e categoria */}
                <div className="grid grid--2">
                    <div className="field">
                        <label htmlFor="nomeObjeto">Nome do objeto</label>

                        <div className="control">
                            <input
                                id="nomeObjeto"
                                type="text"
                                value={formulario.nomeObjeto}
                                onChange={(e) =>
                                    atualizarCampo("nomeObjeto", e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="categoria">Categoria</label>

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
                                    Selecione a categoria
                                </option>

                                {categoriasDisponiveis.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {erroCategoria && (
                            <small role="alert">{erroCategoria}</small>
                        )}
                    </div>
                </div>

                {/* Localização */}
                <div className="grid grid--3">
                    <div className="field">
                        <label htmlFor="estado">Estado</label>

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
                                    Selecione o estado
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
                        <label htmlFor="cidade">Cidade</label>

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
                                    Selecione a cidade
                                </option>

                                {cidadesDisponiveis.map((nomeCidade) => (
                                    <option key={nomeCidade} value={nomeCidade}>
                                        {nomeCidade}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="bairro">Bairro</label>

                        <div className="control">
                            <select
                                id="bairro"
                                value={formulario.bairro}
                                disabled={
                                    !formulario.cidade ||
                                    bairrosDisponiveis.length === 0
                                }
                                onChange={(e) =>
                                    atualizarCampo("bairro", e.target.value)
                                }
                            >
                                <option value="">
                                    {bairrosDisponiveis.length === 0
                                        ? "Sem bairros disponíveis"
                                        : "Selecione o bairro"}
                                </option>

                                {formulario.bairro &&
                                    !bairrosDisponiveis.includes(formulario.bairro) && (
                                        <option value={formulario.bairro}>
                                            {formulario.bairro}
                                        </option>
                                    )}

                                {bairrosDisponiveis.map((nomeBairro) => (
                                    <option key={nomeBairro} value={nomeBairro}>
                                        {nomeBairro}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data e horário */}
                <div className="grid grid--2">
                    <div className="field">
                        <label htmlFor="data">Data</label>

                        <div className="control">
                            <input
                                id="data"
                                type="date"
                                value={formulario.data}
                                onChange={(e) =>
                                    atualizarCampo("data", e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="horario">Horário</label>

                        <div className="control">
                            <input
                                id="horario"
                                type="time"
                                value={formulario.horario}
                                onChange={(e) =>
                                    atualizarCampo("horario", e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Gerenciamento das fotografias */}
                <div className="field">
                    <span className="field__label">
                        Fotos do objeto (mínimo 1 e máximo 6)
                    </span>

                    <input
                        ref={inputFotosRef}
                        id="fotosObjeto"
                        className="upload__input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleSelecionarFotos}
                    />

                    <div className="editar-fotos-grid">

                        {/* Fotografias já cadastradas */}
                        {formulario.fotosExistentes.map((imagem, indice) => (
                            <div
                                key={`existente-${indice}-${imagem}`}
                                className="editar-foto-item"
                            >
                                <img
                                    src={resolverUrlImagem(imagem)}
                                    alt={`Foto cadastrada ${indice + 1}`}
                                    loading="lazy"
                                />

                                <span>Foto cadastrada {indice + 1}</span>

                                <button
                                    type="button"
                                    className="btn btn--outline"
                                    onClick={() => removerFotoExistente(indice)}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}

                        {/* Fotografias novas */}
                        {fotosNovas.map((foto, indice) => (
                            <div
                                key={foto.preview}
                                className="editar-foto-item"
                            >
                                <img
                                    src={foto.preview}
                                    alt={`Nova foto ${indice + 1}`}
                                />

                                <span>Nova foto {indice + 1}</span>

                                <button
                                    type="button"
                                    className="btn btn--outline"
                                    onClick={() => removerFotoNova(foto.preview)}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}

                    </div>

                    <div className="editar-fotos-footer">
                        <span>
                            {formulario.fotosExistentes.length + fotosNovas.length}
                            {" de "}
                            {MAX_FOTOS} fotos
                        </span>

                        <button
                            type="button"
                            className="btn btn--outline"
                            onClick={() => inputFotosRef.current?.click()}
                            disabled={
                                formulario.fotosExistentes.length + fotosNovas.length >=
                                MAX_FOTOS
                            }
                        >
                            + Adicionar fotos
                        </button>
                    </div>

                    {erroFotos && (
                        <small className="upload__error" role="alert">
                            {erroFotos}
                        </small>
                    )}
                </div>

                {/* Descrição */}
                <div className="field">
                    <label htmlFor="descricao">Descrição do objeto</label>

                    <div className="textarea">
                        <textarea
                            id="descricao"
                            maxLength={500}
                            value={formulario.descricao}
                            onChange={(e) =>
                                atualizarCampo("descricao", e.target.value)
                            }
                            required
                        />

                        <span className="textarea__counter">
                            {formulario.descricao.length}/500
                        </span>
                    </div>
                </div>

                {/* Características */}
                <div className="field">
                    <label htmlFor="caracteristicas">
                        Características específicas{" "}
                        <span className="optional">(opcional)</span>
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

                {/* Mensagens de retorno */}
                {mensagemErro && (
                    <p
                        className="cadastro-feedback cadastro-feedback--erro"
                        role="alert"
                    >
                        {mensagemErro}
                    </p>
                )}

                {/* Botões de ação */}
                <div className="actions">

                    {/* Cancelar edição */}
                    <button
                        type="button"
                        className="btn btn--outline btn--lg"
                        disabled={salvando || excluindo}
                        onClick={() => {
                            localStorage.setItem("lastUserPage", "2");
                            navigate("/user-area");
                        }}
                    >
                        Cancelar
                    </button>

                    {/* Salvar alterações */}
                    <button
                        type="submit"
                        className="btn btn--primary btn--lg"
                        disabled={salvando || excluindo}
                    >
                        {salvando ? "Salvando..." : "Salvar alterações"}
                    </button>

                    {/* Excluir objeto */}
                    <button
                        type="button"
                        className="btn btn--danger btn--lg"
                        disabled={salvando || excluindo}
                        onClick={() => {
                            setErroExclusao("");
                            setModalExclusaoAberto(true);
                        }}
                    >
                        Excluir
                    </button>

                </div>
            </form>

            {/* Modal de confirmação de exclusão */}
            {modalExclusaoAberto && (
                <div className="confirmation-overlay">
                    <section
                        className="confirmation-modal confirmation-modal--danger"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-title"
                        aria-busy={excluindo}
                    >
                        <div className="confirmation-modal__icon">
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
                        </div>

                        <h2 id="delete-title">
                            Excluir objeto?
                        </h2>

                        <p>
                            Tem certeza de que deseja excluir este objeto?
                        </p>

                        <p className="confirmation-modal__notice">
                            Ele deixará de aparecer nas buscas públicas,
                            mas continuará no seu histórico de objetos.
                        </p>

                        {erroExclusao && (
                            <p
                                className="cadastro-feedback cadastro-feedback--erro"
                                role="alert"
                            >
                                {erroExclusao}
                            </p>
                        )}

                        <div className="confirmation-modal__actions">

                            <button
                                type="button"
                                className="btn btn--outline"
                                disabled={excluindo}
                                onClick={() => {
                                    setModalExclusaoAberto(false);
                                    setErroExclusao("");
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn btn--danger"
                                disabled={excluindo}
                                onClick={handleExcluir}
                            >
                                {excluindo ? "Excluindo..." : "Excluir objeto"}
                            </button>

                        </div>
                    </section>
                </div>
            )}

            {/* Modal de confirmação de salvamento */}
            {modalSalvarAberto && (
                <div className="confirmation-overlay">
                    <section
                        className="confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="save-title"
                        aria-busy={salvando}
                    >
                        <div className="confirmation-modal__icon">
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
                        </div>

                        <h2 id="save-title">
                            Salvar alterações?
                        </h2>

                        <p>
                            Deseja realmente salvar as alterações deste objeto?
                        </p>

                        <p className="confirmation-modal__notice">
                            As informações atualizadas serão salvas na plataforma.
                        </p>

                        {(mensagemErro || erroFotos) && (
                            <p
                                className="cadastro-feedback cadastro-feedback--erro"
                                role="alert"
                            >
                                {mensagemErro || erroFotos}
                            </p>
                        )}

                        <div className="confirmation-modal__actions">

                            <button
                                type="button"
                                className="btn btn--outline"
                                disabled={salvando}
                                onClick={() => {
                                    setModalSalvarAberto(false);
                                    setMensagemErro("");
                                    setErroFotos("");
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn btn--primary btn--save-confirm"
                                disabled={salvando}
                                onClick={confirmarSalvar}
                            >
                                {salvando ? "Salvando..." : "Confirmar e salvar"}
                            </button>

                        </div>
                    </section>
                </div>
            )}

            {/* Modal de edição concluída */}
            {mensagemSucesso && (
                <div className="confirmation-overlay">
                    <section
                        className="confirmation-modal confirmation-modal--success"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="success-title"
                    >
                        <div className="confirmation-modal__icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>

                        <h2 id="success-title">
                            seu objeto foi salvo com sucesso!
                        </h2>

                        <p>
                            As alterações do seu objeto foram salvas e já estão disponíveis na plataforma.
                        </p>

                        <div className="confirmation-modal__actions">
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={() => {
                                    localStorage.setItem("lastUserPage", "1");
                                    navigate("/user-area");
                                }}
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

export default EditarObjeto;