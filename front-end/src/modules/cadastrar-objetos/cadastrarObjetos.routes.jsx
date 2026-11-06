import CadastrarObjetos from "./pages/CadastrarObjeto.jsx";
import PrivateRoute from "../../routes/PrivateRoute.jsx";

const routerCadastrarObjetos = {
    path: "/cadastrar-objetos",
    element: <PrivateRoute />,
    children: [
        {
            index: true,
            element: <CadastrarObjetos />
        }
    ]
};

export default routerCadastrarObjetos;