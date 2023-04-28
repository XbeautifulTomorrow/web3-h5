<template>
  <div class="blind-detail">
    <template
      v-if="
        blindDetailInfo &&
        blindDetailInfo.series &&
        blindDetailInfo.series.length > 0
      "
    >
      <Lottory
        :lottoList="blindDetailInfo.series"
        :lottResult="lottResult"
        :blindDetailInfo="blindDetailInfo"
        :apiIsError="apiIsError"
        @setBalanceOrder="setBalanceOrder"
        @apiIsErrorFun="apiIsErrorFun"
      />
    </template>
  </div>
</template>

<script>
import {
  balanceOrder,
  lotteryResult,
  blindBoxDetail,
  walletOrder,
} from '@/services/api/blindBox';
import lottAbi from '@/config/lott.json';
import erc20Abi from '@/config/erc20.json';
import transferAbi from '@/config/transfer.json';
import Lottory from '@/components/lottery/index';
import { h } from 'vue';
import { ElNotification } from 'element-plus';
import { useHeaderStore } from '@/store/header.js';
export default {
  name: 'BlindDetail',
  components: {
    Lottory,
  },
  data() {
    return {
      boxList: [],
      ticketList: [],
      NFTList: [],
      generateKey: '',
      boxId: null,
      walletOrderDetail: '',
      usdtAddress: '0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535',
      lottContractAddress: '0x7729c592e087d88afea4b55c367c8570e0025ee0', //抽奖合约，
      transferAddress: '0x927e481e98e01bef13d1486be2fcc23a00761524',
      blindDetailInfo: '',
      lottStatus: true,
      lottResult: '',
      apiIsError: false,
    };
  },
  mounted() {
    this.boxId = this.$route.query.boxId;
    this.getBlindBoxDetail();
  },
  methods: {
    apiIsErrorFun(data){
      this.apiIsError = data;
    },
    async setBalanceOrder(coiledType) {
      //余额抽盲盒
      let _that = this;
      let walletOrderInfo = await balanceOrder({
        boxId: _that.boxId,
        coiledType,
      });
      const headerStore = useHeaderStore();
      await headerStore.getTheUserBalanceApi();
      if (walletOrderInfo.code == 200) {
        this.walletOrderInfo = walletOrderInfo;
        let result = '';
        let resultTimer = setInterval(async () => {
          result = await lotteryResult({
            orderId: walletOrderInfo.data.orderId,
          });
          if (result) {
            if (result.data && result.data.length) {
              _that.lottResult = result;
              clearInterval(resultTimer);
            }
          } else {
            this.apiIsError = true;
            clearInterval(resultTimer);
          }
        }, 2000);
      } else {
        this.apiIsError = true;
      }

      // this.walletOrderDetail = walletOrderInfo.data;
      // this.transfer(this.walletOrderDetail.orderId, coiledType);
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
      let detail = await blindBoxDetail({ boxId: this.boxId });
      this.blindDetailInfo = detail.data;
    },
    async transfer(id, coiledType) {
      console.log(id, 'id====');
      const web3 = window.web3;
      let amountVal = 1;
      if (coiledType == 'ONE') {
        amountVal = this.blindDetailInfo.price;
      }
      if (coiledType == 'FIVE') {
        amountVal = web3.utils.toWei(
          (this.blindDetailInfo.fivePrice * 5).toString(),
          'ether'
        );
      }
      if (coiledType == 'TEN') {
        amountVal = web3.utils.toWei(
          (this.blindDetailInfo.tenPrice * 10).toString(),
          'ether'
        );
      }
      this.dialogVisible = false;

      const contractAddress = this.transferAddress;
      const transferContract = new web3.eth.Contract(
        transferAbi,
        contractAddress
      );
      let tokenChoose = 2;
      if (this.blindDetailInfo.coin == 'ETH') {
        tokenChoose = 1;
      }
      const amount = web3.utils.toWei(amountVal.toString(), 'ether');
      const receiver = localStorage.getItem('receiver');
      const orderId = id.toString() || 'test';
      if ((!orderId && tokenChoose == 1) || !amount) {
        ElNotification({
          title: 'Tips',
          message: h('i', { style: 'color: teal' }, 'Please input info'),
        });
        return;
      }
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log(accounts, contractAddress, 'accounts===');
      const erc20Contract = new web3.eth.Contract(erc20Abi, this.usdtAddress);
      let allowance = await erc20Contract.methods
        .allowance(accounts[0], contractAddress)
        .call();
      if (allowance == '0') {
        await erc20Contract.methods
          .approve(contractAddress, 10000)
          .send({ from: accounts[0] });
      }
      if (tokenChoose == 2) {
        await transferContract.methods
          .transferToken(this.usdtAddress, amount, receiver, orderId)
          .send({
            from: accounts[0],
            to: contractAddress,
          });
        return;
      }
      console.log(333, accounts[0], receiver, amount);
      await transferContract.methods
        .transferETH(amount, receiver, orderId)
        .send({
          from: accounts[0],
          to: contractAddress,
          value: amount,
        });
    },
    async lotteryBox() {
      var accountsFromMetaMask = await window.ethereum.send(
        'eth_requestAccounts'
      );
      let web3 = window.web3;
      let idStr = this.walletOrderDetail.orderId.toString();
      let str = this.walletOrderDetail.orderNumber;
      console.log(accountsFromMetaMask, 'detail===');
      var lottContract = new web3.eth.Contract(
        lottAbi,
        this.lottContractAddress
      );
      await lottContract.methods
        .getRandomness(idStr, 10, str)
        .send({ from: accountsFromMetaMask.result[0] });
    },
  },
};
</script>
<style lang="scss" scoped>
// .home {
//   background: url('@/assets/img/home/bg.png') no-repeat 100% 100%;
// }
</style>
<style lang="scss">
.blind-detail {
  min-height: 800px;
}
.one-btn {
  color: #fff;
}
body {
  background: url('@/assets/img/home/bg.png') no-repeat;
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
  background-image: linear-gradient(
    228deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0) 62%
  );
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
  border-image-source: linear-gradient(
    to bottom,
    #5fe3ef 12%,
    #00689d 53%,
    #b063f5 70%
  );
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #1b082b, #1b082b),
    linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
}
.boxes-button-text {
  background-image: linear-gradient(
    to bottom,
    #5fe3ef 12%,
    #00689d 53%,
    #b063f5 70%
  );
  font-size: 18px;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
