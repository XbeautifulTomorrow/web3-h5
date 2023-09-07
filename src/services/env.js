const config = {
  dev: {
    api: "/",
  },
  test: {
    api: "http://103.1.35.67:33080/",
  },
  pro: {
    api: "/",
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
