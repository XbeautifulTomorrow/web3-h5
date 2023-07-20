<template>
  <div class="contents-info">
    <div class="home-public-title">
      <div class="title-box-l">
        <div class="title_text">{{ $t("home.contentsInfoTitle") }}</div>
        <div class="title_description">
          {{ $t("home.contentsInfoTips") }}
        </div>
      </div>
      <el-select class="title-box-r" v-model="searchId" @change="othersideBoxFun" placeholder="ALL" size="large"
        effect="dark">
        <el-option label="ALL" value="" />
        <el-option v-for="(item, index) in boxList" :key="index" :label="item.boxName" :value="item.id" />
      </el-select>
    </div>
    <el-table :data="nftData" class="table_container" style="width: 100%">
      <el-table-column prop="nftId" label="NFT" min-width="120">
        <template #default="scope">
          <div class="user_info">
            <div class="image_box">
              <Image fit="cover" class="nft_img" :src="scope.row.nftImg" />
            </div>
            <div class="user_text">
              <span>{{ `#${scope.row.nftId}` }}</span>
              <span>{{ scope.row.nftName }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" :label="$t('home.tabelText2')" show-overflow-tooltip>
        <template #default="scope">
          {{ `${scope.row.price} ${scope.row.coin}` }}
        </template>
      </el-table-column>
      <el-table-column prop="usdtPrice" :label="$t('home.tabelText3')" min-width="100" show-overflow-tooltip>
        <template #default="scope">
          {{ `$${scope.row.usdtPrice}` }}
        </template>
      </el-table-column>
      <el-table-column prop="boxName" :label="$t('home.tabelText4')" min-width="120" show-overflow-tooltip />
      <el-table-column prop="date" :label="$t('home.tabelText5')" align="right" fixed="right">
        <template #default>
          <div class="active_btn">
            <img src="@/assets/svg/home/icon_active.svg" alt="">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
        layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
    </div>
  </div>
</template>

<script>
import { getNFTList } from '@/services/api/index';
import Image from "@/components/imageView";
export default {
  name: 'ContentsInfo',
  props: ['boxList'],
  components: {
    Image
  },
  data() {
    return {
      nftData: [],
      searchId: null,
      page: 1,
      size: 10,
      count: 0
    };
  },
  methods: {
    async fetchNftList() {
      const res = await getNFTList({
        page: this.page,
        size: this.size,
        boxId: this.searchId
      });
      if (res && res.code == 200) {
        this.nftData = res.data.records;
        this.count = res.data.total;
      }
    },
    othersideBoxFun() {
      this.page = 1;
      this.fetchNftList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchNftList();
    },
    handleActive(event) {
      console.log(event);
    }
  },
  created() {
    this.fetchNftList();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/contentsInfo.scss";
</style>
<style lang="scss">
.el-select__popper {
  &.is-dark {
    background-color: #1d0f36;
    border: none;
  }

  .el-select-dropdown__list {
    margin: 0.5rem 0 !important;
  }

  .el-select-dropdown__item {
    height: 3.3125rem;
    line-height: 3.3125rem;
    font-size: 1.125rem;
    font-weight: 500;

    &.selected,
    &.hover {
      color: white;
      background-color: #281d31;
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
    }
  }
}
</style>