<template>
  <div class="point_container">
    <div class="user_info">
      <div class="user_info_l">
        <img src="@/assets/svg/user/default_avatar.svg" alt="" />
        <div class="user_box">
          <div class="username_text">
            <div class="name_text">Nobody</div>
            <div class="tips_text">Please wait for data synchronization.</div>
          </div>
          <div class="tips_text">
            <img src="@/assets/svg/airdrop/icon_wallet.svg" alt="" />
            <span>0x18eAF5c69ae2cF50fFd39EA1060073F5AC57b1BB</span>
          </div>
        </div>
      </div>
      <div class="user_info_r">
        <div class="data_item">
          <div class="item_label">RANK</div>
          <div class="item_data rank">--</div>
        </div>
        <div class="data_item">
          <div class="item_label">ACCOUNT POINTS</div>
          <div class="item_data">--</div>
        </div>
        <div class="data_item">
          <div class="item_label">REGISTRATION TIME</div>
          <div class="item_data">--</div>
        </div>
      </div>
    </div>
    <div class="details_info">
      <div class="details_item img_box">
        <img src="" alt="">
      </div>
      <div class="details_item statistics" v-for="(item, index) in statisticsRow" :key="index">
        <div class="statistics_type">
          <div class="title">{{ item.statisticsType }}</div>
          <div class="val">
            <span>{{ item.totalData || "--" }}</span>
            <el-tooltip popper-class="tips_box" effect="dark" placement="top">
              <template #content>{{ item.tips.title }}<br />{{ item.tips.detail }}</template>
              <img v-if="!item.totalData" src="@/assets/svg/airdrop/icon_help.svg" alt="">
            </el-tooltip>
          </div>
        </div>
        <div class="statistics_time">
          <div class="title">Today</div>
          <div class="val">{{ item.todayData || "--" }}</div>
        </div>
        <div class="statistics_time">
          <div class="title">Yesterday</div>
          <div class="val">{{ item.yesterdayData || "--" }}</div>
        </div>
        <div class="statistics_time">
          <div class="title">This month</div>
          <div class="val">{{ item.thisMonthData || "--" }}</div>
        </div>
        <div class="statistics_time">
          <div class="title">Last month</div>
          <div class="val">{{ item.lastMonthData || "--" }}</div>
        </div>
      </div>
      <div class="details_item list">
        <div class="no_date" v-if="!isSync">
          <div class="tips_text">NFT data synchronization in...</div>
          <div class="sync_btn" @click="isSync = true">Click here to switch to the completed sync screen</div>
        </div>
        <div v-if="isSync" class="nft_box">
          <div class="nft_item" v-for="(item, index) in nftList" :key="index">
            <div class="nft_img"></div>
            <div class="nft_info">
              <div class="name_box">
                <span>Bored Ape Yacht Club</span>
                <span>#1254</span>
              </div>
              <div class="time_box">
                <img src="@/assets/svg/airdrop/icon_time.svg" alt="">
                <span>Length of holding:</span>
                <span>{{ `100 D` }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isSync" class="pagination_box">
          <div class="total_box">
            {{ `${(page - 1) * size + 1}-${(page - 1) * size + size} of ${count}` }}
          </div>
          <div class="pagination not-select">
            <div :class="['prev', !pageCount.prev && 'disabled']" @click="handleCurrentChange(-1)">
              <el-icon>
                <ArrowLeftBold />
              </el-icon>
            </div>
            <div class="page_box ">
              <el-input type="number" v-model.number="page" />
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
export default {
  name: 'AirdropPoint',
  data() {
    return {
      isSync: false,
      nftList: [1, 2, 3, 4, 5, 6],
      page: 1,
      size: 6,
      count: 500,
    };
  },
  computed: {
    statisticsRow() {
      return [
        {
          statisticsType: "UNISWAP POINT",
          tips: {
            title: "Only ETH's transactions will be involved in the statistics.The formula is as follows:",
            detail: "(SWAPS*30/(30+SWAPS)*5+TA*20/(20+TA)*20)*DU*350/(365+DU)*2*FACTOR"
          }
        },
        {
          statisticsType: "OPENSEA POINT",
          tips: {
            title: "The opensea points formula is as follows:",
            detail: "(SWAPS*30/(30+SWAPS)*5+TA*20/(20+TA)*20)*DU*350/(365+DU)*2*FACTOR"
          }
        },
        {
          statisticsType: "REFERRALS",
          tips: {
            title: "After inviting one user to sign up for Connect Wallet and earn points, you will receive an extra 10% bonus.",
            detail: ""
          }
        },
        {
          statisticsType: "WALLET POINT",
          tips: {
            title: "The Wallet point formula is as follows:",
            detail: "RARE*NFT/(NFT+RARE)*MHT*200/(200+MHT)*2*DU*355/(365+DU)*2*FACTOR"
          }
        },
      ]
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
@import "./components/point.scss";
</style>
<style lang="scss">
.tips_box {
  width: 16.25rem;
}
</style>