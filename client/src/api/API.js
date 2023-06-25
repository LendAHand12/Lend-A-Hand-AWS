import axios from "axios";
import queryString from "query-string";

import store from "@/store";
import i18n from "@/i18n";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 120000,
  paramsSerializer: (params) => queryString.stringify(params),
});

API.interceptors.request.use(
  function (config) {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    config.headers["Accept-Language"] = i18n.language;
    config.headers["Content-Type"] = "application/json";
    if (config.method === "get" && !config.data) {
      config.headers["Content-Type"] = "application/json";
    } else {
      let hasFile = false;
      Object.values(config.data).forEach((value) => {
        if (value instanceof File) {
          hasFile = true;
        }
      });
      if (hasFile) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default API;
