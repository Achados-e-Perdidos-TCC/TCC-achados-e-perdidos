import PrivateRoute from "../../routes/PrivateRoute";
import userRoutes from './user/user.routes.jsx'; 
import editdetalhesObjetoRoutes from "./edit-detalhes-objeto/editdetalhesObjeto.routes.jsx"; 
import changePasswordRoutes from "./change-password/changePassword.routes.jsx";
import editarObjetoRoutes from "./edit-objeto/editarObjeto.routes.jsx";

const privateRouter = {
    element: <PrivateRoute />, 
    children: [
        userRoutes,
        editarObjetoRoutes,
        editdetalhesObjetoRoutes,
        changePasswordRoutes
    ]
}

export default privateRouter; 