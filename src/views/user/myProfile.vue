<template>
  <div class="wrapper_bg">
    <div class="my_profile_wrapper">
      <div class="user_panel" :style="{
        backgroundImage: isMore ? `url(${pointMore})` : `url(${bg[activeType]})`,
        height: isMore ? '86rem' : activeType == 'point' ? '44.3125rem' : `63.6875rem`
      }">
        <div class="user_info">
          <img src="@/assets/svg/user/default_avatar.svg" alt="">
          <div class="user_box">
            <div class="user_name">{{ userInfo.userName || "userName" }}</div>
            <div class="user_wallet" v-if="userInfo.walletAddress">
              <span>{{ userInfo.walletAddress }}</span>
              <img src="@/assets/svg/user/icon_link.svg" alt="">
            </div>
            <div class="create_time">Joined Mar 2023</div>
          </div>
        </div>
        <el-tabs v-model="activeType" class="type_tabs" @tab-change="handleChange">
          <el-tab-pane label="Point" name="point"></el-tab-pane>
          <el-tab-pane label="Purchase History" name="purchase_history"></el-tab-pane>
        </el-tabs>
        <div class="point_box" v-if="activeType == 'point'">
          <div class="point_total">
            <img src="@/assets/svg/user/icon_profile.svg" alt="">
            <span>{{ `${userBalance || 0} Point` }}</span>
          </div>
          <div class="point_details">
            <div class="point_details_title">POINT DETAILS</div>
            <el-table :data="pointData" class="table_container" style="width: 100%">
              <el-table-column prop="source" label="TYPE" align="center" />
              <el-table-column prop="integral" label="POINT" align="center">
                <template #default="scope">
                  <div class="point_info">
                    <span v-if="scope.row.integral > 0">{{ `+${scope.row.integral || 0}` }}</span>
                    <span v-else class="minus">{{ `${scope.row.integral || 0}` }}</span>
                    <img src="@/assets/svg/user/icon_copy.svg" alt="">
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="usdtPrice" label="ETH AMOUNT" align="center" />
              <el-table-column prop="boxName" label="DETAIL" align="center" />
              <el-table-column prop="date" label="DATE/TIME" align="center">
                <template #default="scope">
                  {{ timeFormat(scope.row.date) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="purchase_history_box" :style="{ height: isMore && '62.5rem' }"
          v-if="activeType == 'purchase_history'">
          <div class="history_item" v-for="(item, index) in purchaseHistory" :key="index">
            <div class="box_info">
              <div class="box_img">
                <img :src="item.boxImg" alt="">
              </div>
              <div class="box_buy">
                <div class="box_name">{{ item.boxName }}</div>
                <div class="box_num">{{ `x ${item.lottery.length}` }}</div>
                <div class="box_order">{{ `ID：${item.orderNumber}` }}</div>
              </div>
            </div>
            <div class="nft_info">
              <div class="nft_list">
                <div class="img_box" v-for="(event, indexs) in item.lottery" :key="indexs">
                  <img :src="event.nftImg" alt="">
                </div>
              </div>
              <div class="price_box">
                <div class="price">{{ `${item.buyPrice} ETH` }}</div>
                <div class="time">{{ timeFormat(item.createTime) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="this.count > 4">
          <div class="more" v-if="!isMore" @click="loadMore()">
            <span>Show more</span>
            <img src="@/assets/svg/user/icon_more.svg" alt="">
          </div>
          <div class="pagination-box" v-else>
            <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
              layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>    
<script>

import {
  getAListOfUserPoints,
  getUserBuyHistory
} from "@/services/api/user";

import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { timeFormat } from "@/utils";
export default {
  name: 'myProfile',
  data() {
    return {
      activeType: "point",
      userBalance: null, // 余额
      pointData: [],
      purchaseHistory: [],
      bg: {
        point: require("@/assets/svg/user/point_bg.svg"),
        purchase_history: require("@/assets/svg/user/purchase_history_bg.svg")
      },
      pointMore: require("@/assets/svg/user/point_more_bg.svg"),
      isMore: false,
      page: 1,
      size: 4,
      count: 20,
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
  },
  methods: {
    timeFormat: timeFormat,
    handleChange(event) {
      this.page = 1;
      this.size = 4;
      this.count = 0;
      this.isMore = false;
      this.pointData = [];
      this.purchaseHistory = [];

      if (event == 'point') {
        this.fetchUserPoints();
      } else {
        this.fetchUserBuyHistory();
      }
    },
    // 获取购买记录
    async fetchUserBuyHistory() {
      const res = await getUserBuyHistory({
        page: this.page,
        size: this.size
      });
      if (res.code == 200) {
        this.purchaseHistory = res.data.records;
        this.count = res.data.total;
      }
    },
    // 获取用户积分
    async fetchUserPoints() {
      const res = await getAListOfUserPoints({
        page: this.page,
        size: this.size
      });
      if (res.code == 200) {
        this.pointData = res.data.records;
        this.count = res.data.total;
      }
    },
    loadMore() {
      this.isMore = true;
      if (this.activeType == "point") {
        this.size = 20;
        this.fetchUserPoints();
      } else {
        this.size = 5;
        this.fetchUserBuyHistory();
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      if (this.activeType == "point") {
        this.fetchUserPoints();
      } else {
        this.fetchUserBuyHistory();
      }
    },
  },
  created() {
    console.log(this.userInfo)
    this.fetchUserPoints();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/myProfile.scss";
</style>
