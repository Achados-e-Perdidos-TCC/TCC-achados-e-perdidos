import PrivateRoute from "../../routes/PrivateRoute";
import UserArea from '../private/user/pages/User.jsx'; 

const privateRouter = {
    element: <PrivateRoute />, 
    children: [
        {
            path: 'user-area', 
            element: <UserArea />
        }
    ]
}

export default privateRouter; 