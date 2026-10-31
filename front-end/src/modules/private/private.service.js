import request from "../../lib/api/api.js";
import { ENDPOINTS } from "../../lib/api/endpoints.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function userInformation() {
  const data = await request(ENDPOINTS.users.me, {
    method: "GET",
  });

  return data;
}

export async function loadAvatar(avatarUrl) {
  // .slice() para cortar /api/v1
  const response = await fetch(`${API_URL.slice(0, 21)}${avatarUrl}`);

  if (!response.ok) {
    throw new Error("Erro ao carregar avatar");
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
}

export async function deleteAccount() {
  const data = await request(ENDPOINTS.users.me, {
    method: "DELETE",
  });

  return data;
}

export async function changeNewUserPassword(currentPassword, newPassword) {
  const data = await request(ENDPOINTS.users.password, {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  return data;
}

export async function myObjects() {
  const data = await request(ENDPOINTS.item.me, {
    method: "GET",
  });

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.content) ? data.content : [];
}

export async function findMyObject(id) {
  const data = await request(ENDPOINTS.item.find(id), {
    method: "GET",
  });

  return data;
}

export async function notification() {
  const data = await request(ENDPOINTS.notification.get, {
    method: "GET",
  });

  return data;
}

export async function markAllNotificationsAsRead() {
  const data = await request(ENDPOINTS.notification.readAll, {
    method: "PATCH",
  });

  console.log("MARCAR TODAS:", data);

  return data;
}

export async function markNotificationAsRead(id) {
  const data = await request(ENDPOINTS.notification.read(id), {
    method: "PATCH",
  });

  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}
