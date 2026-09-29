import { useState } from 'react';
import { NavLink } from 'react-router'; 
import { verificaEmailSenha } from '../../../../utils/inputs/inputs.js'; 
import { forgetPassword } from '../../auth.service.js';

import './esqueciSenha.css'; 

import logo from '../../../../assets/logo_iniciais.png';
import emailGray from '../../../../assets/icons/login/email-gray.png'; 
import sentWhite from '../../../../assets/icons/esqueciSenha/sent-white.png'; 

function EsqueciSenha(){

    const [inputEmailState, setInputEmailState] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    async function recuperarSenha(evento){
        try{
            evento.preventDefault(); 
            setError(null)
            setSuccess(null)
            verificaEmailSenha(inputEmailState.toLowerCase()); 
    
            // faz chamada API
            const response = await forgetPassword( { email: inputEmailState } );

            if (response.message === 'Se o e-mail informado estiver cadastrado, enviaremos instruções para redefinir a senha.') { 
                return setSuccess(response.message);
            }

        } catch(erro) { 
            if(erro.message === 'Credenciais inválidas'){ return setError(`Credenciais inválidas.`)}
            if(erro.message === 'Email inválido') { return setError('Email inválido.')}
            if(erro.message === 'campos precisam estar preenchidos') {return setError('O campo e-mail precisa estar preenchido.')}
            else { return setError('Ocorreu um erro inesperado, verifique se o dado informado está correto.')}
        }
    }

    return(
        <section className="esqueci__senha">

                <div className='esqueci__container__form'>
                <img className="esqueci__logo" src={logo} />

                <div>
                    <h1 className="esqueci__form__title" >Recupere sua senha</h1>
                    <p className="esqueci__form__subtitle">Informe seu e-mail abaixo.</p>
                </div>

                <form  className='esqueci__form' action='POST' noValidate onSubmit={(valor) => { recuperarSenha(valor) }}>

                    <div className={!success ? 'esqueci__no__success' : 'esqueci__success'}>
                        <p className='esqueci__success__message'>{success}</p>
                    </div>

                    <div className={!error ? 'esqueci__no__error' : 'esqueci__error'}>
                        <p className='esqueci__error__message'>{error}</p>
                    </div>

                    <div className='esqueci__container__inputs'>

                        <div>
                            <label className="esqueci__label" htmlFor="email"> E-mail </label>
                            <div className='esqueci__input__email'>
                                <img className='esqueci__email__icon' src={emailGray}/>
                                <input id='email' className='esqueci__input' type="email" placeholder='Seu@email.com' onChange={(e) => {setInputEmailState(e.target.value)}} />
                            </div>
                        </div>

                    </div>

                    <button className='esqueci__form__button' type='submit' >
                        <img className="esqueci__image__sent" src={sentWhite} />
                        <p>Enviar link de recuperação</p>
                    </button>
                    
                </form>

                <hr />

                <div className='esqueci__container__com__conta'>
                    <p className='esqueci__sem__conta__text'>Lembrou sua senha?</p>
                    <NavLink to='/auth/login' end className='esqueci__navlink' ><p> Entrar </p></NavLink>
                </div>
            </div>

        </section>
    )
}

export default EsqueciSenha; 