<template>
  <div class="header">
    <div class="header-main public-width">
      <div class="header-left">
        <img
          class="header-logo"
          src="@/assets/img/headerFooter/logo.png"
          alt="logo"
          @click="goTo()"
        />
        <ul class="header-nav">
          <li
            class="header-nav-text"
            v-for="(item, index) in nav"
            :key="`nav-${index}`"
            @click="goTo(item.page)"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="header-button" @click="conncet">Connect Wallet</div>
      <div class="header-button" @click="transfer">Deposit</div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import transferAbi from "@/config/transfer.json";
import { BigNumber } from "bignumber.js";
export default {
  name: "HeaderCom",
  components: {},
  data() {
    return {
      transferContract: null,
      nav: [
        {
          text: "Airdrop",
          page: "home",
        },
        {
          text: "Mystery Box",
          page: "MysteryBox",
        },
        {
          text: "Stake",
          page: "Stake",
        },
        {
          text: "INO",
          page: "INO",
        },
        {
          text: "Market Place",
          page: "MarketPlace",
        },
        {
          text: "Whitebook",
          page: "Whitebook",
        },
        {
          text: "FAQ",
          page: "FAQ",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    async transferToken(token, amount, receiver, orderId) {
      // const accounts = await web3.eth.getAccounts();
      // const gasPrice = await web3.eth.getGasPrice();
      // const gasLimit = 200000;
      // const transaction = 
      console.log(window.web3.eth,"accounts[0]====")
      this.transferContract.methods.transferToken(
        token,
        amount,
        receiver,
        orderId
      ).send({from:"0x789516ece5a6e88470220be4b99a7edf1e6d4c59"});
      // const encodedTransaction = transaction.encodeABI();
      // const nonce = await web3.eth.getTransactionCount(accounts[0]);

      // const rawTransaction = {
      //   nonce,
      //   from: accounts[0],
      //   to: contractAddress,
      //   gasPrice,
      //   gasLimit,
      //   data: encodedTransaction,
      // };

      // const signedTransaction = await web3.eth.accounts.signTransaction(
      //   rawTransaction,
      //   "your private key"
      // );
      // const txReceipt = await web3.eth.sendSignedTransaction(
      //   signedTransaction.rawTransaction
      // );
      // console.log(`Transaction hash: ${txReceipt.transactionHash}`);
    },
    async conncet() {
      var web3 = new Web3();
      const _that = this;
      let ethereum = window.ethereum;
      if (typeof ethereum === "undefined") {
        //没安装MetaMask钱包进行弹框提示
        alert("请安装MetaMask");
      } else {
        //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        ethereum
          .enable()
          .catch(function (reason) {
            //如果用户拒绝了登录请求
            if (reason === "User rejected provider access") {
              // 用户拒绝登录后执行语句；
            } else {
              // 本不该执行到这里，但是真到这里了，说明发生了意外
              alert("There was a problem signing you in");
            }
          })
          .then(async function (accounts) {
            // 判断是否连接以太
            // if (ethereum.networkVersion !== desiredNetwork) {
            // }
            let web3Provider = new Web3.providers.HttpProvider('https://rpc.ankr.com/eth_goerli');
            // web3.setProvider(
            //   new web3.providers.HttpProvider("https://rpc.ankr.com/eth_goerli")
            // );
            web3 = new Web3(web3Provider);
            //如果用户同意了登录请求，你就可以拿到用户的账号
            web3.eth.defaultAccount = accounts[0];
            window.web3 = web3;
            //这里返回用户钱包地址
            console.log(await window.web3, accounts[0], "====");
            const transferAddress =
              "0x9aedb2865b25a66b0a4c6352a909f70ad7a0447e"; // 合约地址
            var transferContract = new web3.eth.Contract(
              transferAbi,
              transferAddress
            );
            _that.transferContract = transferContract;
            // callback(accounts[0]);
          });
      }
    },
    async transfer() {
     
      let amount = new BigNumber(1).times(1e18).toFixed();
      this.transferToken(
        "0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535", //token
        amount, //数量
        "0x7ef9873d3D85724A59aC2C56c1C7Ae0d1D27dACB", //收款地址
        "123",
        window.web3
      );
    },
    goTo(page = "home") {
      this.$router.push({ path: `/${page}` });
    },
  },
};
</script>

<style lang="scss" scoped>
$header-height: 64px;
.header {
  // position: fixed;
  // top: 0;
  // left: 0;
  width: 100%;
  // z-index: 10;
}
.header-main {
  height: $header-height;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  justify-items: center;
}
.header-logo {
  max-height: $header-height - 10px;
  cursor: pointer;
}
.header-nav-text {
  height: 20px;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.11;
  letter-spacing: normal;
  color: #fff;
}
.header-left,
.header-nav {
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
}
.header-nav {
  margin-left: 90px;
}
.header-nav-text {
  margin-right: 24px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
}
.header-button {
  width: 140px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  border: solid 2px #fff;
  background-image: linear-gradient(0, #b164f6 15%, #026aa1 58%, #42e2f0 79%);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
</style>
