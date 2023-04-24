import axios from 'axios';
// import qs from 'qs'

const axiosInstance = axios.create({
  baseURL: 'http://221.236.31.34:6599',
  withCredentials: false,
  timeout: 20000,
});

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
    console.log('response===', response);
    if (response.headers.certificate || response.headers.Certificate) {
      localStorage.setItem(
        'Certificate',
        response.headers.certificate || response.headers.Certificate
      );
    }
    return response;
  },
  (error) => {
    console.log('[AxiosError]', error);
    return Promise.reject(error);
  }
);

const handleRes = ({ type, url, data }) => {
  console.log(type, url);
  if (data.code === 200) {
    return data;
  } else {
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
    console.warn(err);
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
