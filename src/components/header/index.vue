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
      <div
        class="header-button"
        @click="showConnect = true"
        v-if="!conncectAddress"
      >
        {{ conncectAddress ? conncectAddress : "Connect Wallet" }}
      </div>
      <div class="header-wallet" v-if="conncectAddress">
        <!-- <img class="header-wallet-img" src="" alt="" /> -->
        <span class="header-wallet-money">{{ ethBalance }}ETH</span>
        <span class="header-wallet-add" @click="dialogVisible = true"></span>
      </div>
      <div class="boxes-button" v-if="conncectAddress">
        <!-- <img class="header-user-img" src="" alt="" /> -->
        <span class="boxes-button-text text-ellipsis">
          {{ conncectAddress }}
        </span>
        <img
          class="header-user-down"
          src="@/assets/img/headerFooter/icon-arrowup.png"
          alt=""
        />
        <div class="header-user">
          <div class="header-user-main">
            <ul class="header-user-content">
              <li
                :class="['header-user-list']"
                v-for="(item, index) in userList"
                :key="`box-${index}`"
                @click="othersideBoxFun(item)"
              >
                <span :class="['header-user-list-img', item.class]"></span>
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <WalletList
      v-if="showConnect"
      @connectWallet="connect"
      @close="showConnect = false"
    />
    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
      <el-radio-group v-model="tokenChoose" class="ml-4">
        <el-radio label="1" size="large">ETH</el-radio>
        <el-radio label="2" size="large">USDT</el-radio>
      </el-radio-group>
      <br />
      <span>
        Amount
        <el-input v-model="amountVal" placeholder="Please amount"
      /></span>
      <span v-if="tokenChoose == 1">
        OrderId
        <el-input v-model="orderVal" placeholder="Please orderId"
      /></span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="transfer"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Web3 from "web3";
