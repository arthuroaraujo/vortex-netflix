import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    "voxter_token",
  );

  const isAuthRoute =
    config.url?.startsWith("/auth/login") ||
    config.url?.startsWith("/auth/register");

  if (token && !isAuthRoute) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    const isAuthRoute =
      url?.startsWith("/auth/login") ||
      url?.startsWith("/auth/register");

    if (
      status === 401 &&
      !isAuthRoute
    ) {
      localStorage.removeItem(
        "voxter_token",
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;