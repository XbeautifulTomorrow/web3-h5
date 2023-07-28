<template>
  <el-dialog v-model="show" :destroy-on-close="true" width="78.125rem" :append-to-body="true" :show-close="false"
    :align-center="true" :before-close="handleClose" :close-on-click-modal="false" class="public-dialog recharge-coin">
    <template #header="{ close }">
      <div class="close_btn" v-on="{ click: [close, handleClose] }">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="operating_title">
      <span>{{ title }} NFT'S</span>
    </div>
    <div class="operating_tips" v-if="isDeposit">
      Connecting wallet: {{ accountAddress }}
    </div>
    <div class="withdraw_condition" v-else>
      <div class="condition_item">
        <div class="condition_label">
          <span>WITHDRAWAL NETWORK</span>
          <span class="required">*</span>
        </div>
        <el-select v-model="params.chain" class="nft_type wallet_network" placeholder="Select network"
          :popper-append-to-body="false">
          <el-option v-for="(item, index) in networkList" :key="index" :label="item.label" :value="item.value" />
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
      <div class="condition_item" v-if="params.chain">
        <div class="withdraw_tpis">
          Please enter the ERC20 wallet address you wish to receive the NFT'S
          on. Once confirmed, the withdrawal is usually processed within a few
          minutes.
        </div>
        <div class="condition_label">
          <span>RECEIVING NFT'S ADDRESS</span>
          <span class="required">*</span>
        </div>
        <el-input class="wallet_input" v-model="params.wallet" placeholder="Paste your ERC20 wallet address here">
        </el-input>
      </div>
    </div>
    <div class="choose_panel" v-if="showNft">
      <div class="search_box">
        <el-input class="nft_input" v-model="params.nftName" clearable placeholder="Search NFT TokenId">
          <template #prefix>
            <el-icon class="el-input__icon search_icon" :size="24">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="collections_box type_box">
          <div class="collections_text">Type:</div>
          <el-select v-model="params.type" @change="changeType" class="nft_type" clearable placeholder="All">
            <el-option v-for="item in nftTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="collections_box">
          <div class="collections_text">Collections:</div>
          <el-select v-model="params.collections" class="nft_type" placeholder="All" clearable
            :popper-append-to-body="false">
            <el-option v-for="(item, index) in seriesDrop" :key="index" :label="item.seriesName"
              :value="item.contractAddress" />
          </el-select>
        </div>
      </div>
      <div class="choose_nft">
        <div class="choose_nft_item" :class="[
          { disabled: NFTSeries.includes(item.name) },
        ]" v-for="(item, index) in chooseNftList" :key="index">
          <div class="img_box">
            <Image fit="cover" class="nft_img" :src="item.nftImg || item.img" />
            <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
          </div>
          <div class="nft_name">{{ item.name || "--" }}</div>
          <div class="confirm_btn" v-if="isDeposit" @click="depositOne(item)">
            DEPOSIT
          </div>
          <div class="confirm_btn" v-else @click.stop="onWithdrawalNft(item)">
            WITHDRAW
          </div>
          <div class="mask_box">
            <img src="@/assets/svg/user/icon_selected.svg" alt="" />
          </div>
        </div>
      </div>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
      </div>
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
import { useUserStore } from "@/store/user.js";
import Image from "@/components/imageView";
import { ElMessage } from "element-plus";
import nft721Abi from "@/config/721.json";
import nft1155Abi from "@/config/1155.json";
import { withdrawalNft } from "@/services/api/user";
import Web3 from "web3";
import {
  getSystemNft,
  getWalletNft,
  getTheExternalNFTSeries,
} from "@/services/api/oneBuy";

import Loading from "@/components/loading/index";

const props = defineProps({
  isDeposit: {
    type: Boolean,
    default: true,
  },
  tokenChoose: {
    type: Number,
    default: 3,
  },
  receiver: {
    type: String,
    default: localStorage.getItem("receiver"),
  },
});

const page = ref(1);
const size = ref(8);
const count = ref(0);

const show = ref(true);

const emit = defineEmits("closeDialogFun");
const accountAddress = ref("");
const networkList = [{ label: "Goerli", value: "goerli" }];
const nftTypes = [
  { label: "ERC-721", value: "ERC721" },
  { label: "ERC-1155", value: "ERC1155" },
];

