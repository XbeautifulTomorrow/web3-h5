<template>
  <div class="blind-detail">
    <div class="blind-lottory-box" v-if="blindDetailInfo && blindDetailInfo.series && blindDetailInfo.series.length > 0">
      <Lottory
        v-if="showRoll"
        ref="roll"
        :rollNumber="rollNumber"
        :showRoll="showRoll"
        :lottoList="blindDetailInfo.series"
        :blindDetailInfo="blindDetailInfo"
        :lottResult="lottResult"
        :apiIsError="apiIsError"
        :errorText="errorText"
        @apiIsErrorFun="apiIsErrorFun"
        @closeRollFun="closeRollFun"
      />
    </div>
    <boxDetails :blindDetailInfo="blindDetailInfo" @rollNumberFun="rollNumberFun"></boxDetails>
    <Loading :loading="loading" />
    <div class="preloadingimg"></div>
    <!-- 预加载图片 -->
    <div :style="{ display: 'none' }">
      <img v-for="(item, index) in preloadingImg" :src="item" :key="`img-${index}`" />
    </div>
  </div>
  <el-dialog
    v-model="showTips"
    destroy-on-close
    :close-on-click-modal="false"
    :show-close="false"
    :align-center="true"
    class="public-dialog mystery-dialog"
    width="800px"
    :before-close="handleClose"
  >
    <template #header>
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <p class="public-dialog-title">{{ $t("mysteryBox.boxTipsTitle") }}</p>
      <div class="tips-box">
        <div class="tips-text">{{ $t("mysteryBox.boxTipsDescription1") }}</div>
        <div class="tips-text bottom">
          {{ $t("mysteryBox.boxTipsDescription2") }}
        </div>
      </div>
      <div class="form-buttons">
        <el-button class="public-button" @click="handleClose()">
          <span>{{ $t("mysteryBox.boxTipsClose") }}</span>
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { mapStores } from "pinia";
import bigNumber from "bignumber.js";

import { balanceOrder, lotteryResult, blindBoxDetail, walletOrder, getBoxCatGas } from "@/services/api/blindBox";
import lottAbi from "@/config/lott.json";
import erc20Abi from "@/config/erc20.json";
import transferAbi from "@/config/transfer.json";
import Lottory from "./components/lottery/index";
import Loading from "@/components/loading/index";
import boxDetails from "./details.vue";
import { h } from "vue";
import { ElNotification } from "element-plus";
import { useHeaderStore } from "@/store/header.js";
import { useWalletStore } from "@/store/wallet.js";

