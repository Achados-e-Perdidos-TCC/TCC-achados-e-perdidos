// fetch central, injeta token, trata 401/refresh

import { ENDPOINTS } from "./endpoints";

async function request(url, options = {}, tentouRefresh = false) {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("temporaryToken");

    const headers = new Headers(options.headers || {});

    const isFormData =
        typeof FormData !== "undefined" &&
        options.body instanceof FormData;

    if (isFormData) {
        headers.delete("Content-Type");
    } else if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if ((response.status === 401 || response.status === 403) && accessToken && !tentouRefresh) {

        const renovou = await tentarRefresh();

        if (renovou) { return request(url, options, true) };
    }

    const data = await response.json().catch(() => { return null });

    if (!response.ok) { throw new Error((data ? data.message : undefined) || "Erro na requisicao") }

    return data;
}

async function tentarRefresh() {
    const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem('temporaryToken');
        window.location.reload();
        return false
    }

    const response = await fetch(ENDPOINTS.auth.refresh, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem('temporaryToken');
        sessionStorage.removeItem('refreshToken');
        window.location.reload();
        return false;
    }

    const data = await response.json();

    if (localStorage.getItem("refreshToken")) {

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

    } else {
        sessionStorage.setItem("temporaryToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);
    }

    return true;
}

export default request;