<template>
  <el-dialog
    v-model="dialogVisible"
    :destroy-on-close="true"
    width="78.125rem"
    :append-to-body="true"
    :show-close="false"
    :align-center="true"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="public-dialog recharge-coin"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon
          v-on="{ click: [close, handleClose] }"
          color="#2d313f"
          size="16"
          class="public-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="operating_title">
      <span>{{ title }} NFT'S</span>
    </div>
    <div class="operating_tips" v-if="isDeposit">
      Choose a wallet connection method
    </div>
    <div class="withdraw_condition" v-else>
      <div class="condition_item">
        <div class="condition_label">
          <span>WITHDRAWAL NETWORK</span>
          <span class="required">*</span>
        </div>
        <el-select
          v-model="params.chain"
          class="nft_type wallet_network"
          placeholder="Select network"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="(item, index) in networkList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="hint_text">
          <img src="" alt="" />
          <span>
            Ensure you've selected the same network for both withdrawal and
            deposit. Please check if the depositing platform supports the
            selected network; otherwise, you may lose your assets.
          </span>
        </div>
      </div>
      <div class="condition_item">
        <div class="withdraw_tpis">
          Please enter the ERC20 wallet address you wish to receive the NFT'S
          on. Once confirmed, the withdrawal is usually processed within a few
          minutes.
        </div>
        <div class="condition_label">
          <span>RECEIVING NFT'S ADDRESS</span>
          <span class="required">*</span>
        </div>
        <el-input
          class="wallet_input"
          v-model="params.wallet"
          placeholder="Paste your ERC20 wallet address here"
        >
        </el-input>
      </div>
    </div>
    <div class="choose_panel">
      <div class="search_box">
        <el-input
          class="nft_input"
          v-model="params.nftName"
          placeholder="Search NFT TokenId"
        >
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <!-- <div class="collections_box type_box">
          <div class="collections_text">Type:</div>
          <el-select
            v-model="params.type"
            class="nft_type"
            clearable
            placeholder="All"
          >
            <el-option
              v-for="item in nftTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div> -->
        <!-- <div class="collections_box">
          <div class="collections_text">Collections:</div>
          <el-select
            v-model="params.collections"
            class="nft_type"
            placeholder="All"
            clearable
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in collections"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div> -->
      </div>
      <c-scrollbar class="choose_nft" width="100%" height="69.8125rem">
        <div class="choose_nft">
          <div
            class="choose_nft_item"
            :class="[nftFind(item.seriesName) > -1 && 'active']"
            @click="chooseNfts(item)"
            v-for="(item, index) in chooseNftList"
            :key="index"
          >
            <div class="img_box">
              <img :src="item.img" alt="" />
              <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
            </div>
            <div class="nft_name">{{ item.name }}</div>
            <div class="mask_box">
              <img src="@/assets/svg/user/icon_selected.svg" alt="" />
            </div>
          </div>
        </div>
      </c-scrollbar>
    </div>
    <div v-if="isDeposit" class="confirm_btn" @click="onDepositNftFun">
      <span>{{ `DEPOSIT ${chooseNft.length} NFTs` }}</span>
    </div>
    <div v-else class="confirm_btn" @click="onWithdrawalNft()">
      <span>{{ `WITHDRAW ${chooseNft.length} NFTs` }}</span>
    </div>
    <div class="valuable_text">
      {{ `Withdrawal fee of ${calculatedNftValue} ETH applies.` }}
    </div>
    <Loading :loading="loading" />
  </el-dialog>
</template>
<script setup>
import {
  ref,
  reactive,
  computed,
  defineProps,
  defineEmits,
  onMounted,
} from "vue";
import { CScrollbar } from "c-scrollbar";
import bigNumber from "bignumber.js";
import { ElMessage } from "element-plus";

import { withdrawalNft } from "@/services/api/user";
import {
  getSystemNft,
  getWalletNft,
  getTheExternalNFTSeries,
} from "@/services/api/oneBuy";

import Loading from "@/components/loading/index";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  isDeposit: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits("closeDialogFun", "chooseNftsFun");

const networkList = [{ label: "Goerli", value: "goerli" }];
// const nftTypes = [
//   { label: "ERC-721", value: "ERC721" },
//   { label: "ERC-1155", value: "ERC1155" },
// ];
const dialogVisible = computed({
  get: function () {
    return props.dialogVisible;
  },
  set: function (value) {
    emit("update:modelValue", value);
  },
});
onMounted(() => {
  //   fetchWithdrawalSystemNft();
  getWalletNftApi();
  //   getTheExternalNFTSeriesApi();
});
const chooseNftList = computed(() => {
  const { nftName } = params;
  let chooseNfts = [];
  if (nftName) {
    chooseNftData.forEach((element) => {
      if (`${element.tokenId}`.indexOf(nftName) > -1) chooseNfts.push(element);
    });
  } else {
    chooseNfts = JSON.parse(JSON.stringify(chooseNftData));
  }
  return chooseNfts;
});
const calculatedNftValue = computed(() => {
  let nftVal = 0;
  if (chooseNft.length > 0) {
    chooseNft.forEach((element) => {
      nftVal += Number(new bigNumber(nftVal).plus(element.price || 0));
    });
    return nftVal;
  }
  return nftVal;
});

