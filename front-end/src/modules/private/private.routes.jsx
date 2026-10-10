import PrivateRoute from "../../routes/PrivateRoute";
import userRoutes from './user/user.routes.jsx'; 
import editdetalhesObjetoRoutes from "./edit-detalhes-objeto/editdetalhesObjeto.routes.jsx"; 

const privateRouter = {
    element: <PrivateRoute />, 
    children: [
        userRoutes,
        editdetalhesObjetoRoutes
    ]
}

export default privateRouter; 