<template>
  <div class="my_history_wrapper">
    <div class="history_text">
      <img src="@/assets/svg/user/icon_history.svg" alt="">
      <span>PURCHASE HISTORY</span>
    </div>
    <div class="choose_box">
      <div class="coin_item" v-for="(item, index) in tabsList" :key="index" @click="handleChange(item)"
        :class="[activeType == item.value && 'active']">
        {{ item.label }}
      </div>
    </div>
    <div class="purchase_history_box" v-if="this.count > 0">
      <div class="history_item" v-for="(item, index) in historyList" :key="index">
        <div class="box_info">
          <div class="box_img">
            <Image fit="cover" class="nft_img" v-if="activeType == 'MYSTERY_BOX'" :src="item.boxImg" />
            <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
          </div>
          <div class="box_buy">
            <div class="box_num">
              <span v-if="activeType == 'MYSTERY_BOX'">{{ item.boxName }}</span>
              <span v-else>{{ item.seriesName }}</span>
              <span v-if="activeType == 'MYSTERY_BOX'">{{ `x ${item.lottery.length}` }}</span>
              <span v-else>{{ `x ${item.tickets} ${item.tickets > 1 ? "Tickets" : "Ticket"}` }}</span>
            </div>
            <div v-if="activeType == 'MYSTERY_BOX'" class="box_order">{{ `ID：${item.orderNumber}` }}</div>
            <div v-else class="box_order">{{ `ID：${item.orderNum}` }}</div>
          </div>
        </div>
        <div class="nft_info">
          <div class="nft_list" v-if="activeType == 'MYSTERY_BOX'">
            <div class="img_box" v-for="(event, indexs) in item.lottery" :key="indexs">
              <Image fit="cover" class="nft_img" :src="event.nftImg" />
              <div class="mask_box">
                <img class="status_img" v-if="event.userSelect == 'RECLAIM'" src="@/assets/svg/user/icon_sold.svg"
                  alt="">
                <img class="status_img" v-else src="@/assets/svg/user/icon_refund.svg" alt="">
              </div>
            </div>
          </div>
          <div class="price_box">
            <div class="price">
              <span v-if="activeType == 'MYSTERY_BOX'">{{ `${item.buyPrice} ETH` }}</span>
              <span v-else>{{ `${item.expenditure} ETH` }}</span>
              <img src="@/assets/svg/user/icon_ethereum.svg" alt="">
            </div>
            <div class="time" v-if="activeType == 'MYSTERY_BOX'">{{ timeFormat(item.createTime) }}</div>
            <div class="time" v-else>{{ timeFormat(item.transactionTime) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no_date">
      <span>NO PURCHASE HISTORY FOUND</span>
    </div>
    <div class="pagination-box" v-if="this.count > size">
      <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
        layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
    </div>
  </div>
</template>
<script>
import { getUserBuyHistory } from "@/services/api/user";
import { getUserOneOrder } from "@/services/api/oneBuy";


import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { timeFormat } from "@/utils";
import Image from "@/components/imageView"
export default {
  name: "myHistory",
  components: {
    Image
  },
  data() {
    return {
      activeType: "MYSTERY_BOX",
      tabsList: [{
        label: "MYSTERY BOX",
        value: "MYSTERY_BOX"
      }, {
        label: "COMPETITION",
        value: "COMPETITION"
      }],
      historyList: [],
      page: 1,
      size: 5,
      count: 0,
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    }
  },
  methods: {
    timeFormat: timeFormat,
    handleChange(event) {
      this.page = 1;
      this.count = 0;
      this.historyList = [];
      this.activeType = event.value;

      this.fetchUserBuyHistory();
    },
    // 获取购买记录
    async fetchUserBuyHistory(isSearch = true) {
      const { activeType, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      let res = null;
      if (activeType == "MYSTERY_BOX") {
        res = await getUserBuyHistory({
          page: _page,
          size: size,
        });
      } else {
        res = await getUserOneOrder({
          page: _page,
          size: size,
        });
      }

      if (res.code == 200) {
        this.historyList = res.data.records;
        this.count = res.data.total;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      if (this.activeType == "MYSTERY_BOX") {
        this.fetchUserBuyHistory(false);
      } else {
        this.fetchUserBuyHistory(false);
      }
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchUserBuyHistory();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/history.scss";
</style>
