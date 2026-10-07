import { useState, useContext } from 'react';
import { NavLink } from 'react-router';
import { logout, deleteAccount } from '../../../../../private.service';
import {AuthContext } from '../../../../../../../contexts/authContexts/AuthContext.jsx'; 

import './dangerZone.css';

function DangerZone(){

    const { setIsAuthenticated } = useContext(AuthContext);
    const [attempts, setAttempts] = useState(0);

    function userLogout(){
        logout()
        return setIsAuthenticated(false);
    }

    async function deleteUserAccount(){ 

        setAttempts( attempts <= 0 ? 1 : 0 )

        if (attempts === 1){
            await deleteAccount();
            return setIsAuthenticated(false);
        }
    }

    return (
        <div className='user__danger__zone'>

            <div className='user__danger__container'>
                <div>
                    <h3 className='user__danger__title'>Deslogar</h3>
                    <p className='user__danger__subtitle'>Você poderá logar novamente se quiser.</p>
                </div>

                <NavLink className='user__danger__button' to='/' end onClick={() => { userLogout() }}>
                    <span>Deslogar</span>
                </NavLink>
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

                <NavLink className='user__danger__button' to={attempts === 1 ? '/' : ''} onClick={() => { deleteUserAccount() }}>
                    {attempts === 1 ? <span>Exclua minha conta</span> : <span>Excluir Conta</span>}
                </NavLink>
            </div>
        </div>
    )
}

export default DangerZone;