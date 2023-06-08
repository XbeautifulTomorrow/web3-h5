<template>
  <div class="leaderboard_container">
    <div class="statistics_box">
      <div>
        <div class="statistics_title">VERIFIED USER</div>
        <div class="statistics_content">
          <div class="statistics_item">
            <div class="label">TOTAL USER</div>
            <div class="val">{{ statistics && statistics.totalUser }}</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL POINT</div>
            <div class="val">{{ statistics && statistics.totalPoint }}</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL NFTS</div>
            <div class="val">{{ statistics && statistics.totalNft }}</div>
          </div>
        </div>
      </div>
      <div>
        <div class="statistics_title">YOUR RANKING</div>
        <div class="statistics_content">
          <div class="statistics_item">
            <div class="val">{{ accountPoint ? airdrop.rankIndex : "--" }}</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL POINT</div>
            <div class="val">{{ accountPoint && accountPoint || "--" }}</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL NFTS</div>
            <div class="val">{{ accountPoint ? airdrop.walletHoldNft : "--" }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tabel_container">
      <div class="tabel_thead tabel_item">
        <div class="rank">RANK</div>
        <div class="user_info">USER INFO</div>
        <div class="point">POINT</div>
        <div class="date">DATE</div>
      </div>
      <div class="tabel_tbody">
        <div class="tabel_tbody_item tabel_item" v-for="(item, index) in rankList" :key="index">
          <div class="rank">1</div>
          <div class="user_info">
            <div class="name_text text-ellipsis">{{ item.userName || "Nobody" }}</div>
            <div class="wallet_box text-ellipsis">
              <span>Wallet address:</span>
              <span>{{ item.walletAddress && formatAddr(item.walletAddress) || "--" }}</span>
            </div>
          </div>
          <div class="point">
            <div class="point_item total">
              <div class="title">TOTAL</div>
              <div class="val">{{ pointCalculation(item) }}</div>
            </div>
            <div class="point_item">
              <div class="title">WALLET POINT</div>
              <div class="val">{{ item.walletPoint }}</div>
            </div>
            <div class="point_item">
              <div class="title">UNISWAP POINT</div>
              <div class="val">{{ item.uniswapPoint }}</div>
            </div>
            <div class="point_item">
              <div class="title">OPENSEA POINT</div>
              <div class="val">{{ item.openseaPoint }}</div>
            </div>
          </div>
          <div class="date">{{ timeFormat(item.regTime) }}</div>
        </div>
      </div>
      <div class="pagination_box" v-if="accountPoint">
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
            <span>{{ page }}</span>
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
</template>
  
<script>
import {
  getStatisticsTotal,
  getRankList
} from "@/services/api/airdrop";


import {
  timeFormat
} from "@/utils";
import bigNumber from "bignumber.js";
export default {
  name: 'AirdropLeaderboard',
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
      statistics: {},
      rankList: [],
      page: 1,
      size: 10,
      count: 0,
    };
  },
  computed: {
    startNum() {
      const { page, size } = this;
      return ((page - 1) * size) + 1;
    },
    endNum() {
      const { page, size, count } = this;
      const num = (page - 1) * size + size;
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
      if (page == 1) {
        isPrev = false;
      }

      if (page == pager) {
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
      const point = Number(new bigNumber(uniswapPoint || 0).plus(openseaPoint || 0).plus(walletPoint || 0));
      return point
    }
  },
  created() {
    if (!this.accountPoint) return
    this.fetchStatistics();
    this.fetchRankList();
  },
  methods: {
    timeFormat: timeFormat,
    async fetchStatistics() {
      const res = await getStatisticsTotal();
      if (res && res.code == 200) {
        this.statistics = res.data;
      }
    },
    async fetchRankList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      const res = await getRankList({
        page: _page,
        size: size
      });
      if (res && res.code == 200) {
        this.rankList = res.data.records;
        this.count = res.data.total;
      }
    },
    handleCurrentChange(event) {
      if (event < 0 && !this.pageCount.prev || event > 0 && !this.pageCount.next) return
      this.page += event;
      this.fetchRankList(false);
    },
    // 积分计算
    pointCalculation(event) {
      const { uniswapPoint, openseaPoint, walletPoint, invatePoint } = event;
      const point = Number(new bigNumber(uniswapPoint || 0).plus(openseaPoint || 0).plus(walletPoint || 0).plus(invatePoint || 0));
      return point
    },
    /**
     * @description: 格式化地址
     */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{7})\S+(\S{5})$/;
      return event.replace(reg, "$1...$2");
    },
  },
};
</script>
  
<style lang="scss" scoped>
@import "./components/leaderboard.scss";
</style>