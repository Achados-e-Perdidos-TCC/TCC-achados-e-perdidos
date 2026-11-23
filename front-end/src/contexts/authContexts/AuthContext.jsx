import { useState } from "react";
import { AuthContext } from "./context.js";

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("temporaryToken");

    return Boolean(accessToken);
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
