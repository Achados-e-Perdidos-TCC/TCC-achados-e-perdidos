import { NavLink } from 'react-router'; 
import './notFound.css'; 

import findBlue from '../../../assets/icons/notFound/find-blue.png';
import houseWhite from '../../../assets/icons/notFound/house-white.png';
import notFoundBlue from '../../../assets/icons/notFound/notFound-blue.png';

function NotFound(){

    return (
        <div className='notfound__container'>

            <div className='notfound__content'>

                <div className='notfound__upload__image__content'>
                    <img className='notfound__upload__image' src={notFoundBlue} />
                </div>

                <div className='notfound__texts'>
                    <h1 className='notfound__title'>Ops! Página não encontrada</h1>
                    <p className='notfound__subtitle'>Não conseguimos encontrar a página que você está procurando.</p>
                </div>

                <div className='notfound__container__buttons'>

                    <NavLink className='notfound__form__button notfound__button__blue' to='/' end >
                        <img className='notfound__img__button' src={houseWhite} />
                        <p>Voltar para o início</p>
                    </NavLink>

                    <NavLink className='notfound__form__button notfound__button__white' to='/buscar-objetos' end >
                        <img  className='notfound__img__button' src={findBlue} />
                        <p>Buscar objetos</p>
                    </NavLink>
                    
                </div>

            </div>
        </div>
    )
}

export default NotFound