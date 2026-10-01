import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { userInformation } from '../../private.service.js'; 

import Sidebar from '../components/sidebar/Sidebar.jsx';

function User(){

    const [userInfos, setUserInfos] = useState(null);

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
                <Sidebar userInfos={userInfos} />
            </div>

            <Outlet />
            
        </section>
    )
}

export default User;