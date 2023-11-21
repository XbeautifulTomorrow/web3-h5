import * as apiService from "@/services/apiService";

const userInvateStatistics = (params) =>
  apiService.get("mystery-web-user/user/invate/statistics", params); // 用户邀请统计
const rebatesCreateCode = (
  params, // params => code
) => apiService.get("mystery-web-user/rebates/create/code", params); // 创建邀请码
const rebatesFindList = (params) =>
  apiService.get("mystery-web-user/rebates/findList", params); // 邀请码资产统计
const rebatesDetailPageList = (
  params, // params => page & size
) => apiService.get("mystery-web-user/rebates/detail/pageList", params); // 邀请详情列表
const rebatesReceive = (
  params, // params => inviteCode
) => apiService.get("mystery-web-user/rebates/receive", params); // 一键领取佣金

const getSetting = (params) =>
  apiService.get("mystery-web-user/index/setUp", params); // 获取设置

const setDefaultCode = (params) =>
  apiService.get("mystery-web-user/rebates/defaultCodeSetUp", params); // 获取设置

export {
  userInvateStatistics,
  rebatesCreateCode,
  rebatesFindList,
  rebatesDetailPageList,
  rebatesReceive,
  getSetting,
  setDefaultCode,
};
