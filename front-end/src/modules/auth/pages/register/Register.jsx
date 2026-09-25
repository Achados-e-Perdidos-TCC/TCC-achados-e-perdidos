import { useState } from 'react';
import { NavLink } from 'react-router'; 
import { verificaEmailSenha } from '../../../../utils/inputs/inputs.js';

import Circles from './components/circles/Circles.jsx';
import PreliminaryData from './components/preliminaryData/PreliminaryData.jsx';
import Perfil from './components/perfil/Perfil.jsx'; 
import Preferences from './components/preferences/Preferences.jsx'; 
import ContaCriada from './components/conta-criada/ContaCriada.jsx'; 

import './register.css'; 

import logo from '../../../../assets/logo_iniciais.png';

function Register(){

    const [paginaActive, setPaginaActive] = useState(1); 
    const [error, setError] = useState(null)

    function passarPagina(valor){ setPaginaActive( valor ) }

    return (
        <section className="register">
            <div className='register__container__form'>
                <img className={paginaActive === 4 ? 'register__none' : "register__logo"} src={logo} />

                <div className={paginaActive === 1 ? '' : 'register__none' }>
                    <h1 className="register__form__title" >Crie sua conta</h1>
                    <p className="register__form__subtitle">vamos comecar com seus dados básicos.</p>
                </div>

                <div className={paginaActive === 2 ? '' : 'register__none' }>
                    <h1 className="register__form__title" >Personalize seu perfil</h1>
                    <p className="register__form__subtitle">Adicione uma foto para deixar seu perfil mais pessoal.</p>
                </div>

                <div className={paginaActive === 3 ? '' : 'register__none' }>
                    <h1 className="register__form__title" >Configure suas preferências</h1>
                    <p className="register__form__subtitle">Escolha como deseja receber avisos e atualizações</p>
                </div>

                <div className={paginaActive === 4 ? 'register__none' : ''}>
                    <Circles paginaAtual={ paginaActive } />
                </div>

                <form  className='register__form' action='POST' onSubmit={(evento) => { console.log('enviado') }}>

                    <div className={!error ? 'register__no__error' : 'register__error'}>
                        <p className='register__error__message'>{error}</p>
                    </div>

                    <div className={paginaActive === 1 ? 'register__inputs' : 'register__none'}>
                        <PreliminaryData proximaPagina={ passarPagina }/> 
                    </div>

                    <div className={paginaActive === 2 ? 'register__inputs' : 'register__none'}>
                        <Perfil proximaPagina={ passarPagina }/> 
                    </div>

                    <div className={paginaActive === 3 ? 'register__inputs' : 'register__none'}>
                        <Preferences proximaPagina={ passarPagina } />
                    </div>    

                    <div className={paginaActive === 4 ? 'register__inputs' : 'register__none'} >
                        <ContaCriada />
                    </div>
                </form>
            </div>

        </section>
    )
}

export default Register;