<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box"></div>
      <div class="search_box">
        <el-input v-model="searchVal" clearable @keyup.enter="fetchCheckAllOrders()" class="search_input" type="text"
          placeholder="Search NFT">
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="sort_box">
          <el-select v-model="sort" clearable @change="fetchCheckAllOrders()" class="select_box" placeholder="ALL"
            size="large">
            <el-option v-for="(item, index) in sortDrop" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <div class="sort_title">Sort by:</div>
        </div>
        <div class="sort_box collections">
          <el-select v-model="nftId" clearable @change="fetchCheckAllOrders()" class="select_box" placeholder="ALL"
            size="large">
            <el-option v-for="(item, index) in collections" :key="index" :label="item.seriesName"
              :value="item.contractAddress" />
          </el-select>
          <div class="sort_title">Collections:</div>
        </div>
      </div>
      <ul class="boxes-content" v-if="count > 0">
        <template v-for="(item, index) in ticketList" :key="`tickets-${index}`">
          <li class="ntf-tickets-item" @click="handleTickets(item)">
            <div class="img-box">
              <Image fit="cover" class="nft_img" :src="item.nftImage" />
              <div class="type-box">
                <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                  <img src="@/assets/svg/home/icon_time.svg" alt="">
                  <span v-if="dateDiff(item && item.endTime) > 1">
                    {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                  </span>
                  <countDown v-else v-slot="timeObj" @onEnd="fetchCheckAllOrders()" :time="item.endTime">
                    {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                  </countDown>
                </div>
                <div class="price" v-else>
                  <img src="@/assets/svg/home/icon_price.svg" alt="">
                  <span>
                    {{
                      `${new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold || 0).toString()} TICKETS LEFT`
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="nft-name">
              <div class="nft-name-l">
                <div class="name-text text-ellipsis">{{ item.seriesName || "-" }}</div>
                <img src="@/assets/svg/home/icon_certified.svg" alt="">
              </div>
              <div class="nft-name-r text-ellipsis">{{ `#${item.tokenId}` }}</div>
            </div>
            <div class="price-box">
              {{ `${item.price} ETH` }}
            </div>
            <div class="boxes-button">
              <span class="boxes-button-name">{{ $t("home.nftTicketBtn") }}</span>
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
        <span>NO COMPETITION FOUND</span>
      </div>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
      </div>
    </div>
  </div>
</template>
<script>
import { getCheckAllOrders, getTheExternalNFTSeries } from "@/services/api/oneBuy";
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { dateDiff } from "@/utils";
import Image from "@/components/imageView";
export default {
  name: 'ntfTicketsList',
  components: {
    countDown,
    Image
  },
  data() {
    return {
      collections: [],
      searchVal: null,
      sort: null,
      sortDrop: [
        { label: "Sort by Popularity", value: "popularity" },
        { label: "Sort by Price Low", value: "price_desc" },
        { label: "Sort by Price High", value: "price_asc" }
      ],
      nftId: null,
      ticketList: [],
      page: 1,
      size: 20,
      count: 0
    };
  },
  computed: {},
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    // 获取所有系列，用做筛选
    async fetchAllSeries() {
      const res = await getTheExternalNFTSeries({
        type: "EXTERNAL"
      });
      this.collections = res.data;
    },
    // 最新购买
    async fetchCheckAllOrders(isSearch = true) {
      const { searchVal, sort, nftId, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      let res = await getCheckAllOrders({
        keyWord: searchVal,
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
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchCheckAllOrders(false);
    },
  },
  watch: {},
  created() {
    this.fetchAllSeries();
    this.fetchCheckAllOrders();
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
</style>