// Junta as rotas de todos os modulos (modules)

import { createBrowserRouter } from 'react-router';
import App from '../App.jsx';
import NotFoundPage from '../pages/errors/notFound/NotFound.jsx'; 

import routesBuscarObjetos from '../modules/buscar-objetos/buscarObjetos.routes.jsx';
import routesDetalhesObjeto from '../modules/detalhes-objeto/detalhesObjeto.routes.jsx'; 
import routesHome from '../modules/home/home.routes.jsx';
import routesLogin from '../modules/login/login.routes.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
            routesHome,
            routesBuscarObjetos,
            routesDetalhesObjeto,
            routesLogin,
            
        ]                
    }
])

export default router;