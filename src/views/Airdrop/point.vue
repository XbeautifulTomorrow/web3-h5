<template>
  <div class="point_container">
    <div class="user_info">
      <div class="user_info_l">
        <img src="@/assets/svg/user/default_avatar.svg" alt="" />
        <div class="user_box">
          <div class="username_text">
            <div class="name_text">
              <span>{{ airdrop.userName }}</span>
              <img @click="showModify = true" src="@/assets/svg/user/icon_modify.svg" alt="">
            </div>
            <div class="title_btn" v-if="!accountPoint">
              <span class="title_btn_text">{{ $t("airdrop.syncText") }}</span>
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
          <div class="item_label">{{ $t("airdrop.ranking") }}</div>
          <div class="item_data rank">{{ accountPoint ? airdrop.rankIndex || "--" : "--" }}</div>
        </div>
        <div class="data_item">
          <div class="item_label">{{ $t("airdrop.totalPoint") }}</div>
          <div class="item_data">{{ accountPoint ? accountPoint : "--" }}</div>
        </div>
        <div class="data_item">
          <div class="item_label">{{ $t("airdrop.registrationTime") }}</div>
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
                <span v-if="item.tips.tips" class="tips_title">{{ item.tips.tips }}</span>
                <br v-if="item.tips.tips" />
                <span v-if="item.tips.title" class="tips_title">{{ item.tips.title }}</span>
                <br v-if="item.tips.title" />
                <span v-if="item.tips.detail" class="tips_text">{{ item.tips.detail }}</span>
              </template>
              <img src="@/assets/svg/airdrop/icon_help.svg" alt="">
            </el-tooltip>
          </div>
        </div>
        <div class="statistics_time" v-for="(event, key, i) in item.detail" :key="i">
          <div class="title">{{ $t("airdrop." + key) }}</div>
          <div class="val">{{ accountPoint ? event == null ? "--" : event : "--" }}</div>
        </div>
      </div>
      <div class="details_item list" v-loading="loading" element-loading-text="Loading...">
        <div class="no_date" v-if="!accountPoint || !nftList?.length > 0">
          <div class="tips_text" v-if="!accountPoint">{{ $t("airdrop.syncNft") }}</div>
          <div class="tips_text" v-else>{{ $t("airdrop.noData") }}</div>
        </div>
        <div class="nft_box" v-if="accountPoint && nftList?.length > 0">
          <div class="nft_item" v-for="(item, index) in nftList" :key="index">
            <div class="image_box">
              <Image fit="cover" class="nft_img" :src="item.nftImg" />
            </div>
            <div class="nft_info">
              <div class="name_box">
                <span class="text-ellipsis">{{ item.name }}</span>
                <span class="text-ellipsis">{{ `#${item.tokenId}` }}</span>
              </div>
              <div class="time_box">
                <img src="@/assets/svg/airdrop/icon_time.svg" alt="">
                <span>Holding Time:</span>
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
    <Modify v-if="showModify" @onModify="() => { this.$emit('onModify') }" @closeDialogFun="showModify = false"></Modify>
  </div>
</template>
  
<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { getWalletNft } from "@/services/api/oneBuy";

import { accurateDecimal, timeFormat } from "@/utils";
import bigNumber from "bignumber.js";
import Modify from "./components/modify.vue";
import Image from "@/components/imageView";

