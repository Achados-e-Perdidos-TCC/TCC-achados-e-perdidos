import { useState, useEffect } from 'react';
import { hoje, ontem } from '../../../../../utils/date/date';

import './userNotifications.css'; 

import notificationsJsonTest from './notifications.json'; 

import magnifyingGlassWhite from '../../../../../assets/icons/userArea/magnifyingglass-white.png';
import messageWhite from '../../../../../assets/icons/userArea/message-white.png';
import editProfileWhite from '../../../../../assets/icons/userArea/editprofile-white.png';
import pencilWhite from '../../../../../assets/icons/userArea/pencil-white.png';
import emailBlue from '../../../../../assets/icons/userArea/email-blue.png';

function UserNotifications(){

     const notificationsByDate = notificationsJsonTest.reduce((value, array) => {

        // verifica a data de cada array
        const date = array.createdAt.slice(0, 10);

        // se ainda não existir um item com essa data dentro do objeto, cria esse item com um array vazio
        if (!value[date]) { value[date] = [] }

        // como agora já existe um item com essa data dentro do objeto {}, podemos adicionar nele o array atual. 
        // assim, todos os arrays que possuem a mesma data ficam agrupados no mesmo lugar
        value[date].push(array);

        return value;
    }, {});

    function notifications(){

        const grupos = [];

        for (const data in notificationsByDate) {
    
            grupos.push(
                <div className='user__notifications__principal__container'>
                    <h2 className='notification__dateTime'>{data === hoje() ? 'Hoje' : data === ontem() ? 'Ontem' : `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)} `}</h2>

                    {notificationsByDate[data].map((value) => (
                        <div key={data}>

                            <div className={`user__notifications__container ${ value.read === false ?  'read__pending' : '' }`} >
                                <div className='user__notifications__content'>
                                    {value.type === "PROFILE_UPDATED" ? <img className='notification__img notification__green__bg' src={editProfileWhite} /> 
                                    : value.type === "ITEM_UPDATED" ? <img className='notification__img notification__orange__bg' src={pencilWhite}/> 
                                    : value.type === "POSSIBLE_MATCH" ? <img className='notification__img notification__blue__bg' src={magnifyingGlassWhite}/> : ''
                                    }

                                    <div>
                                        <h3 className='notification__content__title'>{value.title}</h3>
                                        <p className='notification__content__subtitle'>{value.message}</p>
                                    </div>
                                </div>

                                <div className='user__notifications__extra__infos'>
                                    <p className='notification__content__hour'> 10:24 </p>
                                    { value.read === false ? <span className='notification__pending'></span > : <span className='notification__no__pending'></span> }
                                </div>

                            </div>

                        </div>
                        ))}
                </div>
            )}

        return grupos; 
    }

    return( 
        <div className='user__notifications'>

            <div className='user__notifications__header__container'>
                <div>
                    <h1 className='user__notifications__text'>Notificações</h1>
                    <p className='user__notifications__subtitle'>Acompanhe as novidades sobre seus objetos e interações. </p>
                </div>

                <div className='user__notifications__read'>
                    <img className="notifications__email" src={emailBlue}/>
                    <p>Marcar todas como lidas</p>
                </div>
            </div>

            <div>
               {notifications()}
            </div>

        </div>
    )
}

export default UserNotifications; 