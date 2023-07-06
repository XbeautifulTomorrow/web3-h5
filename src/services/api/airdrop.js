import * as apiService from '@/services/apiService'

const linkWallet = params => // 连接钱包
  apiService.post('mystery-web-user/airdrop-statistics/link/wallet', params)

const getAirdrop = params => // 获取空投数据
  apiService.get('mystery-web-user/airdrop-statistics/findOne', params)

const getStatisticsTotal = params => // 排名统计
  apiService.get('mystery-web-user/airdrop-statistics/totalData', params)

const getRankList = params => // 排名数据
  apiService.get('mystery-web-user/airdrop-statistics/rankList', params)

export { linkWallet, getAirdrop, getStatisticsTotal, getRankList }