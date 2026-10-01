import { useState } from 'react';
import { NavLink } from 'react-router';
import { IMaskInput } from 'react-imask';
import { verificaEmailSenha, verificaTelefone, verificaSenhaCadastro, validaCidade } from '../../../../../../utils/inputs/inputs.js';

import './preliminaryData.css'; 

import cidadesBrasil from '../../../../../../utils/json/cidade-estados.json';

import emailGray from '../../../../../../assets/icons/login/email-gray.png';
import lockGray from '../../../../../../assets/icons/login/lock-gray.png';
import personGray from '../../../../../../assets/icons/register/person-gray.png';
import phoneGray from '../../../../../../assets/icons/register/phone-gray.png';
import infoBlue from '../../../../../../assets/icons/register/info-blue.png';
import pinGray from '../../../../../../assets/icons/buscarObjetos/pin-gray.svg';
import openEyeGray from '../../../../../../assets/icons/login/open-eye-gray.png'; 
import closeEyeGray from '../../../../../../assets/icons/login/close-eye-gray.png'; 

function PreliminaryData({ proximaPagina, error, setInput }){

    const [obrigatorio, setObrigatorio] = useState(false);
    const [eyeState, setEyeState] = useState(true);
    const [requisitosSenhaPreenchido, setRequisitosSenhaPreenchido] = useState(false);

    const [inputNameState, setInputNameState] = useState('');
    const [inputEmailState, setInputEmailState] = useState('');
    const [inputPasswordState, setInputPasswordState] = useState('');
    const [inputTelephoneState, setInputTelephoneState] = useState('');

    const [inputCityState, setInputCityState] = useState('');
    const [inputState, setInputState] = useState('');
    
    const [cidadesFiltradas, setCidadesFiltradas] = useState([]); 

    const todasAsCidades = [];
    cidadesBrasil.estados.forEach((estado) => { estado.cidades.forEach((cidade) => { todasAsCidades.push({
        cidade: cidade,
        estado: estado.sigla
    }) })});

    const requisitosSenha = {
        tamanho: inputPasswordState.length >= 8,
        maiuscula: /[A-Z]/.test(inputPasswordState),
        minuscula: /[a-z]/.test(inputPasswordState),
        numero: /[0-9]/.test(inputPasswordState),
        especial: /[^A-Za-z0-9]/.test(inputPasswordState)
    }

    function buscarCidades(valor) {
        setInputCityState(valor);

        if (valor.trim() === '') {
            setCidadesFiltradas([]);
            return;
        }

        const resultado = todasAsCidades.filter((cidade) => {
            const mesmaCidade = cidade.cidade.toLowerCase().startsWith(valor.toLowerCase());

            const mesmoEstado = inputState ? cidade.estado === inputState : true;

            return mesmaCidade && mesmoEstado;   
        });

        setCidadesFiltradas(resultado);
    }

    function continuarCriacaoConta(){ 
        try{
            error(null);
            if (!inputEmailState.trim() || !inputPasswordState.trim() || !inputNameState.trim()) { return setObrigatorio(true)}
            if (inputNameState.trim().length < 3 || inputNameState.trim().length > 100) { return error('Nome inválido') }
            validaCidade(inputCityState, inputState, todasAsCidades)
            if (inputTelephoneState) { verificaTelefone(inputTelephoneState) }

            verificaEmailSenha(inputEmailState.trim().toLowerCase(), inputPasswordState); 
            verificaSenhaCadastro(inputPasswordState); 

            const nome = inputNameState.trim();
            const email = inputEmailState.trim().toLowerCase();
            const password = inputPasswordState;
            const telefone = inputTelephoneState ? inputTelephoneState : '';
            const cidade = inputCityState ? inputCityState : ''; 
            
            setInput({
                name: nome, 
                email: email, 
                password: password,
                telefone: telefone, 
                city: cidade
            });

            setObrigatorio(false);
    
            return proximaPagina(2); 

        } catch (erro) {
            if(erro.message === 'Credenciais inválidas'){ return error(`Credenciais inválidas`)}
            if(erro.message === 'Email inválido') { return error('Email inválido')}
            if(erro.message === 'Senha inválida') { return error('Senha inválida')}
            if(erro.message === 'Telefone inválido') { return error('Telefone inválido')}
            if (erro.message === 'Estado não selecionado') { return error('Selecione o estado da cidade') }
            if (erro.message === 'Cidade inválida') { return error('Selecione uma cidade disponível na lista') }
            else { return error('Ocorreu um erro inesperado, verifique se os dados informados estão corretos e tente novamente mais tarde')}
        }
    }

    function setarEyeState(){ setEyeState( (estadoAtual) => { return estadoAtual === true ? false : true } ) }

    return(
        <div className='register__container__inputs'>

            <div>
                <label className="register__label" htmlFor="nome"> Nome Completo </label>
                {obrigatorio ? (<span className='register__obrigatorio__message'> | Obrigatório</span>) : ''}
                <div className='register__input__container'>
                    <img className='register__icon' src={personGray}/>
                    <input id='nome' className='register__input' type="text" placeholder='Ex: João da silva' onChange={(e) => {setInputNameState(e.target.value)}} />
                </div>
            </div>

            <div>
                <label className="register__label" htmlFor="email"> E-mail </label>
                {obrigatorio ? (<span className='register__obrigatorio__message'> | Obrigatório</span>) : ''}
                <div className='register__input__container'>
                    <img className='register__icon' src={emailGray}/>
                    <input id='email' className='register__input' type="email" placeholder='Ex: joao@email.com' onChange={(e) => {setInputEmailState(e.target.value)}} />
                </div>
            </div>

            <div>
                <label className="register__label" htmlFor="password"> Senha </label>
                {obrigatorio ? (<span className='register__obrigatorio__message'> | Obrigatório</span>) : ''}
                <div className='register__input__container'>

                    <img className='register__icon' src={lockGray} />
                    <input id='password' className='register__input' type={eyeState === true ? 'password' : 'text'} placeholder='Sua senha' onChange={(e) => {setInputPasswordState(e.target.value)}} onFocus={() => setRequisitosSenhaPreenchido(true)} onBlur={() => setRequisitosSenhaPreenchido(false)}/>
                    <div className='register__eye__button' onClick={() => { setarEyeState() } }>
                        {eyeState === true ? <img className='register__eye__icon' src={openEyeGray} /> : <img className='register__eye__icon' src={closeEyeGray} />} 
                    </div>

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

            <div>
                <label className="register__label" htmlFor="telefone"> Telefone </label>
                <div className='register__input__container'>
                    <img className='register__icon' src={phoneGray}/>
                    <IMaskInput id='telefone' className='register__input' mask="(00) 00000-0000" placeholder='Ex: (11) 99999-9999' value={inputTelephoneState} 
                    onAccept={(value) => setInputTelephoneState(value)}/>
                </div>
            </div>

            <div>
                <label className="register__label" htmlFor="cidade"> Cidade </label>
                <div className='register__input__container'>

                    <img className='register__icon' src={pinGray}/>
                    <input id='cidade' className='register__input' type="text" placeholder='Sua Cidade' onChange={(e) => {buscarCidades(e.target.value)}} value={inputCityState} />

                    <select value={inputState}  className="register__estado"  onChange={(event) => setInputState(event.target.value)}>
                        <option value=""> UF </option>

                        {cidadesBrasil.estados.map((estado) => (
                            <option key={estado.sigla} value={estado.sigla}>
                                {estado.sigla}
                            </option>
                        ))}
                    </select>

                </div>

                {cidadesFiltradas.length > 0 ? (
                <div className="register__container__sugestoes">

                    {cidadesFiltradas.map((cidade) => (

                        <div className="register__cidades__sugestoes" key={`${cidade.cidade}-${cidade.estado}`} onClick={() => { setInputCityState(cidade.cidade); setInputState(cidade.estado); setCidadesFiltradas([]) }}>
                             <span>{cidade.cidade} </span>
                        </div>
                    ))}
                </div> ) : ''}

            </div>

            <div className='register__container__info'>
                <img className='info__image' src={infoBlue}  />
                <p className='info__subtitle'>Você poderá adicionar sua foto e personalizar suas preferências nas próximas etapas.</p>
            </div>

            <div className='register__form__button' onClick={ () => { continuarCriacaoConta() }  } >
                <p>Continuar</p>
            </div>

            <hr />

            <div className='register__container__com__conta'>
                <p className='register__com__conta__text'>Já possui uma conta?</p>
                <NavLink to='/auth/login' end className='register__navlink' ><p> Entrar </p></NavLink>
            </div>
        </div>
    )
}

export default PreliminaryData;