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
            'choose-list': tokenChoose == index + 1,
          },
        ]"
        v-for="(item, index) in coinItems"
        :key="`coin-${index}`"
        @click="tokenChooseFun(index)"
      >
        {{ item }}
      </li>
    </ul>
    <div class="recharge-title">
      <el-icon @click="closeDialogFun" color="#e4e7f5" size="32">
        <ArrowLeft />
      </el-icon>
      <img
        v-if="tokenChoose == 1"
        class="recharge-title-icon"
        src="@/assets/img/recharge/ETH.png"
        alt=""
      />
      <img
        v-else-if="tokenChoose == 2"
        class="recharge-title-icon"
        src="@/assets/img/recharge/USDT.png"
        alt=""
      />
      <span class="recharge-title-text">
        {{ `${title} ${coinItems[tokenChoose - 1]}` }}
      </span>
    </div>
    <div class="recharge-address">
      <div class="recharge-address-qr">
        <!-- <img
          class="recharge-address-qr-img"
          src="@/assets/img/recharge/USDT.png"
          alt=""
        /> -->
        <div class="recharge-address-qr-img" ref="qrCodeDiv"></div>
        <div class="recharge-address-input">
          <p class="recharge-text">
            Send the amount of Ethereum of your choice to the following address
            to receive the equivalent in Coins.
          </p>
          <el-input
            v-model="address"
            placeholder="Paste your Ethereum wallet address here"
          >
            <template #suffix>
              <div class="recharge-add">
                <el-button
                  class="public-button"
                  type="primary"
                  @click.stop="copyFun"
                >
                  COPY
                </el-button>
              </div>
            </template>
          </el-input>
        </div>
      </div>
      <div class="recharge-warning">
        <div class="recharge-warning-first">
          <img
            class="recharge-warning-img"
            src="@/assets/img/recharge/warning.png"
            alt=""
          />
          <p class="recharge-text warning-text">
            Only deposit over the ETH network. Do not use BNB or BSC networks.
            Also do not use third-party smart contracts for transfers.
          </p>
        </div>
        <p v-show="tokenChoose == 1" class="recharge-text warning-text">
          Do NOT send NFT's to this ETH deposit address. In order to recover
          NFTs deposited to this address an administrative fee will be charged.
        </p>
      </div>
    </div>
    <div class="recharge-add-input">
      <div v-if="tokenChoose == 3 || tokenChoose == 4">
        <div
          class="recharge-content"
          :key="`recharge-${index}`"
          v-for="(item, index) in transferNFTAddress"
        >
          <div class="recharge-coin-input">
            <p class="recharge-coin-label">
              <span>NFT合约地址</span>
              <span v-if="transferNFTAddress.length > 1">{{ index + 1 }}</span>
              <el-icon
                v-if="transferNFTAddress.length > 1"
                @click="deleteTransferNFTAddressun(index)"
                class="recharge-icon title-icon"
              >
                <Delete />
              </el-icon>
            </p>
            <el-input
              :key="`nft-input-${index}`"
              v-model="transferNFTAddress[index]"
              placeholder="Please input"
            />
          </div>
          <div
            class="recharge"
            v-for="(item1, index1) in transferNFTID[index]"
            :key="`nft-${index1}`"
          >
            <div class="recharge-coin-input nft-input">
              <p class="recharge-coin-label">NFT token id</p>
              <el-input
                class="recharge-input"
                v-model="transferNFTID[index][index1].tokenid"
                placeholder="Please input"
              />
            </div>
            <div class="recharge-coin-input nft-input">
              <p class="recharge-coin-label" v-if="tokenChoose != 4">数量</p>
              <el-input
                class="recharge-input"
                v-if="tokenChoose != 4"
                v-model="transferNFTID[index][index1].amount"
                placeholder="Please amount"
              >
                <template #suffix>
                  <div
                    class="recharge-add"
                    v-if="index1 === transferNFTID[index].length - 1"
                  >
                    <el-button
                      class="public-button"
                      type="primary"
                      @click.stop="addTransferNFTIDFun(index)"
                    >
                      添加
                    </el-button>
                  </div>
                </template>
              </el-input>
              <el-icon
                v-if="transferNFTID[index].length > 1"
                @click="deleteTransferNFTIDFun(index, index1)"
                class="recharge-icon"
              >
                <Delete />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="recharge-coin-input">
          <el-button
            class="public-button"
            type="primary"
            @click="addTransferNFTAddressun"
          >
            添加
          </el-button>
        </div>
      </div>
      <div class="recharge-coin-input" v-else>
        <p class="recharge-coin-label">数量</p>
        <el-input v-model="amountVal[0]" placeholder="Please amount" />
      </div>
      <div
        class="recharge-coin-input"
        v-if="tokenChoose == 1 || tokenChoose == 3 || tokenChoose == 4"
      >
        <p class="recharge-coin-label">OrderId</p>
        <el-input v-model="orderVal" placeholder="Please orderId" />
      </div>
    </div>
    <template #footer>
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
  onUnmounted,
} from "vue";
import Web3 from "web3";

