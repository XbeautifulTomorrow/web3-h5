<template>
  <div class="details_wrapper">
    <div class="lottery_panel">
      <div class="home-public-title">
        <div class="title_box">
          <div class="title_text">TOP BLUE-CHIPS</div>
          <div class="title_description">An offcial box by Bitzing</div>
        </div>
        <div class="title_btn">
          <span class="title_btn_text">Try for free</span>
        </div>
      </div>
      <div class="lottery_boxs">
        <div class="lottery_boxs_l">
          <div class="img_box">
            <img src="@/assets/img/home/icon_box.png" alt="" />
          </div>
          <div class="description_box">
            <div class="title">DESCRIPTION</div>
            <div class="text">
              Enter now for a chance to win Mutant Ape Yacht Club #8039. The
              MUTANT APE YACHT CLUB is a collection of up to 20,000 Mutant Apes
              that can only be created by exposing an existing Bored Ape to a
              vial of MUTANT SERUM or by minting a Mutant Ape in the public sale
            </div>
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
                {{ blindDetailInfo.price }} {{ blindDetailInfo.coin }}
              </div>
            </div>
            <div class="lottery_type five" @click="rollNumberFun('FIVE')">
              <div class="discount">
                <div class="val">5% OFF</div>
              </div>
              <div class="lottery_info">
                <div class="open_text">OPEN</div>
                <div class="num_text">5</div>
                <div class="box_text">BOX</div>
              </div>
              <div class="lottery_btn">
                {{ blindDetailInfo.fivePrice * 5 }} {{ blindDetailInfo.coin }}
              </div>
            </div>
          </div>
          <div class="lottery_type ten" @click="rollNumberFun('TEN')">
            <div class="discount">
              <div class="val">10% OFF</div>
            </div>
            <div class="lottery_info">
              <div class="open_text">OPEN</div>
              <div class="num_text">1</div>
              <div class="box_text">BOX</div>
            </div>
            <div class="lottery_btn">
              {{ blindDetailInfo.tenPrice * 10 }} {{ blindDetailInfo.coin }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nft_series">
      <div class="home-public-title">
        <div class="title_text">NFTS IN THIS BOX</div>
        <div class="title_description">
          Amet ornare massa praesent lacus. In mi tristique enim tellus amet
          semper a. Donec ac congue nunc porta semper auctor enim.
        </div>
      </div>
      <div class="nft_series_list">
        <div
          class="nft_series_item"
          :class="[`series_level_bg_${item.type}`]"
          v-for="(item, index) in seriesList"
          :key="index"
        >
          <div :class="[`series_level_${item.type}`]">
            <div class="img_box"></div>
            <div class="series_info">
              <div class="series_name">
                <span>Bored Ape Yacht Club</span>
                <img src="@/assets/svg/home/icon_certified.svg" alt="" />
              </div>
              <div class="series_probability">
                <span>Range: 1~1</span>
                <span>ODDS: 0.0005%</span>
              </div>
              <div class="series_price">68.254 ETH - 71.254ETH</div>
            </div>
          </div>
          <div class="mask_box">
            <div class="show_series_btn" @click="handleShowNft(item)">
              Show NFTs
            </div>
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
          <el-input
            v-model.number="snapshotId"
            class="snapshot_input"
            placeholder="Search by snapshot ID"
          >
          </el-input>
        </div>
      </div>
      <el-table :data="nftData" class="table_container" style="width: 100%">
        <el-table-column prop="snapshot_id" label="Snapshot ID" align="center">
          <template #default="scope">
            {{ `#${scope.row.nftId}` }}
          </template>
        </el-table-column>
        <el-table-column prop="nftName" label="Box Name" align="center" />
        <el-table-column prop="price" label="Legend" align="center">
        </el-table-column>
        <el-table-column prop="usdtPrice" label="Epic" align="center">
        </el-table-column>
        <el-table-column prop="boxName" label="Rare" align="center" />
        <el-table-column prop="boxName" label="Common" align="center" />
        <el-table-column prop="boxName" label="Timestamp" align="center" />
        <el-table-column prop="date" label="Action" align="center">
          <template #default="scope">
            <div class="active_btn">
              <img
                class="nft_info"
                @click="handleActive(scope.row)"
                src="@/assets/svg/box/icon_info.svg"
                alt=""
              />
              <img
                class="nft_info_active"
                @click="handleActive(scope.row)"
                src="@/assets/svg/box/icon_info_active.svg"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog
    v-model="showSeriesDialog"
    class="series_dialog"
    fullscreen
    align-center
  >
    <div class="close_btn">
      <el-icon @click="showSeriesDialog = false">
        <CircleClose />
      </el-icon>
    </div>
    <series-slider></series-slider>
  </el-dialog>
</template>

<script>
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";
import { useHeaderStore } from "@/store/header.js";
import seriesSlider from "./slider.vue";
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
      timestamp: null,
      showSeriesDialog: false,
      nftData: [11, 2, 2, 2, 2],
      seriesList: [
        { type: "1" },
        { type: "2" },
        { type: "3" },
        { type: "4" },
        { type: "1" },
        { type: "2" },
        { type: "3" },
        { type: "4" },
        { type: "1" },
        { type: "2" },
        { type: "3" },
        { type: "4" },
      ],
      nftList: [],
    };
  },
  computed: {
    ...mapStores(useHeaderStore),
  },
  methods: {
    messageFun(message = "余额不足,请充值!", type = "warning") {
      ElMessage({
        message,
        type,
      });
    },
    rollNumberFun(type) {
      const { blindDetailInfo } = this;
      const { balance } = this.headerStoreStore;
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
    handleShowNft(event) {
      this.nftList = event;
      this.showSeriesDialog = true;
    },
    handleActive(event) {
      this.$router.push({ name: "Snapshot", query: { id: event.id } });
    },
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
