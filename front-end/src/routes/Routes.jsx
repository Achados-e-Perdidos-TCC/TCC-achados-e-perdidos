// Junta as rotas de todos os modulos (modules)

import { createBrowserRouter } from 'react-router';
import App from '../App.jsx';
import NotFoundPage from '../pages/errors/notFound/NotFound.jsx'; 

import routesBuscarObjetos from '../modules/buscar-objetos/buscarObjetos.routes.jsx';
import routesDetalhesObjeto from '../modules/detalhes-objeto/detalhesObjeto.routes.jsx'; 

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
            routesBuscarObjetos,
            routesDetalhesObjeto,
            
        ]                
    }
])

export default router;