// Protege rotas que precisam de login

import { useContext } from 'react'
import { AuthContext } from '../contexts/authContexts/AuthContext.jsx'; 
import { Outlet, useOutletContext } from 'react-router'

import NotAuthenticated from '../pages/errors/notAuthenticated/NotAuthenticated.jsx'; 

function PrivateRoute(){

    const { isAuthenticated } = useContext(AuthContext);

    const context = useOutletContext();

    if (!isAuthenticated){ return <NotAuthenticated /> }

    return <Outlet context={context} />

}

export default PrivateRoute