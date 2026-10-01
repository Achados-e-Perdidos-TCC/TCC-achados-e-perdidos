import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx'; 
import ForgotPassword from './pages/forgot-password/Forgot-password.jsx'; 

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
            path: 'forgot-password', 
            element: <ForgotPassword />
        }
    ]
}

export default routerAuth; 