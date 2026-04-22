import { goto } from "$app/navigation";

const API_URL = import.meta.env.VITE_API_URL;

export const clearAuth = () => {
  if (typeof localStorage === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const refreshAccessToken = async () => {
  if (typeof localStorage === "undefined") return null;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token: refreshToken })
  });

  if (!res.ok) return null;

  const data = await res.json();
  const accessToken = data.accessToken || data.token;

  if (!accessToken) return null;

  localStorage.setItem("token", accessToken);
  return accessToken;
};

export const fetchWithAuth = async (url, options = {}) => {
  if (typeof localStorage === "undefined") {
    return fetch(url, options);
  }

  const headers = options.headers ? { ...options.headers } : {};
  const token = localStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status !== 401) return res;

  const newToken = await refreshAccessToken();

  if (!newToken) {
    clearAuth();
    goto("/login");
    return null;
  }

  res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: `Bearer ${newToken}`
    }
  });

  if (res.status === 401) {
    clearAuth();
    goto("/login");
    return null;
  }

  return res;
};
