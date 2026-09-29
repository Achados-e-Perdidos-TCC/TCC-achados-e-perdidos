import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx'; 
import EsqueciSenha from './pages/esqueci-senha/EsqueciSenha.jsx'; 

const routerAuth = {
    path: '/auth',
    children: [
        {
            path: 'login', 
            element: <Login />
        }, 
        {
            path: 'register', 
            element: <Register />
        },
        {
            path: 'esqueci-senha', 
            element: <EsqueciSenha />
        }
    ]
}

export default routerAuth; 