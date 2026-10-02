import { useEffect, useState } from 'react';

import { userInformation } from '../../private.service.js'; 

import './user.css'; 

import Sidebar from '../components/sidebar/Sidebar.jsx';
import UserObjects from '../components/user-objects/UserObjects.jsx';

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

            <div className={`user__area__objects ${pageActive === 1 ? '' : 'user__none' }`} >
                <UserObjects userInfos={userInfos} />
            </div>
            
        </section>
    )
}

export default User;