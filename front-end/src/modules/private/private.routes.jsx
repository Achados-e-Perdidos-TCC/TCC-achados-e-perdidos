import PrivateRoute from "../../routes/PrivateRoute";
import userRoutes from "./user/user.routes.jsx";

import changePasswordRoutes from "./change-password/changePassword.routes.jsx";
import editarObjetoRoutes from "./edit-objeto/editarObjeto.routes.jsx";

const privateRouter = {
  element: <PrivateRoute />,
  children: [userRoutes, editarObjetoRoutes, changePasswordRoutes],
};

export default privateRouter;
