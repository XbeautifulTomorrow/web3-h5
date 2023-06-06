<template>
  <div class="header">
    <div class="header-main">
      <div class="header-left">
        <img class="header-logo" src="@/assets/img/headerFooter/logo.png" alt="logo" @click="goTo()" />
        <ul class="header-nav">
          <li class="header-nav-text" v-for="(item, index) in nav" :key="`nav-${index}`" @click="goTo(item.page)">
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="header-login">
        <div class="header-right" v-if="!userInfo?.id">
          <div class="btn-box login" @click="changeTypeFun('login')">Login</div>
          <div class="btn-box register" @click="changeTypeFun('register')">
            Register
          </div>
        </div>
        <div class="header-button" @click="showConnect = true" v-if="!userInfo?.id && !conncectAddress">
          {{ conncectAddress ? conncectAddress : "Connect Wallet" }}
        </div>
      </div>
      <div v-if="userInfo?.id || conncectAddress" class="header-login">
        <div class="header-wallet">
          <img class="header-wallet-img" src="@/assets/img/headerFooter/eth_icon.png" alt="" />
          <span class="header-wallet-money">{{ ethBalance }}</span>
          <span class="header-wallet-add" @click="dialogVisible = true">+</span>
        </div>
        <div class="header-user" v-if="userInfo?.id">
          <img class="header-user-img" src="@/assets/svg/user/default_avatar.svg" alt="" />
          <span class="header-user-text text-ellipsis">
            {{ userInfo?.userName || userInfo?.email }}
          </span>
          <img class="header-user-down" src="@/assets/img/headerFooter/icon-arrowup.png" alt="" />
          <div class="header-user-popup">
            <ul class="header-user-content">
              <li :class="['header-user-list']" v-for="(item, index) in userList" :key="`box-${index}`"
                @click="othersideBoxFun(item)">
                <span :class="['header-user-list-img', item.class]"></span>
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <WalletList v-if="showConnect" @connectWallet="connect" @close="closeDialogFun" />
    <el-dialog v-model="dialogVisible" title="Tips" width="50%">
      <el-radio-group v-model="tokenChoose" class="ml-4">
        <el-radio label="1" size="large">ETH</el-radio>
        <el-radio label="2" size="large">USDT</el-radio>
        <el-radio label="3" size="large">NFT-1155</el-radio>
        <el-radio label="4" size="large">NFT-721</el-radio>
      </el-radio-group>
      <br />

      <div v-if="tokenChoose == 3||tokenChoose == 4">
        <div class="header-nft-content" :key="`add-${index}`" v-for="(item, index) in transferNFTAddress">
          <p class="header-nft-title">
            <span>NFT合约地址</span>
            <span v-if="transferNFTAddress.length > 1">{{ index + 1 }}</span>
            <el-icon v-if="transferNFTAddress.length > 1" @click="deleteTransferNFTAddressun(index)"
              class="header-nft-icon title-icon">
              <Delete />
            </el-icon>
          </p>
          <el-input :key="`nft-input-${index}`" v-model="transferNFTAddress[index]" placeholder="Please input" />

          <div class="header-nft" v-for="(item1, index1) in transferNFTID[index]" :key="`nft-${index1}`">
            <span class="header-nft-wrapper">
              <span class="header-nft-label">NFT token id</span>
              <el-input class="header-nft-input" v-model="transferNFTID[index][index1].tokenid"
                placeholder="Please input" />
            </span>
            <span class="header-nft-wrapper" >
              <span class="header-nft-label" v-if="tokenChoose!=4">数量</span>
              <el-input class="header-nft-input" v-if="tokenChoose!=4" v-model="transferNFTID[index][index1].amount"
                placeholder="Please amount" />
              <el-icon v-if="transferNFTID[index].length > 1" @click="deleteTransferNFTIDFun(index, index1)"
                class="header-nft-icon">
                <Delete />
              </el-icon>
            </span>
            <div class="header-nft-add" v-if="index1 === transferNFTID[index].length - 1">
              <el-button class="header-nft-button" type="primary" @click="addTransferNFTIDFun(index)">
                添加
              </el-button>
            </div>
          </div>
        </div>

        <el-button class="header-nft-button" type="primary" @click="addTransferNFTAddressun">
          添加
        </el-button>
      </div>

      <span v-else>
        数量
        <el-input v-model="amountVal[0]" placeholder="Please amount" />
      </span>
      <span v-if="tokenChoose == 1 || tokenChoose == 3|| tokenChoose == 4">
        OrderId
        <el-input v-model="orderVal" placeholder="Please orderId" />
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="transfer"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
  </div>
