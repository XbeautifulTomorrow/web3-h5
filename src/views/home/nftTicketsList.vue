<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box"></div>
      <div class="search_box">
        <div class="search_input_box">
          <div class="type_btn">
            <div :class="['type_btn_item',{'active':type=='ETH'}]" @click="getListFunc">
              <span>ETH</span>
              <img src="@/assets/svg/home/icon_eth.svg" alt="" v-if="type=='ETH'">
              <img src="@/assets/svg/home/coin_eth_enable.svg" alt="" v-else>
            </div>
            <div :class="['type_btn_item',{'active':type=='NFT'}]" @click="getListFunc">
              <span>NFT</span>
              <img src="@/assets/svg/home/coin_nft.svg" alt="" v-if="type=='NFT'">
              <img src="@/assets/svg/home/coin_nft_enable.svg" alt="" v-else>
            </div>
          </div>
          <el-input
            v-if="type=='NFT'"
            v-model="searchVal"
            clearable
            @input="handleSearch"
            class="search_input"
            type="text"
            :placeholder="$t('homeReplenish.searchNft')"
          >
            <template #prefix>
              <el-icon class="el-input__icon search_icon">
                <search />
              </el-icon>
            </template>
          </el-input>
          <div class="sort_box">
            <el-select
              v-model="currentStatus"
              @change="fetchCheckAllOrders()"
              :placeholder="$t('homeReplenish.all')"
              clearable
              class="select_box"
              size="large"
            >
              <el-option
                v-for="(item, index) in statusDrop"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="sort_title">{{ $t("homeReplenish.status") }}</div>
          </div>
          <div class="sort_box">
            <el-select
              v-model="sort"
              @change="fetchCheckAllOrders()"
              :placeholder="$t('homeReplenish.all')"
              :class="['select_box',{'sort_select':type=='ETH'}]"
              size="large"
            >
              <el-option
                v-for="(item, index) in sortDrop"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="sort_title">{{ $t("homeReplenish.sort") }}</div>
          </div>
          <div class="sort_box collections" v-if="type=='NFT'">
            <el-select
              v-model="nftId"
              clearable
              @change="fetchCheckAllOrders()"
              class="select_box"
              :placeholder="$t('homeReplenish.all')"
              size="large"
            >
              <el-option
                v-for="(item, index) in collections"
                :key="index"
                :label="item.seriesName"
                :value="item.contractAddress"
              />
            </el-select>
            <div class="sort_title">
              {{ $t("homeReplenish.sortCollections") }}
            </div>
          </div>
        </div>
        <div class="create_btn create" @click="toDraw()">
          {{ $t("homeReplenish.startBtn") }}
        </div>
      </div>
      <ul class="boxes-content" v-if="count > 0">
        <template v-for="(item, index) in ticketList" :key="`tickets-${index}`">
          <li class="ntf-tickets-item" @click="handleTickets(item)">
            <div class="discount" v-if="item.sendTicketsSwitch == 1">
              <div class="val">FREE</div>
            </div>
            <div class="img-box">
              <Image
                fit="cover"
                class="nft_img"
                v-if="item.orderType == 'LIMITED_PRICE_COIN'"
                :src="require('@/assets/svg/user/create_eth.webp')"
              />
              <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
              <div class="type-box" v-if="item.currentStatus == 'IN_PROGRESS'">
                <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                  <img src="@/assets/svg/home/icon_time.svg" alt="" />
                  <span v-if="dateDiff(item && item.endTime) > 1">
                    {{
                      `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT`
                    }}
                  </span>
                  <countDown
                    v-else
                    v-slot="timeObj"
                    @onEnd="fetchCheckAllOrders(false)"
                    :time="item.endTime"
                  >
                    {{
                      $t("home.timeLeft", {
                        time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}`,
                      })
                    }}
                  </countDown>
                </div>
                <div class="price" v-else>
                  <img src="@/assets/svg/home/icon_price.svg" alt="" />
                  <span
                    v-if="
                      Number(
                        new bigNumber(item.limitNum || 0).minus(
                          item.numberOfTicketsSold || 0
                        )
                      ) > 1
                    "
                  >
                    {{
                      $t("home.ticketsLeft", {
                        num: Number(
                          new bigNumber(item.limitNum || 0).minus(
                            item.numberOfTicketsSold || 0
                          )
                        ),
                      })
                    }}</span
                  >
                  <span v-else>
                    {{
                      $t("home.ticketLeft", {
                        num: Number(
                          new bigNumber(item.limitNum || 0).minus(
                            item.numberOfTicketsSold || 0
                          )
                        ),
                      })
                    }}
                  </span>
                </div>
              </div>
              <div
                class="tips_round end"
                v-else-if="item.currentStatus == 'DRAWN'"
              >
                {{ $t("user.endStatus", { date: timeFormat(item.endTime) }) }}
              </div>
              <div
                class="nft-token"
                v-if="item.orderType != 'LIMITED_PRICE_COIN'"
              >
                {{ `#${item.tokenId}` }}
              </div>
            </div>
            <div class="nft-name">
              <div class="nft-name-l">
                <div class="name-text text-ellipsis">
                  <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">
                    {{ item.seriesName || "--" }}
                  </span>
                  <span v-else>
                    {{ `${Number(item.price).toLocaleString()} ETH` }}
                  </span>
                </div>
                <img src="@/assets/svg/home/icon_certified.svg" alt="" />
              </div>
            </div>
            <div class="price-box">
              <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">
                {{ `$ ${Number(item.price).toLocaleString()}` }}
              </span>
              <span v-else>
                {{
                  `$ ${Number(
                    accurateDecimal(
                      new bigNumber(exchangeRate).multipliedBy(item.price),
                      4
                    )
                  ).toLocaleString()}`
                }}
              </span>
            </div>
            <div
              class="boxes-button boxes-free-button"
              v-if="item.currentStatus == 'IN_PROGRESS' && item.sendTicketsSwitch == 1"
            >
              <span class="boxes-button-name name-free">{{
                $t("home.nftTicketBtn2")
              }}</span>
            </div>
            <div
              class="boxes-button"
              v-else-if="item.currentStatus == 'IN_PROGRESS'"
            >
              <span class="boxes-button-name">{{
                $t("home.nftTicketBtn")
              }}</span>
            </div>
            <div
              class="buy_btn winner"
              v-else-if="item.currentStatus == 'DRAWN'"
            >
              <span>{{ $t("ticketsInfo.winner") }}</span>
              <img src="@/assets/svg/user/default_avatar.svg" alt="" />
              <span
                v-if="userInfo && userInfo?.id == item.winningAddress"
                class="you"
                >{{ $t("user.you") }}</span
              >
              <span v-else>
                {{ item.winningName || item.winningAddress }}
              </span>
            </div>
            <div class="sold-box" v-html="$t('home.ticketsSold', { num: item.numberOfTicketsSold || 0 })" v-if="item.numberOfTicketsSold > 1">
            </div>
            <div class="sold-box" v-html="$t('home.ticketSold', { num: item.numberOfTicketsSold || 0 })" v-else>
            </div>
          </li>
        </template>
      </ul>
      <div v-else class="no_date">
        <span>{{ $t("homeReplenish.noDataCompetition") }}</span>
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
    <Login
      v-if="pageType === 'login'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Register
      v-if="pageType === 'register'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Forgot
      v-if="pageType === 'forgot'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Modify
      v-if="pageType === 'modify'"
      @onModify="closeDialogFun"
      @closeDialogFun="closeDialogFun"
    ></Modify>
    <createCom
      v-if="pageType === 'create'"
      @closeDialogFun="closeDialogFun"
    ></createCom>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

import {
  getTheExternalNFTSeries,
  getCoinAllOrders,
  getNftAllOrders,
} from "@/services/api/oneBuy";
import { getCacheTicker } from "@/services/api";
import bigNumber from "bignumber.js";
import countDown from "@/components/countDown";
import { accurateDecimal, dateDiff, timeFormat } from "@/utils";
import { i18n } from "@/locales";
const { t } = i18n.global;
import Image from "@/components/imageView";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import createCom from "@/views/user/components/createComponents.vue";
export default {
  name: "ntfTicketsList",
  components: {
    countDown,
    Login,
    Register,
    Forgot,
    Modify,
    createCom,
    Image,
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
      timer: null,
      type:"ETH"
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
    getListFunc(){
      this.type = this.type=='NFT'?'ETH':'NFT';
      this.fetchCheckAllOrders();
    },
    // 获取所有系列，用做筛选
    async fetchAllSeries() {
      const res = await getTheExternalNFTSeries({
        type: "EXTERNAL",
      });
      this.collections = res.data;
    },
    // 提款汇率
    async fetchCacheTicker() {
      const res = await getCacheTicker({
        areaCoin: "ETH",
        coinName: "USDT",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
      }
    },
    fetchCheckAllOrders(){
      if(this.type=='ETH'){
        this.fetchCoinAllOrders()
      } else {
        this.fetchNftAllOrders()
      }
    },
    // nft最新购买
    async fetchNftAllOrders(isSearch = true) {
      const { searchVal, currentStatus, sort, nftId, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      let res = await getNftAllOrders({
        keyWord: searchVal,
        currentStatus: currentStatus,
        sortBy: sort,
        contractAddress: nftId,
        page: _page,
        size: size,
      });

      if (res && res.code == 200) {
        this.ticketList = res.data.records;
        this.count = res.data.total;
      }
    },
    // coin最新购买
    async fetchCoinAllOrders(isSearch = true) {
      const { searchVal, currentStatus, sort, nftId, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      let res = await getCoinAllOrders({
        keyWord: searchVal,
        currentStatus: currentStatus,
        sortBy: sort,
        contractAddress: nftId,
        page: _page,
        size: size,
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
      this.fetchCheckAllOrders();
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    handleTickets(event) {
      this.$router.push({ name: "FreeNFT", query: { id: event.orderNumber } });
    },
    toDraw() {
      if (!this.isLogin || !this.userInfo?.id) {
        this.pageType = "login";
        return;
      }
      this.pageType = "create";
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchCheckAllOrders(false);
    },
  },
  created() {
    this.fetchAllSeries();
    this.fetchCheckAllOrders();
    this.fetchCacheTicker();

    this.statusDrop = [
      { label: t("homeReplenish.inProgress"), value: "IN_PROGRESS" },
      { label: t("homeReplenish.ended"), value: "DRAWN" },
    ];
    this.sortDrop = [
      { label: t("homeReplenish.sortPopularity"), value: "popularity" },
      { label: t("ticketsInfo.remaining"), value: "remaining" },
      { label: t("homeReplenish.sortPriceLow"), value: "price_asc" },
      { label: t("homeReplenish.sortPriceHigh"), value: "price_desc" },
    ];
  },
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