<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box">
      </div>
      <div class="search_box">
        <el-input v-model="searchVal" clearable @keyup.enter="fetchBoxPageList()" class="search_input" type="text"
          placeholder="Search mystery box">
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="sort_box">
          <el-select v-model="sort" clearable @change="changeSort" class="select_box" placeholder="ALL" size="large">
            <el-option v-for="(item, index) in sortDrop" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <div class="sort_title">Sort by:</div>
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
import { getBoxPageList } from '@/services/api/index';
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
      searchVal: null,
      sort: null,
      sortDrop: [
        { label: "Sort by Popularity", value: "popularity" },
        { label: "Sort by Price Low", value: "price_desc" },
        { label: "Sort by Price High", value: "price_asc" }
      ],
      boxList: [],
      orderBy: null,
      orderType: null,
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
        boxName: searchVal,
        orderBy: orderBy,
        orderType: orderType,
        page: _page,
        size: size
      });

      if (res && res.code == 200) {
        this.boxList = res.data.records;
        this.count = res.data.total;
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
      this.fetchBoxPageList(false);
    }
  },
  created() {
    this.fetchBoxPageList();
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