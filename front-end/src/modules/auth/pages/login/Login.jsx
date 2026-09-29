import { useState } from 'react';
import { NavLink } from 'react-router'; 
import { verificaEmailSenha } from '../../../../utils/inputs/inputs.js';
import { login } from '../../auth.service.js';

import './login.css'; 

import logo from '../../../../assets/logo_iniciais.png';
import emailGray from '../../../../assets/icons/login/email-gray.png'; 
import lockGray from '../../../../assets/icons/login/lock-gray.png'; 
import openEyeGray from '../../../../assets/icons/login/open-eye-gray.png'; 
import closeEyeGray from '../../../../assets/icons/login/close-eye-gray.png'; 
import entrarWhite from '../../../../assets/icons/login/entrar-white.png'; 

function Login(){

    const [eyeState, setEyeState] = useState(true);
    const [inputEmailState, setInputEmailState] = useState('')
    const [inputPasswordState, setInputPasswordState] = useState('')
    const [lembrarUsuario, setLembrarUsuario] = useState(false); 
    const [error, setError] = useState(null)

    function setarEyeState(){
        setEyeState( (estadoAtual) => { return estadoAtual === true ? false : true } )
    }

    async function logarUsuario(evento){
        try{
            evento.preventDefault(); 
            setError(null)
            verificaEmailSenha(inputEmailState.toLowerCase(), inputPasswordState); 
    
            // faz chamada API
            await login(inputEmailState.toLowerCase(), inputPasswordState, lembrarUsuario);

            return window.location.href = "/";

        } catch(erro) { 
            if(erro.message === 'Credenciais inválidas'){ return setError(`Credenciais inválidas`)}
            if(erro.message === 'Email inválido') { return setError('Email inválido')}
            if(erro.message === 'Senha inválida') { return setError('Senha inválida')}
            if(erro.message === 'campos precisam estar preenchidos') {return setError('Todos os campos precisam estar preenchidos')}
            else { return setError('Ocorreu um erro inesperado, verifique se os dados informados estão corretos e tente novamente mais tarde')}
        }
    }

    return (
        <section className="login">
            
            <div className='login__container__form'>
                <img className="login__logo" src={logo} />

                <div>
                    <h1 className="login__form__title" >Bem-vindo de volta!</h1>
                    <p className="login__form__subtitle">Faça login para continuar</p>
                </div>

                <form  className='login__form' action='POST' noValidate onSubmit={(evento) => { logarUsuario(evento) }}>

                    <div className={!error ? 'login__no__error' : 'login__error'}>
                        <p className='login__error__message'>{error}</p>
                    </div>

                    <div className='login__container__inputs'>

                        <div>
                            <label className="login__label" htmlFor="email"> E-mail </label>
                            <div className='login__input__email'>
                                <img className='login__email__icon' src={emailGray}/>
                                <input id='email' className='login__input' type="email" placeholder='Seu@email.com' onChange={(e) => {setInputEmailState(e.target.value)}} />
                            </div>
                        </div>

                        <div>
                            <label className="login__label" htmlFor="password"> Senha </label>
                            <div className='login__input__password'>
                                <img className='login__password__icon' src={lockGray} />
                                <input id='password' className='login__input' type={eyeState === true ? 'password' : 'text'} placeholder='Sua senha' onChange={(e) => {setInputPasswordState(e.target.value)}}/>
                                <div className='login__eye__button' onClick={() => { setarEyeState() }}>
                                   {eyeState === true ? <img className='login__eye__icon' src={openEyeGray} /> : <img className='login__eye__icon' src={closeEyeGray} />} 
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='login__container__esqueci__senha'>
                        <div className='login__container__checkbox'>
                            <input className='login__input__checkbox' type="checkbox" onClick={() => {setLembrarUsuario((valor) => (valor === false ? true : false))}} />
                            <label htmlFor=""> Lembrar de mim </label>
                        </div>

                        <NavLink to='/auth/esqueci-senha' end className='login__navlink'>Esqueci minha senha</NavLink>
                    </div>

                    <button className='login__form__button' type='submit' >
                        <img className="login__image__entrar" src={entrarWhite} />
                        <p>Entrar</p>
                    </button>
                    
                </form>

                <hr />

                <div className='login__container__sem__conta'>
                    <p className='login__sem__conta__text'>Ainda não tem uma conta?</p>
                    <NavLink to='/auth/register' end className='login__navlink' ><p> Criar conta </p></NavLink>
                </div>
            </div>

        </section>
    )
}

export default Login;