export default {
  name: 'AirdropPoint',
  components: {
    Modify,
    Image
  },
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
      loading: false,
      showModify: false,
      formUser: {
        name: null
      }
    };
  },
  computed: {
    statisticsRow() {
      const { airdrop } = this;
      return [
        {
          statisticsType: t("airdrop.uniswapPoint"),
          tips: {
            tips: t("airdrop.uniswapTitle"),
            title: t("airdrop.uniswapTips"),
            detail: "(SWAPS*30/(30+SWAPS)*5+TA*20/(20+TA)*20)*DU*365/(365+DU)*2*FACTOR"
          },
          totalPoint: airdrop.uniswapPoint,
          detail: {
            Duration: t("common.dayNum", { days: airdrop.uniswapDay || 0 }), //uniwap刚链接的瞬间的使用天数
            Swaps: airdrop.uniswapExchangeNum, //uniwap兑换笔数
            "Total Amount": `${accurateDecimal(airdrop.uniswapExchangeAmount || 0, 4)} ETH`, //uniwap兑换总额
            "Total Gas": `${this.toNonExponential(accurateDecimal(airdrop.uniswapExpendGas || 0, 8))} ETH`, //uniwapGas支出
          }
        },
        {
          statisticsType: t("airdrop.openSeaPoint"),
          tips: {
            title: t("airdrop.openSeaTitle"),
            detail: "TXN*20/(20+TXN)*10+PUR^2/(PUR+SALE)*2*DU*180/(180+DU)*2*FACTOR"
          },
          totalPoint: airdrop.openseaPoint,
          detail: {
            Duration: t("common.dayNum", { days: airdrop.openseaDay }), //opensea刚链接的瞬间的使用天数
            Transactions: airdrop.openseaTraNum, //opensea交易数量
            "Total purchases": `${accurateDecimal(airdrop.openseaBuyAmount || 0, 4)} ETH`, //opensea购买金额
            "Total Sale": `${accurateDecimal(this.toNonExponential(airdrop.openseaSellAmount) || 0, 4)} ETH`, //opensea售卖金额
          }
        },
        {
          statisticsType: t("airdrop.walletPoint"),
          tips: {
            title: t("airdrop.walletTitle"),
            detail: "RARE*NFT/(NFT+RARE)*MHT*200/(200+MHT)*2*DU*365/(365+DU)*2*FACTOR"
          },
          totalPoint: airdrop.walletPoint,
          detail: {
            Duration: t("common.dayNum", { days: airdrop.walletDay || 0 }), //钱包使用天数
            "Total NFT": airdrop.walletHoldNft, //持有NFT数量
            "Rare NFT": airdrop.walletQualityNft, //优质NFT数量
            "Max Holding Time": t("common.dayNum", { days: airdrop.walletLongestDay || 0 }), //钱包最长天数
          }
        },
        {
          statisticsType: t("airdrop.referrals"),
          tips: {
            title: t("airdrop.referralsTitle"),
            detail: ""
          },
          totalPoint: airdrop.invatePoint,
          detail: {
            Clicks: airdrop.clickNumber, //点击次数
            Referrals: airdrop.regNumber, //注册人数
            "This month": airdrop.thisMonthPoint, //这个月积分
            "Last month": airdrop.lastMonthPoint, //上个月积分
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
      const { uniswapPoint, openseaPoint, walletPoint, invatePoint } = this.airdrop;
      if (uniswapPoint == null || openseaPoint == null || walletPoint == null) return false;
      const point = new bigNumber(uniswapPoint || 0).plus(openseaPoint || 0).plus(walletPoint || 0).plus(invatePoint || 0).toString();
      return point
    }
  },
  methods: {
    timeFormat: timeFormat,
    async fetchWalletNft(isSearch = true) {
      this.loading = true;
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 0;
        _page = 0;
      }

      const res = await getWalletNft({
        address: this.airdrop.walletAddress,
        cursor: this.pageList[_page],
        size: size,
        chatId: 1
      });
      if (res && res.code == 200) {
        this.nftList = res.data?.records || [];
        this.count = res.data?.total || 0;
        this.loading = false;
        if (!res.data?.cursor) return;
        this.addCursor(res.data?.cursor)
      }
    },
    addCursor(event) {
      const isRepeat = this.pageList.findIndex(e => e == event) > -1;
      if (!isRepeat) {
        this.pageList.push(event);
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
    },
    /**
     * @description: 科学计数法修正
     */
    toNonExponential(num) {
      if (!num) return 0
      var m = Number(num)
        .toExponential()
        .match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return Number(num).toFixed(Math.max(0, (m[1] || "").length - m[2]));
    },
  },
  created() {
    // 如果未同步就不加载Nft列表
    if (!this.accountPoint) return;
    this.fetchWalletNft();
  },
  watch: {
    accountPoint(newV) {
      if (!newV) return
      this.fetchWalletNft();
    }
  }
};
</script>
  
<style lang="scss" scoped>
@import "./components/point.scss";
</style>
<style lang="scss">
.tips_box {
  max-width: 90%;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.3125rem;
  background-color: #2c115b !important;
  box-sizing: border-box;

  .tips_title {
    font-family: 'Medium';
    font-size: 0.75rem;
    line-height: 1.3;
    text-align: left;
    color: #a9a4b4;
  }

  .tips_text {
    font-family: 'Medium';
    font-size: 0.75rem;
    line-height: 1.3;
    text-align: left;
    color: white;
    word-break: break-all;
  }

  .el-popper__arrow::before {
    background-color: #2c115b !important;
  }
}
</style>