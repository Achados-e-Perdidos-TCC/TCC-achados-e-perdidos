// fetch central, injeta token, trata 401/refresh

import { ENDPOINTS } from "./endpoints";

async function request(url, options = {}, tentouRefresh = false) {
    const acessToken = localStorage.getItem("acessToken");

    const response = await fetch(url, {
        ...options, 
        headers: {
            // Content-Type é um header HTTP que informa ao servidor que o conteúdo que estou enviando está neste formato
            "content-Type": "application/json",
            ...acessToken ? { Authorization: `Bearer ${acessToken}` } : {},
            ...options.headers,
        }, 
    }); 

    if (response.status === 401 && acessToken && !tentouRefresh){

        const renovou = await tentarRefresh();

        if (renovou) { return request(url, options, true) };
    }

    const data = await response.json().catch(() => { return null });

    if(!response.ok) { throw new Error(data.message || "Erro na requisicao") }

    return data; 
}

async function tentarRefresh(){
    const refreshToken = localStorage.getItem("refreshToken");
    if(!refreshToken) { return false }

    const response = await fetch(ENDPOINTS.auth.refresh, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }), 
    }); 

    if (!response.ok) {
        localStorage.removeItem("acessToken");
        localStorage.removeItem("refreshToken");
        return false; 
    }

    const data = await response.json();
    localStorage.setItem("acessToken", data.acessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return true;
}

export default request;