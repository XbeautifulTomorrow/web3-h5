import * as apiService from '@/services/apiService'

const getBoxList = params =>//首页盲盒列表
  apiService.get('mystery-web-user/index/box/list', params)

const getTicketList = params =>//首页盲盒抽奖列表
  apiService.get('mystery-web-user/index/box/lottery', params)

const getNFTList = params =>//首页盲盒NFT分页查询
  apiService.get('mystery-web-user/index/contentsInfo', params)

export { getBoxList,getTicketList,getNFTList }