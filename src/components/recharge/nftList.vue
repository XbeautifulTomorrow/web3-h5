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
        <el-input class="nft_input" v-if="!isDeposit" @keyup.enter="fetchSystemNft()" v-model="params.nftName" clearable
          placeholder="Search NFTs">
          <template #prefix>
            <el-icon class="el-input__icon search_icon" @click="fetchSystemNft()">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="collections_box type_box" v-if="!isDeposit">
          <div class="collections_text">Type:</div>
          <el-select v-model="params.type" @change="changeType" class="nft_type">
            <el-option v-for="item in nftTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="collections_box">
          <div class="collections_text">Collections:</div>
          <el-select v-model="params.collections" @change="changeSeries" class="nft_type" placeholder="All" clearable
            :popper-append-to-body="false">
            <el-option v-for="(item, index) in seriesDrop" :key="index" :label="item.seriesName"
              :value="item.contractAddress" />
          </el-select>
        </div>
        <el-input :class="['nft_input', !params.collections && 'disabled']" :disabled="!params.collections"
          v-model="params.nftName" v-if="isDeposit" @keyup.enter="getWalletNftApi()" clearable placeholder="Search NFTs">
          <template #prefix>
            <el-icon class="el-input__icon search_icon" @click="getWalletNftApi()">
              <search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="choose_nft">
        <div class="choose_nft_item" v-for="(item, index) in chooseNftData" :key="index">
          <div class="img_box">
            <Image fit="cover" class="nft_img" v-if="isDeposit" :src="item.nftImg" />
            <Image fit="cover" class="nft_img" v-else :src="item.img" />
            <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
          </div>
          <div class="nft_name">{{ item.name || "--" }}</div>
          <div class="confirm_btn" v-if="isDeposit" @click="depositOne(item)">
            DEPOSIT
          </div>
          <div class="confirm_btn disabled" v-else-if="item.currentStatus == 'WITHDRAW'">
            WITHDRAW
          </div>
          <div class="confirm_btn" v-else @click.stop="onWithdrawConfirm(item)">
            WITHDRAW
          </div>
        </div>
      </div>
      <div class="pagination_boxs" v-if="isDeposit">
        <div class="total_box">
          {{ `${startNum}-${endNum} of ${count}` }}
        </div>
        <div class="pagination not-select">
          <div :class="['prev', !pageCount.prev && 'disabled']" @click="handlePageChange(-1)">
            <el-icon>
              <ArrowLeftBold />
            </el-icon>
          </div>
          <div class="page_box">
            <span>{{ page + 1 }}</span>
            <span>{{ `/ ${Math.ceil(count / size) || 1}` }}</span>
          </div>
          <div :class="['next', !pageCount.next && 'disabled']" @click="handlePageChange(1)">
            <el-icon>
              <ArrowRightBold />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="pagination-box" v-if="!isDeposit && count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
      </div>
    </div>
    <Loading :loading="loading" />
    <withdraw v-if="showWithdraw" :dialogType="dialogType" :nftInfo="chooseNft" @confirm="onWithdrawalNft()"
      @cancelDialogFun="showWithdraw = false" @closeDialogFun="handleClose()"></withdraw>
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
import { i18n } from '@/locales';
const { t } = i18n.global;

import { useUserStore } from "@/store/user.js";
import { useWalletStore } from "@/store/wallet.js";
import Image from "@/components/imageView";
import { ElMessage } from "element-plus";
import nft721Abi from "@/config/721.json";
import nft1155Abi from "@/config/1155.json";
import { withdrawalNft, getTheUserSPayoutAddress } from "@/services/api/user";
import config from "@/services/env";

import withdraw from "./withdrawConfirm.vue";

import {
  getSystemNft,
  getWalletNft,
  getTheExternalNFTSeries,
} from "@/services/api/oneBuy";

import Loading from "@/components/loading/index";
import { isValidEthAddress } from "@/utils";

const props = defineProps({
  isDeposit: {
    type: Boolean,
    default: true,
  }
});

const page = ref(1);
const size = ref(8);
const count = ref(0);

const show = ref(true);
const showWithdraw = ref(false);
const dialogType = ref(1);

const chooseNft = ref({});
const receiver = ref("");

const emit = defineEmits("closeDialogFun");
const accountAddress = ref("");
const networkList = [{ label: "Goerli", value: "goerli" }];
const nftTypes = [
  { label: "ERC-721", value: "ERC721" },
  { label: "ERC-1155", value: "ERC1155" },
];

onMounted(() => {
  if (props.isDeposit) {
    page.value = 0;
    getWalletNftApi();

    const { web3 } = useWalletStore();
    accountAddress.value = web3?.eth?.defaultAccount;
  } else {
    page.value = 1;
    fetchSystemNft();
  }

  fetchExternalSeries();
  getTheUserSPayoutAddressApi();
});

