<template>
  <el-dialog
    v-model="newValue"
    :modal="true"
    width="100%"
    :show-close="false"
    destroy-on-close
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :custom-class="['roll-dialog', { 'roll-one-dialog': rollNumber === 'ONE' }]"
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
    <!-- 多个中奖 -->
    <more-awards
      v-else
      :prizeList="rollNumber === 'FIVE' ? fiveList : tenList"
      :apiIsError="apiIsError"
      :awardItem="awardItem"
      :blindDetailInfo="blindDetailInfo"
      @showResultFun="showResultFun"
    />
    <!-- 中奖列表 -->
    <result-list
      v-if="showResult"
      :result="awardItem"
      :localDateTime="localDateTime"
      @chooseLotteryHold="chooseLotteryHold"
      @closeDialogFun="closeDialogFun"
    />
    <!-- 弹窗 -->
    <choose-token
      v-if="showDialog === 'chooseToken'"
      @closeDialogFun="closeDialogFun"
    />
    <your-reard
      v-else-if="showDialog === 'yourReard'"
      :sold="awardItem[0]"
      :blindPrice="blindPrice"
      @inventoryFun="inventoryFun"
      @unboxAgain="unboxAgain"
      @closeDialogFun="closeDialogFun"
    />
    <chain-dialog
      v-else-if="showDialog === 'chainDialog'"
      :sold="awardItem[0]"
      @balanceFun="balanceFun"
      @unboxAgain="unboxAgain"
      @closeDialogFun="closeDialogFun"
    />
    <been-sold
      v-else-if="showDialog === 'beenSold'"
      :soldList="awardItem"
      :blindPrice="blindPrice"
      @unboxAgain="unboxAgain"
      @closeDialogFun="closeDialogFun"
    />
    <part-sold
      v-else-if="showDialog === 'partSold'"
      :soldList="awardItem"
      :chooseIds="chooseIds"
      :failList="failList"
      :blindPrice="blindPrice"
      @inventoryFun="inventoryFun"
      @unboxAgain="unboxAgain"
      @closeDialogFun="closeDialogFun"
    />
    <transaction-warning
      v-else-if="showDialog === 'transactionWarning'"
      @unboxAgain="unboxAgain"
      @closeDialogFun="closeDialogFun"
      :text="warningText"
      :blindPrice="blindPrice"
    />
    <CheckLoading v-else-if="showDialog === 'checkLoading'" />

    <Loading :loading="loading" />
  </el-dialog>
</template>

<script>
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";

import { lotteryHold, lotteryCheck } from "@/services/api/blindBox";
import { useHeaderStore } from "@/store/header.js";

import { shuffle } from "@/assets/js";

import MoreAwards from "./moreAwards.vue";
import oneAward from "./oneAward.vue";
import ResultList from "./resultList.vue";

import ChooseToken from "./chooseToken.vue";
import YourReard from "./yourReard.vue";
import ChainDialog from "./chainDialog.vue";
import BeenSold from "./beenSold.vue";
import PartSold from "./partSold.vue";
import TransactionWarning from "./transactionWarning.vue";
import CheckLoading from "./checkLoading.vue";

