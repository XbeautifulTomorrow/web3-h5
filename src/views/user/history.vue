<template>
  <div class="my_history_wrapper">
    <div class="history_text">
      <img src="@/assets/svg/user/icon_history.svg" alt="" />
      <span>{{ $t("user.history") }}</span>
    </div>
    <div class="choose_box">
      <div
        class="coin_item"
        v-for="(item, index) in tabsList"
        :key="index"
        @click="handleChange(item)"
        :class="[activeType == item.value && 'active']"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="purchase_history_box" v-if="this.count > 0">
      <div
        :class="[
          'history_item',
          { history_competition: activeType != 'MYSTERY_BOX' },
        ]"
        v-for="(item, index) in historyList"
        :key="index"
      >
        <div class="box_info">
          <div class="box_img">
            <Image
              fit="cover"
              class="nft_img"
              v-if="activeType == 'MYSTERY_BOX'"
              :src="item.boxImg"
            />
            <Image
              fit="cover"
              class="nft_img"
              v-else-if="
                activeType != 'MYSTERY_BOX' &&
                item.orderType == 'LIMITED_PRICE_COIN'
              "
              :src="createEthImg"
            />
            <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
          </div>
          <div class="box_buy">
            <div class="box_num">
              <div v-if="activeType == 'MYSTERY_BOX'" class="box_name">
                {{ item.boxName }}
              </div>
              <div v-else class="box_name">{{ item.seriesName }}</div>
              <div v-if="activeType == 'MYSTERY_BOX'" class="mag-l">
                {{ ` x ${item.lottery.length}` }}
              </div>
              <div class="btns" v-if="activeType == 'MYSTERY_BOX'">
                <el-tooltip
                  v-if="item.hash"
                  popper-class="tips_box"
                  effect="dark"
                  placement="top"
                >
                  <template #content>
                    <span>{{ $t("user.verifyBtn") }}</span>
                  </template>
                  <img
                    @click="openLenk(item)"
                    src="@/assets/svg/user/icon_external_link.svg"
                    alt=""
                  />
                </el-tooltip>
                <el-tooltip
                  v-if="item.snapshotId"
                  popper-class="tips_box"
                  effect="dark"
                  placement="top"
                >
                  <template #content>
                    <span>{{ $t("user.snapshotBtn") }}</span>
                  </template>
                  <img
                    @click="handleSnapshot(item)"
                    src="@/assets/svg/user/icon_snapshot.svg"
                    alt=""
                  />
                </el-tooltip>
              </div>
              <div v-else class="mag-l">
                <span v-if="item.tickets > 1">{{
                  $t("user.numTicket", { num: item.tickets })
                }}</span>
                <span v-else>{{
                  $t("user.numTickets", { num: item.tickets })
                }}</span>
              </div>
            </div>
            <div v-if="activeType == 'MYSTERY_BOX'" class="box_order">
              {{ `ID：${item.orderNumber}` }}
            </div>
            <div v-else class="box_order">{{ `ID：${item.orderNum}` }}</div>
          </div>
        </div>
        <div class="nft_info">
          <div class="nft_list" v-if="activeType == 'MYSTERY_BOX'">
            <template v-for="(event, indexs) in item.lottery" :key="indexs">
              <el-tooltip popper-class="tips_box" effect="dark" placement="top">
                <template #content>
                  <span>
                    {{
                      `${event.seriesName} ${
                        (event.tokenId && "#" + event.tokenId) || ""
                      }`
                    }}
                  </span>
                </template>
                <div class="img_box">
                  <Image fit="cover" class="nft_img" :src="event.nftImg" />
                  <div class="mask_box" v-if="event.userSelect == 'RECLAIM'">
                    <img
                      class="status_img"
                      v-if="event.userSelect == 'RECLAIM'"
                      src="@/assets/svg/user/icon_sold.svg"
                      alt=""
                    />
                  </div>
                  <div
                    class="mask_box"
                    v-if="
                      event.userSelect == 'HOLD' &&
                      event.lotteryStatus != 'SUCCESS'
                    "
                  >
                    <img
                      class="status_img"
                      src="@/assets/svg/user/icon_refund.svg"
                      alt=""
                    />
                  </div>
                </div>
              </el-tooltip>
            </template>
          </div>
          <div class="price_box">
            <div class="price">
              <span v-if="activeType == 'MYSTERY_BOX'">{{
                `${item.buyPrice}`
              }}</span>
              <span v-else>{{ `${item.expenditure}` }}</span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            </div>
            <div class="time" v-if="activeType == 'MYSTERY_BOX'">
              {{ timeFormat(item.createTime) }}
            </div>
            <div class="time" v-else>
              {{ timeFormat(item.transactionTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no_date">
      <span>{{ $t("user.noDataHistory") }}</span>
    </div>
    <div class="pagination-box" v-if="count > size">
      <el-pagination
        v-model="page"
        :page-size="size"
        @current-change="handleCurrentChange"
        :pager-count="5"
        layout="prev, pager, next"
        :total="count"
        :prev-text="$t('common.prev')"
        :next-text="$t('common.next')"
      />
    </div>
  </div>
</template>
<script>
import { getUserBuyHistory } from "@/services/api/user";
import { getUserOneOrder } from "@/services/api/oneBuy";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { timeFormat, setSessionStore, openUrl } from "@/utils";
import Image from "@/components/imageView";

import createEth from "@/assets/svg/user/create_eth.webp";
export default {
  name: "myHistory",
  components: {
    Image,
  },
  data() {
    return {
      activeType: "MYSTERY_BOX",
      tabsList: [],
      historyList: [],
      page: 1,
      size: 5,
      count: 0,
      createEthImg: createEth,
    };
  },
  computed: {
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    isLogin() {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
    userInfo() {
      const userStore = useUserStore();
      return userStore.userInfo;
    },
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
    handleSnapshot(event) {
      setSessionStore("boxName", event.boxName);
      this.$router.push({ name: "Snapshot", query: { id: event.snapshotId } });
    },
    /**
     * @description: 打开链上
     */
    openLenk(event) {
      let chainLink = import.meta.env.VITE_APP_CHAIN_MUMBAI_ADDR;
      if (event.lotteryChainType == "OKT_TEST") {
        chainLink = import.meta.env.VITE_APP_CHAIN_OKT_TEST_ADDR;
      } else if (event.lotteryChainType == "BSC_TEST") {
        chainLink = import.meta.env.VITE_APP_CHAIN_BSC_TEST_ADDR;
      } else if (event.lotteryChainType == "BASE") {
        chainLink = import.meta.env.VITE_APP_CHAIN_BASE_ADDR;
      } else if (event.lotteryChainType == "BSC") {
        chainLink = import.meta.env.VITE_APP_CHAIN_BSC_ADDR;
      } else if (event.lotteryChainType == "OKT") {
        chainLink = import.meta.env.VITE_APP_CHAIN_OKT_ADDR;
      } else if (event.lotteryChainType == "ThunderCore") {
        chainLink = import.meta.env.VITE_APP_CHAIN_THUNDERCORE_ADDR;
      } else if (event.chainType == "TRC_20_TEST") {
        chainLink = import.meta.env.VITE_APP_CHAIN_TRC20TEST_ADDR;
      } else if (event.chainType == "TRC_20") {
        chainLink = import.meta.env.VITE_APP_CHAIN_TRC20_ADDR;
      }

      openUrl(`${chainLink}${event.hash}`);
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
    this.tabsList = [
      {
        label: this.$t("user.mysteryBox"),
        value: "MYSTERY_BOX",
      },
      {
        label: this.$t("user.competition"),
        value: "COMPETITION",
      },
    ];

    if (this.isLogin && this.userInfo?.id) {
      this.fetchUserBuyHistory();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/history.scss";
</style>
