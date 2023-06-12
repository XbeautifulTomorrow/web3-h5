const config = {
  dev: {
    api: 'http://221.236.31.34:6599/mystery-web-admin',
  },
  test: {
    api: 'http://221.236.31.34:6599/mystery-web-admin',
  },
  pre: {
    api: '/mystery-web-admin',
  },
  pro: {
    api: '/mystery-web-admin',
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
