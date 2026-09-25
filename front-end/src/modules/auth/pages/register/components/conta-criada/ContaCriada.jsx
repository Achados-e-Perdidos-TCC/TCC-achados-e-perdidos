import { useState } from 'react'; 
import { useOutletContext, NavLink } from 'react-router'; 

import './contaCriada.css'; 

import success from '../../../../../../assets/icons/register/success.png'; 

function ContaCriada(){

    return (
        <div className='conta__criada'>
            <img className='success__image' src={success} />

            <div>
                <h1 className='success__title'>Conta criada com sucesso!</h1>
                <p className='success__subtitle'>Sua conta no Achados e Devolvidos foi criada. Agora você já pode explorar e usar o sistema.</p>
            </div>

            <div className='success__button' onClick={() => {window.location.href = "/"}}>
                <p className='success__link'> Ir para meu perfil </p>
            </div>

            <div onClick={() => {window.location.href = "/"}}>
                <p className='success__return__link '> Voltar para início</p>
            </div>
        </div>
    )
}

export default ContaCriada;