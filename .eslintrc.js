// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "prettier"],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "vue/require-default-prop": "off",
    "vue/no-v-for-template-key": "off",
    "vue/multi-word-component-names": "off",
  },
};
