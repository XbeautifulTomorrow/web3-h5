import axios from 'axios';
import { ElMessage } from 'element-plus'
// import qs from 'qs'

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000/',
  baseURL: 'http://221.236.31.34:6599',
  withCredentials: true,
  timeout: 20000
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('certificate')) {
      config.headers.certificate = localStorage.getItem('certificate');
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
      type: 'warning',
    })
    return Promise.reject(error);
  }
);

const handleRes = ({ type, url, data }) => {
  console.log(type, url);
  if (data.code === 200) {
    return data;
  } else {
    ElMessage({
      message: data.message,
      type: 'warning',
    })
    return [false, data.code, data];
  }
};

export async function post(url, params, config = {}) {
  try {
    const res = await axiosInstance.post(url, params, config);
    return handleRes({
      type: 'post',
      url,
      data: res.data,
    });
  } catch (err) {
    ElMessage({
      message: err,
      type: 'warning',
    })
    err.message = 'error';
    return err;
  }
}

export async function get(url, params) {
  try {
    const res = await axiosInstance.get(url, { params });
    return handleRes({
      type: 'get',
      url,
      data: res.data,
    });
  } catch (err) {
    console.warn(err);
    err.message = 'error';
    return err;
  }
}
