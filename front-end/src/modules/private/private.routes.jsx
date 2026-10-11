import PrivateRoute from "../../routes/PrivateRoute";
import userRoutes from './user/user.routes.jsx'; 
import editdetalhesObjetoRoutes from "./edit-detalhes-objeto/editdetalhesObjeto.routes.jsx"; 
import changePasswordRoutes from "./change-password/changePassword.routes.jsx";

const privateRouter = {
    element: <PrivateRoute />, 
    children: [
        userRoutes,
        editdetalhesObjetoRoutes,
        changePasswordRoutes
    ]
}

export default privateRouter; 