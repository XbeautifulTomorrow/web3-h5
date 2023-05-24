<template>
  <el-dialog
    v-model="newValue"
    width="100%"
    :show-close="false"
    destroy-on-close
    :align-center="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="roll-dialog"
  >
    <!-- 预加载图片 -->
    <div :style="{ display: 'none' }">
      <img v-for="(item, index) in imteImg" :src="item" :key="`img-${index}`" />
    </div>
    <!-- 单个中奖 -->
    <one-award
      v-if="rollNumber === 'ONE'"
      :awards="oneAwards"
      :apiIsError="apiIsError"
      :awardItem="awardItem"
      @showResultFun="showResultFun"
    />
    <!-- 多个中奖 -->
    <more-awards
      v-else
      :prizeList="rollNumber === 'FIVE' ? fiveList : tenList"
      :apiIsError="apiIsError"
      :awardItem="awardItem"
      @showResultFun="showResultFun"
    />
    <!-- 弹窗 -->
    <choose-token
      v-if="showDialog === 'chooseToken'"
      @closeDialogFun="closeDialogFun"
    />
    <your-reard
      v-else-if="showDialog === 'yourReard'"
      :sold="awardItem[0]"
      @inventoryFun="inventoryFun"
      @closeDialogFun="closeDialogFun"
    />
    <chain-dialog
      v-else-if="showDialog === 'chainDialog'"
      :sold="{}"
      @balanceFun="balanceFun"
      @closeDialogFun="closeDialogFun"
    />
    <been-sold
      v-else-if="showDialog === 'beenSold'"
      :soldList="awardItem"
      @balanceFun="balanceFun"
      @closeDialogFun="closeDialogFun"
    />
    <all-sold
      v-else-if="showDialog === 'allSold'"
      :soldList="awardItem"
      @inventoryFun="inventoryFun"
      @closeDialogFun="closeDialogFun"
    />
    <part-sold
      v-else-if="showDialog === 'partSold'"
      :soldList="awardItem"
      :chooseIds="chooseIds"
      :failList="failList"
      @inventoryFun="inventoryFun"
      @closeDialogFun="closeDialogFun"
    />
    <transaction-warning
      v-else-if="showDialog === 'transactionWarning'"
      @balanceFun="balanceFun"
      @closeDialogFun="closeDialogFun"
      :text="warningText"
    />
    <!-- 中奖列表 -->
    <result-list
      v-if="showResult"
      :result="awardItem"
      :localDateTime="localDateTime"
      @chooseLotteryHold="chooseLotteryHold"
      @closeDialogFun="closeDialogFun"
    />
  </el-dialog>
</template>

<script>
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";
import { lotteryHold } from "@/services/api/blindBox";
import { useHeaderStore } from "@/store/header.js";

import { shuffle } from "@/assets/js";

import MoreAwards from "./moreAwards.vue";
import oneAward from "./oneAward.vue";
import ResultList from "./resultList.vue";

import ChooseToken from "./chooseToken.vue";
import YourReard from "./yourReard.vue";
import ChainDialog from "./chainDialog.vue";
import BeenSold from "./beenSold.vue";
import AllSold from "./allSold.vue";
import PartSold from "./partSold.vue";
import TransactionWarning from "./transactionWarning.vue";

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
    AllSold,
    PartSold,
    TransactionWarning,
    oneAward,
  },
  props: ["lottoList", "lottResult", "apiIsError", "showRoll", "rollNumber"],
  data() {
    return {
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
  },
  watch: {
    lottResult: function (newVal) {
      if (newVal && newVal.data && newVal.data.length) {
        this.awardItem = newVal.data;
        this.localDateTime = newVal.localDateTime;
        localStorage.setItem(this.rollNumber, JSON.stringify(newVal.data));
      } else {
        this.messageFun("很遗憾您没有中奖");
        this.autoplay = false;
      }
    },
    apiIsError: function (newData) {
      if (newData) {
        this.autoplay = false;
        this.$emit("apiIsErrorFun", false);
        this.showDialog = "transactionWarning";
        this.warningText =
          "Due to congestion on the chain or Gas fee set too low, this purchase time-out, your payment in the chain after the completion of processing will be automatically transferred to the balance.";
      }
    },
  },
  methods: {
    async inventoryFun() {
      const { chooseIds, awardItem } = this;
      let _chooseIds = [];
      if (chooseIds.length) {
        _chooseIds = chooseIds;
      } else {
        _chooseIds = awardItem.map((item) => item.id);
      }
      const _data = {
        lotteryIds: _chooseIds.join(","),
        orderId: awardItem[0]?.orderId,
      };
      const res = await lotteryHold(_data);
      if (res && res.code === 200) {
        localStorage.removeItem(this.rollNumber);
        if (res.data.length) {
          this.showDialog = "partSold";
          this.failList = res.data;
        } else {
          this.closeDialogFun();
        }
      }
    },
    balanceFun() {
      this.headerStoreStore.getTheUserBalanceApi();
      localStorage.removeItem(this.rollNumber);
      this.closeDialogFun();
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
    async chooseLotteryHold(type, _choose) {
      const { awardItem } = this;
      if (type === "hold") {
        if (awardItem.length < 2) {
          const _data = {
            lotteryIds: awardItem[0]?.id,
            orderId: awardItem[0]?.orderId,
          };
          const res = await lotteryHold(_data);
          if (res && res.code === 200) {
            localStorage.removeItem(this.rollNumber);
            this.showDialog = "yourReard";
          }
        } else {
          if (_choose.value.length) {
            this.chooseIds = _choose.value;
            this.showDialog = "partSold";
          } else {
            this.showDialog = "allSold";
          }
        }
      } else {
        this.showDialog = "beenSold";
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
      let _itemImg = [];
      lottoList.forEach((item1) => {
        item1.boxNftInfos.forEach((item) => {
          let img = new Image();
          img.src = item1.seriesImg;
          _itemImg.push(item1.seriesImg);
          let _obj = {
            seriesImg: item1.seriesImg,
            seriesName: item1.seriesName,
            tokenId: item1.tokenId,
          };
          _obj = { ..._obj, ...item };
          this.itemList.push(_obj);
        });
      });
      this.imteImg = _itemImg;
      this.oneAwards = this.awardsFun(this.showNumber + 1);
      this.fiveList = this.moreListFun(5);
      this.tenList = this.moreListFun(10);
    },
  },
  mounted() {
    const { clientWidth } = document.body;
    const number = Math.ceil(clientWidth / itemWidth);
    this.showNumber = number;
    this.dataFun();
    if (localStorage.getItem(this.rollNumber)) {
      const _data = localStorage.getItem(this.rollNumber);
      this.messageFun("上次中奖结果未处理,处理之后才能再次抽奖");
      this.awardItem = JSON.parse(_data);
      this.showResultFun();
    }
  },
};
</script>
<style lang="scss" scoped>
@import url("./css/index.scss");
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
