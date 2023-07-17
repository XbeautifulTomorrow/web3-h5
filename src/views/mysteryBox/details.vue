<template>
  <div class="details_wrapper">
    <div class="lottery_panel">
      <div class="home-public-title">
        <div class="title_box">
          <div class="title_text">{{ blindDetailInfo.boxName }}</div>
          <div class="title_description">An offcial box by Bitzing</div>
        </div>
        <div class="title_btn">
          <span class="title_btn_text">Try for free</span>
        </div>
      </div>
      <div class="lottery_boxs">
        <div class="lottery_boxs_l">
          <div class="img_box">
            <img :src="blindDetailInfo.boxImg" alt="" />
          </div>
          <div class="description_box">
            <div class="title">DESCRIPTION</div>
            <div class="text" v-html="blindDetailInfo.boxDesc"></div>
          </div>
        </div>
        <div class="lottery_boxs_r">
          <div class="top">
            <div class="lottery_type" @click="rollNumberFun('ONE')">
              <div class="lottery_info">
                <div class="open_text">OPEN</div>
                <div class="num_text">1</div>
                <div class="box_text">BOX</div>
              </div>
              <div class="lottery_btn">
                {{ blindDetailInfo && blindDetailInfo.price }}
                {{ blindDetailInfo.coin }}
              </div>
            </div>
            <div class="lottery_type five" @click="rollNumberFun('FIVE')">
              <div class="discount">
                <div class="val">5% OFF</div>
              </div>
              <div class="lottery_info">
                <div class="open_text">OPEN</div>
                <div class="num_text">5</div>
                <div class="box_text">BOXES</div>
              </div>
              <div class="lottery_btn">
                {{
                  blindDetailInfo &&
                  new bigNumber(blindDetailInfo.fivePrice || 0).multipliedBy(5)
                }}
                {{ blindDetailInfo?.coin }}
              </div>
            </div>
          </div>
          <div class="lottery_type ten" @click="rollNumberFun('TEN')">
            <div class="discount">
              <div class="val">10% OFF</div>
            </div>
            <div class="lottery_info">
              <div class="open_text">OPEN</div>
              <div class="num_text">10</div>
              <div class="box_text">BOXES</div>
            </div>
            <div class="lottery_btn">
              {{
                blindDetailInfo &&
                new bigNumber(blindDetailInfo.tenPrice || 0).multipliedBy(10)
              }}
              {{ blindDetailInfo.coin }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nft_series">
      <div class="home-public-title">
        <div class="title_text">NFTS IN THIS BOX</div>
      </div>
      <div class="nft_series_list" v-if="blindDetailInfo">
        <div class="nft_series_item" @click="handleShowNft(item)" :class="[`series_level_bg_${typrFormat(item)}`]"
          v-for="(item, index) in blindDetailInfo.series" :key="index">
          <div :class="[`series_level_${typrFormat(item)}`]">
            <div class="img_box">
              <img :src="item.seriesImg" alt="" />
            </div>
            <div class="series_info">
              <div class="series_name">
                <span>{{ item.seriesName }}</span>
                <img src="@/assets/svg/home/icon_certified.svg" alt="" />
              </div>
              <div class="series_probability">
                <span> {{ `Range:${item.range}` }}</span>
                <span>{{ `ODDS: ${nftProbabilityFormat(item.nftNumber)}%` }}</span>
              </div>
              <div v-if="item.nftType == 'EXTERNAL'" class="series_price">
                {{ `${item.minPrice}ETH - ${item.maxPrice}ETH` }}
              </div>
              <div v-else class="series_price">
                {{ `${item.maxPrice}ETH` }}
              </div>
            </div>
          </div>
          <div class="mask_box">
            <div class="show_series_btn">Show NFTs</div>
          </div>
        </div>
      </div>
    </div>
    <div class="contents-info">
      <div class="home-public-title">
        <div class="title-box-l">
          <div class="title_text">BOX SNAPSHOT</div>
        </div>
        <div class="title-box-r">
          <div class="title">Snapshot ID</div>
          <el-input v-model.number="snapshotId" @keyup.enter="handleSearch()" class="snapshot_input"
            placeholder="Search by snapshot ID">
            <template #suffix>
              <el-icon class="search_btn el-input__icon" @click="handleSearch()">
                <search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
      <el-table :data="snapshotData" class="table_container" style="width: 100%">
        <el-table-column prop="id" label="Snapshot ID" align="center">
        </el-table-column>
        <el-table-column prop="boxName" label="Box Name" align="center" />
        <el-table-column prop="legendNum" label="Legend" align="center">
          <template #default="scope">
            {{ `${probabilityFormat(scope.row, scope.row.legendNum)}%` }}
          </template>
        </el-table-column>
        <el-table-column prop="epicNum" label="Epic" align="center">
          <template #default="scope">
            {{ `${probabilityFormat(scope.row, scope.row.epicNum)}%` }}
          </template>
        </el-table-column>
        <el-table-column prop="rareNum" label="Rare" align="center">
          <template #default="scope">
            {{ `${probabilityFormat(scope.row, scope.row.rareNum)}%` }}
          </template>
        </el-table-column>
        <el-table-column prop="normalNum" label="Common" align="center">
          <template #default="scope">
            {{ `${probabilityFormat(scope.row, scope.row.normalNum)}%` }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="Timestamp" align="center">
          <template #default="scope">
            {{ timeFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="Details" align="center">
          <template #default="scope">
            <div class="active_btn">
              <img class="nft_info" @click="handleActive(scope.row)" src="@/assets/svg/box/icon_info.svg" alt="" />
              <img class="nft_info_active" @click="handleActive(scope.row)" src="@/assets/svg/box/icon_info_active.svg"
                alt="" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
      </div>
    </div>
  </div>
  <el-dialog v-model="showSeriesDialog" class="series_dialog" fullscreen align-center>
    <div class="close_btn">
      <el-icon @click="showSeriesDialog = false">
        <CircleClose />
      </el-icon>
    </div>
    <series-slider :nftParams="nftList" :nftType="seriesType" :sName="seriesName"
      @closeFun="showSeriesDialog = false"></series-slider>
  </el-dialog>
</template>

<script>
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { getSnapshotList } from "@/services/api/blindBox";
import seriesSlider from "./slider.vue";
import bigNumber from "bignumber.js";
import { timeFormat } from "@/utils";

export default {
  name: "boxDetails",
  components: {
    seriesSlider,
  },
  props: {
    blindDetailInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      snapshotId: null,
      showSeriesDialog: false,
      seriesList: [],
      snapshotData: [],
      seriesName: null,
      seriesType: null,
      nftList: [],
      page: 1,
      size: 10,
      count: 0,
    };
  },
  computed: {
    ...mapStores(useHeaderStore, useUserStore),
  },
  methods: {
    timeFormat: timeFormat,
    bigNumber: bigNumber,
    messageFun(message = "Insufficient balance, please recharge!", type = "warning") {
      ElMessage({
        message,
        type,
      });
    },
    rollNumberFun(type) {
      const { blindDetailInfo } = this;
      const { balance } = this.headerStoreStore;
      const { userInfo } = this.userStore;
      if (!userInfo) {
        this.messageFun("You have not logged in, please log in and try again!");
        return;
      }
      if (type === "ONE" && blindDetailInfo.price > balance) {
        this.messageFun();
        return;
      } else if (type === "FIVE" && blindDetailInfo.fivePrice * 5 > balance) {
        this.messageFun();
        return;
      } else if (type === "TEN" && blindDetailInfo.tenPrice * 10 > balance) {
        this.messageFun();
        return;
      }
      this.$emit("rollNumberFun", type);
    },
    typrFormat(event) {
      const { boxNftInfos } = event;
      if (!boxNftInfos.length > 0) return "4";
      const { qualityType } = boxNftInfos[0];
      if (qualityType == "LEGEND") {
        return "1";
      }
      if (qualityType == "RARE") {
        return "2";
      }
      if (qualityType == "EPIC") {
        return "3";
      } else {
        return "4";
      }
    },
    handleShowNft(event) {
      this.seriesName = event.seriesName;
      this.seriesType = event.nftType;
      this.nftList = event.boxNftInfos;
      this.showSeriesDialog = true;
    },
    handleActive(event) {
      this.$router.push({ name: "Snapshot", query: { id: event.id } });
    },
    handleSearch() {
      this.page = 1;
      this.fetchSnapshotList();
    },
    async fetchSnapshotList() {
      const res = await getSnapshotList({
        snapshotId: this.snapshotId,
        page: this.page,
        size: this.size,
      });

      if (res && res.code == 200) {
        this.snapshotData = res.data.records;
        this.count = res.data.total;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchSnapshotList();
    },
    /**
     * @description 概率计算
     * @param string event
     */
    probabilityFormat(event, num) {
      const { legendNum, epicNum, rareNum, normalNum } = event;
      const numTotal = Number(new bigNumber(legendNum).plus(epicNum).plus(rareNum).plus(normalNum));
      return new bigNumber(num).dividedBy(numTotal).multipliedBy(100).toFixed(4);
    },
    /**
    * @description Nft概率计算
    * @param string event
    */
    nftProbabilityFormat(event) {
      const { blindDetailInfo: { series } } = this;
      let numTotal = 0;
      for (let i = 0; i < series.length; i++) {
        numTotal += +series[i].nftNumber;
      }

      return new bigNumber(event).dividedBy(numTotal).multipliedBy(100).toFixed(4);
    },
  },
  created() {
    this.fetchSnapshotList();
  },
};
</script>
<style lang="scss" scoped>
@import "./components/details.scss";
</style>
<style lang="scss">
.series_dialog {
  background-color: transparent;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