</template>

<script>
import Web3 from "web3";
import { h } from "vue";
import { mapStores } from "pinia";
import { BigNumber } from "bignumber.js";
import { ElNotification } from "element-plus";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import transferAbi from "@/config/transfer.json";
import nftAbi from "@/config/nft.json";
import nft1155Abi from "@/config/1155.json";
import erc20Abi from "@/config/erc20.json";

import {
  getKey,
  authLogin,
  getTheUserSPayoutAddress,
} from "@/services/api/user";

import WalletList from "../wallet/index.vue";
import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";

export default {
  name: "HeaderCom",
  components: {
    WalletList,
    Login,
    Register,
    Forgot,
  },
  data() {
    return {
      dialogVisible: false,
      conncectAddress: null,
      amountVal: [1],
      orderVal: "",
      tokenChoose: "1",
      web3: null,
      showConnect: false,
      pageType: "",
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
          text: "Profile",
          class: "myProfile",
        },
        {
          text: "Wallet",
          class: "wallet",
        },
        // {
        //   text: "Wallet Log",
        //   class: "walletLog",
        // },
        {
          text: "Competitions",
          class: "competitions",
        },
        // {
        //   text: "My Collections",
        //   class: "myCollections",
        // },
        // {
        //   text: "Create",
        //   class: "create",
        // },
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
      NFTID: {
        tokenid: "",
        amount: 1,
      },
      transferNFTAddress: [""],
      transferNFTID: [[{ tokenid: "", amount: 1 }]],
      transferAmounts: [],
      usdtAddress: "0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535",
      nftTokenAddress: "0x74dA78c4A6cEf9809FeaC2Cd557778b848EDC931", //nft充值
      receiver: "0x7ef9873d3D85724A59aC2C56c1C7Ae0d1D27dACB", //收款地址
      transferAddress: "0x927e481e98e01bef13d1486be2fcc23a00761524",
      // lottContractAddress: "0xfe05ed99354bef7d5f7e47a60ba06ef2a04a66c1", //抽奖合约 bsc
      lottContractAddress: "0x4bc6a8b7b471493c4f99d36a2d123d0aa60df59d", //抽奖合约
    };
  },
  mounted() {
    // this.connect();
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
  },
  methods: {
    closeDialogFun() {
      this.pageType = "";
      this.showConnect = false;
      if (this.userInfo) {
        this.getTheUserBalanceInfo();
      } else if (this.regInfo) {
        console.log(this.regInfo);
      }
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    addTransferNFTAddressun() {
      this.transferNFTAddress.push("");
      const _last = this.transferNFTID[this.transferNFTID.length - 1];
      const _data = JSON.parse(JSON.stringify(_last));
      this.transferNFTID.push(_data);
    },
    deleteTransferNFTAddressun(index) {
      if (this.transferNFTAddress.length < 2) return;
      this.transferNFTAddress.splice(index, 1);
      this.transferNFTID.splice(index, 1);
    },
    addTransferNFTIDFun(index) {
      const _data = JSON.parse(JSON.stringify(this.NFTID));
      this.transferNFTID[index].push(_data);
    },
    deleteTransferNFTIDFun(index, _index) {
      if (this.transferNFTID[index].length < 2) return;
      this.transferNFTID[index].splice(_index, 1);
    },
    getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      // let res = await getTheUserBalance();
      // this.ethBalance = res.data[0].balance;
    },
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
          let loginData = await authLogin({
            key: res.data, //登录临时key
            signature: signature, //钱包签名
            chainId: 5, //链ID
            walletAddress: web3.eth.defaultAccount, //钱包地址
            walletName: "METAMASK", //钱包名称(META_MASK,WALLET_CONNECT)
            inviteCode: "", //邀请码
          });
          if (loginData.data.certificate) {
            localStorage.setItem("certificate", loginData.data.certificate);
          }
          let receiver = await getTheUserSPayoutAddress();
          this.getTheUserBalanceInfo();
          this.closeDialogFun();
          this.receiver = receiver.data;
          localStorage.setItem("receiver", this.receiver);
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
            const headerStore = useHeaderStore();
            const _ethBalance = new BigNumber(
              await _that.web3.eth.getBalance(accounts[0])
            )
              .div(1e18)
              .toFixed(4);
            headerStore.setBalance(_ethBalance);
            headerStore.setWallet(accounts[0]);
            _that.login();
            //这里返回用户钱包地址
            // callback(accounts[0]);
          });
      }
    },
    dataArrFun(arr, key) {
      let _arr = [];
      arr.forEach((item, index) => {
        let _itemArr = [];
        let num = "";
        item.forEach((_item) => {
          num = _item[key];
          if (key == "amount") {
            num = parseInt(_item[key]);
          }
          _itemArr.push(num);
        });
        _arr[index] = _itemArr;
      });
      return _arr;
    },
    async transfer() {
      this.dialogVisible = false;
      const web3 = new Web3(window.ethereum);
      const contractAddress = this.transferAddress;
      const transferContract = new web3.eth.Contract(
        transferAbi,
        contractAddress
      );
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const amount = web3.utils.toWei(this.amountVal[0].toString(), "ether");
      const receiver = this.receiver;
      const orderId = this.orderVal;
      let nftList = [];
      if (this.tokenChoose == 3) {
        this.transferNFTAddress.forEach(async (item) => {
          //多个nft授权
          let nftContract = new web3.eth.Contract(
            nft1155Abi,
            item || "0xf4910c763ed4e47a585e2d34baa9a4b611ae448c"
          );
          nftList.push(item || "0xf4910c763ed4e47a585e2d34baa9a4b611ae448c");
          // //授权
          await nftContract.methods
            .setApprovalForAll(this.nftTokenAddress, true)
            .send({ from: accounts[0] });
        });

        const nftTransferContract = new web3.eth.Contract( //nft转账合约
          nftAbi,
          this.nftTokenAddress
        );
        const _tokenid = this.dataArrFun(this.transferNFTID, "tokenid"); // [[tokenid1,tokenid2], [tokenid1,tokenid2]]
        const _amount = this.dataArrFun(this.transferNFTID, "amount");
        console.log(_tokenid, _amount, nftList,"========");
        if(tokenChoose==4){
          //721充值
          await nftTransferContract.methods
          .transferNFTMultti(
            nftList,
            _tokenid,
            this.receiver,
            orderId,
            "0x"
          )
          .send({ from: accounts[0] });
          return;
        }
        //1155充值
        await nftTransferContract.methods
          .transfer1155Multi(
            nftList,
            _tokenid,
            _amount,
            this.receiver,
            orderId,
            "0x"
          )
          .send({ from: accounts[0] });
        return;
      }
      if ((!orderId && this.tokenChoose == 1) || !amount) {
        ElNotification({
          title: "Tips",
          message: h("i", { style: "color: teal" }, "Please input info"),
        });
        return;
      }

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
    goTo(page = "home") {
      this.$router.push({ path: `/${page}` });
    },
    othersideBoxFun(item) {
      if (item.text == "Profile") {
        this.$router.push({ name: "MyProfile" });
      } else if (item.text == "Wallet") {
        this.$router.push({ name: "Wallet" });
      } else if (item.text == "Competitions") {
        this.$router.push({ name: "Competitions", query: { type: "ENTERED" } });
      } else if (item.text == "My Collections") {
        this.$router.push({
          name: "Competitions",
          query: { type: "MY_COMPETITIONS" },
        });
      } else if (item.text == "Referral") {
        this.$router.push({ name: "Invite" });
      } else if (item.text == "Settings") {
        this.$router.push({ name: "Setting" });
      } else if (item.text === "Logout") {
        this.userStore.logoutApi();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("./index.scss");
</style>
