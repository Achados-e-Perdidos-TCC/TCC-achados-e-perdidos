import { useEffect, useState } from 'react';

import { userInformation } from '../../private.service.js'; 

import './user.css'; 

import Sidebar from '../components/sidebar/Sidebar.jsx';
import UserObjects from '../components/user-objects/UserObjects.jsx';
import UserProfile from '../components/user-profile/UserProfile.jsx'; 
import UserNotifications from '../components/user-notifications/UserNotifications.jsx'; 

function User(){

    const [userInfos, setUserInfos] = useState(null);
    const [pageActive, setPageActive] = useState(1);

    useEffect(() => {

        async function getUserInformation() {
            const data = await userInformation(); 
            setUserInfos(data);
        }

        getUserInformation()

    }, []); 

    if (!userInfos) { return ( <p> Carregando... </p> )}

    return (
        <section className='user__area'>

            <div className='user__area__sidebar'>
                <Sidebar userInfos={userInfos} pageActive={ pageActive } setPageActive={ setPageActive } />
            </div>

            <div className={`user__area__profile ${pageActive === 1 ? '' : 'user__none' }`}>
                <UserProfile userInfos={userInfos} />
            </div>

            <div className={`user__area__objects ${pageActive === 2 ? '' : 'user__none' }`} >
                <UserObjects userInfos={userInfos} />
            </div>

            <div className={`user__area__objects ${pageActive === 3 ? '' : 'user__none' }`} >
                <UserNotifications userInfos={userInfos} />
            </div>
            
        </section>
    )
}

export default User;