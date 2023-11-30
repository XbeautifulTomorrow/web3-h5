import * as apiService from "@/services/apiService";

const getBoxList = (
  params // 首页盲盒列表
) => apiService.get("mystery-web-user/index/box/list", params);

const getBoxPageList = (
  params // 首页盲盒列表分页
) => apiService.get("mystery-web-user/index/box/pageList", params);

const getTicketList = (
  params // 首页盲盒抽奖列表
) => apiService.get("mystery-web-user/index/box/lottery", params);

const getNFTList = (
  params // 首页盲盒NFT分页查询
) => apiService.get("mystery-web-user/index/contentsInfo", params);

const getBannerList = (
  params // 首页banner
) => apiService.get("mystery-web-user/banner-data/getBannerList", params);

const authIp = (
  params // 获取是否国内IP
) => apiService.get("mystery-web-user/auth/getIp", params);

const getAuthimage = (
  params // 图形验证码
) => apiService.get("mystery-web-user/auth/getCode", params);

const getCacheTicker = (
  params // 汇率换算
) => apiService.get("mystery-web-user/auth/getCacheTicker", params);

const getBoxReward = (
  params // 假盲盒列表
) => apiService.get("mystery-web-user/index/box/reward", params);

const getBoxOpen = (
  params // 假盲盒开盒
) => apiService.get("mystery-web-user/index/box/open", params);

export {
  getBoxList,
  getBoxPageList,
  getTicketList,
  getNFTList,
  authIp,
  getAuthimage,
  getCacheTicker,
  getBannerList,
  getBoxReward,
  getBoxOpen,
};
