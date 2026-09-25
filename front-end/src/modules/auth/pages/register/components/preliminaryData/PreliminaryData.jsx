import { useState } from 'react';
import { NavLink } from 'react-router';

import './preliminaryData.css'; 

import emailGray from '../../../../../../assets/icons/login/email-gray.png';
import lockGray from '../../../../../../assets/icons/login/lock-gray.png';
import personGray from '../../../../../../assets/icons/register/person-gray.png';
import phoneGray from '../../../../../../assets/icons/register/phone-gray.png';
import infoBlue from '../../../../../../assets/icons/register/info-blue.png';
import pinGray from '../../../../../../assets/icons/buscarObjetos/pin-gray.svg';
import openEyeGray from '../../../../../../assets/icons/login/open-eye-gray.png'; 
import closeEyeGray from '../../../../../../assets/icons/login/close-eye-gray.png'; 

function PreliminaryData({ proximaPagina }){

    const [eyeState, setEyeState] = useState(true);
    const [inputNameState, setInputNameState] = useState()
    const [inputEmailState, setInputEmailState] = useState()
    const [inputPasswordState, setInputPasswordState] = useState()
    const [inputTelephoneState, setInputTelephoneState] = useState()
    const [inputCityState, setInputCityState] = useState()

    function setarEyeState(){ setEyeState( (estadoAtual) => { return estadoAtual === true ? false : true } ) }

    return(
        <div className='register__container__inputs'>

            <div>
                <label className="register__label" htmlFor="nome"> Nome Completo </label>
                <div className='register__input__container'>
                    <img className='register__icon' src={personGray}/>
                    <input id='nome' className='register__input' type="text" placeholder='Ex: João da silva' onChange={(e) => {setInputNameState(e.target.value)}} />
                </div>
            </div>

            <div>
                <label className="register__label" htmlFor="email"> E-mail </label>
                <div className='register__input__container'>
                    <img className='register__icon' src={emailGray}/>
                    <input id='email' className='register__input' type="email" placeholder='Ex: joao@email.com' onChange={(e) => {setInputEmailState(e.target.value)}} />
                </div>
            </div>

            <div>
                <label className="register__label" htmlFor="password"> Senha </label>
                <div className='register__input__container'>

                    <img className='register__icon' src={lockGray} />
                    <input id='password' className='register__input' type={eyeState === true ? 'password' : 'text'} placeholder='Sua senha' onChange={(e) => {setInputPasswordState(e.target.value)}}/>
                    <div className='register__eye__button' onClick={() => { setarEyeState() }}>
                        {eyeState === true ? <img className='register__eye__icon' src={openEyeGray} /> : <img className='register__eye__icon' src={closeEyeGray} />} 
                    </div>

                </div>
            </div>

            <div>
                <label className="register__label" htmlFor="telefone"> Telefone </label>
                <div className='register__input__container'>
                    <img className='register__icon' src={phoneGray}/>
                    <input id='telefone' className='register__input' type="text" placeholder='Ex: (11) 99999-9999' onChange={(e) => {setInputTelephoneState(e.target.value)}} />
                </div>
            </div>

            <div>
                <label className="register__label" htmlFor="cidade"> Cidade </label>
                <div className='register__input__container'>
                    <img className='register__icon' src={pinGray}/>
                    <input id='cidade' className='register__input' type="text" placeholder='Ex: Porto Alegre' onChange={(e) => {setInputCityState(e.target.value)}} />
                </div>
            </div>

            <div className='register__container__info'>
                <img className='info__image' src={infoBlue}  />
                <p className='info__subtitle'>Você poderá adicionar sua foto e personalizar suas preferências nas próximas etapas.</p>
            </div>

            <div className='register__form__button' onClick={ () => { proximaPagina(2) }  } >
                <p>Continuar</p>
            </div>

            <hr />

            <div className='register__container__com__conta'>
                <p className='register__com__conta__text'>Já possui uma conta?</p>
                <NavLink to='/auth/login' end className='navlink' ><p> Entrar </p></NavLink>
            </div>

        </div>
    )
}

export default PreliminaryData;