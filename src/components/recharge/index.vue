<template>
  <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    width="800"
    class="public-dialog recharge-coin"
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon
          v-on="{ click: [close, closeDialogFun] }"
          color="#2d313f"
          size="16"
          class="public-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <ul class="recharge-menu">
      <li
        :class="[
          'recharge-menu-list',
          {
            'choose-list': operateChoose == item,
          },
        ]"
        v-for="(item, index) in operateItems"
        :key="`coin-${index}`"
        @click="operateChooseFun(item)"
      >
        {{ item }}
      </li>
    </ul>
    <template v-if="tokenChoose === 0">
      <h2 class="recharge-title">{{ operateChoose }} OPTIONS</h2>
      <ul class="recharge-logos">
        <li
          v-for="(item, index) in coinList"
          :key="`list-${index}`"
          @click="tokenChooseFun(index)"
          class="recharge-list"
        >
          <img
            v-if="item.url"
            class="recharge-list-img"
            :src="item.url"
            alt=""
          />
          <p class="recharge-list-text">{{ item.text }}</p>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="recharge-title-back">
        <el-icon
          class="pointer"
          @click="tokenChoose = 0"
          color="#e4e7f5"
          size="32"
        >
          <ArrowLeft />
        </el-icon>
        <img
          v-if="tokenChoose == 1"
          class="recharge-title-icon"
          :src="ETHIcon"
          alt=""
        />
        <img
          v-else-if="tokenChoose == 2"
          class="recharge-title-icon"
          :src="USDTIcon"
          alt=""
        />
        <span class="recharge-title-text">
          {{ `${operateChoose} ${coinItems[tokenChoose - 1]}` }}
        </span>
      </div>
      <qr-code :tokenChoose="tokenChoose" />
      <div class="recharge-coin-input">
        <p class="recharge-coin-label">数量</p>
        <el-input v-model="amountVal" placeholder="Please amount" />
      </div>
      <div
        class="recharge-coin-input"
        v-if="tokenChoose == 1 || tokenChoose == 3"
      >
        <p class="recharge-coin-label">OrderId</p>
        <el-input v-model="orderVal" placeholder="Please orderId" />
      </div>
    </template>
    <template v-if="tokenChoose > 0" #footer>
      <div class="dialog-footer">
        <el-button
          class="public-button public-continue"
          @click="closeDialogFun"
        >
          Cancel
        </el-button>
        <el-button class="public-button" type="primary" @click="transfer">
          Confirm
        </el-button>
      </div>
    </template>
    <nft-list
      v-if="nftDialogVisible"
      :dialogVisible="nftDialogVisible"
      :isDeposit="operateChoose === operateItems[0]"
      @chooseNftsFun="chooseNftsFun"
      @closeDialogFun="closeNftDialogFun"
    />
  </el-dialog>
</template>
<script setup>
import {
  ref,
  reactive,
  h,
  computed,
  defineProps,
  defineEmits,
  onMounted,
} from "vue";
import Web3 from "web3";

import { ElNotification } from "element-plus";

import transferAbi from "@/config/transfer.json";
import nftAbi from "@/config/nft.json";
import nft1155Abi from "@/config/1155.json";
import erc20Abi from "@/config/erc20.json";

import qrCode from "./qrCode.vue";
import nftList from "./nftList.vue";

import ETHIcon from "@/assets/img/recharge/ETH.png";
import USDTIcon from "@/assets/img/recharge/USDT.png";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  isDeposit: {
    type: Boolean,
    default: true,
  },
  nftData: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits("closeDialogFun");
const operateItems = ["DEPOSIT", "WITHDRAW"];
const coinItems = ["ETH", "USDT", "NFT721", "NFT1155"];
const coinList = [
  {
    text: "Ethereum [ETH]",
    url: ETHIcon,
  },
  {
    text: "USDT",
    url: USDTIcon,
  },
  {
    text: "NFT721",
    url: "",
  },
  // {
  //   text: "NFT1155",
  //   url: "",
  // },
];

const tokenChoose = ref(0);
const operateChoose = ref(operateItems[0]);
const amountVal = ref(1);
const orderVal = ref("");
let chooseNft = reactive([]);
let chooseNftAddress = reactive([]);
const nftDialogVisible = ref(false);
const usdtAddress = ref("0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535");
const nftTokenAddress = "0x74dA78c4A6cEf9809FeaC2Cd557778b848EDC931"; //nft充值
const receiver = ref("0x7ef9873d3D85724A59aC2C56c1C7Ae0d1D27dACB"); //收款地址
const contractAddress = "0x927e481e98e01bef13d1486be2fcc23a00761524";
// const transferAddress = ref("0x927e481e98e01bef13d1486be2fcc23a00761524");
// lottContractAddress: "0xfe05ed99354bef7d5f7e47a60ba06ef2a04a66c1", //抽奖合约 bsc
// const lottContractAddress = ref("0x4bc6a8b7b471493c4f99d36a2d123d0aa60df59d"); //抽奖合约

