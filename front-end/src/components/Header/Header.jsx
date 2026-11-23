import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../../contexts/authContexts/context.js";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher.jsx";

import "./Header.css";

import logo from "../../assets/logo_completa.png";
import iconCadastrarObjeto from "../../assets/icons/header/cabecalho_cadastrar_objeto.svg";

import burguerWhite from "../../assets/icons/header/cabecalho_burguer_white.svg";
import burguerDark from "../../assets/icons/header/cabecalho_burguer_black.svg";

import closeWhite from "../../assets/icons/header/cabecalho_close_white.svg";
import closeBlack from "../../assets/icons/header/cabecalho_close_black.svg";

import personWhite from "../../assets/icons/header/cabecalho_person_white.png";
import personDark from "../../assets/icons/header/cabecalho_person_dark.png";

function Header({ tema }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  const rotaPerfil = isAuthenticated ? "/user-area" : "/auth/login";

  const iconeMenu = tema === "light" ? burguerDark : burguerWhite;
  const iconeFechar = tema === "light" ? closeWhite : closeBlack;
  const iconePerfil = tema === "light" ? personDark : personWhite;

  function toggleMenu() {
    setMenuOpen((estadoAtual) => !estadoAtual);
  }

  function fecharMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    function fecharComEscape(evento) {
      if (evento.key === "Escape") {
        fecharMenu();
      }
    }

    if (menuOpen) {
      document.addEventListener("keydown", fecharComEscape);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuOpen]);

  function renderLink(to, texto) {
    return (
      <NavLink
        className={({ isActive }) =>
          `header__link ${isActive ? "header__link--ativo" : ""}`
        }
        to={to}
        end
        onClick={fecharMenu}
      >
        {texto}
      </NavLink>
    );
  }

  return (
    <header className="header">
      <div className="header__container">
        {/* LOGO */}

        <NavLink
          className="header__logo-link"
          to="/"
          onClick={fecharMenu}
          aria-label={t("header.homeAria")}
        >
          <img className="header__logo" src={logo} alt="Achados e Devolvidos" />
        </NavLink>

        {/* NAVEGAÇÃO DESKTOP */}

        <nav className="header__nav header__nav--desktop">
          {renderLink("/", t("header.home"))}
          {renderLink("/buscar-objetos", t("header.search"))}
          {renderLink("/como-funciona", t("header.howItWorks"))}
        </nav>

        {/* AÇÕES */}

        <div className="header__acoes">
          {/* IDIOMA */}

          <LanguageSwitcher />

          {/* CADASTRAR OBJETO */}

          <NavLink
            className="header__botao header__botao--cadastrar"
            to="/cadastrar-objetos"
            onClick={fecharMenu}
          >
            <img
              src={iconCadastrarObjeto}
              alt=""
              className="header__icone-cadastrar"
            />

            <span>{t("header.register")}</span>
          </NavLink>

          {/* ENTRAR / MEU PERFIL */}

          <NavLink
            className="header__botao header__botao--perfil"
            to={rotaPerfil}
            onClick={fecharMenu}
          >
            {isAuthenticated ? t("header.myProfile") : t("header.signIn")}
          </NavLink>

          {/* ÍCONE DO PERFIL */}

          <NavLink
            className="header__perfil-icone"
            to={rotaPerfil}
            onClick={fecharMenu}
            aria-label={
              isAuthenticated
                ? t("header.openProfile")
                : t("header.signInAccount")
            }
          >
            <img src={iconePerfil} alt="" />
          </NavLink>

          {/* BOTÃO MENU MOBILE */}

          <button
            className="header__menu-botao"
            type="button"
            onClick={toggleMenu}
            aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="header-menu-mobile"
          >
            <img src={menuOpen ? iconeFechar : iconeMenu} alt="" />
          </button>
        </div>
      </div>

      {/* OVERLAY */}

      <div
        className={`header__overlay ${menuOpen ? "header__overlay--ativo" : ""}`}
        onClick={fecharMenu}
        aria-hidden="true"
      />

      {/* MENU MOBILE */}

      <div
        id="header-menu-mobile"
        className={`header__menu-mobile ${menuOpen ? "header__menu-mobile--ativo" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="header__menu-cabecalho">
          <span className="header__menu-titulo">{t("header.navigation")}</span>

          <button
            className="header__menu-fechar"
            type="button"
            onClick={fecharMenu}
            aria-label={t("header.closeMenu")}
          >
            <img src={iconeFechar} alt="" />
          </button>
        </div>

        <nav className="header__nav header__nav--mobile">
          {renderLink("/", t("header.home"))}
          {renderLink("/buscar-objetos", t("header.search"))}
          {renderLink("/como-funciona", t("header.howItWorks"))}
        </nav>

        <div className="header__menu-divisor" />

        <div className="header__menu-acoes">
          <NavLink
            className="header__menu-cadastrar"
            to="/cadastrar-objetos"
            onClick={fecharMenu}
          >
            <img src={iconCadastrarObjeto} alt="" />
            {t("header.register")}
          </NavLink>

          <NavLink
            className="header__menu-perfil"
            to={rotaPerfil}
            onClick={fecharMenu}
          >
            <img src={iconePerfil} alt="" />
            {isAuthenticated
              ? t("header.myProfile")
              : t("header.signInAccount")}
          </NavLink>

          {/* IDIOMA (MOBILE) */}

          <LanguageSwitcher />
        </div>

        <div className="header__menu-rodape">
          <span>Achados e Devolvidos</span>
          <span>{t("header.tagline")}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
