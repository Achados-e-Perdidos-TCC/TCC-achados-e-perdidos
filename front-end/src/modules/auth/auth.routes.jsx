import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx'; 

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
        }
        
    ]
}

export default routerAuth; 