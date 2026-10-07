import { useState, useEffect } from 'react'; 
import { updateProfile, updatePreferences, imageUpload } from '../../../../auth/auth.service.js';
import { verificaEmailSenha, validaCidade, verificaTelefone } from '../../../../../utils/inputs/inputs.js';

import FormInfos from './components/formInfos/FormInfos.jsx'; 
import SecurityLinks from './components/securityLinks/SecurityLinks.jsx'; 
import UserPreferences from './components/userPreferences/UserPreferences.jsx'; 
import DangerZone from './components/dangerZone/DangerZone.jsx'; 
import PhotoCard from './components/photoCard/PhotoCard.jsx'; 

import cidadesBrasil from '../../../../../utils/json/cidade-estados.json';

import './UserProfile.css'; 

import userBlue from '../../../../../assets/icons/register/user-blue.png'; 
import configBlue from '../../../../../assets/icons/userArea/config-blue.png'; 
import shieldBlue from '../../../../../assets/icons/userArea/protect-blue.png';
import dangerRed from '../../../../../assets/icons/userArea/danger-red.png';
import saveWhite from '../../../../../assets/icons/userArea/save-white.png';

function UserProfile({ userInfos }){

    const [inputNameState, setInputNameState] = useState(userInfos.name);
    const [inputEmailState, setInputEmailState] = useState(userInfos.email);
    const [inputTelephoneState, setInputTelephoneState] = useState(userInfos.phone);

    const [inputCityState, setInputCityState] = useState(userInfos.city);
    const [inputState, setInputState] = useState('');

    const [ativo1, setAtivo1] = useState(userInfos.preferences.notificationsEnabled);
    const [ativo2, setAtivo2] = useState(userInfos.preferences.emailsEnabled);

    const [avatar, setAvatar] = useState(null); // -> db
    const [photo, setPhoto] = useState() // -> new 

    const [error, setError] = useState();

    const todasAsCidades = [];
    cidadesBrasil.estados.forEach((estado) => { estado.cidades.forEach((cidade) => { todasAsCidades.push({
        cidade: cidade,
        estado: estado.sigla
    })})});

        useEffect(() => {
            if (userInfos.city) {
                const estadoEncontrado = cidadesBrasil.estados.find((estado) => estado.cidades.includes(userInfos.city));

                if (estadoEncontrado) { setInputState(estadoEncontrado.sigla) }
            }
    }, [userInfos.city]);

    async function changeDataAccount(){
        try{
            if(inputNameState !== userInfos.name || inputTelephoneState !== userInfos.phone || inputCityState !== userInfos.city || photo){ 

                let avatar = userInfos.avatarUrl

                if(photo){
                    const image = await imageUpload(photo);
                    avatar = image.url; 
                }

                if (inputNameState.trim().length < 3 || inputNameState.trim().length > 100) { return setError('Nome inválido') }

                verificaTelefone(inputTelephoneState);
                validaCidade(inputCityState, inputState, todasAsCidades); 

                await updateProfile( inputNameState, inputTelephoneState, inputCityState, avatar); 
                return window.location.reload()
             }

            if(ativo1 !== userInfos.preferences.notificationsEnabled || ativo2 !== userInfos.preferences.emailsEnabled){

                await updatePreferences({
                    notificationsEnabled: ativo1,
                    matchAlertsEnabled: false,
                    emailsEnabled: ativo2
                }); 
                return window.location.reload()
            }

            setError('Não foi possivel atualizar os seus dados, verifique se você realmente realizou alguma alteração');

        } catch(erro){
            if(erro.message === 'Telefone inválido') { return setError('Telefone inválido')}
            if (erro.message === 'Estado não selecionado') { return setError('Selecione o estado da cidade') }
            if (erro.message === 'Cidade inválida') { return setError('Selecione uma cidade disponível na lista') } 
        }
    }

    return(
        <section className="user__profile">
           <div>
                <h1 className='user__profile__text'>Meu perfil</h1>
                <p className='user__profile__subtitle'>Gerencie suas informações pessoais, preferências e segurança da sua conta. </p>
            </div>

            <div>
                <PhotoCard userInfos={userInfos} photo={photo} setPhoto={setPhoto} avatar={avatar} setAvatar={setAvatar} setError={setError} />
            </div>


            <div className='user__profile__container__contents'>

                <div className='user__profile__container__default'>

                    <div className='user__profile__header'>
                        <img className='user__profile__user' src={userBlue} />
                        <h3 className='user__profile__header__subtitle'>Informações pessoais</h3>
                    </div>

                    <div>
                        <FormInfos inputState={inputState} inputCityState={inputCityState} inputEmailState={inputEmailState} setInputNameState={setInputNameState} 
                        inputNameState={inputNameState} inputTelephoneState={inputTelephoneState} setInputCityState={setInputCityState} 
                        setInputEmailState={setInputEmailState} setInputTelephoneState={setInputTelephoneState} setInputState={setInputState} todasAsCidades={todasAsCidades} /> 
                    </div>

                </div>

                <div className='user__profile__container__default'>

                    <div className='user__profile__header'>
                        <img className='user__profile__shield' src={shieldBlue} />
                        <h3 className='user__profile__header__subtitle'>Segurança</h3>
                    </div>

                    <div>
                        <SecurityLinks />
                    </div>

                </div>

                <div className='user__profile__container__default'>

                    <div className='user__profile__header'>
                        <img className='user__profile__bell' src={configBlue} />
                        <h3 className='user__profile__header__subtitle'>Preferências</h3>
                    </div>

                    <div>
                        <UserPreferences ativo1={ativo1} ativo2={ativo2} setAtivo1={setAtivo1} setAtivo2={setAtivo2} />
                    </div>

                </div>

                <div className='user__profile__container__default__danger'>

                    <div className='user__profile__header'>
                        <img className='user__profile__danger' src={dangerRed} />
                        <h3 className='user__profile__header__subtitle__danger'>Zona de perigo</h3>
                    </div>

                    <div>
                        <DangerZone />
                    </div>

                </div>
            </div>

            {error ? <p className='user__error__message'>{error}</p> : ''}

            <div className='user__profile__buttons'>

                    <button className='user__profile__save__button' onClick={() => { changeDataAccount() }}>
                        <img className='user__profile__save' src={saveWhite} />
                        <span> Salvar alterações </span>
                    </button>

                    <button className='user__profile__cancel__button' onClick={() => { window.location.reload() }}>
                        <span> Cancelar </span>
                    </button>
            </div>
        </section>
    )
}

export default UserProfile; 