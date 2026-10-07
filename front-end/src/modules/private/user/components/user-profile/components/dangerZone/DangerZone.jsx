import { useState, useContext } from 'react';
import { logout } from '../../../../../private.service';
import {AuthContext } from '../../../../../../../contexts/authContexts/AuthContext.jsx'; 

import './dangerZone.css';

function DangerZone(){

    const { setIsAuthenticated } = useContext(AuthContext);
    const [attempts, setAttempts] = useState(0);

    function userLogout(){
        logout()
        setIsAuthenticated(false);
    }

    function deleteAccount(){ 

        setAttempts( attempts <= 0 ? 1 : 0 )

        if (attempts === 1){
            return console.log('conta excluida');
            // return window.location.reload(); 
        }
    }

    return (
        <div className='user__danger__zone'>

            <div className='user__danger__container'>
                <div>
                    <h3 className='user__danger__title'>Deslogar</h3>
                    <p className='user__danger__subtitle'>Você poderá logar novamente se quiser.</p>
                </div>

                <button className='user__danger__button' onClick={() => { userLogout() }}>
                    <span>Deslogar</span>
                </button>
            </div>

            <hr />

            {attempts === 1 ? (
                <div className="user__delete__confirmation">
                    <span className="user__delete__confirmation__icon">!</span>

                    <div className="user__delete__confirmation__content">
                        <strong className="user__delete__confirmation__title">Tem certeza que deseja excluir sua conta?</strong>
                        <p className="user__delete__confirmation__subtitle">Essa ação não poderá ser desfeita.</p>
                    </div>
                </div>
            ) : ''}

            <div className='user__danger__container'>
                <div>
                    <h3 className='user__danger__title'>Excluir Conta</h3>
                    <p className='user__danger__subtitle'>Esta ação é permanente e não pode ser desfeita.</p>
                </div>

                <button className='user__danger__button' onClick={() => { deleteAccount() }}>
                    {attempts === 1 ? <span>Exclua minha conta</span> : <span>Excluir Conta</span>}
                </button>
            </div>
        </div>
    )
}

export default DangerZone;