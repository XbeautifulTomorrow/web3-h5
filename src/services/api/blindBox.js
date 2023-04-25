import * as apiService from "@/services/apiService";

const lottery = (params) =>
  apiService.post("mystery-web-user/box/wallet/order", params);

const blindBoxDetail = (params) =>
  apiService.get("mystery-web-user/box/detail", params);

const walletOrder = (params) =>
  apiService.post("mystery-web-user/box/wallet/order", params);
  
export { lottery,blindBoxDetail,walletOrder };