import transferAbi from "@/config/transfer.json";
import lottAbi from "@/config/lott.json";
import erc20Abi from "@/config/erc20.json";
import { h } from "vue";
import { ElNotification } from "element-plus";
import {
  getKey,
  authLogin,
  getTheUserSPayoutAddress,
} from "@/services/api/user";
import WalletList from "../login/index.vue";
import { BigNumber } from "bignumber.js";
export default {
  name: "HeaderCom",
  components: {
    WalletList,
  },
  data() {
    return {
      dialogVisible: false,
      conncectAddress: null,
      amountVal: 0.01,
      orderVal: "",
      tokenChoose: "1",
      ethBalance: 0,
      web3: null,
      showConnect: false,
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
      userList: [
        {
          text: "My Profile",
          class: "myProfile",
        },
        {
          text: "Wallet",
          class: "wallet",
        },
        {
          text: "Wallet Log",
          class: "walletLog",
        },
        {
          text: "Competitions",
          class: "competitions",
        },
        {
          text: "My Collections",
          class: "myCollections",
        },
        {
          text: "Create",
          class: "create",
        },
        {
          text: "Referral",
          class: "referral",
        },
        {
          text: "Settings",
          class: "settings",
        },
        {
          text: "Logout",
          class: "logout",
        },
      ],
      usdtAddress: "0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535",
      receiver: "0x7ef9873d3D85724A59aC2C56c1C7Ae0d1D27dACB", //收款地址
      transferAddress: "0x927e481e98e01bef13d1486be2fcc23a00761524",
      // lottContractAddress: "0xfe05ed99354bef7d5f7e47a60ba06ef2a04a66c1", //抽奖合约 bsc
      lottContractAddress: "0x4bc6a8b7b471493c4f99d36a2d123d0aa60df59d", //抽奖合约
    };
  },
  mounted() {
    // this.connect();
    console.log(123123);
  },
  methods: {
    async login() {
      const _that = this;
      let web3 = window.web3;
      getKey().then(async (res) => {
        if (res.data) {
          console.log(web3.eth, "web3=== ");
          this.generateKey = web3.utils.toHex(res.data);
          let msg = this.generateKey;
          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [_that.conncectAddress, msg],
          });
          await authLogin({
            key: res.data, //登录临时key
            signature: signature, //钱包签名
            chainId: 5, //链ID
            walletAddress: web3.eth.defaultAccount, //钱包地址
            walletName: "METAMASK", //钱包名称(META_MASK,WALLET_CONNECT)
            inviteCode: "", //邀请码
          });
          let receiver = await getTheUserSPayoutAddress();
          this.showConnect = false;
          this.receiver = receiver.data;
        }
      });
    },
    async connect() {
      let web3 = new Web3(window.ethereum);
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
            // let web3Provider = new Web3.providers.HttpProvider(
            //   "https://eth.llamarpc.com"
            // );
            // web3 = new Web3("https://goerli.infura.io/v3/60e51d66a38e4624bfb90643cff08d0b");
            web3 = new Web3(window.ethereum);
            //如果用户同意了登录请求，你就可以拿到用户的账号
            web3.eth.defaultAccount = accounts[0];
            window.web3 = web3;
            _that.web3 = web3;
            _that.conncectAddress = accounts[0];
            _that.ethBalance = new BigNumber(await _that.web3.eth.getBalance(accounts[0])).div(1e18).toFixed(4);
            _that.login();
            //这里返回用户钱包地址
            // callback(accounts[0]);
          });
      }
    },
    async transfer() {
      this.dialogVisible = false;
      const web3 = new Web3(window.ethereum);
      const contractAddress = this.transferAddress;
      const transferContract = new web3.eth.Contract(
        transferAbi,
        contractAddress
      );
      const amount = web3.utils.toWei(this.amountVal.toString(), "ether");
      const receiver = this.receiver;
      const orderId = this.orderVal;
      if ((!orderId && this.tokenChoose == 1) || !amount) {
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
      let allowance = await erc20Contract.methods
        .allowance(accounts[0], contractAddress)
        .call();
      if (allowance == "0") {
        await erc20Contract.methods
          .approve(contractAddress, 10000)
          .send({ from: accounts[0] });
      }
      if (this.tokenChoose == 2) {
        await transferContract.methods
          .transferToken(this.usdtAddress, amount, receiver, orderId)
          .send({
            from: accounts[0],
            to: contractAddress,
          });
        return;
      }

      await transferContract.methods
        .transferETH(amount, receiver, orderId)
        .send({
          from: accounts[0],
          to: contractAddress,
          value: amount,
        });
    },
    async lottery() {
      var accountsFromMetaMask = await window.ethereum.send('eth_requestAccounts');
      let web3 =window.web3;
      let idStr ="1234"
      let str = "5678"
      var lottContract = new web3.eth.Contract(
        lottAbi,
        this.lottContractAddress
      );
      await lottContract.methods
        .getRandomness(idStr, 10, str)
        .send({ from:accountsFromMetaMask.result[0]});
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
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 40px;
  border-radius: 20px;
  border: solid 2px #fff;
  background-image: linear-gradient(0, #b164f6 15%, #026aa1 58%, #42e2f0 79%);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
.header-wallet {
  width: 171px;
  height: 48px;
  border-radius: 24px;
  background-color: #2e0d4a;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-around;
}
.header-wallet-img {
  width: 24px;
  height: 24px;
}
.header-wallet-money {
  font-size: 24px;
  color: #fff;
}
.header-wallet-add {
  display: inline-block;
  width: 52px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  background: url("@/assets/img/headerFooter/icon-add.png") no-repeat center
    center #a896b5;
}
.boxes-button {
  cursor: pointer;
  position: relative;
  overflow: visible;
  height: 40px;
  margin-top: 0;
  margin-left: 16px;
  &:hover {
    .header-user {
      transform: scaleY(1);
      opacity: 1;
    }
    .header-user-down {
      transform: rotate(0);
    }
  }
}
.header-user {
  transform: scaleY(0);
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 16px;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  transition: transform 0.2s ease;
  transform-origin: top;
  z-index: 100;
}
.header-user-main {
  padding: 0;
  border-radius: 12px;
  border-style: solid;
  border-width: 2px;
  border-image-source: linear-gradient(
    to bottom,
    #6ce1f9,
    #00669b 48%,
    #b770f4
  );
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #2d1942, #2d1942),
    linear-gradient(to bottom, #6ce1f9, #00669b 48%, #b770f4);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.header-user-content {
  padding: 8px;
}
.header-user-list {
  font-size: 18px;
  color: #a896b5;
  border-radius: 8px;
  padding: 0 8px;
  height: 40px;
  text-align: left;
  display: flex;
  align-content: center;
  align-items: center;
  &:hover {
    color: #f5e1d6;
    background-color: rgba(168, 150, 181, 0.1);
  }
}
.header-user-img {
  width: 24px;
  height: 24px;
}
.boxes-button-text {
  max-width: 100px;
  height: 22px;
  margin: 0 8px;
}
.header-user-down {
  transform: rotate(180deg);
  transition: transform 0.2s;
}
.header-user-list-img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.header-user-list {
  &:hover {
    .myProfile {
      background-image: url("@/assets/img/headerFooter/icon-profile-hover.png");
    }
    .wallet {
      background-image: url("@/assets/img/headerFooter/icon-walletdefault-hover.png");
    }
    .walletLog {
      background-image: url("@/assets/img/headerFooter/icon-walletlogdefault-hover.png");
    }
    .competitions {
      background-image: url("@/assets/img/headerFooter/icon-competitionsdefault-hover.png");
    }
    .myCollections {
      background-image: url("@/assets/img/headerFooter/icon-collectiondefault-hover.png");
    }
    .create {
      background-image: url("@/assets/img/headerFooter/icon-create-hover.png");
    }
    .referral {
      background-image: url("@/assets/img/headerFooter/icon-referraldefault-hover.png");
    }
    .settings {
      background-image: url("@/assets/img/headerFooter/icon-settingsdefault-hover.png");
    }
    .logout {
      background-image: url("@/assets/img/headerFooter/icon-logoutdefault-hover.png");
    }
  }
}
.myProfile {
  background-image: url("@/assets/img/headerFooter/icon-profile.png");
}
.wallet {
  background-image: url("@/assets/img/headerFooter/icon-walletdefault.png");
}
.walletLog {
  background-image: url("@/assets/img/headerFooter/icon-walletlogdefault.png");
}
.competitions {
  background-image: url("@/assets/img/headerFooter/icon-competitionsdefault.png");
}
.myCollections {
  background-image: url("@/assets/img/headerFooter/icon-collectiondefault.png");
}
.create {
  background-image: url("@/assets/img/headerFooter/icon-create.png");
}
.referral {
  background-image: url("@/assets/img/headerFooter/icon-referraldefault.png");
}
.settings {
  background-image: url("@/assets/img/headerFooter/icon-settingsdefault.png");
}
.logout {
  background-image: url("@/assets/img/headerFooter/icon-logoutdefault.png");
}
</style>
