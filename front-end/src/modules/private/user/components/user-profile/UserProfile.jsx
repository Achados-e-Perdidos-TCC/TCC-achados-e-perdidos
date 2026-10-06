import { useState } from 'react'; 

import FormInfos from './components/formInfos/FormInfos.jsx'; 
import PhotoCard from './components/photoCard/PhotoCard.jsx'; 

import './UserProfile.css'; 

import userBlue from '../../../../../assets/icons/register/user-blue.png'; 
import bellBlue from '../../../../../assets/icons/register/bell-blue.png'; 
import shieldBlue from '../../../../../assets/icons/userArea/protect-blue.png';
import keyBlue from '../../../../../assets/icons/userArea/key-blue.png';
import padlockBlue from '../../../../../assets/icons/userArea/padlock-blue.png';
import dangerRed from '../../../../../assets/icons/userArea/danger-red.png';


function UserProfile({ userInfos }){

    const [inputNameState, setInputNameState] = useState(userInfos.name);
    const [inputEmailState, setInputEmailState] = useState(userInfos.email);
    const [inputTelephoneState, setInputTelephoneState] = useState(userInfos.phone);

    const [inputCityState, setInputCityState] = useState(userInfos.city);
    const [inputState, setInputState] = useState('');

    const [avatar, setAvatar] = useState(null); 

    const [photo, setPhoto] = useState()

    return(
        <section className="user__profile">
           <div>
                <h1 className='user__profile__text'>Meu perfil</h1>
                <p className='user__profile__subtitle'>Gerencie suas informações pessoais, preferências e segurança da sua conta. </p>
            </div>

            <div>
                <PhotoCard userInfos={userInfos} photo={photo} setPhoto={setPhoto} avatar={avatar} setAvatar={setAvatar} />
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
                        setInputEmailState={setInputEmailState} setInputTelephoneState={setInputTelephoneState} setInputState={setInputState} /> 
                    </div>

                </div>

                <div className='user__profile__container__default'>

                        <div className='user__profile__header'>
                            <img className='user__profile__shield' src={shieldBlue} />
                            <h3 className='user__profile__header__subtitle'>Segurança</h3>
                        </div>

                        

                </div>

                <div className='user__profile__container__default'>

                        <div className='user__profile__header'>
                            <img className='user__profile__bell' src={bellBlue} />
                            <h3 className='user__profile__header__subtitle'>Preferências</h3>
                        </div>


                </div>

                <div className='user__profile__container__default__danger'>

                        <div className='user__profile__header'>
                            <img className='user__profile__danger' src={dangerRed} />
                            <h3 className='user__profile__header__subtitle__danger'>Zona de perigo</h3>
                        </div>

                </div>

               

            </div>

        </section>
    )
}

export default UserProfile; 