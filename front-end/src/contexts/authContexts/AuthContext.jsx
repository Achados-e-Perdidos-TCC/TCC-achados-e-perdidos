import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }){

    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("temporaryToken"); 

    const [ isAuthenticated, setIsAuthenticated ] = useState(!accessToken ? false : true); 

    return (
        <AuthContext.Provider value={ { isAuthenticated, setIsAuthenticated } }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;

