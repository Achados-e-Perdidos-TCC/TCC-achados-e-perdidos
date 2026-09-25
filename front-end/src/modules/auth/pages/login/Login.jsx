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
    const [inputEmailState, setInputEmailState] = useState()
    const [inputPasswordState, setInputPasswordState] = useState()
    const [lembrarUsuario, setLembrarUsuario] = useState(false); 
    const [error, setError] = useState(null)

    function setarEyeState(){
        setEyeState( (estadoAtual) => { return estadoAtual === true ? false : true } )
    }

    async function logarUsuario(evento){
        try{
            evento.preventDefault(); 
            setError(null)
            verificaEmailSenha(inputEmailState, inputPasswordState); 
    
            // faz chamada API
            await login(inputEmailState, inputPasswordState, lembrarUsuario);

            return window.location.href = "/";

        } catch(erro) { 
            if(erro.message === 'Credenciais inválidas' || error === null ){ return setError(`Credenciais inválidas`)}
            if(erro.message === 'Email inválido') { return setError('Email inválido')}
            if(erro.message === 'Senha inválida') { return setError('Senha inválida')}
            else { return setError('Ocorreu um erro inesperado, verifique se os dados informados estão corretos e tente novamente mais tarde')}
        }
    }

    return (
        <section className="login">
            
            <div className='container__form'>
                <img className="login__logo" src={logo} />

                <div>
                    <h1 className="form__title" >Bem-vindo de volta!</h1>
                    <p className="form__subtitle">Faça login para continuar</p>
                </div>

                <form  className='form' action='POST' onSubmit={(evento) => { logarUsuario(evento) }}>

                    <div className={!error ? 'no__error' : 'error'}>
                        <p className='error__message'>{error}</p>
                    </div>

                    <div className='container__inputs'>

                        <div>
                            <label className="label" htmlFor="email"> E-mail </label>
                            <div className='input__email'>
                                <img className='email__icon' src={emailGray}/>
                                <input id='email' className='input' type="email" placeholder='Seu@email.com' onChange={(e) => {setInputEmailState(e.target.value)}} />
                            </div>
                        </div>

                        <div>
                            <label className="label" htmlFor="password"> Senha </label>
                            <div className='input__password'>
                                <img className='password__icon' src={lockGray} />
                                <input id='password' className='input' type={eyeState === true ? 'password' : 'text'} placeholder='Sua senha' onChange={(e) => {setInputPasswordState(e.target.value)}}/>
                                <div className='eye__button' onClick={() => { setarEyeState() }}>
                                   {eyeState === true ? <img className='eye__icon' src={openEyeGray} /> : <img className='eye__icon' src={closeEyeGray} />} 
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='container__esqueci__senha'>
                        <div className='container__checkbox'>
                            <input className='input__checkbox' type="checkbox" onClick={() => {setLembrarUsuario((valor) => (valor === false ? true : false))}} />
                            <label htmlFor=""> Lembrar de mim </label>
                        </div>

                        <NavLink to='/' end className='navlink'>Esqueci minha senha</NavLink>
                    </div>

                    <button className='form__button' type='submit' >
                        <img src={entrarWhite} />
                        <p>Entrar</p>
                    </button>
                    
                </form>

                <hr />

                <div className='container__sem__conta'>
                    <p className='sem__conta__text'>Ainda não tem uma conta?</p>
                    <NavLink to='/auth/register' end className='navlink' ><p> Criar conta </p></NavLink>
                </div>
            </div>

        </section>
    )
}

export default Login;