import * as apiService from "@/services/apiService";
const serviceUrl = "mystery-web-user";

/**
 * @description 获取用户钱包NFT余额
 */
const getWalletNft = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/getWalletNftEth", params);

/**
 * @description 获取用户系统NFT余额
 */
const getSystemNft = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/getWalletNftSystem", params);
/**
 * @description 获取外部系列
 * 全部-ALL；平台-PLATFORM，外部-EXTERNAL，不传默认外部
 */
const getTheExternalNFTSeries = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/getTheExternalNFTSeries", params);

/**
 * @description 添加一元购活动订单
 */
const addNftOrder = (params) =>
  apiService.post(serviceUrl + "/oneNftOrders/addNftOrder", params);

/**
 * @description 取消一元购活动订单
 */
const cancelNftOrder = (params) =>
  apiService.post(serviceUrl + "/oneNftOrders/cancelNftOrder", params);

/**
 * @description 删除一元购活动订单
 */
const delNftOrder = (params) =>
  apiService.post(serviceUrl + "/oneNftOrders/delNftOrder", params);

/**
 * @description 获取用户相关nft订单
 */
const getOneBuyList = (params) =>
  apiService.get(
    serviceUrl + "/oneNftOrders/inquireAboutIndividualOrders",
    params
  );

/**
 * @description 获取即将结束的nft订单
 */
const getEndingSoon = (params) =>
  apiService.get(serviceUrl + "/oneNftLotteryOrders/endingSoonPage", params);

/**
 * @description 获取一元购详情
 */
const getOneBuyInfo = (params) =>
  apiService.get(serviceUrl + "/oneNftLotteryOrders/getInfo", params);

/**
 * @description 获取一元购最新购买记录
 */
const getAListOfActivities = (params) =>
  apiService.get(
    serviceUrl + "/oneNftLotteryOrders/getAListOfActivities",
    params
  );

/**
 * @description 获取一元购用户购买记录
 */
const getAListOfParticipants = (params) =>
  apiService.get(
    serviceUrl + "/oneNftLotteryOrders/getAListOfParticipants",
    params
  );

/**
 * @description 获取一元购用户购买记录
 */
const getCheckAllOrders = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/checkAllOrders", params);

/**
 * @description 获取开奖者
 */
const getLottery = (params) =>
  apiService.get(serviceUrl + "/oneNftLotteryOrders/getLottery", params);

/**
 * @description 余额购买一元购活动
 */
const buyNftBalance = (params) =>
  apiService.post(serviceUrl + "/oneNftLotteryOrders/balancePurchases", params);

/**
 * @description 钱包购买一元购活动
 */
const buyNftWallet = (params) =>
  apiService.post(serviceUrl + "/oneNftLotteryOrders/onChainPurchases", params);

/**
* @description 查询个人订单
*/
const getUserOneOrder = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/userOneOrder", params);

/**
* @description 查询个人总参与票数
*/
const getUserTotalTicket = (params) =>
  apiService.get(serviceUrl + "/oneNftLotteryOrders/getUserTotalTicket", params);

/**
* @description 查询个人总参与票数
*/
const getNftAttrRate = (params) =>
  apiService.get(serviceUrl + "/oneNftLotteryOrders/getNftAttrRate", params);

const getGlobalNew = params =>
  apiService.get(serviceUrl + '/oneNftOrders/global/redDots', params); // 全局new

const delNewWalletNftMark = params =>
  apiService.get(serviceUrl + '/oneNftOrders/remove/walletNftSystemRedDots', params); // 取消背包标记

const delNewOrderMark = params =>
  apiService.get(serviceUrl + '/oneNftOrders/remove/oneNftOrderRedDots', params); // 取消一元购标记

/**
 * @description 获取一元购历史
 */
const getNftActivity = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/nftActivityLog", params);

/**
 * @description 获取一元购历史 折线图
 */
const getNftActivityCharts = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/nftActivity", params);

/**
 * @description 获取服务费
 */
const getServiceFee = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/getServiceCharge", params);

/**
* @description 获取推特验证
*/
const getTweetInfo = (params) =>
  apiService.get(serviceUrl + "/oneNftLotteryOrders/getTweetInfo", params);

/**
* @description 获取推特验证
*/
const getShareTwitter = (params) =>
  apiService.get(serviceUrl + "/twitterInfo/shareTwitter", params);

/**
 * @description 验证推特链接
 */
const tweetSendTikect = (params) =>
  apiService.post(serviceUrl + "/oneNftLotteryOrders/tweetSendTikect", params);

/**
* @description 获取配置Key
*/
const getCofingKey = (params) =>
  apiService.get(serviceUrl + "/oneNftOrders/getCofingK", params);

  /**
* @description 查询币种一元购所有订单
*/
const getCoinAllOrders = (params) => apiService.get(serviceUrl + "/oneNftOrders/coinAllOrders", params);

  /**
* @description 查询一元购nft全部订单
*/
const getNftAllOrders = (params) => apiService.get(serviceUrl + "/oneNftOrders/nftAllOrders", params);

export {
  getWalletNft,
  getSystemNft,
  addNftOrder,
  cancelNftOrder,
  delNftOrder,
  getOneBuyList,
  getEndingSoon,
  buyNftBalance,
  buyNftWallet,
  getOneBuyInfo,
  getAListOfActivities,
  getAListOfParticipants,
  getCheckAllOrders,
  getLottery,
  getTheExternalNFTSeries,
  getUserOneOrder,
  getUserTotalTicket,
  getNftAttrRate,
  getGlobalNew,
  delNewWalletNftMark,
  delNewOrderMark,
  getNftActivityCharts,
  getNftActivity,
  getServiceFee,
  getTweetInfo,
  getShareTwitter,
  tweetSendTikect,
  getCofingKey,
  getCoinAllOrders,
  getNftAllOrders,
};
