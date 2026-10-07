import './securityLinks.css'; 

import keyBlue from '../../../../../../../assets/icons/userArea/key-blue.png';
import padlockBlue from '../../../../../../../assets/icons/userArea/padlock-blue.png';
import arrowGray from '../../../../../../../assets/icons/detalhesObjeto/arrow-gray.svg';

function SecurityLinks(){

    return (
        <div className='user__security'>
            <div className='user__security__links__container'>

                <div className='user__security__links__content'>

                    <img className='user__security__img' src={padlockBlue} />

                    <div>
                        <h4 className='user__security__title'>Alterar Senha</h4>
                        <p className='user__security__subtitle'>Atualize sua senha regularmente.</p>
                    </div>

                </div>

                <img className='user__security__arrow' src={arrowGray} />

            </div>

            <hr />

            <div className='user__security__links__container'>

                <div className='user__security__links__content'>
                    <img className='user__security__img' src={keyBlue} />

                    <div>
                        <h4 className='user__security__title'>Autenticação</h4>
                        <p className='user__security__subtitle'>Gerencie seus metodos de Autenticação.</p>
                    </div>
                </div>

                <img className='user__security__arrow' src={arrowGray}  />

            </div>

        </div>
    )
}

export default SecurityLinks;