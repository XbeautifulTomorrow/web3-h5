const config = {
  dev: {
    api: 'http://221.236.31.34:6599/',
  },
  test: {
    api: 'http://221.236.31.34:6599/',
  },
  pre: {
    api: '/',
  },
  pro: {
    api: '/',
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
