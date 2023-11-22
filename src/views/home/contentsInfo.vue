<template>
  <div class="contents-info">
    <div class="home-public-title">
      <div class="title-box-l">
        <div class="title_text">{{ $t("home.contentsInfoTitle") }}</div>
        <div class="title_description">
          {{ $t("home.contentsInfoTips") }}
        </div>
      </div>
      <div class="collections_box">
        <div class="collections_text">Collections:</div>
        <el-select
          v-model="contractAddress"
          @change="othersideBoxFun()"
          class="nft_type"
          placeholder="ALL"
          clearable
          :popper-append-to-body="false"
        >
          <el-option
            v-for="(item, index) in seriesList"
            :key="index"
            :label="item.seriesName"
            :value="item.contractAddress"
          />
        </el-select>
      </div>
    </div>
    <el-table :data="nftData" class="table_container" style="width: 100%">
      <el-table-column prop="nftId" label="NFT" show-overflow-tooltip>
        <template #default="scope">
          <div class="user_info text-ellipsis">
            <div class="image_box">
              <Image fit="cover" class="nft_img" :src="scope.row.nftImg" />
            </div>
            <div class="user_text">{{ scope.row.nftName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        :label="$t('home.tabelText1')"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ `#${scope.row.tokenId} ` }}
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        :label="$t('home.tabelText2')"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{
            `$${Number(
              accurateDecimal(scope.row.usdtPrice, 2),
            ).toLocaleString()}`
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="usdtPrice"
        :label="$t('home.tabelText3')"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ `${scope.row.price} ETH` }}
        </template>
      </el-table-column>
      <el-table-column
        prop="boxName"
        :label="$t('home.tabelText4')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="date"
        :label="$t('home.tabelText5')"
        align="center"
        width="100"
        fixed="right"
      >
        <template #default="scope">
          <div class="active_btn" @click="handleMysteryBoxes(scope.row)">
            <img src="@/assets/svg/home/icon_active.svg" alt="" />
          </div>
        </template>
      </el-table-column>
    </el-table>
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
import { getNFTList } from "@/services/api/index";
import { getTheExternalNFTSeries } from "@/services/api/oneBuy";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { accurateDecimal } from "@/utils";
import Image from "@/components/imageView";
export default {
  name: "ContentsInfo",
  components: {
    Image,
  },
  data() {
    return {
      seriesList: [],
      nftData: [],
      contractAddress: null,
      page: 1,
      size: 10,
      count: 0,
    };
  },
  computed: {
    ...mapStores(useUserStore),
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
    accurateDecimal: accurateDecimal,
    // 获取所有系列，用做筛选
    async fetchAllSeries() {
      const res = await getTheExternalNFTSeries({
        type: "EXTERNAL",
      });
      this.seriesList = res.data;
    },
    // 盲盒具体nft详情列表
    async fetchNftList(isSearch = true) {
      const { contractAddress, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      const res = await getNFTList({
        page: _page,
        size: size,
        contractAddress: contractAddress,
      });
      if (res && res.code == 200) {
        this.nftData = res.data.records;
        this.count = res.data.total;
      }
    },
    // 去抽奖
    handleMysteryBoxes(event) {
      this.$router.push({
        path: "/raffleBox",
        query: { boxId: event.boxId },
      });
    },
    othersideBoxFun() {
      this.page = 1;
      this.fetchNftList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchNftList(false);
    },
  },
  created() {
    this.fetchAllSeries();
    this.fetchNftList();
  },
};
</script>
<style lang="scss" scoped>
@import "./components/contentsInfo.scss";
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
    font-weight: 500;
    line-height: 1.6;
    padding: 0.625rem 0.825rem;
    height: auto;

    &.selected {
      color: #fad54d;
    }

    &:hover,
    &.hover {
      border-radius: 0.5rem;
      background-color: #13151f;
    }
  }

  .el-popper__arrow {
    display: none;
  }

  .el-select-dropdown__empty {
    font-size: 1rem;
    color: #a9a4b4;
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

    .el-select-dropdown__empty {
      font-size: 0.75rem;
    }
  }
}
</style>
