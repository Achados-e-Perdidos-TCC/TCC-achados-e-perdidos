import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }){

    const acessToken = localStorage.getItem("acessToken") || sessionStorage.getItem("temporaryToken"); 

    const [ isAuthenticated, setIsAuthenticated ] = useState(acessToken ? true : false); 

    return (
        <AuthContext.Provider value={ { isAuthenticated, setIsAuthenticated } }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;

