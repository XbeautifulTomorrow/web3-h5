import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user.js";
import config from './env';
import { i18n } from '@/locales';
const { t } = i18n.global;
// import qs from 'qs'

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000/',
  // baseURL: "http://221.236.31.34:6599",
  baseURL: config.api,
  withCredentials: true,
  timeout: 300000,
});
const notMessage = ["mystery-web-user/auth/check/captcha", "mystery-web-user/auth/getIp", "/mystery-web-user/auth/getCode"];
axiosInstance.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("certificate")) {
      config.headers.certificate = localStorage.getItem("certificate");
    }

    if (sessionStorage.getItem("verify")) {
      config.headers.verify = sessionStorage.getItem("verify");
    }

    if (config.url.indexOf("/mystery-web-user/auth/getCode") > -1) {
      config.responseType = "blob"
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    ElMessage({
      message: error,
      type: "warning",
    });
    return Promise.reject(error);
  }
);

// eslint-disable-next-line no-unused-vars
const handleRes = ({ headers, url, data }) => {
  if (data.code === 200) {
    return data;
  } else if (data.code === 20011) {

    if (!notMessage.includes(url)) {
      ElMessage({
        message: t("errorTips." + data.messageKey),
        type: "warning",
      });
    }

    const { logoutApi } = useUserStore();
    logoutApi();

    return [false, data.code, data];
  } else {
    if (!notMessage.includes(url)) {
      ElMessage({
        message: t("errorTips." + data.messageKey),
        type: "warning",
      });
    }

    if (notMessage.includes("/mystery-web-user/auth/getCode")) {
      return headers;
    } else {
      return [false, data.code, data];
    }
  }
};

export async function post(url, params, config = {}) {
  try {
    const res = await axiosInstance.post(url, params, config);
    return handleRes({
      headers: res,
      url,
      data: res.data,
    });
  } catch (err) {
    ElMessage({
      message: err,
      type: "warning",
    });
    err.message = "error";
    return err;
  }
}

export async function get(url, params) {
  try {
    const res = await axiosInstance.get(url, { params });
    return handleRes({
      headers: res,
      url,
      data: res.data,
    });
  } catch (err) {
    console.warn(err);
    err.message = "error";
    return err;
  }
}