onMounted(() => {
  if (props.isDeposit) {
    getWalletNftApi();
  } else {
    fetchSystemNft();
    fetchExternalSeries();
  }
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

const seriesDrop = computed(() => {
  const { type } = params;
  const chooseNfts = [];
  if (!type) return collections.value;

  collections.value.forEach((element) => {
    if (element.seriesNftType == type) chooseNfts.push(element);
  });

  return chooseNfts;
});

const showNft = computed(() => {
  const { chain } = params;

  if (props.isDeposit) {
    return true;
  } else {
    if (chain) {
      return true
    } else {
      return false
    }
  }
});

const NFTSeries = reactive([]);

const title = ref(props.isDeposit ? "DEPOSIT" : "WITHDRAW");

const params = reactive({
  nftName: null,
  type: "ERC721",
  collections: null,
  wallet: null,
  chain: null,
});
let chooseNftData = reactive([]);
let stockNftList = reactive([]);
let collections = ref([]);
const loading = ref(false);

const handleClose = () => {
  emit("closeDialogFun");
};


const depositOne = async (item) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  accountAddress.value = accounts[0];
  const receiver = localStorage.getItem("receiver");
  const web3 = new Web3(window.ethereum);
  if (item.contractType == "ERC1155") {
    let nft1155Contract = new web3.eth.Contract(
      nft1155Abi,
      item.contractAddress
    );
    nft1155Contract.methods
      .safeTransferFrom(accounts[0], receiver, item.tokenId, 1, "0x")
      .send({ from: accounts[0] });
    return;
  }
  let nftContract = new web3.eth.Contract(nft721Abi, item.contractAddress);
  nftContract.methods
    .transferFrom(accounts[0], receiver, item.tokenId)
    .send({ from: accounts[0] });
};

// 提取Nft
const onWithdrawalNft = async (item) => {
  const { wallet } = params;
  if (!wallet) {
    ElMessage({
      message: "Please enter wallet address",
      type: "error",
    });
    return;
  }

  const res = await withdrawalNft({
    knapsackIds: [item.id], //背包ID
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
const fetchSystemNft = async (isSearch = true) => {
  let _page = page.value;
  if (isSearch) {
    page.value = 1;
    _page = 1;
  }
  loading.value = true;
  const res = await getSystemNft({
    page: _page,
    size: size.value,
  });
  loading.value = false;
  if (res && res.code == 200) {
    const stockNft = res.data.records;
    count.value = res.data.total;
    stockNftList = [];
    if (stockNft && !stockNft.length > 0) return;
    stockNft.forEach((element) => {
      if (!element.tokenId) return;
      stockNftList.push(element);
    });
    stockNftList.forEach((item, index) => {
      chooseNftData[index] = item;
    });
  }
};
// 获取外部系列
const fetchExternalSeries = async () => {
  const { userInfo } = useUserStore();
  const res = await getTheExternalNFTSeries({
    userId: userInfo?.id,
    type: "ALL"
  });

  collections.value = res.data;
};

const changeType = () => {
  params.collections = null;
  fetchSystemNft();
}

const getWalletNftApi = async (isSearch = true) => {
  let _page = page.value;
  if (isSearch) {
    page.value = 1;
    _page = 1;
  }

  const { userInfo } = useUserStore();

  loading.value = true;
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  if (accounts && accounts[0]) {
    Promise.all([
      getWalletNft({
        address: accounts[0],
        page: _page,
        size: size.value,
      }),
      getTheExternalNFTSeries({
        userId: userInfo?.id,
        type: "ALL"
      }),
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
        const contractType = props.tokenChoose == 3 ? "ERC721" : "ERC1155";
        const walletNft = JSON.parse(
          JSON.stringify(res[0].data.records)
        ).filter((item) => item.contractType === contractType);

        const systemNft = JSON.parse(JSON.stringify(res[1].data));
        const _nameArr = systemNft.map((item1) => {
          return item1.tokenId && item1.seriesName;
        });
        NFTSeries.values = _nameArr;
        // const _data = walletNft.filter((item) => {
        //   return _nameArr.includes(item.name);
        // });
        walletNft.forEach((item, index) => {
          chooseNftData[index] = item;
        });
      } else {
        getWalletNftApi();
      }
    });
  }
};

const handleCurrentChange = (event) => {
  page.value = event;

  if (props.isDeposit) {
    getWalletNftApi(false);
  } else {
    fetchSystemNft(false);
  }
}
</script>
<style lang="scss" scoped>
@import "./nftList.scss";
</style>
<style>
@media screen and (max-width: 1980px) {
  .choose_nft_item {
    width: calc(25% - 7px);
  }
}

@media screen and (min-width: 1981px) {
  .choose_nft_item {
    width: calc(20% - 7px);
  }
}
</style>
