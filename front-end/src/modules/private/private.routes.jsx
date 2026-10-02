import PrivateRoute from "../../routes/PrivateRoute";
import userRoutes from './user/user.routes.jsx'; 

const privateRouter = {
    element: <PrivateRoute />, 
    children: [
        userRoutes,
    ]
}

export default privateRouter; 