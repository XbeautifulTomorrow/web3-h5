<template>
  <el-dialog
    v-model="newValue"
    :modal="true"
    width="100%"
    :show-close="false"
    destroy-on-close
    :append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :custom-class="['roll-dialog', { 'roll-one-dialog': rollNumber === 'ONE' }, { 'roll-lottery-dialog': !showResult }]"
  >
    <!-- 单个中奖 -->
    <keep-alive v-if="rollNumber === 'ONE'">
      <one-award
        :awards="oneAwards"
        :apiIsError="apiIsError"
        :awardItem="awardItem"
        :blindDetailInfo="blindDetailInfo"
        @showResultFun="showResultFun"
      />
    </keep-alive>
    <!-- 中奖列表 -->
    <result-list
      v-if="showResult"
      :result="awardItem"
      :idLotteryIn="idLotteryIn"
      :localDateTime="localDateTime"
      :clearResultTimer="clearResultTimer"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Loading :loading="loading" />
  </el-dialog>
</template>

<script>
import { ElMessage } from "element-plus";

import { shuffle } from "@/assets/js";

import oneAward from "./oneAward.vue";
import ResultList from "./resultList.vue";

import Loading from "@/components/loading/index.vue";

const itemWidth = 220;
export default {
  name: "LotteryPage",
  components: {
    ResultList,
    oneAward,
    Loading,
  },
  props: ["lottoList", "lottResult", "apiIsError", "errorText", "showRoll", "rollNumber", "blindDetailInfo"],
  data() {
    return {
      loading: false,
      oneAwards: [], //滚动的卡片列表
      awardItem: [], //中奖道具
      musicLoop: true,
      showNumber: 0,
      showResult: false,
      moreLuck: [],
      idLotteryIn: false,
    };
  },
  computed: {
    newValue: {
      get: function () {
        return this.showRoll;
      },
      set: function (value) {
        this.$emit("update:showRoll", value);
      },
    },
  },
  watch: {
    lottResult: function (newVal) {
      console.log(newVal, "newVal----------------");
      if (newVal?.length) {
        this.awardItem = shuffle(newVal);
      } else {
        this.messageFun(this.$t("lottery.no_win"));
      }
    },
  },
  created() {},
  methods: {
    changeTypeFun(data) {
      this.$emit("changeTypeFun", data);
    },
    closeDialogFun() {
      setTimeout(() => {
        this.$emit("closeRollFun");
      });
    },
    showResultFun(data) {
      this.showResult = true;
      this.idLotteryIn = data || false;
    },
    messageFun(message, type = "warning") {
      ElMessage({
        message,
        type,
        customClass: "roll-message",
      });
    },
    dataFun() {
      this.oneAwards = this.transformArr();
    },
    transformArr(len = 100) {
      const lottoList = JSON.parse(JSON.stringify(this.lottoList));
      let awards = [];
      const arr = shuffle(lottoList);
      this._transformArr(arr, awards, len);
      return shuffle(awards);
    },
    _transformArr(arr, newArr, len) {
      let state = false;
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.nftType !== "PLATFORM" && item.boxNftInfos.length > 0) {
          state = true;
          break;
        }
      }
      if (!state) {
        return;
      }

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.boxNftInfos.length > 0) {
          if (newArr.length >= len) return;
          newArr.push({ ...item, ...item.boxNftInfos[0] });
          if (item.nftType !== "PLATFORM") {
            arr[i].boxNftInfos.splice(0, 1);
          }
        }
      }
      this._transformArr(arr, newArr, len);
    },
  },
  mounted() {
    const { clientWidth } = document.body;
    const number = Math.ceil(clientWidth / itemWidth);
    this.showNumber = number;
    this.dataFun();
    const result = sessionStorage.getItem("result");
    if (result) {
      const _result = JSON.parse(result);
      this.awardItem = _result;
      console.log(this.awardItem, "awardItem-------------");
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
</style>
<style lang="scss">
.blind-lottory-box {
  .el-overlay {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
  }
}
.lottery-moreLuck {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__footer {
    display: none;
  }
}
.roll-one-dialog {
  background-color: transparent !important;
}
.roll-dialog {
  margin-top: 12.5rem;
  width: 100%;
  height: calc(100% - 12.5rem);
  margin-bottom: 0;
  background: url("@/assets/img/lottery/bg.webp") no-repeat center top;
  background-size: cover;
  border-radius: 0;
  &::-webkit-scrollbar {
    display: none;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    height: 100%;
    padding: 0;
  }
}
.public-dialog-header-icon {
  font-size: 2.5rem !important;
  margin-top: 1.875rem;
  margin-right: 1.875rem;
  cursor: pointer;
}
@media screen and (max-width: 950px) {
  .roll-dialog {
    margin-top: 6rem;
    height: calc(100% - 6rem);
  }
  .roll-lottery-dialog {
    background-image: none !important;
  }
  // .blind-lottory-box {
  //   .el-overlay {
  //     background-color: rgba(0, 0, 0, 0.7);
  //     backdrop-filter: blur(0px);
  //   }
  // }
}
</style>
<style lang="scss">
$borWidth: 180px;

.moreAward {
  display: flex;
  flex-wrap: wrap;
  align-oneawards: center;
  align-content: center;

  .lottery-carousel-list {
    background-image: linear-gradient(228deg, hsla(0, 0%, 100%, 0.3), hsla(0, 0%, 100%, 0) 62%);
    background-color: #e38d4c;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }

  .lottery-list-bor {
    width: 180px;
  }

  .lottery-list-seriesName {
    font-size: 18px;
    line-height: 20px;
    margin: 5px 0;
    color: #000;
  }

  .lottery-list-text img {
    width: 15px;
    height: 15px;
  }

  .lottery-list-text {
    width: 90%;
    margin: 0 auto;
    font-size: 15px;
    line-height: 17px;
    background-color: #fff;
    color: #f00;
    border-radius: 5px;
  }
}

.lottery-result-choose {
  b {
    color: red;
  }
}

.lottery-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0;
}
.show-top-walletvb {
  position: relative;
  z-index: 5000;
}
</style>