import { ElNotification, ElMessage } from "element-plus";
import QRCode from "qrcodejs2";

import transferAbi from "@/config/transfer.json";
import nftAbi from "@/config/nft.json";
import nft1155Abi from "@/config/1155.json";
import erc20Abi from "@/config/erc20.json";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "DEPOSIT",
  },
});
const emit = defineEmits("closeDialogFun");

const coinItems = ["ETH", "USDT", "NFT-1155", "NFT-721"];
const NFTID = {
  tokenid: "",
  amount: 1,
};
const qrCodeDiv = ref(null);
let timer = ref(null);
// let title = ref("DEPOSIT");
const qrText = ref("https://github.com/");
let qrcode = ref(null);
const tokenChoose = ref(1);
const amountVal = reactive([1]);
const address = ref("");
const orderVal = ref("");
let transferNFTID = reactive([[{ tokenid: "", amount: 1 }]]);
const transferNFTAddress = reactive([""]);
const usdtAddress = ref("0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535");
const nftTokenAddress = ref("0x74dA78c4A6cEf9809FeaC2Cd557778b848EDC931"); //nft充值
const transferAddress = ref("0x927e481e98e01bef13d1486be2fcc23a00761524");
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
  timer.value = setTimeout(() => {
    createQrcode();
  }, 10);
});
onUnmounted(() => {
  clearTimerFun();
});

const clearTimerFun = () => {
  clearTimeout(timer.value);
  timer.value = null;
  timer = null;
};
const tokenChooseFun = (index) => {
  tokenChoose.value = index + 1;
  qrText.value = "http://www.google.com/";
  qrcode.value.makeCode(qrText.value);
};
const createQrcode = () => {
  if (qrCodeDiv?.value) {
    qrcode.value = new QRCode(qrCodeDiv.value, {
      text: qrText.value,
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
};
const copyFun = () => {
  //   navigator.clipboard
  //     .writeText(address.value)
  //     .then(() => {
  //       ElMessage({
  //         message: "内容复制成功",
  //         type: "success",
  //       });
  //     })
  //     .catch(() => {
  //       ElMessage({
  //         message: "内容复制失败",
  //         type: "warning",
  //       });
  //     });
  navigator.clipboard
    .readText()
    .then((clipText) => {
      address.value = clipText;
      ElMessage({
        message: "内容粘贴成功",
        type: "success",
      });
    })
    .catch(() => {
      ElMessage({
        message: "内容粘贴失败",
        type: "warning",
      });
    });
};
const dataArrFun = (arr, key) => {
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
};
const addTransferNFTAddressun = () => {
  transferNFTAddress.push("");
  const _last = transferNFTID[transferNFTID.length - 1];
  const _data = JSON.parse(JSON.stringify(_last));
  transferNFTID.push(_data);
};
const deleteTransferNFTAddressun = (index) => {
  if (transferNFTAddress.length < 2) return;
  transferNFTAddress.splice(index, 1);
  transferNFTID.splice(index, 1);
};
const addTransferNFTIDFun = (index) => {
  const _data = JSON.parse(JSON.stringify(NFTID));
  transferNFTID[index].push(_data);
};
const deleteTransferNFTIDFun = (index, _index) => {
  if (transferNFTID[index].length < 2) return;
  transferNFTID[index].splice(_index, 1);
};
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const transfer = async () => {
  closeDialogFun();
  const web3 = new Web3(window.ethereum);
  const contractAddress = transferAddress;
  const transferContract = new web3.eth.Contract(transferAbi, contractAddress);
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const amount = web3.utils.toWei(amountVal[0].toString(), "ether");
  const receiver = receiver;
  const orderId = orderVal;
  let nftList = [];
  if (tokenChoose.value == 3) {
    transferNFTAddress.forEach(async (item) => {
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
    });

    const nftTransferContract = new web3.eth.Contract(nftAbi, nftTokenAddress); //nft转账合约
    const _tokenid = dataArrFun(transferNFTID, "tokenid"); // [[tokenid1,tokenid2], [tokenid1,tokenid2]]
    const _amount = dataArrFun(transferNFTID, "amount");
    if (tokenChoose.value == 4) {
      //721充值
      await nftTransferContract.methods
        .transferNFTMultti(nftList, _tokenid, receiver, orderId, "0x")
        .send({ from: accounts[0] });
      return;
    }
    //1155充值
    await nftTransferContract.methods
      .transfer1155Multi(nftList, _tokenid, _amount, receiver, orderId, "0x")
      .send({ from: accounts[0] });
    return;
  }
  if ((!orderId && tokenChoose.value == 1) || !amount) {
    ElNotification({
      title: "Tips",
      message: h("i", { style: "color: teal" }, "Please input info"),
    });
    return;
  }

  const erc20Contract = new web3.eth.Contract(erc20Abi, usdtAddress);
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
      .transferToken(usdtAddress, amount, receiver, orderId)
      .send({
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
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
.recharge-coin {
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
