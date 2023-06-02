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

const getCheckCaptcha = (params) =>
  apiService.post("mystery-web-user/auth/check/captcha", params); //校验邮箱验证码

const getAListOfUserPoints = (params) =>
  apiService.get("mystery-web-user/user/getAListOfUserPoints", params); // 积分列表

const getUserBuyHistory = (params) =>
  apiService.get("mystery-web-user/box/buy/history", params); // 积分列表

const getRechargeExchangeRate = (params) =>
  apiService.get("mystery-web-user/index/exchangeRate", params); // 充值汇率

const getWithdrawalExchangeRate = (params) =>
  apiService.get("mystery-web-user/index/withdrawalExchangeRate", params); // 提款汇率

const withdrawalBalance = (params) =>
  apiService.post("mystery-web-user/withdrawal/balance", params); // 提款ETH余额

const withdrawalNft = (params) =>
  apiService.post("mystery-web-user/withdrawal/nft", params); // 提款NFT

const getWithdrawalHistory = (params) =>
  apiService.get("mystery-web-user/withdrawal/pageList", params); // 充值提款历史

const rechargeByHash = (params) =>
  apiService.get("mystery-web-user/withdrawal/rechargeByHash", params); // 补偿充值

export {
  getKey,
  authLogin,
  getTheUserSPayoutAddress,
  getTheUserBalance,
  getLogin,
  getReg,
  getForgetPasswordtcha,
  getCaptcha,
  getCheckCaptcha,
  getAListOfUserPoints,
  getUserBuyHistory,
  getRechargeExchangeRate,
  getWithdrawalExchangeRate,
  withdrawalBalance,
  withdrawalNft,
  getWithdrawalHistory,
  rechargeByHash,
};
