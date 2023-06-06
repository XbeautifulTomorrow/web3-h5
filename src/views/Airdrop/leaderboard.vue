<template>
  <div class="leaderboard_container">
    <div class="statistics_box">
      <div>
        <div class="statistics_title">VERIFIED USER</div>
        <div class="statistics_content">
          <div class="statistics_item">
            <div class="label">TOTAL USER</div>
            <div class="val">1321456</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL POINT</div>
            <div class="val">1321456</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL NFTS</div>
            <div class="val">1321456</div>
          </div>
        </div>
      </div>
      <div>
        <div class="statistics_title">YOUR RANKING</div>
        <div class="statistics_content">
          <div class="statistics_item">
            <div class="val">1321456</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL POINT</div>
            <div class="val">1321456</div>
          </div>
          <img src="@/assets/svg/airdrop/icon_interval.svg" alt="">
          <div class="statistics_item">
            <div class="label">TOTAL NFTS</div>
            <div class="val">1321456</div>
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
        <div class="tabel_tbody_item tabel_item">
          <div class="rank">1</div>
          <div class="user_info">
            <div class="name_text text-ellipsis">user12559649483456</div>
            <div class="wallet_box text-ellipsis">
              <span>Wallet address:</span>
              <span>dasddadasdadasdasdadasda</span>
            </div>
          </div>
          <div class="point">
            <div class="point_item total">
              <div class="title">TOTAL</div>
              <div class="val">13456</div>
            </div>
            <div class="point_item">
              <div class="title">WALLET POINT</div>
              <div class="val">13456</div>
            </div>
            <div class="point_item">
              <div class="title">UNISWAP POINT</div>
              <div class="val">13456</div>
            </div>
            <div class="point_item">
              <div class="title">OPENSEA POINT</div>
              <div class="val">13456</div>
            </div>
          </div>
          <div class="date">Mar 9, 2023 4:12 AM</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import {
  getWalletNft
} from "@/services/api/oneBuy";
export default {
  name: 'AirdropLeaderboard',
  data() {
    return {
      page: 1,
      size: 6,
      count: 500,
    };
  },
  computed: {
    statisticsRow() {
      return []
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
    }
  },
  methods: {
    async fetchWalletNft(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      const res = await getWalletNft({
        cursor: _page,
        size: size
      });
      if (res && res.code == 200) {
        this.nftList = res.data.records;
        this.count = res.data.total;
      }
    },
    handleCurrentChange(event) {
      if (event < 0 && !this.pageCount.prev || event > 0 && !this.pageCount.next) return
      this.page += event;
      this.fetchWalletNft(false);
    },
  },
};
</script>
  
<style lang="scss" scoped>
@import "./components/leaderboard.scss";
</style>