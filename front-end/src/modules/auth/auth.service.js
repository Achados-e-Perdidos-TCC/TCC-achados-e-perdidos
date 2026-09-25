import request from '../../lib/api/api.js';
import { ENDPOINTS } from '../../lib/api/endpoints.js';

export async function login(email, password, lembrarDeMim = false) {

    const data = await request(ENDPOINTS.auth.login, {
        method: "POST", 
        body: JSON.stringify({ email, password }),
    }); 

    if (lembrarDeMim){
        localStorage.setItem("acessToken", data.acessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
    }

    sessionStorage.setItem("temporaryToken", data.acessToken); 

    return data
}

export function logout() {
    localStorage.removeItem("acessToken");
    localStorage.removeItem("refreshToken");
}