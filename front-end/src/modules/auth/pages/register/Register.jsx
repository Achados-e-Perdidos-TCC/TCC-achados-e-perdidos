import { useState } from 'react';
import { NavLink } from 'react-router'; 
import { verificaEmailSenha } from '../../../../utils/inputs/inputs.js';

import './register.css'; 

import logo from '../../../../assets/logo_iniciais.png';
import emailGray from '../../../../assets/icons/login/email-gray.png';
import lockGray from '../../../../assets/icons/login/lock-gray.png';
import openEyeGray from '../../../../assets/icons/login/open-eye-gray.png'; 
import closeEyeGray from '../../../../assets/icons/login/close-eye-gray.png'; 

function Register(){

    const [eyeState, setEyeState] = useState(true);
    const [inputEmailState, setInputEmailState] = useState()
    const [inputPasswordState, setInputPasswordState] = useState()
    const [error, setError] = useState(null)

    function setarEyeState(){ setEyeState( (estadoAtual) => { return estadoAtual === true ? false : true } ) }

    return (
        <section className="register">
            
            <div className='container__form'>
                <img className="register__logo" src={logo} />

                <form  className='form' action='POST' onSubmit={(evento) => { console.log('enviado') }}>

                    <div>
                        <h1 className="form__title" >Bem-vindo de volta!</h1>
                        <p className="form__subtitle">Faça login para continuar</p>
                    </div>

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

                    <button className='form__button' type='submit' >
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

export default Register;