import Loading from "../loading/index.vue";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import emitter from "@/utils/event-bus.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const itemWidth = 220;
export default {
  name: "LotteryPage",
  components: {
    ResultList,
    MoreAwards,
    ChooseToken,
    YourReard,
    ChainDialog,
    BeenSold,
    PartSold,
    TransactionWarning,
    oneAward,
    Loading,
    CheckLoading,
  },
  props: [
    "lottoList",
    "lottResult",
    "apiIsError",
    "errorText",
    "showRoll",
    "rollNumber",
    "blindDetailInfo",
  ],
  data() {
    return {
      loading: false,
      showDialog: "",
      // warningText
      // Due to congestion on the chain or Gas fee set too low, this purchase time-out, your payment in the chain after the completion of processing will be automatically transferred to the balance.
      // Timeout not paid, this transaction is closed
      warningText: "",
      oneAwards: [], //滚动的卡片列表
      awardItem: [], //中奖道具
      chooseIds: [],
      failList: [],
      itemList: [],
      fiveList: [],
      tenList: [],
      musicLoop: true,
      showNumber: 0,
      imteImg: [],
      showResult: false,
      resultSecondTimer: null,
      moreLuck: [],
      localDateTime: new Date(),
      checkInterVal: null,
    };
  },
  computed: {
    ...mapStores(useHeaderStore),
    newValue: {
      get: function () {
        return this.showRoll;
      },
      set: function (value) {
        this.$emit("update:showRoll", value);
      },
    },
    blindPrice() {
      let price = 0;
      console.log(this.rollNumber, "this.rollNumber-------");
      console.log(this.blindDetailInfo, "this.blindDetailInfo-------");
      if (this.blindDetailInfo) {
        if (this.rollNumber === "ONE") {
          price = this.blindDetailInfo.price;
        } else if (this.rollNumber === "FIVE") {
          price = this.blindDetailInfo.fivePrice;
        } else if (this.rollNumber === "TEN") {
          price = this.blindDetailInfo.tenPrice;
        }
      }
      console.log(price);
      return price;
    },
  },
  watch: {
    lottResult: function (newVal) {
      if (newVal && newVal.data && newVal.data.length) {
        this.awardItem = shuffle(newVal.data);
        this.localDateTime = newVal.localDateTime;
      } else {
        this.messageFun("Sorry you didn't win");
      }
    },
    apiIsError: function (newData) {
      if (newData) {
        const { errorText } = this;
        this.$emit("apiIsErrorFun", false);
        this.showDialog = "transactionWarning";
        this.warningText =
          errorText && errorText[2] && errorText[2].message
            ? errorText[2].message
            : "Depositing gas fees for your account, please try again later.";
      }
    },
  },
  methods: {
    async inventoryFun() {
      // const res = await lotteryCheck({ orderId: awardItem[0]?.orderId });
      // if (res && res.code === 200) {
      //   console.log(res.data);
      // }
    },
    async lotteryCheckFunc(dialog) {
      const { awardItem } = this;
      const res = await lotteryCheck({ orderId: awardItem[0]?.orderId });
      if (res && res.code === 200) {
        let data = res.data;
        let waitData = data.filter((x) => x.lotteryStatus == "WAIT");
        if (waitData?.length == 0) {
          this.checkInterVal && clearInterval(this.checkInterVal);
          this.failList = data
            .filter((x) => x.lotteryStatus == "FAIL")
            .map((x) => x.id);
          if (typeof dialog === "string") {
            this.showDialog = dialog;
          } else {
            if (this.failList?.length > 0) {
              this.showDialog = dialog[1];
            } else {
              this.showDialog = dialog[0];
            }
          }
        }
      }
    },
    async lotteryHoldApi(isSell, dialog = "partSold") {
      const { chooseIds, awardItem } = this;
      if (isSell.value) {
        localStorage.removeItem("result");
        this.showDialog = dialog;
        this.headerStoreStore.getTheUserBalanceApi();
        this.loading = false;
        return;
      }
      const _data = {
        lotteryIds: chooseIds.length > 0 ? chooseIds.join(",") : undefined,
        orderId: awardItem[0]?.orderId,
      };
      const res = await lotteryHold(_data);
      this.loading = false;
      localStorage.removeItem("result");
      if (res && res.code === 200) {
        if (res.data.length) {
          this.failList = res.data;
        }
        if (chooseIds.length > 0) {
          this.showDialog = "checkLoading";
          this.checkInterVal = setInterval(() => {
            this.lotteryCheckFunc(dialog);
          }, 3000);
        } else {
          this.showDialog = dialog;
        }

        this.headerStoreStore.getTheUserBalanceApi();
      }
    },
    getTheUserBalanceApiFun() {
      this.headerStoreStore.getTheUserBalanceApi();
    },
    goInventory() {
      localStorage.removeItem("result");
      this.$router.push({ path: "/user/inventory" });
      this.closeDialogFun();
    },
    balanceFun() {
      localStorage.removeItem("result");
      this.$router.push({ path: "/user/balances" });
      this.closeDialogFun();
    },
    unboxAgain() {
      localStorage.removeItem("result");
      this.closeDialogFun();
      emitter.emit("unBoxAgainFunc", this.rollNumber);
    },
    closeDialogFun() {
      this.showDialog = "";
      this.chooseIds = [];
      this.failList = [];
      this.showResult = false;
      this.$emit("closeRollFun");
    },
    showResultFun() {
      this.showResult = true;
    },
    async chooseLotteryHold(type, _choose, isSell) {
      const { awardItem } = this;
      if (type === "hold") {
        //传入id take
        this.loading = true;
        if (awardItem.length < 2) {
          const _data = {
            lotteryIds: awardItem[0]?.id,
            orderId: awardItem[0]?.orderId,
          };
          const res = await lotteryHold(_data);
          this.loading = false;
          if (res && res.code === 200) {
            if (res.data.length) {
              this.showDialog = "chainDialog";
            } else {
              this.showDialog = "checkLoading";
              this.checkInterVal = setInterval(() => {
                this.lotteryCheckFunc(["yourReard", "chainDialog"]);
              }, 3000);
            }
          }
          localStorage.removeItem("result");
        } else {
          if (_choose.value.length) {
            this.chooseIds = _choose.value;
          }
          this.lotteryHoldApi(isSell);
        }
      } else {
        if (awardItem.length < 2) {
          this.lotteryHoldApi(isSell, "beenSold");
        } else {
          this.chooseIds = _choose.value;
          this.lotteryHoldApi(isSell);
        }
      }
    },
    messageFun(message = "余额不足,请充值!", type = "warning") {
      ElMessage({
        message,
        type,
        customClass: "roll-message",
      });
    },
    getRand(start, end) {
      return Math.floor(Math.random() * (end - start + 1) + start);
    },
    awardsFun(_showNumber = this.showNumber) {
      const { itemList } = this;
      let _items = [];
      let _item = [];
      const _itemList = JSON.parse(JSON.stringify(itemList));
      for (;;) {
        _itemList.forEach((item) => {
          if (_item.length >= _showNumber) {
            _items.push(shuffle(_item));
            _item = [];
          }
          _item.push(item);
        });
        if (_items.length >= 3) {
          return shuffle(_items);
        }
      }
    },
    moreListFun(number = 5, showNumber = 3) {
      let _arr = [];
      for (let i = 0; i < number; i++) {
        _arr.push(this.awardsFun(showNumber));
      }
      return shuffle(_arr);
    },
    dataFun() {
      const { lottoList } = this;
      let arr = [];
      let _length = 0;
      lottoList.forEach((item) => {
        const { boxNftInfos } = item;
        if (boxNftInfos.length > _length) {
          for (let i = _length; i < boxNftInfos.length; i++) {
            lottoList.forEach((item1) => {
              if (item1.boxNftInfos[i]) {
                let _obj = {
                  seriesImg: item1.seriesImg,
                  seriesName: item1.seriesName,
                  tokenId: item1.tokenId,
                };
                _obj = { ..._obj, ...item1.boxNftInfos[i] };
                arr.push(_obj);
              }
            });
          }
          _length = boxNftInfos.length;
        }
      });
      //   lottoList.forEach((item) => {
      //     const { boxNftInfos } = item;
      //     boxNftInfos.forEach((item1) => {
      //       let _obj = {
      //         seriesImg: item1.seriesImg,
      //         seriesName: item1.seriesName,
      //         tokenId: item1.tokenId,
      //       };
      //       _obj = { ..._obj, ...item };
      //       arr.push(_obj);
      //     });
      //   });
      //    this.itemList = shuffle(arr);
      this.itemList = shuffle(arr);
      this.oneAwards = this.awardsFun(this.showNumber + 1);
      this.fiveList = this.moreListFun(5);
      this.tenList = this.moreListFun(10);
    },
  },
  mounted() {
    setTimeout(() => {}, 30000);
    const { clientWidth } = document.body;
    const number = Math.ceil(clientWidth / itemWidth);
    this.showNumber = number;
    this.dataFun();
    const result = localStorage.getItem("result");
    if (result) {
      const _result = JSON.parse(result);
      const { localDateTime } = _result.result;
      const _time = dayjs().utc().diff(localDateTime, "s") - 480 * 60;
      if (_time > 60) {
        localStorage.removeItem("result");
      } else {
        this.messageFun(
          "The previous order has not been processed, please process it before drawing a prize"
        );
        this.awardItem = _result.result.data;
        this.localDateTime = _result.result.localDateTime;
        this.showResultFun();
      }
    }
  },
  beforeUnmount() {
    this.checkInterVal && clearInterval(this.checkInterVal);
  },
};
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
</style>
<style lang="scss">
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
  margin-top: 15.5rem;
  overflow: hidden;
  overflow-y: auto;
  width: 100%;
  height: calc(100% - 15.5rem);
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
</style>
<style lang="scss">
$borWidth: 180px;

.moreAward {
  display: flex;
  flex-wrap: wrap;
  align-oneawards: center;
  align-content: center;

  .lottery-carousel-list {
    background-image: linear-gradient(
      228deg,
      hsla(0, 0%, 100%, 0.3),
      hsla(0, 0%, 100%, 0) 62%
    );
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
</style>
