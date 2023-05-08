<template>
  <div class="header">
    <div class="header-main public-width">
      <div class="header-left">
        <img class="header-logo" src="@/assets/img/headerFooter/logo.png" alt="logo" @click="goTo()" />
        <ul class="header-nav">
          <li class="header-nav-text" v-for="(item, index) in nav" :key="`nav-${index}`" @click="goTo(item.page)">
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="header-button" @click="showConnect = true" v-if="!conncectAddress">
        {{ conncectAddress ? conncectAddress : 'Connect Wallet' }}
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
        <img class="header-user-down" src="@/assets/img/headerFooter/icon-arrowup.png" alt="" />
        <div class="header-user">
          <div class="header-user-main">
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
    <WalletList v-if="showConnect" @connectWallet="connect" @close="showConnect = false" />
    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
      <el-radio-group v-model="tokenChoose" class="ml-4">
        <el-radio label="1" size="large">ETH</el-radio>
        <el-radio label="2" size="large">USDT</el-radio>
      </el-radio-group>
      <br />
      <span>
        Amount
        <el-input v-model="amountVal" placeholder="Please amount" /></span>
      <span v-if="tokenChoose == 1">
        OrderId
        <el-input v-model="orderVal" placeholder="Please orderId" /></span>
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
import Web3 from 'web3';
import transferAbi from '@/config/transfer.json';
import erc20Abi from '@/config/erc20.json';
import { h } from 'vue';
import { ElNotification } from 'element-plus';
import { useHeaderStore } from '@/store/header.js';
import {
  getKey,
  authLogin,
  getTheUserSPayoutAddress,
} from '@/services/api/user';

import WalletList from '../login/index.vue';
import { BigNumber } from 'bignumber.js';

export default {
  name: 'HeaderCom',
  components: {
    WalletList,
  },
  data() {
    return {
      dialogVisible: false,
      conncectAddress: null,
      amountVal: 0.01,
      orderVal: '',
      tokenChoose: '1',
      web3: null,
      showConnect: false,
      nav: [
        {
          text: 'Airdrop',
          page: 'home',
        },
        {
          text: 'Mystery Box',
          page: 'MysteryBox',
        },
        {
          text: 'Stake',
          page: 'Stake',
        },
        {
          text: 'INO',
          page: 'INO',
        },
        {
          text: 'Market Place',
          page: 'MarketPlace',
        },
        {
          text: 'Whitebook',
          page: 'Whitebook',
        },
        {
          text: 'FAQ',
          page: 'FAQ',
        },
      ],
      userList: [
        {
          text: 'My Profile',
          class: 'myProfile',
        },
        {
          text: 'Wallet',
          class: 'wallet',
        },
        {
          text: 'Wallet Log',
          class: 'walletLog',
        },
        {
          text: 'Competitions',
          class: 'competitions',
        },
        {
          text: 'My Collections',
          class: 'myCollections',
        },
        {
          text: 'Create',
          class: 'create',
        },
        {
          text: 'Referral',
          class: 'referral',
        },
        {
          text: 'Settings',
          class: 'settings',
        },
        {
          text: 'Logout',
          class: 'logout',
        },
      ],
      usdtAddress: '0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535',
      receiver: '0x7ef9873d3D85724A59aC2C56c1C7Ae0d1D27dACB', //收款地址
      transferAddress: '0x927e481e98e01bef13d1486be2fcc23a00761524',
      // lottContractAddress: "0xfe05ed99354bef7d5f7e47a60ba06ef2a04a66c1", //抽奖合约 bsc
      lottContractAddress: '0x4bc6a8b7b471493c4f99d36a2d123d0aa60df59d', //抽奖合约
    };
  },
  mounted() {
    // this.connect();
  },
  computed: {
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
  },
  methods: {
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
          console.log(web3.eth, 'web3=== ');
          this.generateKey = web3.utils.toHex(res.data);
          let msg = this.generateKey;
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [_that.conncectAddress, msg],
          });
          let loginData = await authLogin({
            key: res.data, //登录临时key
            signature: signature, //钱包签名
            chainId: 5, //链ID
            walletAddress: web3.eth.defaultAccount, //钱包地址
            walletName: 'METAMASK', //钱包名称(META_MASK,WALLET_CONNECT)
            inviteCode: '', //邀请码
          });
          if (loginData.data.certificate) {
            localStorage.setItem('certificate', loginData.data.certificate);
          }
          let receiver = await getTheUserSPayoutAddress();
          this.getTheUserBalanceInfo();
          this.showConnect = false;
          this.receiver = receiver.data;
          localStorage.setItem('receiver', this.receiver);
        }
      });
    },
    async connect() {
      let web3 = new Web3(window.ethereum);
      const _that = this;
      let ethereum = window.ethereum;
      if (typeof ethereum === 'undefined') {
        //没安装MetaMask钱包进行弹框提示
        alert('请安装MetaMask');
      } else {
        //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        ethereum
          .enable()
          .catch(function (reason) {
            //如果用户拒绝了登录请求
            if (reason === 'User rejected provider access') {
              // 用户拒绝登录后执行语句；
            } else {
              // 本不该执行到这里，但是真到这里了，说明发生了意外
              alert('There was a problem signing you in');
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
      const amount = web3.utils.toWei(this.amountVal.toString(), 'ether');
      const receiver = this.receiver;
      const orderId = this.orderVal;
      if ((!orderId && this.tokenChoose == 1) || !amount) {
        ElNotification({
          title: 'Tips',
          message: h('i', { style: 'color: teal' }, 'Please input info'),
        });
        return;
      }
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const erc20Contract = new web3.eth.Contract(erc20Abi, this.usdtAddress);
      let allowance = await erc20Contract.methods
        .allowance(accounts[0], contractAddress)
        .call();
      if (allowance == '0') {
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
    goTo(page = 'home') {
      this.$router.push({ path: `/${page}` });
    },
    othersideBoxFun(item) {
      console.log(item);
      if (item.text == "Wallet") {
        this.$router.push({ name: "User" });
      } else if (item.text == "Competitions") {
        this.$router.push({ name: "Competitions", query: { type: "ENTERED" } });
      } else if (item.text == "My Collections") {
        this.$router.push({ name: "Competitions", query: { type: "MY_COMPETITIONS" } });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url('./index.scss');
</style>
