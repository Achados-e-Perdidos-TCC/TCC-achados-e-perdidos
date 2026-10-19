import { NavLink } from 'react-router'; 
import './securityLinks.css'; 

import padlockBlue from '../../../../../../../assets/icons/userArea/padlock-blue.png';
import arrowGray from '../../../../../../../assets/icons/detalhesObjeto/arrow-gray.svg';

function SecurityLinks(){

    return (
        <div className='user__security'>
            <NavLink className='user__security__links__container' to='/user-area/change-password'>

                <div className='user__security__links__content'>

                    <img className='user__security__img' src={padlockBlue} />

                    <div>
                        <h4 className='user__security__title'>Alterar Senha</h4>
                        <p className='user__security__subtitle'>Atualize sua senha regularmente.</p>
                    </div>

                </div>

                <img className='user__security__arrow' src={arrowGray} />

            </NavLink>

        </div>
    )
}

export default SecurityLinks;