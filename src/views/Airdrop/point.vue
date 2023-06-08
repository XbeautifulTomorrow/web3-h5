<template>
  <div class="point_container">
    <div class="user_info">
      <div class="user_info_l">
        <img src="@/assets/svg/user/default_avatar.svg" alt="" />
        <div class="user_box">
          <div class="username_text">
            <div class="name_text">{{ airdrop.userName }}</div>
            <div class="title_btn" v-if="!accountPoint">
              <span class="title_btn_text">Please wait for data synchronization.</span>
            </div>
          </div>
          <div class="tips_text">
            <img src="@/assets/svg/airdrop/icon_wallet.svg" alt="" />
            <span>{{ airdrop.walletAddress }}</span>
          </div>
        </div>
      </div>
      <div class="user_info_r">
        <div class="data_item">
          <div class="item_label">RANK</div>
          <div class="item_data rank">{{ accountPoint ? airdrop.rankIndex : "--" }}</div>
        </div>
        <div class="data_item">
          <div class="item_label">ACCOUNT POINTS</div>
          <div class="item_data">{{ accountPoint ? accountPoint : "--" }}</div>
        </div>
        <div class="data_item">
          <div class="item_label">REGISTRATION TIME</div>
          <div class="item_data">{{ timeFormat(airdrop.regTime) }}</div>
        </div>
      </div>
    </div>
    <div class="details_info">
      <div class="details_item statistics" v-for="(item, index) in statisticsRow" :key="index">
        <div class="statistics_type">
          <div class="title">{{ item.statisticsType }}</div>
          <div class="val">
            <span>{{ accountPoint ? item.totalPoint : "--" }}</span>
            <el-tooltip popper-class="tips_box" effect="dark" placement="top">
              <template #content>
                <span v-if="item.tips.title" class="tips_title">{{ item.tips.title }}</span>
                <br v-if="item.tips.title" />
                <span v-if="item.tips.detail" class="tips_text">{{ item.tips.detail }}</span>
              </template>
              <img v-show="!accountPoint" src="@/assets/svg/airdrop/icon_help.svg" alt="">
            </el-tooltip>
          </div>
        </div>
        <div class="statistics_time" v-for="(event, key, i) in item.detail" :key="i">
          <div class="title">{{ key }}</div>
          <div class="val">{{ accountPoint ? event : "--" }}</div>
        </div>
      </div>
      <div class="details_item list">
        <div class="no_date" v-if="!accountPoint || !nftList.length > 0">
          <div class="tips_text">NFT data synchronization in...</div>
        </div>
        <div class="nft_box" v-if="accountPoint && nftList.length > 0">
          <div class="nft_item" v-for="(item, index) in nftList" :key="index">
            <div class="nft_img">
              <img :src="item.nftImg" alt="">
            </div>
            <div class="nft_info">
              <div class="name_box">
                <span class="text-ellipsis">{{ item.name }}</span>
                <span class="text-ellipsis">{{ `#${item.tokenId}` }}</span>
              </div>
              <div class="time_box">
                <img src="@/assets/svg/airdrop/icon_time.svg" alt="">
                <span>Length of holding:</span>
                <span>{{ `${timeDiff(item.time)} D` }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination_box" v-if="accountPoint && nftList.length > 0">
          <div class="total_box">
            {{ `${startNum}-${endNum} of ${count}` }}
          </div>
          <div class="pagination not-select">
            <div :class="['prev', !pageCount.prev && 'disabled']" @click="handleCurrentChange(-1)">
              <el-icon>
                <ArrowLeftBold />
              </el-icon>
            </div>
            <div class="page_box">
              <span>{{ page + 1 }}</span>
              <span>{{ `/ ${Math.ceil(count / size)}` }}</span>
            </div>
            <div :class="['next', !pageCount.next && 'disabled']" @click="handleCurrentChange(1)">
              <el-icon>
                <ArrowRightBold />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import {
  getWalletNft
} from "@/services/api/oneBuy";

import {
  timeFormat
} from "@/utils";
import bigNumber from "bignumber.js";
export default {
  name: 'AirdropPoint',
  props: {
    airdrop: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      isSync: false,
      nftList: [],
      pageList: [""],
      page: 0,
      size: 9,
      count: 0,
    };
  },
  computed: {
    statisticsRow() {
      const { airdrop } = this;
      return [
        {
          statisticsType: "UNISWAP POINT",
          tips: {
            title: "Only ETH's transactions will be involved in the statistics.The formula is as follows:",
            detail: "(SWAPS*30/(30+SWAPS)*5+TA*20/(20+TA)*20)*DU*350/(365+DU)*2*FACTOR"
          },
          totalPoint: airdrop.uniswapPoint,
          detail: {
            Duration: airdrop.uniswapDay, //uniwap刚链接的瞬间的使用天数
            Swaps: airdrop.uniswapExchangeNum, //uniwap兑换笔数
            "Total Amount": airdrop.uniswapExchangeAmount, //uniwap兑换总额
            "Total Gas": airdrop.uniswapExpendGas, //uniwapGas支出
          }
        },
        {
          statisticsType: "OPENSEA POINT",
          tips: {
            title: "The opensea points formula is as follows:",
            detail: "(SWAPS*30/(30+SWAPS)*5+TA*20/(20+TA)*20)*DU*350/(365+DU)*2*FACTOR"
          },
          totalPoint: airdrop.openseaPoint,
          detail: {
            Duration: airdrop.openseaDay, //opensea刚链接的瞬间的使用天数
            Transactions: airdrop.openseaTraNum, //opensea交易数量
            "Total purchases": airdrop.openseaBuyAmount, //opensea购买金额
            "Total Sale": airdrop.openseaSellAmount, //opensea售卖金额
          }
        },
        {
          statisticsType: "REFERRALS",
          tips: {
            title: "",
            detail: "After inviting one user to sign up for Connect Wallet and earn points, you will receive an extra 10% bonus."
          },
          totalPoint: airdrop.invatePoint,
          detail: {
            Clicks: airdrop.clickNumber, //点击次数
            Referrals: airdrop.regNumber, //注册人数
            "This month Point": airdrop.thisMonthPoint, //这个月积分
            "Last month Point": airdrop.lastMonthPoint, //上个月积分
          }
        },
        {
          statisticsType: "WALLET POINT",
          tips: {
            title: "The Wallet point formula is as follows:",
            detail: "RARE*NFT/(NFT+RARE)*MHT*200/(200+MHT)*2*DU*355/(365+DU)*2*FACTOR"
          },
          totalPoint: airdrop.walletPoint,
          detail: {
            Duration: airdrop.walletDay, //钱包使用天数
            "Total NFT": airdrop.walletHoldNft, //持有NFT数量
            "Rare NFT": airdrop.walletQualityNft, //优质NFT数量
            "Max Holding Time": airdrop.walletLongestDay, //钱包最长天数
          }
        },
      ]
    },
    startNum() {
      const { page, size } = this;
      return page * size + 1;
    },
    endNum() {
      const { page, size, count } = this;
      const num = page * size + size;
      if (count > num) {
        return num;
      }
      return count;
    },
    pageCount() {
      const { page, size, count } = this;
      const pager = Math.ceil(count / size);
      let isPrev = true;
      let isNext = true;
      if (page == 0) {
        isPrev = false;
      }

      if ((page + 1) == pager) {
        isNext = false;
      }

      if (!pager > 0) {
        return {
          prev: false,
          next: false
        }
      }

      return {
        prev: isPrev,
        next: isNext
      }
    },
    accountPoint() {
      const { uniswapPoint, openseaPoint, walletPoint } = this.airdrop;
      if (uniswapPoint == null || openseaPoint == null || walletPoint == null) return false;
      const point = new bigNumber(uniswapPoint || 0).plus(openseaPoint || 0).plus(walletPoint || 0).toString();
      return point
    }
  },
  methods: {
    timeFormat: timeFormat,
    async fetchWalletNft(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 0;
        _page = 0;
      }

      const res = await getWalletNft({
        address: this.airdrop.walletAddress,
        cursor: this.pageList[_page],
        size: size
      });
      if (res && res.code == 200) {
        this.nftList = res.data.records;
        this.count = res.data.total;
        if (!res.data.cursor) return;
        this.pageList.push(res.data.cursor);
      }
    },
    handleCurrentChange(event) {
      if (event < 0 && !this.pageCount.prev || event > 0 && !this.pageCount.next) return
      this.page += event;
      this.fetchWalletNft(false);
    },
    /**
     * 获取时间和当前相距多久
     *
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return
     */
    timeDiff(event) {
      if (!event) return 0
      const setTime = new Date(event).getTime();
      const nowTime = new Date().getTime();

      // 按照传入的格式生成一个simpledateformate对象
      let nd = 1000 * 24 * 60 * 60; // 一天的毫秒数
      let nh = 1000 * 60 * 60;// 一小时的毫秒数
      let nm = 1000 * 60; // 一分钟的毫秒数
      let ns = 1000; // 一秒钟的毫秒数;

      // 获得两个时间的毫秒时间差异
      let diff;
      diff = Number(new bigNumber(nowTime).minus(setTime));

      let day = Number(new bigNumber(diff).div(nd));// 计算差多少天
      // eslint-disable-next-line no-unused-vars
      let hour = Number(new bigNumber(diff).mod(nd).div(nh));// 计算差多少小时
      // eslint-disable-next-line no-unused-vars
      let min = Number(new bigNumber(diff).mod(nd).mod(nh).div(nm));// 计算差多少分钟
      // eslint-disable-next-line no-unused-vars
      let sec = Number(new bigNumber(diff).mod(nd).mod(nh).mod(nm).div(ns));// 计算差多少秒//输出结果

      return Math.floor(day);
    }
  },
  created() {
    // 如果未同步就不加载Nft列表
    if (!this.accountPoint) return;
    this.fetchWalletNft();
  }
};
</script>
  
<style lang="scss" scoped>
@import "./components/point.scss";
</style>
<style lang="scss">
.tips_box {
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.3125rem;
  background-color: #2c115b !important;

  .tips_title {
    font-size: 0.75rem;
    line-height: 1.3;
    text-align: left;
    color: #a9a4b4;
  }

  .tips_text {
    font-size: 0.75rem;
    line-height: 1.3;
    text-align: left;
    color: white;
  }
}
</style>