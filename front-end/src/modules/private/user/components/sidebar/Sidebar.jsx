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

function Sidebar({ userInfos }){

    const initialName = `${userInfos.name.slice(0 , 1)}${userInfos.name.split(' ')[1][0].toUpperCase()}`; 

    const [routeActive, setRouteActive] = useState(1);
    const [open, setOpen] = useState(true);
    const [avatar, setAvatar] = useState(null); 

    useEffect(() => {

          async function findAvatar() {

            if (!userInfos.avatarUrl) { return }

            try {
                const avatarUrl = await loadAvatar(userInfos.avatarUrl);

                setAvatar(avatarUrl);

            } catch (error) {
                return (<p> { initialName } </p>)
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
                    <div className='sidebar__profile__container'>
                        <div className={!userInfos.avatarUrl ? 'sidebar__without__photo' : 'sidebar__with__photo'}>
                            {!userInfos.avatarUrl ? <p> { initialName } </p> : <img className='photo' src={`${avatar}`}/> } 
                        </div>

                        <div>
                            <p className='sidebar__profile__name'>{userInfos.name.length >= 24 ? `${userInfos.name.slice(0, 24)}...` : userInfos.name}</p>
                            <p className='sidebar__profile__email'>{userInfos.email.length >= 29 ? `${userInfos.email.slice(0,24)}...` : userInfos.email}</p>
                        </div>
                    </div>
                </NavLink>

                <div className='sidebar__links__container' >
                    <NavLink  end className={`sidebar__link ${routeActive === 1 ? 'link__active' : ''}`} onClick={() => { setRouteActive(1) } } >
                            {routeActive === 1 ? <img  src={inboxBlue} /> : <img  src={inboxGray}  />}
                            <p>Meus objetos</p>
                    </NavLink>

                    <NavLink  end className={`sidebar__link ${routeActive === 2 ? 'link__active' : ''}`} onClick={() => { setRouteActive(2) } }>
                            {routeActive === 2 ? <img  className='sidebar__bell' src={bellBlue} /> : <img  className='sidebar__bell' src={bellGray} /> } 
                            <p>Notificações</p>
                    </NavLink>

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