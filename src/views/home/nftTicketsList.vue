<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box"></div>
      <div class="search_box">
        <el-input v-model="searchVal" clearable @input="handleSearch" class="search_input" type="text"
          :placeholder="$t('homeReplenish.searchNft')">
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="sort_box">
          <el-select v-model="currentStatus" @change="fetchCheckAllOrders()" :placeholder="$t('homeReplenish.all')"
            clearable class="select_box" size="large">
            <el-option v-for="( item, index ) in  statusDrop " :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <div class="sort_title">{{ $t("homeReplenish.status") }}</div>
        </div>
        <div class="sort_box">
          <el-select v-model="sort" @change="fetchCheckAllOrders()" :placeholder="$t('homeReplenish.all')"
            class="select_box" size="large">
            <el-option v-for="( item, index ) in  sortDrop " :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <div class="sort_title">{{ $t("homeReplenish.sort") }}</div>
        </div>
        <div class="sort_box collections">
          <el-select v-model="nftId" clearable @change="fetchCheckAllOrders()" class="select_box"
            :placeholder="$t('homeReplenish.all')" size="large">
            <el-option v-for="( item, index ) in  collections " :key="index" :label="item.seriesName"
              :value="item.contractAddress" />
          </el-select>
          <div class="sort_title">{{ $t('homeReplenish.sortCollections') }}</div>
        </div>
        <div class="create_btn create" @click="toDraw()">{{ $t('homeReplenish.startBtn') }}</div>
      </div>
      <ul class="boxes-content" v-if="count > 0">
        <template v-for="( item, index ) in ticketList" :key="`tickets-${index}`">
          <li class="ntf-tickets-item" @click="handleTickets(item)">
            <div class="img-box">
              <Image fit="cover" class="nft_img" v-if="item.orderType == 'LIMITED_PRICE_COIN'"
                :src="require('@/assets/svg/user/create_eth.svg')" />
              <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
              <div class="type-box" v-if="item.currentStatus == 'IN_PROGRESS'">
                <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                  <img src="@/assets/svg/home/icon_time.svg" alt="">
                  <span v-if="dateDiff(item && item.endTime) > 1">
                    {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                  </span>
                  <countDown v-else v-slot="timeObj" @onEnd="fetchCheckAllOrders(false)" :time="item.endTime">
                    {{ $t("home.timeLeft", { time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}` }) }}
                  </countDown>
                </div>
                <div class="price" v-else>
                  <img src="@/assets/svg/home/icon_price.svg" alt="">
                  <span v-if="Number(new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold ||
                    0)) > 1">
                    {{ $t("home.ticketsLeft", {
                      num: Number(new bigNumber(item.limitNum ||
                        0).minus(item.numberOfTicketsSold || 0))
                    }) }}</span>
                  <span v-else>
                    {{ $t("home.ticketLeft", {
                      num: Number(new bigNumber(item.limitNum ||
                        0).minus(item.numberOfTicketsSold ||
                          0))
                    }) }}
                  </span>
                </div>
              </div>
              <div class="tips_round end" v-else-if="item.currentStatus == 'DRAWN'">
                {{ $t("user.endStatus", { date: timeFormat(item.endTime) }) }}
              </div>
            </div>
            <div class="nft-name">
              <div class="nft-name-l">
                <div class="name-text text-ellipsis">
                  <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">{{ item.seriesName || "--" }}</span>
                  <span v-else>{{ `${item.price} ETH` }}</span>
                </div>
                <img src="@/assets/svg/home/icon_certified.svg" alt="">
              </div>
              <div class="nft-name-r text-ellipsis" v-if="item.orderType != 'LIMITED_PRICE_COIN'">{{ `#${item.tokenId}` }}
              </div>
            </div>
            <div class="price-box">
              <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">{{ `${item.price} ETH` }}</span>
              <span v-else>{{ `${accurateDecimal(new bigNumber(exchangeRate).multipliedBy(item.price), 4)} USDT` }}</span>
            </div>
            <div class="boxes-button" v-if="item.currentStatus == 'IN_PROGRESS'">
              <span class="boxes-button-name">{{ $t("home.nftTicketBtn") }}</span>
            </div>
            <div class="buy_btn winner" v-else-if="item.currentStatus == 'DRAWN'">
              <span>{{ $t("ticketsInfo.winner") }}</span>
              <img src="@/assets/svg/user/default_avatar.svg" alt="">
              <span v-if="userInfo && userInfo?.id == item.winningAddress" class="you">{{ $t("user.you") }}</span>
              <span v-else>
                {{ item.winningName || item.winningAddress }}
              </span>
            </div>
            <div class="sold-box" v-if="item.numberOfTicketsSold > 1">
              {{ $t("home.ticketsSold", { num: item.numberOfTicketsSold || 0 }) }}
            </div>
            <div class="sold-box" v-else>
              {{ $t("home.ticketSold", { num: item.numberOfTicketsSold || 0 }) }}
            </div>
          </li>
        </template>
      </ul>
      <div v-else class="no_date">
        <span>{{ $t("homeReplenish.noDataCompetition") }}</span>
      </div>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
      </div>
    </div>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

import { getCheckAllOrders, getTheExternalNFTSeries } from "@/services/api/oneBuy";
import { getWithdrawalExchangeRate } from "@/services/api/user";
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { accurateDecimal, dateDiff, timeFormat } from "@/utils";
import { i18n } from '@/locales';
const { t } = i18n.global;
import Image from "@/components/imageView";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
export default {
  name: 'ntfTicketsList',
  components: {
    countDown,
    Login,
    Register,
    Forgot,
    Modify,
    Image
  },
  data() {
    return {
      collections: [],
      exchangeRate: null,
      searchVal: null,
      currentStatus: null,
      sort: "popularity",
      statusDrop: [],
      sortDrop: [],
      nftId: null,
      ticketList: [],
      page: 1,
      size: 20,
      count: 0,
      pageType: "",
      timer: null
    };
  },
  computed: {
    ...mapStores(useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
  },
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    // 获取所有系列，用做筛选
    async fetchAllSeries() {
      const res = await getTheExternalNFTSeries({
        type: "EXTERNAL"
      });
      this.collections = res.data;
    },
    // 提款汇率
    async fetchWithdrawalExchangeRate() {
      const res = await getWithdrawalExchangeRate({
        coinName: "ETH",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
      }
    },
    // 最新购买
    async fetchCheckAllOrders(isSearch = true) {
      const { searchVal, currentStatus, sort, nftId, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      let res = await getCheckAllOrders({
        keyWord: searchVal,
        currentStatus: currentStatus,
        sortBy: sort,
        contractAddress: nftId,
        page: _page,
        size: size
      });

      if (res && res.code == 200) {
        this.ticketList = res.data.records;
        this.count = res.data.total;
      }
    },
    handleSearch() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.fetchCheckAllOrders();
      }, 300);
    },
    closeDialogFun() {
      this.pageType = "";
      this.buyVotes = 1;
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
    toDraw() {
      if (!this.isLogin || !this.userInfo?.id) {
        this.pageType = "login";
        return
      }
      this.userStore.setUserPage(this.$route.path, 'inventory');
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchCheckAllOrders(false);
    },
  },
  created() {
    this.fetchAllSeries();
    this.fetchCheckAllOrders();
    this.fetchWithdrawalExchangeRate();

    this.statusDrop = [
      { label: t("homeReplenish.inProgress"), value: "IN_PROGRESS" },
      { label: t("homeReplenish.ended"), value: "DRAWN" }
    ];
    this.sortDrop = [
      { label: t("homeReplenish.sortPopularity"), value: "popularity" },
      { label: t("homeReplenish.sortPriceLow"), value: "price_asc" },
      { label: t("homeReplenish.sortPriceHigh"), value: "price_desc" }
    ]
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTicketsList.scss";
</style>
<style lang="scss">
.el-select__popper {
  border: none !important;
  background-color: #1d0f36 !important;

  .el-scrollbar__view {
    margin: 0.625rem 0 !important;
    padding: 0 0.625rem !important;
  }

  .el-select-dropdown__item {
    color: #a9a4b4;
    font-size: 1rem;
    line-height: 1.6;
    padding: 0.625rem 1.25rem;
    height: auto;

    &.selected {
      color: #fad54d;
    }

    &:hover,
    &.hover {
      color: #a9a4b4;
      border-radius: 0.5rem;
      background-color: #13151f;
    }
  }

  .el-popper__arrow {
    display: none;
  }
}

@media screen and (max-width: 950px) {
  .el-select__popper {
    .el-select-dropdown__item {
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 0.75rem;
      padding: 0 0.25rem;
    }
  }
}
</style>