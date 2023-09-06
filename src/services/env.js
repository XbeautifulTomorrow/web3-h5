const config = {
  dev: {
    api: "https://www.bitzing.io/",
  },
  test: {
    // api: "http://221.236.31.34:16082/",
    api: "https://www.bitzing.io/",
  },
  pro: {
    api: "https://www.bitzing.io/",
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
