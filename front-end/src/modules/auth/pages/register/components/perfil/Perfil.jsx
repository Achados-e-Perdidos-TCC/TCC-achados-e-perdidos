import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router";

import "./perfil.css";

import userBlue from "../../../../../../assets/icons/register/user-blue.png";
import uploadBlue from "../../../../../../assets/icons/register/upload-blue.png";
import skipGray from "../../../../../../assets/icons/register/skip-gray.png";
import arrowBlack from "../../../../../../assets/icons/register/arrow-black.png";
import arrowWhite from "../../../../../../assets/icons/register/arrow-white.png";

function Perfil({ proximaPagina, error, setInput }) {
  const [foto, setFoto] = useState(null);
  const [arrastando, setArrastando] = useState(false);

  const { tema } = useOutletContext();
  const inputRef = useRef(null);

  const [preview, setPreview] = useState("");

  // Cria e limpa a URL temporária da imagem
  useEffect(() => {
    if (!foto) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(foto);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [foto]);

  // Validação e seleção da imagem
  function selecionarImagem(arquivo) {
    if (!arquivo) return;

    error(null);

    const formatosPermitidos = ["image/jpeg", "image/png"];

    if (!formatosPermitidos.includes(arquivo.type)) {
      error("Selecione uma imagem no formato JPG ou PNG.");
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      error("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setFoto(arquivo);
  }

  function excluirImagem() {
    setFoto(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    error(null);
  }

  function handleDrop(evento) {
    evento.preventDefault();
    setArrastando(false);

    const arquivo = evento.dataTransfer.files[0];

    selecionarImagem(arquivo);
  }

  function continuarCriacaoConta() {
    error(null);

    if (!foto) {
      return error(
        "Adicione uma foto para continuar ou clique em “Pular por enquanto”.",
      );
    }

    setInput((valorAntigo) => ({
      ...valorAntigo,
      avatarUrl: foto,
    }));

    proximaPagina(3);
  }

  function pularProximaPagina() {
    error(null);

    setInput((valorAntigo) => ({
      ...valorAntigo,
      avatarUrl: "",
    }));

    proximaPagina(3);
  }

  function voltarPagina() {
    proximaPagina(1);
    error(null);
  }

  return (
    <div className="perfil">
      {/* APRESENTAÇÃO DA FOTO */}

      <div className="register__container__foto">
        <div className="perfil__foto-wrapper">
          {preview ? (
            <img
              className="com__foto"
              src={preview}
              alt="Pré-visualização da foto de perfil"
            />
          ) : (
            <div className="sem__foto">
              <img src={userBlue} alt="" />
            </div>
          )}

          {preview && (
            <span className="perfil__foto-status">
              <span />
              Foto selecionada
            </span>
          )}
        </div>

        <div className="perfil__foto-informacoes">
          <h3 className="register__foto__title">
            {foto ? "Sua foto de perfil" : "Adicione uma foto"}
          </h3>

          <span className="register__foto__subtitle">
            JPG ou PNG · Recomendado até 5 MB
          </span>
        </div>
      </div>

      {/* ÁREA DE UPLOAD */}

      <div
        className={`register__upload ${
          arrastando ? "register__upload--arrastando" : ""
        }`}
        onDragOver={(evento) => {
          evento.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={(evento) => {
          if (!evento.currentTarget.contains(evento.relatedTarget)) {
            setArrastando(false);
          }
        }}
        onDrop={handleDrop}
      >
        <div className="register__upload__container">
          <div className="perfil__upload-icone">
            <img className="upload__image" src={uploadBlue} alt="" />
          </div>

          <div className="perfil__upload-textos">
            <h4 className="register__upload__title">
              Selecione uma imagem do seu dispositivo
            </h4>

            <p className="register__upload__subtitle">
              Ou arraste e solte aqui
            </p>
          </div>
        </div>

        <div className="register__selecionar__imagem">
          {foto ? (
            <button
              className="upload__image__label upload__image__label--excluir no__responsive"
              type="button"
              onClick={excluirImagem}
            >
              Excluir imagem
            </button>
          ) : (
            <label
              htmlFor="uploadimage"
              className="upload__image__label no__responsive"
            >
              Selecionar imagem
            </label>
          )}

          <input
            ref={inputRef}
            id="uploadimage"
            type="file"
            accept="image/jpeg,image/png"
            onChange={(evento) => {
              selecionarImagem(evento.target.files[0]);
              evento.target.value = "";
            }}
            hidden
          />
        </div>
      </div>

      {/* AÇÕES MOBILE */}

      {foto ? (
        <button
          className="upload__image__label upload__image__label--excluir register__responsive"
          type="button"
          onClick={excluirImagem}
        >
          Excluir imagem
        </button>
      ) : (
        <label
          htmlFor="uploadimage"
          className="upload__image__label register__responsive"
        >
          Selecionar imagem
        </label>
      )}

      {/* PULAR ETAPA */}

      <button
        className="register__perfil__skip"
        type="button"
        onClick={pularProximaPagina}
      >
        <img src={skipGray} alt="" />
        <span>Pular por enquanto</span>
      </button>

      {/* NAVEGAÇÃO */}

      <div className="container__buttons">
        <button
          className="register__button__voltar"
          type="button"
          onClick={voltarPagina}
        >
          <img
            className="perfil__arrow__black"
            src={tema === "light" ? arrowBlack : arrowWhite}
            alt=""
          />
          <p>Voltar</p>
        </button>

        <button
          className="register__button__continuar"
          type="button"
          onClick={continuarCriacaoConta}
        >
          <img className="perfil__arrow__white" src={arrowWhite} alt="" />
          <p>Continuar</p>
        </button>
      </div>
    </div>
  );
}

export default Perfil;
