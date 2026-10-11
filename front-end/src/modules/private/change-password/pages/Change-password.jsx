import { useContext, useState } from 'react';
import { AuthContext } from '../../../../contexts/authContexts/AuthContext.jsx'; 
import { NavLink, useNavigate } from 'react-router'; 
import { verificaSenhaCadastro } from '../../../../utils/inputs/inputs.js'; 
import { changeNewUserPassword } from '../../private.service.js';

import './change-password.css'; 

import logo from '../../../../assets/logo_iniciais.png';

function ChangePassword(){

    const navigate = useNavigate();

    const { isAuthenticated , setIsAuthenticated } = useContext(AuthContext); 

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [requisitosSenhaPreenchido, setRequisitosSenhaPreenchido] = useState(false);
    const [inputSenhaAtual, setInputSenhaAtual] = useState('');
    const [inputNewPasswordState, setInputNewPasswordState] = useState('');

    const requisitosSenha = {
        tamanho: inputNewPasswordState.length >= 8,
        maiuscula: /[A-Z]/.test(inputNewPasswordState),
        minuscula: /[a-z]/.test(inputNewPasswordState),
        numero: /[0-9]/.test(inputNewPasswordState),
        especial: /[^A-Za-z0-9]/.test(inputNewPasswordState)
    }

    async function changeUserPassword(evento){
        try{
            evento.preventDefault(); 
            setError(null)
            setSuccess(null)

            if (!inputNewPasswordState || !inputSenhaAtual){ throw new Error('campos precisam estar preenchidos') }
            if (inputNewPasswordState === inputSenhaAtual){ throw new Error('A senha precisa ser diferente') }
            verificaSenhaCadastro(inputNewPasswordState)

            await changeNewUserPassword( inputSenhaAtual, inputNewPasswordState );

            setSuccess('Senha alterada com sucesso! Você será redirecionado para a tela de login em instantes.');

            setTimeout(() => { 
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("refreshToken"); 
                setIsAuthenticated(false); 
                navigate('/auth/login');
            }, 3000); 

        } catch(erro) { 
            if(erro.message === 'Credenciais inválidas'){ return setError(`Credenciais inválidas.`)}
            if(erro.message === 'Senha inválida') { return setError('Nova Senha inválida')}
            if(erro.message === 'Senha atual incorreta') { return setError('Senha atual incorreta')}
            if(erro.message === 'A senha precisa ser diferente') { return setError('As senhas não podem ser iguais')}
            if(erro.message === 'campos precisam estar preenchidos') {return setError('Os campos precisam estar preenchidos.')}
            else { return setError('Ocorreu um erro inesperado, verifique se os dados informados estão corretos.')}
        }
    }

    return(
        <section className="esqueci__senha">

            <div className='esqueci__container__form'>
                <img className="esqueci__logo" src={logo} />

                <div>
                    <h1 className="esqueci__form__title" >Altere sua senha</h1>
                    <p className="esqueci__form__subtitle">Informe a senha atual e a sua nova senha.</p>
                </div>

                <form  className='esqueci__form' action='POST' noValidate onSubmit={(valor) => { changeUserPassword(valor) }}>

                    <div className={!success ? 'esqueci__no__success' : 'esqueci__success'}>
                        <p className='esqueci__success__message'>{success}</p>
                    </div>

                    <div className={!error ? 'esqueci__no__error' : 'esqueci__error'}>
                        <p className='esqueci__error__message'>{error}</p>
                    </div>

                    <div className='esqueci__container__inputs change__password__user'>

                        <div>
                            <label className="esqueci__label" htmlFor="email"> Senha atual </label>
                            <div>
                                <input id='password' className='esqueci__input__change' type="text" placeholder='Sua senha' onChange={(e) => {setInputSenhaAtual(e.target.value)}} />
                            </div>
                        </div>

                        <div>
                            <label className="register__label" htmlFor="password"> Nova senha </label>

                                <div className='register__input__container'>

                                    <input id='password' className='esqueci__input__change' type='text' placeholder='Sua nova senha' onChange={(e) => {setInputNewPasswordState(e.target.value)}} onFocus={() => setRequisitosSenhaPreenchido(true)} onBlur={() => setRequisitosSenhaPreenchido(false)}/>

                                    </div>

                                    {requisitosSenhaPreenchido ? (
                                        <div className="register__password__requerimentos">

                                            <p className={requisitosSenha.tamanho ? 'requisito__cumprido' : 'requisito__pendente'}> • Pelo menos 8 caracteres </p>
                                            <p className={requisitosSenha.maiuscula ? 'requisito__cumprido' : 'requisito__pendente'}> • Uma letra maiúscula </p>
                                            <p className={requisitosSenha.minuscula ? 'requisito__cumprido' : 'requisito__pendente'}> • Uma letra minúscula </p>
                                            <p className={requisitosSenha.numero ? 'requisito__cumprido' : 'requisito__pendente'}> • Um número </p>
                                            <p className={requisitosSenha.especial ? 'requisito__cumprido' : 'requisito__pendente'}> • Um caractere especial </p>

                                        </div>
                                    ) : ''}
                                </div>
                    </div>

                    <button className='esqueci__form__button' type='submit'>
                        <p>Alterar senha</p>
                    </button>
                    
                </form>

                {success ? '' : <hr /> } 

                {success ? '' : 
                <div className='esqueci__container__com__conta'>
                    <p className='esqueci__sem__conta__text'>Não deseja mais alterar?</p>
                    <NavLink to='/user-area' end className='esqueci__navlink' ><p> Voltar </p></NavLink>
                </div>
                }
            </div>
                
        </section>
    )
}

export default ChangePassword; 