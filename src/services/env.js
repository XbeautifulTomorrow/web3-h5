const config = {
  dev: {
    api: "/",
  },
  test: {
    // api: "http://103.1.35.67:33080/",
    api: "http://172.16.10.10:16082/",
  },
  pro: {
    api: "/",
  },
};

export default {
  ENV: import.meta.env.VITE_APP_DOMAIN_CONFIG,
  ...config[import.meta.env.VITE_APP_DOMAIN_CONFIG],
};
