// Protege rotas que precisam de login

import { useContext } from 'react'
import { AuthContext } from '../contexts/authContexts/AuthContext.jsx'; 
import { Outlet } from 'react-router'

import NotAuthenticated from '../pages/errors/notAuthenticated/NotAuthenticated.jsx'; 

function PrivateRoute(){

    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated){ return <NotAuthenticated /> }

    return <Outlet />

}

export default PrivateRoute