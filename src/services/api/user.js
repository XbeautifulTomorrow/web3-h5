import * as apiService from "@/services/apiService";

const getKey = (params) =>
  apiService.get("mystery-web-user/auth/generate/key", params);

const authLogin = (params) =>
  apiService.post("mystery-web-user/auth/login", params);
const getTheUserSPayoutAddress = (params) =>
  apiService.get("mystery-web-user/user/getTheUserSPayoutAddress", params);
  
export { getKey, authLogin,getTheUserSPayoutAddress };
