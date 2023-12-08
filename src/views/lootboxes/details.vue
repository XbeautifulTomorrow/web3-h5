<template>
  <div class="details_wrapper" id="lootboxes_details_wrapper">
    <div class="mask_box"></div>
    <div class="details_content">
      <div class="lottery_panel">
        <div class="home-public-title">
          <div class="title_box">
            <div class="title_text">{{ blindDetailInfo.boxName }}</div>
            <div class="title_description">Free to win $60,000 USDT</div>
          </div>
        </div>
        <div class="lottery_boxs">
          <div class="lottery_boxs_l">
            <div class="img_box img_cover">
              <Image fit="cover" class="nft_img" :src="blindDetailInfo.boxImg" alt="" />
            </div>
            <div class="jackpot-box nft_series">
              <div class="home-public-title">
                <div class="title_box">
                  <div class="title_text">JACKPOT</div>
                </div>
              </div>
              <div class="nft_series_list" v-if="blindDetailInfo">
                <template v-for="(item, index) in blindDetailInfo.boxNftInfos">
                  <div class="nft_series_item" :class="[`series_level_bg_${typrFormat(item,true)}`]" v-if="index < 2" :key="index">
                    <div :class="['item_bg', `series_level_${typrFormat(item,true)}`]">
                      <div class="img_box">
                        <Image fit="cover" class="nft_img" :src="item.nftImg" alt="" />
                        <div
                          class="nft-token"
                          v-if="item.tokenId"
                        >
                          {{ `#${item.tokenId}` }}
                        </div>
                      </div>
                      <div class="series_info">
                        <div class="series_name">
                          <span>{{ item.nftName }}</span>
                          <img src="@/assets/svg/home/icon_certified.svg" alt="" />
                        </div>
                        <div class="series_price">
                          <img src="@/assets/svg/user/icon_usdt_gold.svg" />
                          <span>{{ ` ${formatPrice(item.price)}` }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="h5_lottery_boxs_r">
            <div class="lottery_calculate_box">
              <div class="calculate_btn disable" @click="calculateAmountFunc('sub')">
                <img src="@/assets/svg/lottery/subtract.svg" alt="" />
              </div>
              <div class="calculate_txt">x {{ amountArr[amountIndex] }}</div>
              <div class="calculate_btn disable" @click="calculateAmountFunc('add')">
                <img src="@/assets/svg/lottery/add.svg" alt="" />
              </div>
            </div>
            <div class="lottery_open_btn" @click="rollNumberFun(amountIndex == 0 ? 'ONE' : amountIndex == 1 ? 'FIVE' : 'TEN')">
              <div class="discount_h5 free">
                <div class="val">FREE</div>
              </div>
              <div class="lottery_box_title">OPEN</div>
              <img src="@/assets/img/home/poster/pointer.webp" alt="" class="pointer" />
            </div>
          </div>
        </div>
      </div>
      <div class="nft_series">
        <div class="home-public-title">
          <div class="title_text">NFTS IN THIS BOX</div>
        </div>
        <div class="nft_series_list" v-if="blindDetailInfo">
          <div
            class="nft_series_item"
            @click="handleShowNft(item)"
            :class="[`series_level_bg_${typrFormat(item)}`]"
            v-for="(item, index) in blindDetailInfo.series"
            :key="index"
          >
            <div :class="['item_bg', `series_level_${typrFormat(item)}`]">
              <div class="img_box">
                <Image fit="cover" class="nft_img" :src="item.seriesImg" alt="" />
              </div>
              <div class="series_info">
                <div class="series_name">
                  <span>{{ item.seriesName }}</span>
                  <img src="@/assets/svg/home/icon_certified.svg" alt="" />
                </div>
                <div class="series_probability">
                  <span>{{ $t("mysteryBox.range", { range: item.range }) }}</span>
                  <span>
                    {{
                      $t("mysteryBox.odds", {
                        odds: nftProbabilityFormat(item.nftNumber),
                      })
                    }}
                  </span>
                </div>
                <div v-if="item.nftType == 'EXTERNAL'" class="series_price">
                  <p v-if="item.minPrice == item.maxPrice">
                    <img src="@/assets/svg/user/icon_usdt_gold.svg" />
                    <span>{{ ` ${formatPrice(item.minPrice)}` }}</span>
                  </p>
                  <p v-else>
                    <img src="@/assets/svg/user/icon_usdt_gold.svg" />
                    <span>{{ ` ${formatPrice(item.minPrice)} - ` }}</span>
                    <img src="@/assets/svg/user/icon_usdt_gold.svg" />
                    <span>{{ ` ${formatPrice(item.maxPrice)}` }}</span>
                  </p>
                </div>
                <div v-else class="series_price">
                  <img src="@/assets/svg/user/icon_usdt_gold.svg" />
                  <span>{{ ` ${formatPrice(item.maxPrice)}` }}</span>
                </div>
              </div>
            </div>
            <div class="mask_box">
              <div class="show_series_btn">{{ $t("mysteryBox.showNfts") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="showSeriesDialog" class="series_dialog" fullscreen align-center>
    <div class="close_btn">
      <el-icon @click="showSeriesDialog = false">
        <CircleClose />
      </el-icon>
    </div>
    <series-slider :nftParams="nftList" :nftType="seriesType" :sName="seriesName" @closeFun="showSeriesDialog = false"></series-slider>
  </el-dialog>
</template>

<script>
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import { i18n } from "@/locales";
const { t } = i18n.global;

import { getSnapshotList } from "@/services/api/blindBox";
import seriesSlider from "./slider.vue";
import bigNumber from "bignumber.js";
import { timeFormat, setSessionStore, accurateDecimal } from "@/utils";
import Image from "@/components/imageView";

export default {
  name: "boxDetails",
  emits: ["rollNumberFun"],
  components: {
    seriesSlider,
    Image,
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
      size: 36,
      count: 0,
      isShowMore: null,
      amountIndex: 0,
      amountArr: [1, 5, 10],
    };
  },
  computed: {
    ...mapStores(useHeaderStore, useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    fiveRebate() {
      const { price, fivePrice } = this.blindDetailInfo;
      if (!fivePrice) return 0;

      const diff = Number(new bigNumber(price).minus(fivePrice));
      if (diff <= 0) return 0;
      const rebate = new bigNumber(diff).div(price).multipliedBy(100);
      return accurateDecimal(rebate, 2);
    },
    tenRebate() {
      const { price, tenPrice } = this.blindDetailInfo;
      if (!tenPrice) return 0;

      const diff = Number(new bigNumber(price).minus(tenPrice));
      if (diff <= 0) return 0;
      const rebate = Number(new bigNumber(diff).div(price).multipliedBy(100));
      return accurateDecimal(rebate, 2);
    },
  },
  methods: {
    timeFormat: timeFormat,
    bigNumber: bigNumber,
    calculateAmountFunc(type) {
      if (type == "sub") {
        if (this.amountIndex <= 0) {
          this.amountIndex = 0;
        } else {
          this.amountIndex--;
        }
      } else {
        if (this.amountIndex >= 2) {
          this.amountIndex = 2;
        } else {
          this.amountIndex++;
        }
      }
    },
    messageFun(message = t("mysteryBox.rechargeHint"), type = "warning") {
      ElMessage({
        message,
        type,
      });
    },
    rollNumberFun(type) {
      this.$emit("rollNumberFun", type);
    },
    typrFormat(event,type) {
      let qualityType = null
      if(!type){
        const { boxNftInfos } = event;
        if (!boxNftInfos.length > 0) return "4";
        qualityType = boxNftInfos[0].qualityType;
      } else {
        qualityType = event.qualityType
      }
      
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
      setSessionStore("boxName", event.boxName);
      this.$router.push({ name: "Snapshot", query: { id: event.id } });
    },
    handleSearch() {
      this.page = 1;
      this.fetchSnapshotList();
    },
    async fetchSnapshotList() {
      const res = await getSnapshotList({
        snapshotId: this.snapshotId,
        boxId: this.blindDetailInfo.id,
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
      const {
        blindDetailInfo: { series },
      } = this;
      let numTotal = 0;
      for (let i = 0; i < series.length; i++) {
        numTotal += +series[i].nftNumber;
      }

      return new bigNumber(event).dividedBy(numTotal).multipliedBy(100).toFixed(4);
    },
    formatPrice(event) {
      if (!event) return event;
      const arr = String(event).split(".");
      if (arr.length > 1 && arr[1].length > 2) {
        return Number(accurateDecimal(event, 2)).toLocaleString();
      } else {
        return Number(event).toLocaleString();
      }
    },
  },
  watch: {
    blindDetailInfo() {
      this.fetchSnapshotList();
      this.$nextTick(() => {
        const contentInfo = this.$refs.contentInfo;
        this.isShowMore = contentInfo ? contentInfo.scrollHeight > contentInfo.clientHeight : false;
      });
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
