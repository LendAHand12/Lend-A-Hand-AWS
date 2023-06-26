import axios from "axios";
import queryString from "query-string";

import store from "@/store";
import i18n from "@/i18n";

const APIUpload = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 120000,
  paramsSerializer: (params) => queryString.stringify(params),
});

APIUpload.interceptors.request.use(
  function (config) {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    config.headers["Accept-Language"] = i18n.language;
    config.headers["Content-Type"] = "multipart/form-data";
    // if (config.method === "get" && !config.data) {
    //   config.headers["Content-Type"] = "application/json";
    // } else {
    //   const formData = new FormData();
    //   for (const key in config.data) {
    //     formData.append(key, config.data[key]);
    //   }

    //   // Kiểm tra xem formData có chứa tệp tin hay không
    //   const hasFile = Array.from(formData.values()).some(
    //     (value) => value instanceof File
    //   );

    //   if (hasFile) {
    //     config.headers["Content-Type"] = "multipart/form-data";
    //   } else {
    //     config.headers["Content-Type"] = "application/json";
    //   }
    // }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default APIUpload;