const dialogVisible = computed({
  get: function () {
    return props.dialogVisible;
  },
  set: function (value) {
    emit("update:modelValue", value);
  },
});

onMounted(() => {
  if (!props.isDeposit) {
    operateChoose.value = operateItems[1];
  }
});

const closeDialogFun = () => {
  emit("closeDialogFun");
};
const closeNftDialogFun = () => {
  nftDialogVisible.value = false;
  tokenChoose.value = 0;
};
const tokenChooseFun = (index) => {
  tokenChoose.value = index + 1;
  if (index > 1) {
    nftDialogVisible.value = true;
  }
};
const operateChooseFun = (name) => {
  operateChoose.value = name;
};
const chooseNftsFun = (data) => {
  if (data && data.length > 0) {
    chooseNft = data;
    data.forEach((item) => {
      if (!chooseNftAddress.includes(item.contractAddress)) {
        chooseNftAddress.push(item.contractAddress);
      }
    });
    nftDialogVisible.value = false;
  }
};
// const dataArrFun = (arr, key) => {
//   let _arr = [];
//   arr.forEach((item) => {
//     _arr.push(item[key]);
//   });
//   return [_arr];
// };
const dataArrSevenFun = (arr, key) => {
  let _arr = [];
  arr.forEach((item) => {
    const _index = chooseNftAddress.indexOf(item.contractAddress);
    if (_arr[_index]) {
      _arr[_index].push([item[key]]);
    } else {
      _arr[_index] = [];
      _arr[_index].push([item[key]]);
    }
  });
  return _arr;
};
const transfer = async () => {
  closeDialogFun();
  const web3 = new Web3(window.ethereum);
  const transferContract = new web3.eth.Contract(transferAbi, contractAddress);
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const amount = web3.utils.toWei(amountVal.value.toString(), "ether");
  const orderId = orderVal.value;
  let nftList = [];

  if (tokenChoose.value == 3) {
    const _length = chooseNftAddress.length;
    chooseNftAddress.forEach(async (item, index) => {
      //多个nft授权
      let nftContract = new web3.eth.Contract(
        nft1155Abi,
        item || "0xf4910c763ed4e47a585e2d34baa9a4b611ae448c"
      );
      nftList.push(item || "0xf4910c763ed4e47a585e2d34baa9a4b611ae448c");
      // //授权
      await nftContract.methods
        .setApprovalForAll(nftTokenAddress, true)
        .send({ from: accounts[0] });
      if (index === _length - 1) {
        const nftTransferContract = new web3.eth.Contract(
          nftAbi,
          nftTokenAddress
        ); //nft转账合约
        const _tokenidSeven = dataArrSevenFun(chooseNft, "tokenId");
        //721充值
        await nftTransferContract.methods
          .transferNFTMultti(nftList, _tokenidSeven, receiver.value, orderId)
          .send({ from: accounts[0] });
      }
    });
    return;
    // const _tokenid = dataArrFun(chooseNft, "tokenId");
    //1155充值
    // await nftTransferContract.methods
    //   .transfer1155Multi(
    //     nftList,
    //     _tokenid,
    //     [[amountVal.value]],
    //     receiver.value,
    //     orderId,
    //     "0x"
    //   )
    //   .send({ from: accounts[0] });
    // return;
  }
  if ((!orderId && tokenChoose.value == 1) || !amount) {
    ElNotification({
      title: "Tips",
      message: h("i", { style: "color: teal" }, "Please input info"),
    });
    return;
  }

  const erc20Contract = new web3.eth.Contract(erc20Abi, usdtAddress.value);
  let allowance = await erc20Contract.methods
    .allowance(accounts[0], contractAddress)
    .call();
  if (allowance == "0") {
    await erc20Contract.methods
      .approve(contractAddress, 10000)
      .send({ from: accounts[0] });
  }
  if (tokenChoose.value == 2) {
    await transferContract.methods
      .transferToken(usdtAddress.value, amount, receiver.value, orderId)
      .send({
        from: accounts[0],
        to: contractAddress,
      });
    return;
  }
  await transferContract.methods
    .transferETH(amount, receiver.value, orderId)
    .send({
      from: accounts[0],
      to: contractAddress,
      value: amount,
    });
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
.recharge-coin {
  box-shadow: inset 0 2px 0 0 rgba(255, 255, 255, 0.05) !important;
  background-image: none !important;
  .public-button {
    flex: 1;
    width: auto;
    margin-top: 0 !important;
  }
  .el-input__wrapper {
    border: solid 1px #363945;
    background-color: #13151f;
    border-radius: 8px;
    box-shadow: none;
  }
  .el-input__inner {
    color: #a9a4b4;
  }
}
</style>
