module.exports = {
  plugins: {
    // ...
    'postcss-px-to-viewport': {
      viewportWidth: 1920,
      unitPrecision: 3,
      propList: ['*'],
      selectorBlackList: ['bitzing-iframe'],
    },
  },
};
