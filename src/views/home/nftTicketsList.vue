<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box"></div>
      <div class="search_box">
        <el-input v-model="searchVal" class="search_input" type="text" placeholder="Search NFT">
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="sort_box">
          <el-select v-model="sort" class="select_box" placeholder="" size="large">
            <el-option label="Sort by Popularity" value="1" />
            <el-option label="Sort by Price Low" value="2" />
            <el-option label="Sort by Price High" value="3" />
          </el-select>
          <div class="sort_title">Sort by:</div>
        </div>
        <div class="sort_box collections">
          <el-select v-model="nftId" class="select_box" placeholder="ALL" size="large">
            <el-option label="ALL" value="1" />
            <el-option label="BAYC" value="2" />
            <el-option label="AZUKI" value="3" />
          </el-select>
          <div class="sort_title">Collections:</div>
        </div>

      </div>
      <ul class="boxes-content">
        <li class="ntf-tickets-item" v-for="(item, index) in ticketList" :key="`tickets-${index}`">
          <div class="image_box">
            <img class="nft_img" :src="item && item.nftImage" alt="">
            <div class="tips_round" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
              <img v-if="item.orderType == 'LIMITED_TIME'" src="@/assets/svg/home/icon_info_time_white.svg" alt="">
              <img v-else src="@/assets/svg/home/icon_info_price_white.svg" alt="">
              <span v-if="item.orderType == 'LIMITED_TIME'">
                <span v-if="dateDiff(item && item.endTime) > 1">
                  {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                </span>
                <countDown v-else v-slot="timeObj" :time="item && item.endTime">
                  {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                </countDown>
              </span>
              <span v-else>
                {{ `${new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold || 0)} TICKETS LEFT` }}
              </span>
            </div>
            <div class="image_tag text-ellipsis">#{{ item && item.tokenId }}</div>
          </div>
          <div class="nft_name">
            <span>{{ item && item.seriesName }}</span>
            <img src="@/assets/svg/home/icon_certified.svg" alt="">
          </div>
          <div class="nft_price">{{ item && item.price }}ETH</div>
          <div class="buy_btn" @click="handleTickets(item)">
            <span>ENTER NOW</span>
          </div>
          <div class="remaining_votes">
            {{ `${item && item.numberOfTicketsSold || 0} Tickets sold` }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getCheckAllOrders } from "@/services/api/oneBuy";
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { dateDiff } from "@/utils";
export default {
  name: 'ntfTicketsList',
  components: {
    countDown
  },
  data() {
    return {
      searchVal: null,
      sort: null,
      nftId: null,
      ticketList: [],
      page: 1,
      size: 9999,
      total: 0,
      finished: false
    };
  },
  computed: {},
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    // 最新购买
    async fetchCheckAllOrders(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      let res = await getCheckAllOrders({
        page: _page,
        size: size
      });

      if (res && res.code == 200) {
        if (isSearch) {
          this.ticketList = res.data.records;
          return
        }

        if (res.data.records.length == 0) {
          this.finished = true;
        }

        this.ticketList.push.apply(this.ticketList, res.data.records);
      }
    },
    // 加载更多
    nextPage() {
      this.page++;
      if (this.activeType == "activity") {
        this.fetchBuyRecord(false)
      }
    },
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
  },
  watch: {},
  created() {
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