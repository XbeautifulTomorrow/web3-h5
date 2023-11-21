<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box"></div>
      <div class="search_box">
        <el-input
          v-model="searchVal"
          clearable
          @input="handleSearch()"
          class="search_input"
          type="text"
          :placeholder="$t('homeReplenish.searchBox')"
        >
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="sort_box">
          <el-select
            v-model="sort"
            @change="changeSort"
            class="select_box"
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
      </div>
      <ul class="boxes-content" v-if="count > 0">
        <template v-for="(item, index) in boxList" :key="`mystery-${index}`">
          <li class="mystery-boxes-item" @click="handleMysteryBoxes(item)">
            <div class="img_box">
              <Image
                fit="cover"
                class="mystery-boxs-list-img"
                :src="item.boxImg"
                alt=""
              />
            </div>
            <div class="mystery-boxs-title text-ellipsis">
              <div class="box-name text-ellipsis">{{ item.boxName }}</div>
            </div>
            <div class="box-price">
              <div class="price-box">
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span v-priceFormat="item.price"></span>
              </div>
            </div>
            <div class="other">
              <div class="sale">{{ $t("home.sale") }}</div>
              <div class="sale-val">{{ item.sales }}</div>
            </div>
            <p class="mystery-boxs-text text-ellipsis"></p>
            <div class="boxes-button buy-btn text-ellipsis">
              <span class="boxes-button-name">{{ $t("home.buyBtn") }}</span>
            </div>
          </li>
        </template>
      </ul>
      <div v-else class="no_date">
        <span>{{ $t("homeReplenish.noDataBox") }}</span>
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
  </div>
</template>
<script>
import { getBoxPageList } from "@/services/api/index";
import bigNumber from "bignumber.js";
import { dateDiff } from "@/utils";
import { i18n } from "@/locales";
const { t } = i18n.global;

import Image from "@/components/imageView";
export default {
  name: "mysteryBoxesList",
  components: {
    Image,
  },
  data() {
    return {
      searchVal: null,
      sort: "popularity",
      sortDrop: [],
      boxList: [],
      orderBy: null,
      orderType: null,
      page: 1,
      size: 20,
      count: 0,

      timer: null,
    };
  },
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    changeSort(event) {
      if (event == "popularity") {
        this.orderBy = "sales";
        this.orderType = "DESC";
      } else if (event == "price_desc") {
        this.orderBy = "price";
        this.orderType = "DESC";
      } else if (event == "price_asc") {
        this.orderBy = "price";
        this.orderType = "ASC";
      } else {
        this.orderBy = null;
        this.orderType = null;
      }

      this.fetchBoxPageList();
    },
    // 最新购买
    async fetchBoxPageList(isSearch = true) {
      const { searchVal, orderBy, orderType, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      let res = await getBoxPageList({
        boxName: searchVal || undefined,
        orderBy: orderBy,
        orderType: orderType,
        page: _page,
        size: size,
      });

      if (res && res.code == 200) {
        this.boxList = res.data.records;
        this.count = res.data.total;
      }
    },
    handleSearch() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.fetchBoxPageList();
      }, 300);
    },
    handleMysteryBoxes(event) {
      this.$router.push({ path: "/raffleBox", query: { boxId: event.id } });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchBoxPageList(false);
    },
  },
  created() {
    this.changeSort("popularity");
    this.sortDrop = [
      { label: t("homeReplenish.sortPopularity"), value: "popularity" },
      { label: t("homeReplenish.sortPriceLow"), value: "price_asc" },
      { label: t("homeReplenish.sortPriceHigh"), value: "price_desc" },
    ];
  },
};
</script>
<style lang="scss" scoped>
@import "./components/mysteryBoxesList.scss";
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
