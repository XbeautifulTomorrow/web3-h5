import * as apiService from "@/services/apiService";

const getKey = (params) =>
  apiService.get("mystery-web-user/auth/generate/key", params);

const authLogin = (params) =>
  apiService.post("mystery-web-user/auth/login", params);

const getTheUserSPayoutAddress = (params) =>
  apiService.get("mystery-web-user/user/getTheUserSPayoutAddress", params); //收款地址

const getTheUserBalance = (params) =>
  apiService.get("mystery-web-user/user/getTheUserBalance", params); //获取钱包余额

const getLogin = (params) =>
  apiService.post("mystery-web-user/auth/account/login", params); //登录

const getReg = (params) =>
  apiService.post("mystery-web-user/auth/account/reg", params); //注册

const getCaptcha = (params) =>
  apiService.get("mystery-web-user/auth/send/captcha", params); //验证码

const getForgetPasswordtcha = (params) =>
  apiService.post("mystery-web-user/auth/account/forgetPassword", params); //忘记密码

export {
  getKey,
  authLogin,
  getTheUserSPayoutAddress,
  getTheUserBalance,
  getLogin,
  getReg,
  getForgetPasswordtcha,
  getCaptcha,
};
