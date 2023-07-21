<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box">
      </div>
      <div class="search_box">
        <el-input v-model="searchVal" clearable @keyup.enter="fetchBoxList()" class="search_input" type="text"
          placeholder="Search mystery box">
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="sort_box">
          <el-select v-model="sort" clearable @change="fetchBoxList()" class="select_box" placeholder="ALL" size="large">
            <el-option v-for="(item, index) in sortDrop" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <div class="sort_title">Sort by:</div>
        </div>
        <div class="sort_box collections">
          <el-select v-model="nftId" clearable @change="fetchBoxList()" class="select_box" placeholder="ALL" size="large">
            <el-option v-for="(item, index) in collections" :key="index" :label="item.seriesName"
              :value="item.contractAddress" />
          </el-select>
          <div class="sort_title">Collections:</div>
        </div>
      </div>
      <ul class="boxes-content" v-if="count > 0">
        <template v-for="(item, index) in boxList">
          <li class="mystery-boxes-item" @click="handleMysteryBoxes(item)" v-if="index < 4" :key="`mystery-${index}`">
            <div class="img_box">
              <Image fit="cover" class="mystery-boxs-list-img" :src="item.boxImg" alt="" />
            </div>
            <div class="mystery-boxs-title text-ellipsis">
              <div class="box-name text-ellipsis">{{ item.boxName }}</div>
              <img src="@/assets/svg/box/icon_eth.svg" alt="">
            </div>
            <div class="box-price">
              <div class="price-box">
                {{ `${item.price} ${item.coin}` }}
              </div>
            </div>
            <div class="other">
              <div class="sale">{{ $t("home.sale") }}</div>
              <div class="sale-val">{{ item.sales }}</div>
            </div>
            <p class="mystery-boxs-text text-ellipsis">
            </p>
            <div class="boxes-button buy-btn text-ellipsis">
              <span class="boxes-button-name">{{ $t("home.buyBtn") }}</span>
            </div>
          </li>
        </template>
      </ul>
      <div v-else class="no_date">
        <span>NO MYSTERY BOX</span>
      </div>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
      </div>
    </div>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>
<script>
import { getBoxList } from '@/services/api/index';
import { getTheExternalNFTSeries } from "@/services/api/oneBuy";
import bigNumber from "bignumber.js";
import { dateDiff } from "@/utils";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Image from "@/components/imageView";
export default {
  name: 'mysteryBoxesList',
  components: {
    Login,
    Register,
    Forgot,
    Modify,
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
      boxList: [],
      pageType: null,
      page: 1,
      size: 20,
      count: 0
    };
  },
  computed: {},
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    closeDialogFun() {
      this.pageType = "";
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    // 获取所有系列，用做筛选
    async fetchAllSeries() {
      const res = await getTheExternalNFTSeries({
        type: "ALL"
      });
      this.collections = res.data;
    },
    // 最新购买
    async fetchBoxList(isSearch = true) {
      const { searchVal, sort, nftId, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      let res = await getBoxList({
        keyWord: searchVal,
        sortBy: sort,
        contractAddress: nftId,
        page: _page,
        size: size
      });

      if (res && res.code == 200) {
        // this.boxList = res.data.records;
        this.boxList = res.data;
        // this.count = res.data.total;
      }
    },
    handleMysteryBoxes(event) {
      if (this.isLogin && this.userInfo?.id) {
        this.$router.push({ path: "/mysteryBox", query: { boxId: event.id } });
      } else {
        this.changeTypeFun('login');
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchBoxList(false);
    }
  },
  created() {
    this.fetchAllSeries();
    this.fetchBoxList();
  }
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
</style>