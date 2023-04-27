import * as apiService from "@/services/apiService";

const getKey = (params) =>
  apiService.get("mystery-web-user/auth/generate/key", params);

const authLogin = (params) =>
  apiService.post("mystery-web-user/auth/login", params);
const getTheUserSPayoutAddress = (params) =>
  apiService.get("mystery-web-user/user/getTheUserSPayoutAddress", params);//收款地址

const getTheUserBalance = (params) =>
  apiService.get("mystery-web-user/user/getTheUserBalance", params);//获取钱包余额
  
export { getKey, authLogin,getTheUserSPayoutAddress,getTheUserBalance };
