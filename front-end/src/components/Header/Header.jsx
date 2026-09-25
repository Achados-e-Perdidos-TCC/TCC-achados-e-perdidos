import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/authContexts/AuthContext.jsx'; 
import './Header.css';

import { NavLink } from 'react-router'; 

import logo from '../../assets/logo_completa.png';
import iconCadastrarObjeto from '../../assets/icons/header/cabecalho_cadastrar_objeto.svg';
import temaDark from '../../assets/icons/header/cabecalho_tema_dark.svg';
import temaLight from '../../assets/icons/header/cabecalho_tema_light.svg';
import burguerWhite from '../../assets/icons/header/cabecalho_burguer_white.svg';
import burguerDark from '../../assets/icons/header/cabecalho_burguer_black.svg';
import closeWhite from '../../assets/icons/header/cabecalho_close_white.svg';
import closeBlack from '../../assets/icons/header/cabecalho_close_black.svg';
import personWhite from '../../assets/icons/header/cabecalho_person_white.png';
import personDark from '../../assets/icons/header/cabecalho_person_dark.png';

function Header({ tema, aoAlternarTema }) {

    // Implementar funcionalidade para reconhecer se usuario está logado ou não (após implementacão do login)

    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated } = useContext(AuthContext); 

    function toogleMenu() { !menuOpen ? setMenuOpen(true) : setMenuOpen(false) }

    function person(){
        if(tema === 'light' && !isAuthenticated) { 
            return ( <NavLink to='/auth/entrar' end> <img className="person" src={personDark} alt="Acessar perfil" /> </NavLink> );
        } else if(tema === 'light' && isAuthenticated){
            return ( <NavLink to='/' end> <img className="person" src={personDark} alt="Acessar perfil" /> </NavLink> );
        }

        if(tema === 'dark' && !isAuthenticated) { 
            return ( <NavLink to='/auth/entrar' end> <img className="person" src={personWhite} alt="Acessar perfil" /> </NavLink>);
        } else if(tema === 'dark' && isAuthenticated){
            return ( <NavLink to='/' end> <img className="person" src={personWhite} alt="Acessar perfil" /> </NavLink>);
        } 
    }

    return (
        <header className='header cabecalho_content'>
            <a href="/"><img className='cabecalho__logo' src={logo} alt="Página inicial" /></a>

            <div className={!menuOpen ? 'menu__desativo' : 'menu__ativo'}>
                {tema === 'light' ? <img className='burguer close__menu' onClick={toogleMenu} src={closeWhite} alt="Fechar menu" /> : <img className='burguer close__menu' onClick={toogleMenu} src={closeBlack} alt="Fechar menu" />}
                <nav>
                    <ul>
                        <NavLink className='nav__link' to='/'end><li> <p>início</p> </li> </NavLink>
                        <NavLink className='nav__link' to='/buscar-objetos' end> <li> <p>Buscar objetos</p> </li> </NavLink>
                        <NavLink className='link__cadastrar nav__link' to='/' end ><li> <p>Cadastrar objeto</p> </li></NavLink>
                        <NavLink className='nav__link' to='/' end> <li> <p>Como funciona</p> </li> </NavLink>
                    </ul>
                </nav>
            </div>

            <div className='cabecalho__buttons'>

                <div className='button button__cadastrar'>
                    <img className='cabecalho__icon' src={iconCadastrarObjeto} alt="Cadastrar objeto" />
                    <NavLink to='/' end className='cadastrar link' href="#">Cadastrar objeto</NavLink>
                </div>
                
                <div className='button button__entrar'>
                    {isAuthenticated ? <NavLink to='/' end className='entrar link'>Meu Perfil</NavLink> : <NavLink to='/auth/login' end className='entrar link' href="#">Entrar</NavLink>}
                </div>


                <div className='button button__tema' onClick={aoAlternarTema}>
                    {tema === 'light' ? <img className="tema" src={temaDark} alt="Ativar tema escuro" /> : <img className="tema" src={temaLight} alt="Ativar tema claro" />}
                </div>

                <div className='button__person'>
                    {person()}
                </div>

                <div className='burguer__menu' onClick={toogleMenu}>
                    {tema === 'light' ? <img className='burguer' src={burguerDark} alt="Abrir menu" /> : <img className='burguer' src={burguerWhite} alt="Abrir menu" />}
                </div>
            </div>
        </header>
    )
}

export default Header;