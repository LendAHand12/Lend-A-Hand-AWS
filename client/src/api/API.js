import axios from "axios";
import queryString from "query-string";

import store from "@/store";
import Auth from "@/api/Auth";
import i18n from "@/i18n";
import { REFRESH_TOKEN } from "@/slices/authSlice";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 120000,
  paramsSerializer: (params) => queryString.stringify(params),
});

API.interceptors.request.use(
  function (config) {
    // Lấy accessToken từ Redux Store
    const { accessToken } = store.getState().auth;

    // Nếu tồn tại accessToken, thêm nó vào header Authorization
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    config.headers["Accept-Language"] = i18n.language;

    if (config.method === "get" && !config.data) {
      // Đặt Content-Type là application/json cho phương thức GET
      config.headers["Content-Type"] = "application/json";
    } else {
      const hasFile = Object.values(config.data).some(
        (value) => value instanceof File
      );
      if (hasFile) {
        // Nếu có file, đặt Content-Type là multipart/form-data
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        // Nếu không có file, đặt Content-Type là application/json
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lại yêu cầu mạng khi gặp lỗi xác thực
API.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    // Kiểm tra nếu mã trạng thái là 401 và không phải là yêu cầu lặp lại
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Lấy refreshToken từ Redux Store
      const {
        userInfo: { email },
        refreshToken,
      } = store.getState().auth;

      // Gửi yêu cầu lấy accessToken mới bằng refreshToken
      return Auth.refresh({ email, refreshToken })
        .then((response) => {
          const newAccessToken = response.data.accessToken;

          // Cập nhật accessToken mới trong Redux Store
          // store.dispatch({ type: "REFRESH_TOKEN", payload: newAccessToken });
          store.dispatch(REFRESH_TOKEN(newAccessToken));

          // Cập nhật header Authorization trong yêu cầu ban đầu với accessToken mới
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Gửi lại yêu cầu ban đầu với accessToken mới
          return API(originalRequest);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }

    return Promise.reject(error);
  }
);

export default API;
