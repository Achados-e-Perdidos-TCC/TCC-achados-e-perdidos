import request from '../../lib/api/api.js';
import { ENDPOINTS } from '../../lib/api/endpoints.js';

export async function login(email, password, lembrarDeMim = false) {

    const data = await request(ENDPOINTS.auth.login, {
        method: "POST", 
        body: JSON.stringify({ email, password }),
    }); 

    if (lembrarDeMim){
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
    }

    sessionStorage.setItem("temporaryToken", data.accessToken); 
    sessionStorage.setItem("refreshToken", data.accessToken);

    return data
}

export async function register(name, email, password ){

    const data = await request(ENDPOINTS.auth.register, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    })

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data; 
}

export async function imageUpload( file ) {

    const formData = new FormData();

    formData.append('file', file);

    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(ENDPOINTS.uploads, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    });

    const data = await response.json();

    if (!response.ok) { throw new Error(data.message || 'Erro ao enviar imagem') }

    return data;
}

export async function updateProfile( name, phone, city, avatarUrl ){

    const data = await request(ENDPOINTS.users.me, {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, city, avatarUrl })
    })

    return data; 
}

export async function updatePreferences( preferences ){

    const data = await request(ENDPOINTS.users.preferences, {
        method: 'PATCH',
        body: JSON.stringify( preferences )
    })

    return data; 
}

export async function forgetPassword( email ){

     const data = await request(ENDPOINTS.auth.forgotpassword, {
        method: 'POST',
        body: JSON.stringify( email )
    })

    return data; 
}

export function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}