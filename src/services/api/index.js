import * as apiService from '@/services/apiService'

const getBoxList = params =>//首页盲盒列表
  apiService.get('mystery-web-user/index/box/list', params)
const getBoxPageList = params =>//首页盲盒列表分页
  apiService.get(' /mystery-web-user/index/box/pageList', params)



const getTicketList = params =>//首页盲盒抽奖列表
  apiService.get('mystery-web-user/index/box/lottery', params)

const getNFTList = params =>//首页盲盒NFT分页查询
  apiService.get('mystery-web-user/index/contentsInfo', params)
const authIp = params =>//获取是否国内IP
  apiService.get('mystery-web-user/auth/getIp', params)
const getAuthimage = params =>//图形验证码
  apiService.get('/mystery-web-user/auth/getCode', params)

export {
  getBoxList,
  getBoxPageList,
  getTicketList,
  getNFTList,
  authIp,
  getAuthimage
}