import { Howl } from "howler";
import * as audioResource from "@/utils/audioResource";
import { setSessionStore, getSessionStore } from "@/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "BlindDetail",
  components: {
    Lottory,
    boxDetails,
    Loading,
  },
  data() {
    return {
      loading: false,
      preloadingImg: [],
      rollNumber: "",
      showRoll: false,
      boxList: [],
      ticketList: [],
      NFTList: [],
      generateKey: "",
      boxId: null,
      walletOrderDetail: "",
      usdtAddress: "0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535",
      lottContractAddress: "0x7729c592e087d88afea4b55c367c8570e0025ee0", //抽奖合约，
      transferAddress: "0x927e481e98e01bef13d1486be2fcc23a00761524",
      blindDetailInfo: {},
      lottStatus: true,
      lottResult: "",
      apiIsError: false,
      resultTimer: null,
      errorText: undefined,

      showTips: true,
    };
  },
  computed: {
    ...mapStores(useHeaderStore, useWalletStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
  },
  mounted() {
    this.boxId = this.$route.query.boxId;
    this.getBlindBoxDetail();
    this.audioPreloadFunc();
  },
  watch: {
    showRoll(val) {
      if (val) {
        window.scrollTo(0, 0);
      }
    },
  },
  methods: {
    audioPreloadFunc() {
      const audioSrc = audioResource;
      Object.values(audioSrc).forEach((x) => new Howl({ src: x }));
    },
    rollNumberFun(number) {
      const result = localStorage.getItem("result");
      if (result) {
        const _result = JSON.parse(result);
        const { localDateTime } = _result.result;
        const _time = dayjs().utc().diff(localDateTime, "s") - 480 * 60;
        if (_time > 60) {
          localStorage.removeItem("result");
        } else {
          this.rollNumber = _result.rollNumber;
          this.showRoll = true;
          this.lottResult = _result.result;
          return;
        }
      }
      this.setBalanceOrder(number);
    },
    closeRollFun() {
      this.showRoll = false;
      this.rollNumber = "";
    },
    rollFun(number) {
      const roll = this.$refs.roll;
      if (!roll) return;
      this.showRoll = true;
      roll.startLott(number);
    },
    apiIsErrorFun(data) {
      this.apiIsError = data;
      this.errorText = undefined;
    },
    async getBoxCatGasFunc() {
      let res = await getBoxCatGas();
      if (res) {
        if (res.data === false) {
          this.apiIsError = true;
          this.errorText = this.$t("lottery.tips4");
        } else {
          this.apiIsError = false;
          this.errorText = undefined;
        }
      } else {
        this.apiIsError = true;
        this.errorText = this.$t("lottery.tips4");
      }
      return res && res.data === false ? false : true;
    },
    async setBalanceOrder(coiledType) {
      // 判断gas
      if (!this.getBoxCatGasFunc()) {
        return;
      }
      const headerStore = useHeaderStore();
      this.loading = true;
      this.apiIsError = false;
      let price = this.blindDetailInfo.price;
      if (coiledType == "FIVE") {
        price = Number(new bigNumber(this.blindDetailInfo.fivePrice || 0).multipliedBy(5));
      } else if (coiledType == "TEN") {
        price = Number(new bigNumber(this.blindDetailInfo.tenPrice || 0).multipliedBy(10));
      }
      await this.getBlindBoxDetail();
      this.showRoll = true;
      this.rollNumber = coiledType;
      headerStore.setBalance(this.ethBalance - price);
      //余额抽盲盒
      let _that = this;
      let walletOrderInfo = await balanceOrder({
        boxId: _that.boxId,
        coiledType,
      });
      await headerStore.getTheUserBalanceApi();
      if (walletOrderInfo.code == 200) {
        this.walletOrderInfo = walletOrderInfo;
        this.timeOutFun(walletOrderInfo);
      } else {
        this.apiIsError = true;
        this.errorText = walletOrderInfo;
      }
      // this.walletOrderDetail = walletOrderInfo.data;
      // this.transfer(this.walletOrderDetail.orderId, coiledType);
    },
    clearTimerFun() {
      clearTimeout(this.resultTimer);
      this.resultTimer = null;
    },
    timeOutFun(walletOrderInfo) {
      this.clearTimerFun();
      let result = "";
      this.resultTimer = setTimeout(async () => {
        result = await lotteryResult({
          orderId: walletOrderInfo.data.orderId,
        });
        if (result?.code == 200) {
          if (result.data && result.data.length) {
            this.lottResult = result;
            localStorage.setItem("result", JSON.stringify({ result, rollNumber: this.rollNumber }));
            this.clearTimerFun();
          } else {
            this.timeOutFun(walletOrderInfo);
          }
        } else {
          this.apiIsError = true;
          this.errorText = this.$t("errorTips.image_enum_error");
          this.clearTimerFun();
        }
      }, 2000);
    },
    async setWalletOrder(coiledType) {
      let walletOrderInfo = await walletOrder({
        boxId: this.boxId,
        coiledType,
      });
      this.walletOrderDetail = walletOrderInfo.data;
      this.transfer(this.walletOrderDetail.orderId, coiledType);
    },
    async getBlindBoxDetail() {
      const res = await blindBoxDetail({ boxId: this.boxId });
      this.loading = false;
      if (res && res.code == 200) {
        this.blindDetailInfo = res.data;
        res?.data?.series.forEach((item) => {
          const { boxNftInfos } = item;
          this.preloadingImg.push(item.seriesImg);
          boxNftInfos.forEach((item1) => {
            this.preloadingImg.push(item1.nftImg);
          });
        });
      }
    },
    async transfer(id, coiledType) {
      const web3 = this.walletStore.web3;
      if (!web3) return;
      let amountVal = 1;
      if (coiledType == "ONE") {
        amountVal = this.blindDetailInfo.price;
      }
      if (coiledType == "FIVE") {
        amountVal = web3.utils.toWei((this.blindDetailInfo.fivePrice * 5).toString(), "ether");
      }
      if (coiledType == "TEN") {
        amountVal = web3.utils.toWei((this.blindDetailInfo.tenPrice * 10).toString(), "ether");
      }
      this.dialogVisible = false;

      const contractAddress = this.transferAddress;
      const transferContract = new web3.eth.Contract(transferAbi, contractAddress);
      let tokenChoose = 2;
      if (this.blindDetailInfo.coin == "ETH") {
        tokenChoose = 1;
      }
      const amount = web3.utils.toWei(amountVal.toString(), "ether");
      const receiver = localStorage.getItem("receiver");
      const orderId = id.toString() || "test";
      if ((!orderId && tokenChoose == 1) || !amount) {
        ElNotification({
          title: "Tips",
          message: h("i", { style: "color: teal" }, "Please input info"),
        });
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const erc20Contract = new web3.eth.Contract(erc20Abi, this.usdtAddress);
      let allowance = await erc20Contract.methods.allowance(accounts[0], contractAddress).call();
      if (allowance == "0") {
        await erc20Contract.methods.approve(contractAddress, 10000).send({ from: accounts[0] });
      }
      if (tokenChoose == 2) {
        await transferContract.methods.transferToken(this.usdtAddress, amount, receiver, orderId).send({
          from: accounts[0],
          to: contractAddress,
        });
        return;
      }
      await transferContract.methods.transferETH(amount, receiver, orderId).send({
        from: accounts[0],
        to: contractAddress,
        value: amount,
      });
    },
    async lotteryBox() {
      var accountsFromMetaMask = await window.ethereum.send("eth_requestAccounts");
      let web3 = this.walletStore.web3;
      if (!web3) return;
      let idStr = this.walletOrderDetail.orderId.toString();
      let str = this.walletOrderDetail.orderNumber;
      var lottContract = new web3.eth.Contract(lottAbi, this.lottContractAddress);
      await lottContract.methods.getRandomness(idStr, 10, str).send({ from: accountsFromMetaMask.result[0] });
    },
    // 关闭弹窗
    handleClose(done) {
      if (done) {
        done();
        return;
      }

      setSessionStore("showTips", 2);
      this.showTips = false;
    },
  },
  created() {
    const showTips = getSessionStore("showTips");
    if (showTips && showTips == 2) {
      this.showTips = false;
    }
  },
  beforeUnmount() {
    this.clearTimerFun();
  },
};
</script>
<style lang="scss" scoped>
.public-dialog-title {
  padding-top: 1.875rem;
  font-size: 2.75rem;
  text-align: left;
}

.tips-box {
  padding: 1rem 0 3.75rem;
}

.tips-text {
  font-family: Inter;
  font-size: 1.125rem;
  line-height: 1.6;
  text-align: left;
  color: #a9a4b4;
}
@media (max-width: 950px) {
  .public-dialog-title {
    font-size: 1.125rem !important;
  }
  .tips-text {
    font-size: 0.75rem !important;
  }
  .preloadingimg {
    background: url("@/assets/img/h5/lottery/05.gif") no-repeat;
  }
}
</style>
<style lang="scss">
.blind-detail {
  min-height: 800px;
}

.one-btn {
  color: #fff;
}

body {
  background-size: 100% auto;
}

.home-public-title {
  text-align: left;
  margin: 48px auto 24px;
}

.boxes-content {
  display: flex;
}

.boxes-list {
  width: 220px;
  margin-right: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  background-image: linear-gradient(228deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 62%);

  &:last-child {
    margin-right: 0;
  }
}

.boxes-title {
  width: 200px;
  height: max-content;
  margin: 0 auto;
  font-size: 24px;
  background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.boxes-button {
  $width: 200px;
  $height: 40px;
  $border: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  width: $width;
  height: $height;
  font-size: 24px;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 12px;
  padding: 2px;
  border-image-source: linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #1b082b, #1b082b), linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
}

.boxes-button-text {
  background-image: linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  font-size: 18px;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