const changeSeries = () => {
  if (props.isDeposit) {
    getWalletNftApi();
  } else {
    fetchSystemNft();
  }
};

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

const title = ref(props.isDeposit ? "DEPOSIT" : "WITHDRAW");

const params = reactive({
  nftName: null,
  type: "ERC721",
  collections: null,
  wallet: null,
  chain: null,
});
let chooseNftData = ref([]);
let stockNftList = reactive([]);
let collections = ref([]);
const loading = ref(false);

const handleClose = () => {
  emit("closeDialogFun");
};


const depositOne = async (item) => {

  const { web3 } = useWalletStore();
  accountAddress.value = web3?.eth?.defaultAccount;

  if (item.contractType == "ERC1155") {
    let nft1155Contract = new web3.eth.Contract(
      nft1155Abi,
      item.contractAddress
    );
    nft1155Contract.methods
      .safeTransferFrom(accountAddress.value, receiver.value, item.tokenId, 1, "0x")
      .send({ from: accountAddress.value });
    return;
  }
  let nftContract = new web3.eth.Contract(nft721Abi, item.contractAddress);
  nftContract.methods
    .transferFrom(accountAddress.value, receiver.value, item.tokenId)
    .send({ from: accountAddress.value });
};


// 打开确认弹窗
const onWithdrawConfirm = (item) => {
  const { wallet } = params;
  if (!wallet) {
    ElMessage({
      message: "Please enter wallet address",
      type: "error",
    });
    return;
  }

  if (!isValidEthAddress(wallet)) {
    ElMessage({
      message: t("user.enterError2"),
      type: "error",
    });
    return;
  }

  chooseNft.value = item;
  showWithdraw.value = true;
}
// 提取Nft
const onWithdrawalNft = async () => {
  const { wallet } = params;

  const res = await withdrawalNft({
    knapsackIds: [chooseNft.value.id], //背包ID
    walletAddress: wallet, //钱包地址
  });
  if (res && res.code == 200) {
    dialogType.value = 2;
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
    contractType: params.type,
    contractAddress: params.collections,
    keyword: params.nftName,
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

    chooseNftData.value = stockNftList;
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
  if (props.isDeposit) {
    getWalletNftApi();
  } else {
    fetchSystemNft();
  }
}

const getWalletNftApi = async (isSearch = true) => {
  let _page = page.value;
  if (isSearch) {
    page.value = 0;
    _page = 0;
  }

  loading.value = true;
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  if (accounts && accounts[0]) {
    Promise.all([
      getWalletNft({
        contractAddress: params.collections,
        address: accounts[0],
        cursor: pageList.value[_page],
        size: size.value,
        chatId: config.ENV == "pro" ? 1 : null,
        keyword: params.nftName
      }),
      getTheExternalNFTSeries({
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

        count.value = res[0].data.total;
        addCursor(res[0].data.cursor);

        collections.value = JSON.parse(JSON.stringify(res[1].data));

        chooseNftData.value = JSON.parse(
          JSON.stringify(res[0].data.records)
        )
      } else {
        getWalletNftApi();
      }
    });
  }
};

const pageList = ref([""])

const startNum = computed(() => {
  return page.value * size.value + 1;
})

const endNum = computed(() => {
  const num = page.value * size.value + size.value;

  if (count.value > num) {
    return num;
  }

  return count.value;
})

const pageCount = computed(() => {
  const pager = Math.ceil(count.value / size.value);
  let isPrev = true;
  let isNext = true;
  if (page.value == 0) {
    isPrev = false;
  }

  if ((page.value + 1) == pager) {
    isNext = false;
  }

  if (!pager > 0) {
    return {
      prev: false,
      next: false
    }
  }

  return {
    prev: isPrev,
    next: isNext
  }
})

const addCursor = (event) => {
  const isRepeat = pageList.value.findIndex(e => e == event) > -1;

  if (!isRepeat) {
    pageList.value.push(event);
  }
}

const handlePageChange = (event) => {
  if (event < 0 && !pageCount.value.prev || event > 0 && !pageCount.value.next) return
  page.value += event;
  getWalletNftApi(false);
}

const handleCurrentChange = (event) => {
  page.value = event;

  if (props.isDeposit) {
    getWalletNftApi(false);
  } else {
    fetchSystemNft(false);
  }
}

const getTheUserSPayoutAddressApi = async () => {
  const res = getTheUserSPayoutAddress();
  if (res && res.code == 200) {
    receiver.value = res.data;
    localStorage.setItem("receiver", res.data);
  } else {
    receiver.value = localStorage.getItem("receiver");
  }
};
</script>
<style lang="scss" scoped>
@import "./nftList.scss";
</style>