const title = ref(props.isDeposit ? "Deposit" : "Withdraw");
const params = reactive({
  nftName: null,
  type: "ERC721",
  collections: null,
  wallet: null,
  chain: null,
});
let chooseNftData = reactive([]);
// let collections = reactive([]);
let chooseNft = reactive([]);
let stockNftList = reactive([]);
const loading = ref(false);

const handleClose = () => {
  emit("closeDialogFun");
};
// 选择检索
const nftFind = (event) => {
  const eindex = chooseNft.findIndex((e) => e.seriesName == event);
  return eindex;
};
// 选择Nft
const chooseNfts = (event) => {
  const eindex = nftFind(event.seriesName);
  if (eindex > -1) {
    chooseNft.splice(eindex, 1);
  } else {
    chooseNft.push(event);
  }
};
const onDepositNftFun = () => {
  emit("chooseNftsFun", chooseNft);
};
// 提取Nft
const onWithdrawalNft = async () => {
  const { wallet } = params;
  if (!wallet) {
    ElMessage({
      message: "Please enter wallet address",
      type: "error",
    });
    return;
  }
  if (!chooseNft.length > 0) {
    ElMessage({
      message: "Please select the NFT you want to withdraw",
      type: "error",
    });
    return;
  }
  let knapsackId = [];
  chooseNft.forEach((element) => {
    knapsackId.push(element.seriesName);
  });
  const res = await withdrawalNft({
    knapsackIds: knapsackId, //背包ID
    walletAddress: wallet, //钱包地址
  });
  if (res && res.code == 200) {
    ElMessage({
      message: "Created successfully",
      type: "success",
    });
    handleClose();
    fetchSystemNft();
  }
};
// 获取系统Nft列表
const fetchSystemNft = async () => {
  const res = await getSystemNft({
    page: 1,
    size: 9999,
  });
  if (res && res.code == 200) {
    const stockNft = res.data.records;
    stockNftList = [];
    if (stockNft && !stockNft.length > 0) return;
    stockNft.forEach((element) => {
      if (!element.tokenId) return;
      stockNftList.push(element);
    });
  }
};
// // 获取系统Nft列表，提取NFT
// const fetchWithdrawalSystemNft = async () => {
//   const res = await getSystemNft({
//     page: 1,
//     size: 9999,
//   });
//   if (res && res.code == 200) {
//     const stockNft = res.data.records;
//     chooseNftData = [];
//     if (stockNft && !stockNft.length > 0) return;
//     stockNft.forEach((element) => {
//       if (element.tokenId) {
//         chooseNftData.push(element);
//       }
//     });
//     generateCollections();
//   }
// };
// // 生成当前已有系列
// const generateCollections = () => {
//   collections = [];
//   chooseNftData.forEach((element) => {
//     if (!collectionsFind(element.name)) {
//       collections.push(element.name);
//     }
//   });
// };
// // 检索已有系列
// const collectionsFind = (event) => {
//   const index = collections.findIndex((e) => e == event);
//   return index > -1;
// };

// const getWalletNftApi = async () => {
//   loading.value = true;
//   const accounts = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   if (accounts && accounts[0]) {
//     const res = await getWalletNft({
//       address: accounts[0],
//       size: 999,
//     });
//     loading.value = false;
//     if (res && res.code === 200) {
//       const data = JSON.parse(JSON.stringify(res.data.records));
//       data.forEach((item, index) => {
//         chooseNftData[index] = item;
//       });
//       //   chooseNftData = [...data];
//     }
//   }
// };
// const getTheExternalNFTSeriesApi = async () => {
//   loading.value = true;
//   const res = await getTheExternalNFTSeries();
//   loading.value = false;
//   if (res && res.code === 200) {
//     const records = JSON.parse(JSON.stringify(res.data));
//     records.forEach((item, index) => {
//       chooseNftData[index] = item;
//     });
//   }
// };
const getWalletNftApi = async () => {
  loading.value = true;
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  if (accounts && accounts[0]) {
    Promise.all([
      getWalletNft({
        address: accounts[0],
        size: 999,
      }),
      getTheExternalNFTSeries(),
    ]).then((res) => {
      if (
        res &&
        res[0] &&
        res[1] &&
        res[0].code === 200 &&
        res[1].code === 200 &&
        res[0].data &&
        res[1].data
      ) {
        loading.value = false;
        const walletNft = JSON.parse(JSON.stringify(res[0].data.records));
        const systemNft = JSON.parse(JSON.stringify(res[1].data));
        const _nameArr = systemNft.map((item1) => {
          return item1.tokenId && item1.seriesName;
        });
        const _data = walletNft.filter((item) => {
          return _nameArr.includes(item.name);
        });
        _data.forEach((item, index) => {
          chooseNftData[index] = item;
        });
      } else {
        getWalletNftApi();
      }
    });
  }
};
</script>
<style lang="scss">
@import url("./nftList.scss");
</style>
