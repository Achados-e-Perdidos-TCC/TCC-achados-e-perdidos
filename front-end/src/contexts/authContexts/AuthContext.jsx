import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }){

    let accessToken = false

    if (localStorage.getItem("accessToken") === null || sessionStorage.getItem("temporaryToken") === null){
        accessToken === false; 
    } else { 
        accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("temporaryToken"); 
    }

    const [ isAuthenticated, setIsAuthenticated ] = useState(!accessToken ? false : true); 

    return (
        <AuthContext.Provider value={ { isAuthenticated, setIsAuthenticated } }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;

