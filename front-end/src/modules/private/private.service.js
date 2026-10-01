import request from '../../lib/api/api.js';
import { ENDPOINTS } from '../../lib/api/endpoints.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function userInformation() {

    const data = await request(ENDPOINTS.users.me, {
        method: "GET"
    }); 

    return data
}

export async function loadAvatar(avatarUrl){

    // .slice() para cortar /api/v1
    const response = await fetch(`${API_URL.slice(0, 21)}${avatarUrl}`);

    if (!response.ok) { throw new Error("Erro ao carregar avatar") }

    const blob = await response.blob();

    return URL.createObjectURL(blob);
}