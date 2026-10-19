import { useState } from 'react';
import { useOutletContext } from 'react-router';

import './userPreferences.css';

function UserPreferences({ ativo1, ativo2, setAtivo1, setAtivo2 }){
    
    const [temaAberto, setTemaAberto] = useState(false);

    const { tema, setTema } = useOutletContext();

    return (
        <div className='user__profile__preferences'>

            <div className='user__profile__preferences__container'>

                <div>   
                    <h4 className='user__profile__preferences__title'> Receber Notificações </h4>
                    <p className='user__profile__preferences__subtitle'> Receba notificações sobre novidades da plataforma </p>
                </div>

                <div className={`preference__button ${ ativo1 ? "ativo1" : ''}`} onClick={ () => setAtivo1(!ativo1)} >
                    <span />
                </div>

            </div>

            <hr />

            <div className='user__profile__preferences__container'>
                <div >   
                    <h4 className='user__profile__preferences__title'>Atualizações por email</h4>
                    <p className='user__profile__preferences__subtitle'> Receba atualizações importantes por e-mail </p>
                </div>

                <div className={`preference__button ${ ativo2 ? "ativo2" : ''}`} onClick={ () => setAtivo2(!ativo2)} >
                    <span />
                </div>
            </div>

            <hr />

            <div className='user__profile__preferences__container'>
                <div className='user__profile__select__container'>  

                    <h4 className='user__profile__preferences__title preferences__theme__title'>Tema</h4>
                    
                   <div className="custom__select">

                        <button className={`custom__select__button ${!temaAberto ? `select__button__off` : 'select__button__on' }`} 
                        onClick={() => setTemaAberto(!temaAberto)} >

                            <span>
                                {tema === 'light' ? 'Claro' : 'Escuro'}
                            </span>
                            
                        </button>

                        {temaAberto ? (
                            <div className="custom-select__options">

                                <button className="custom-select__option" onClick={() => setTema('light')}>
                                    Claro
                                </button>

                                <button className="custom-select__option" onClick={() => setTema('dark')}>
                                    Escuro
                                </button>
            
                            </div>) : null
                        }

                    </div>

                </div>

                
            </div>
            
        </div>
    )
}

export default UserPreferences;