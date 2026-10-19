import { NavLink } from 'react-router'; 
import './notAuthenticated.css'; 

import entrarWhite from '../../../assets/icons/login/entrar-white.png';
import addUserBlue from '../../../assets/icons/notAuthenticated/addUser-blue.png';
import lockedUserBlue from '../../../assets/icons/notAuthenticated/lockedUser-blue.png';

function NotAuthenticated(){

    return (
        <div className='authenticated__container'>

            <div className='authenticated__content'>

                <div className='authenticated__upload__image__content'>
                    <img className='authenticated__upload__image' src={lockedUserBlue} />
                </div>

                <div className='authenticated__texts'>
                    <h1 className='authenticated__title'>Você precisa entrar na sua conta</h1>
                    <p className='authenticated__subtitle'>Para acessar esta área e gerenciar suas informações, entre na sua conta ou crie um cadastro gratuito.</p>
                </div>

                <div className='authenticated__container__buttons'>

                    <NavLink className='authenticated__form__button authenticated__button__blue' to='/auth/login' end >
                        <img className='authenticated__img__button' src={entrarWhite} />
                        <p>Entrar na minha conta</p>
                    </NavLink>

                    <NavLink className='authenticated__form__button authenticated__button__white' to='/auth/register' end >
                        <img  classname='authenticated__img__button' src={addUserBlue} />
                        <p>Criar minha conta</p>
                    </NavLink>
                    
                </div>

            </div>
        </div>
    )
}

export default NotAuthenticated