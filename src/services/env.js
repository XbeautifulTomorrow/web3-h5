const config = {
  dev: {
    api: 'http://221.236.31.34:6599/mystery-web-user',
  },
  test: {
    api: 'http://221.236.31.34:6599/mystery-web-user',
  },
  pre: {
    api: '/mystery-web-user',
  },
  pro: {
    api: '/mystery-web-user',
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
