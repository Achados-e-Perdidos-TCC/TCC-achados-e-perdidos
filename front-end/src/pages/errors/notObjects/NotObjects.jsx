import './notObjects.css';

import notFoundIllustration from '../../../assets/icons/notobjects/notFound-illustration.png'; 
import garbageWhite from '../../../assets/icons/notobjects/garbage-white.png'; 

function NotObjects(){

    return (
        <div className='notobjects__container'>
            <div className='notobject__content'>
                <img className="notobject__img" src={notFoundIllustration} />

                <div>
                    <h1 className='notobject__title'> Ops! Não encontramos nenhum objeto</h1>
                    <p className='notobject__subtitle'> Se você aplicou algum filtro, tente removê-lo. </p>
                </div>

                <div>

                    <div className='notobject__form__button notobject__button__blue' onClick={() => { window.location.reload() }} >
                        <img className='notobject__img__button' src={garbageWhite} />
                        <p>Limpar filtros</p>
                    </div>

                </div>
            </div>
        </div>
    )

}

export default NotObjects;