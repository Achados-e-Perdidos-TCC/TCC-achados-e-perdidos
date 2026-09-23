import { useState, useEffect } from 'react';
import { NavLink } from 'react-router'; 

import './login.css'; 

import logo from '../../../assets/logo_iniciais.png';
import emailGray from '../../../assets/icons/login/email-gray.png'; 
import lockGray from '../../../assets/icons/login/lock-gray.png'; 
import openEyeGray from '../../../assets/icons/login/open-eye-gray.png'; 
import closeEyeGray from '../../../assets/icons/login/close-eye-gray.png'; 
import entrarWhite from '../../../assets/icons/login/entrar-white.png'; 

function Login(){

    const [eyeState, setEyeState] = useState('open');

    function setarEyeState(){
        setEyeState( (estadoAtual) => {
            return estadoAtual === 'open' ? 'close' : 'open'; 
        })
    }

    

    return (
        <section className="login">

            
            <div className='container__form'>
                <img className="login__logo" src={logo} />

                <form  className='form' action='GET'>

                    <div>
                        <h1 className="form__title" >Bem-vindo de volta!</h1>
                        <p className="form__subtitle">Faça login para continuar</p>
                    </div>

                    <div className='container__inputs'>
                        <div>
                            <label className="label" htmlFor="email"> E-mail </label>
                            <div className='input__email'>
                                <img className='email__icon' src={emailGray} />
                                <input className='email input' type="email" placeholder='Seu@email.com' />
                            </div>
                        </div>

                        <div>
                            <label className="label" htmlFor="password"> Senha </label>
                            <div className='input__password'>
                                <img className='password__icon' src={lockGray} />
                                <input className='password input' type={eyeState === 'open' ? 'password' : 'text'} placeholder='Sua senha' />
                                <div className='eye__button' onClick={() => { setarEyeState() }}>
                                   {eyeState === 'open' ? <img className='eye__icon' src={openEyeGray} /> : <img className='eye__icon' src={closeEyeGray} />} 
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='container__esqueci__senha'>
                        <div className='container__checkbox'>
                            <input className='input__checkbox' type="checkbox" />
                            <label htmlFor=""> Lembrar de mim </label>
                        </div>

                        <NavLink to='/' end className='navlink'>Esqueci minha senha</NavLink>
                    </div>

                    <button className='form__button'>
                        <img src={entrarWhite} />
                        <p>Entrar</p>
                    </button>
                    
                </form>

                <hr />

                <div className='container__sem__conta'>
                    <p className='sem__conta__text'>Ainda não tem uma conta?</p>
                    <NavLink to='/' end className='navlink' ><p> Criar conta </p></NavLink>
                </div>

            </div>

        </section>
    )
}

export default Login;