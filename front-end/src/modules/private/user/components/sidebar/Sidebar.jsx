import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

import { loadAvatar } from '../../../private.service.js';

import './sidebar.css'; 

import inboxGray from '../../../../../assets/icons/userArea/inbox-gray.png';
import inboxBlue from '../../../../../assets/icons/userArea/inbox-blue.png'; 
import bellGray from '../../../../../assets/icons/userArea/bell-gray.png'; 
import bellBlue from '../../../../../assets/icons/register/bell-blue.png';
import helpBlue from '../../../../../assets/icons/userArea/help-blue.png';
import arrowBlue from '../../../../../assets/icons/detalhesObjeto/arrow-blue.svg'; 

function Sidebar({ userInfos, pageActive, setPageActive, notifications}){

    let initialName = userInfos.name.slice(0, 2).toUpperCase(); 
    
    if(userInfos.name.includes(' ')){ 
        initialName = `${userInfos.name.slice(0 , 1)}${userInfos.name.split(' ')[1][0].toUpperCase()}`; 
    }

    const [open, setOpen] = useState(() => {
        const sideOpen = localStorage.getItem('sidebarPreference');
        return sideOpen === null ? true : sideOpen === 'true' ? true : false;
    });

    const [avatar, setAvatar] = useState(null); 
    const [avatarError, setAvatarError] = useState(null);

    useEffect(() => { 
        localStorage.setItem('sidebarPreference', open) 
    }, [open]); 

    useEffect(() => {

          async function findAvatar() {

            if (!userInfos.avatarUrl) { return }

            try {
                const avatarUrl = await loadAvatar(userInfos.avatarUrl);

                setAvatar(avatarUrl);

            } catch (error) {
                setAvatarError(true); 
            }
        }

        findAvatar();
    }, [userInfos.avatarUrl])
    

    return (
        <div className={`${open ? 'user__sidebar__open' : 'user__sidebar__close'}`}>
            <div className='sidebar__content'>

                <div className={open ? 'sidebar__close__button' : 'sidebar__open__button'} onClick={() => { setOpen((valor) => {return valor === true ? false : true})}}>
                    {<img className={`sidebar__arrow ${open ? '' : 'sidebar__arrow__close'}`} src={arrowBlue} /> }
                </div>

                <NavLink end >
                    <div className={`sidebar__profile__container ${pageActive === 1 ? 'profile__active' : '' }`} onClick={() => { setPageActive(1) }}>
                        <div className={!userInfos.avatarUrl || avatarError === true ? 'sidebar__without__photo' : 'sidebar__with__photo'}>
                            {!userInfos.avatarUrl || avatarError === true ? <p> { initialName } </p> : <img className='photo' src={`${avatar}`}/> } 
                        </div>

                        <div>
                            <p className='sidebar__profile__name'>{userInfos.name.length >= 24 ? `${userInfos.name.slice(0, 24)}...` : userInfos.name}</p>
                            <p className='sidebar__profile__email'>{userInfos.email.length >= 29 ? `${userInfos.email.slice(0,24)}...` : userInfos.email}</p>
                        </div>
                    </div>
                </NavLink>

                <div className='sidebar__links__container' >
                    <div className={`sidebar__link ${pageActive === 2 ? 'link__active' : 'none__active'}`} onClick={() => { setPageActive(2) } } >
                            {pageActive === 2 ? <img  src={inboxBlue} /> : <img  src={inboxGray}  />}
                            <p>Meus objetos</p>
                    </div>

                    <div className={`sidebar__notification  ${pageActive === 3 ? 'link__active' : 'none__active'}`} onClick={() => { setPageActive(3) } }>
                        <div className={`sidebar__link `}>
                            {pageActive === 3 ? <img  className='sidebar__bell' src={bellBlue} /> : <img  className='sidebar__bell' src={bellGray} /> } 
                            <p>Notificações</p>
                        </div>

                        <div>
                            {notifications > 0 && notifications < 51 ? <p className={`notification__sidebar__text ${notifications < 10 ? 'one' : 'two'}`}>{notifications}</p> : ''} 
                            {notifications > 50 ? <p className={`notification__sidebar__text three`}>+50</p> : ''}
                        </div>
                    </div>

                </div>

                <NavLink  end className='sidebar__link sidebar__help__container'>
                        <div className='sidebar__help__content'>
                            <img src={helpBlue} /> 
                            <p>Central de ajuda</p>
                        </div>
                </NavLink>

            </div>
        </div>
    )
}

export default Sidebar;