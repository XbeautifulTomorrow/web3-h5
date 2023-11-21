import * as apiService from "@/services/apiService";
const serviceUrl = "mystery-web-game";

const getWarHistory = (
  params, // 获取战争历史列表
) => apiService.get(serviceUrl + "/war/history", params);

const getRewardAmount = (
  params, // 获取战争奖励余额
) => apiService.get(serviceUrl + "/war/getRewardAmount", params);

const receiveAmount = (
  params, // 领取战争奖励余额
) => apiService.get(serviceUrl + "/war/receiveAmount", params);

const setAutoConfig = (
  params, // 战争自动配置
) => apiService.post(serviceUrl + "/war/auto/config", params);

const getAutoConfig = (
  params, // 获取战争自动配置
) => apiService.get(serviceUrl + "/war/find/auto/config", params);

const warBuy = (
  params, // 战争游戏购买
) => apiService.post(serviceUrl + "/war/buy", params);

const getWarUserInfo = (
  params, // 查询战争用户信息
) => apiService.get(serviceUrl + "/war/userJoinData", params);

const getCommonData = (
  params, // 查询历史信息
) => apiService.get(serviceUrl + "/war/getCommonData", params);

const getConfig = (
  params, // 查询历史信息
) => apiService.get(serviceUrl + "/war/config", params);

export {
  getWarHistory,
  getRewardAmount,
  receiveAmount,
  setAutoConfig,
  getAutoConfig,
  warBuy,
  getWarUserInfo,
  getCommonData,
  getConfig,
};
