import * as apiService from "@/services/apiService";

const balanceOrder = (params) =>
  apiService.post("mystery-web-user/box/balance/open", params); //余额下单

const blindBoxDetail = (params) =>
  apiService.get("mystery-web-user/box/detail", params); //盲盒详情

const walletOrder = (params) =>
  apiService.post("mystery-web-user/box/wallet/order", params); //钱包下单

const lotteryResult = (params) =>
  apiService.get("mystery-web-user/box/lottery/result", params); //查询抽奖结果

const lotteryHold = (params) =>
  apiService.get("mystery-web-user/box/lottery/hold", params); //选择持有还是回收

const lotteryCheck = (params) =>
  apiService.get("mystery-web-user/box/lottery/check", params); //选择持有还是回收

const getSnapshotList = (params) =>
  apiService.get("mystery-web-user/snapshot-manager/pageList", params); // 快照

const getSnapshotDetail = (params) =>
  apiService.get("mystery-web-user/snapshot-manager/detail", params); // 快照详情

export {
  balanceOrder,
  blindBoxDetail,
  walletOrder,
  lotteryResult,
  lotteryHold,
  getSnapshotList,
  getSnapshotDetail,
  lotteryCheck,
};
