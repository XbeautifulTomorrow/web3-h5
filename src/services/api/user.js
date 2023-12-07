import * as apiService from "@/services/apiService";

const getKey = (params) => apiService.get("mystery-web-user/auth/generate/key", params);

const authLogin = (params) => apiService.post("mystery-web-user/auth/login", params);

const authGoogleLogin = (params) => apiService.post("mystery-web-user/auth/google/login", params);

const updateUserInfo = (params) => apiService.post("mystery-web-user/user/updateInfo", params);

const getTheUserSPayoutAddress = (params) => apiService.get("mystery-web-user/user/getTheUserSPayoutAddress", params); //收款地址

const getTheUserBalance = (params) => apiService.get("mystery-web-user/user/getTheUserBalance", params); //获取钱包余额

const getLogin = (params) => apiService.post("mystery-web-user/auth/account/login", params); //登录

const getReg = (params) => apiService.post("mystery-web-user/auth/account/reg", params); //注册

const getCaptcha = (params) => apiService.get("mystery-web-user/auth/send/captcha", params); //验证码

const getForgetPasswordtcha = (params) => apiService.post("mystery-web-user/auth/account/forgetPassword", params); //忘记密码

const getCheckCaptcha = (params) => apiService.get("mystery-web-user/auth/check/captcha", params); //校验邮箱验证码

const getAListOfUserPoints = (params) => apiService.get("mystery-web-user/user/getAListOfUserPoints", params); // 积分列表

const getUserBuyHistory = (params) => apiService.get("mystery-web-user/box/buy/history", params); // 购买记录

const getRechargeExchangeRate = (params) => apiService.get("mystery-web-user/index/exchangeRate", params); // 充值汇率

const getWithdrawalExchangeRate = (params) => apiService.get("mystery-web-user/index/withdrawalExchangeRate", params); // 提款汇率

const withdrawalBalance = (params) => apiService.post("mystery-web-user/withdrawal/balance", params); // 提款ETH余额

const withdrawalNft = (params) => apiService.post("mystery-web-user/withdrawal/nft", params); // 提款NFT

const getWithdrawalChain = (params) => apiService.get("mystery-web-user/withdrawal/withdrawalChain", params); // 获取充提款支持的链

const getWithdrawalHistory = (params) => apiService.get("mystery-web-user/withdrawal/pageList", params); // 充值提款历史

const getFlashExchangePage = (params) => apiService.get("mystery-web-user/withdrawal/flashExchangePage", params); // 闪兑历史

const rechargeByHash = (params) => apiService.get("mystery-web-user/withdrawal/rechargeByHash", params); // 补偿充值

const getLegalCurrencyRechargeList = (params) => apiService.get("mystery-web-user/withdrawal/legalCurrencyRechargeList", params); // 获取法币支付平台

const statisticsClick = (params) => apiService.get("mystery-web-user/user/invite", params); // 统计点击次数

const getTheUserPoint = (params) => apiService.get("mystery-web-user/user/getTheUserPoint", params); // 积分余额

const resetPassword = (params) => apiService.post("mystery-web-user/auth/account/resetPassword", params); // 重置密码
const verifyNickname = (params) => apiService.get("mystery-web-user/user/verifyNickname", params); // 重复昵称校验
const getNftWithdrawalList = (params) => apiService.get("mystery-web-user/withdrawal/nft/pageList", params); // NFT充提记录

const getGoogleValidateStatus = (params) => apiService.get("mystery-web-user/auth/account/getGoogleValidateStatus", params); // 获取是否开启谷歌验证
const getGoogleQrCode = (params) => apiService.get("mystery-web-user/auth/genQrCode", params); // 创建谷歌验证二维码
const bindGoogleAuth = (params) => apiService.get("/mystery-web-user/user/bingGoogleValidate", params); // 绑定谷歌验证

const getActivityLists = (params) => apiService.get("mystery-web-user/activity/findList", params); // 查询正在进行的活动
const getActivityTargetList = (params) => apiService.get("mystery-web-user/activity/targetList", params); // 奖励列表
const getActivityTargetHeaderDataTotal = (params) => apiService.get("mystery-web-user/activity/targetHeaderDataTotal", params); // 奖励领取数据统计
const activityReceive = (params) => apiService.get("mystery-web-user/activity/receive", params); // 奖励领取
const getActivityPoint = (params) => apiService.get("mystery-web-user/activity/getPoint", params); // 积分获取
const removeWelcomeBounsRedDots = (params) => apiService.get("mystery-web-user/oneNftOrders/remove/welcomeBounsRedDots ", params); // 移除活动小红点

const flashExchange = (params) => apiService.post("mystery-web-user/withdrawal/flashExchange", params); // 闪兑
const exchangeRateV2 = (params) => apiService.get("mystery-web-user/index/exchangeRateV2", params); // 获取真实汇率

const productionOfThirdPartyOrders = (params) =>
  apiService.get("mystery-web-user/three-party-transaction/productionOfThirdPartyOrders", params); // 法币交易提交提单
const getProductionOfThirdPartyOrdersList = (params) =>
  apiService.get("mystery-web-user/three-party-transaction/productionOfThirdPartyOrdersList", params); // 第三方支付历史记录
const productionOfThirdPartyCoin = (params) => apiService.get("mystery-web-user/three-party-transaction/rates", params); // 获取第三方支付币种
const productionOfThirdPartyRate = (params) => apiService.get("mystery-web-user/three-party-transaction/rate", params); // 获取第三方支付汇率

const exchangeCoupons = (params) => apiService.get("mystery-web-user/redeem-code-info/redeem", params); // 使用兑换码
const getRedeemTextSetting = (params) => apiService.get("mystery-web-user/redeem-code-info/findRedeemTextSetting", params); // 兑换码获取渠道
const getExchangeCouponsList = (params) => apiService.get("mystery-web-user/redeem-code-info/pageList", params); // 兑换码兑换记录


export {
  getKey,
  authLogin,
  authGoogleLogin,
  updateUserInfo,
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
  getWithdrawalChain,
  withdrawalBalance,
  withdrawalNft,
  getWithdrawalHistory,
  getFlashExchangePage,
  rechargeByHash,
  statisticsClick,
  getTheUserPoint,
  resetPassword,
  verifyNickname,
  getNftWithdrawalList,
  getGoogleValidateStatus,
  getGoogleQrCode,
  bindGoogleAuth,
  getActivityLists,
  getActivityTargetList,
  getActivityTargetHeaderDataTotal,
  activityReceive,
  getActivityPoint,
  removeWelcomeBounsRedDots,
  flashExchange,
  exchangeRateV2,
  productionOfThirdPartyOrders,
  getProductionOfThirdPartyOrdersList,
  productionOfThirdPartyCoin,
  productionOfThirdPartyRate,
  exchangeCoupons,
  getRedeemTextSetting,
  getExchangeCouponsList,
  getLegalCurrencyRechargeList,
};
