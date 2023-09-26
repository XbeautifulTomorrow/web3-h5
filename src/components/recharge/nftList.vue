<template>
  <div>
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
                :value="`${item.contractAddress}${Number(item.tokenId) > -1 && '+' + item.tokenId || ''}`" />
            </el-select>
          </div>
          <el-input :class="['nft_input', !params.collections && 'disabled']" :disabled="!params.collections"
            v-model="params.nftName" v-if="isDeposit" @keyup.enter="getWalletNftApi()" clearable
            placeholder="Search NFTs">
            <template #prefix>
              <el-icon class="el-input__icon search_icon" @click="getWalletNftApi()">
                <search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="choose_nft" v-if="count > 0">
          <div class="choose_nft_item" v-for="(item, index) in chooseNftData" :key="index">
            <div class="img_box">
              <Image fit="cover" class="nft_img" v-if="isDeposit" :src="item.nftImg" />
              <Image fit="cover" class="nft_img" v-else :src="item.img" />
              <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
              <div v-if="isDeposit" class="num_tips text-ellipsis">{{ `x ${item.amount}` }}</div>
            </div>
            <div class="nft_name">{{ item.name || "--" }}</div>
            <template v-if="isDeposit">
              <div class="confirm_btn" v-if="!depositConfirm(item.tokenId)" @click="depositOne(item)">
                DEPOSIT
              </div>
              <div class="confirm_btn disabled" v-else>
                DEPOSITING
              </div>
            </template>
            <template v-else>
              <div class="confirm_btn" v-if="item.currentStatus == 'WAIT'" @click.stop="onWithdrawConfirm(item)">
                WITHDRAW
              </div>
              <div class="confirm_btn disabled" v-else-if="item.currentStatus == 'ONE_DOLLAR'">
                {{ $t("user.onSale") }}
              </div>
              <div class="confirm_btn disabled" v-else>
                WITHDRAWLING
              </div>
            </template>
            <div class="disabled_mask" v-if="isDeposit && !findSeries(item.contractAddress)">
              <div class="tips_text">{{ $t("recharge.notDeposit", { name: item.name || "--" }) }}</div>
            </div>
          </div>
        </div>
        <div class="choose_nft" v-else>
          <div class="no_date">
            <span>{{ $t("user.noDataNft") }}</span>
          </div>
        </div>
        <div class="pagination_boxs" v-if="isDeposit && count > size">
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
      <withdraw v-if="showWithdraw" :dialogType="dialogType" :nftInfo="chooseNft" :txId="transactionId"
        @confirm="onWithdrawalNft()" @cancelDialogFun="handleCancel()"></withdraw>
    </el-dialog>
  </div>
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
import { useHeaderStore } from "@/store/header.js";
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
const transactionId = ref("");
const confirmNft = ref([]); // 确认中id
const confirmIndex = ref(""); // 当前确认索引

const chooseNft = ref({});
const receiver = ref("");

const emit = defineEmits("closeDialogFun");
const accountAddress = ref("");
const networkList = [{ label: "Ethereum", value: "ethereum" }];
const nftTypes = [
  { label: "ERC-721", value: "ERC721" },
  { label: "ERC-1155", value: "ERC1155" },
];

onMounted(() => {
  if (props.isDeposit) {
    page.value = 0;

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
  chooseNft.value = item;
  showWithdraw.value = true;
  dialogType.value = 3;
  confirmNft.value.push(item.tokenId);
  confirmIndex.value = confirmNft.value.length - 1;

  const { web3 } = useWalletStore();
  accountAddress.value = web3?.eth?.defaultAccount;

  if (item.contractType == "ERC1155") {
    let nft1155Contract = new web3.eth.Contract(
      nft1155Abi,
      item.contractAddress
    );
    nft1155Contract.methods
      .safeTransferFrom(accountAddress.value, receiver.value, item.tokenId, 1, "0x")
      .send({ from: accountAddress.value })
      .catch((error) => {
        console.error(error.message);
        delDeposit(); // 交互失败，删除确认状态
      })
      .then((res) => {
        if (res) {
          dialogType.value = 4;
          transactionId.value = res.transactionHash;
        } else {
          delDeposit(); // 交互失败，删除确认状态
          handleCancel();
        }
      });
    return;
  }

  let nftContract = new web3.eth.Contract(nft721Abi, item.contractAddress);
  nftContract.methods
    .transferFrom(accountAddress.value, receiver.value, item.tokenId)
    .send({ from: accountAddress.value })
    .catch((error) => {
      console.error(error.message);
      delDeposit(); // 交互失败，删除确认状态
    })
    .then((res) => {
      if (res) {
        dialogType.value = 4;
        transactionId.value = res.transactionHash;
      } else {
        delDeposit(); // 交互失败，删除确认状态
        handleCancel();
      }
    });
};

const getTheUserBalanceInfo = () => {
  const headerStore = useHeaderStore();
  headerStore.getTheUserBalanceApi();
}

// 确认中状态
const depositConfirm = (item) => {
  if (!confirmNft.value > 0) return false;

  const confirm = confirmNft.value.findIndex(e => e == item) > -1;
  return confirm
}

// 删除确认中状态
const delDeposit = () => {
  confirmNft.value.splice(confirmIndex.value, 1);
}

// 打开确认弹窗
const onWithdrawConfirm = (item) => {
  const { wallet } = params;
  if (!wallet) {
    ElMessage({
      message: t("airdrop.enterTips"),
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
  dialogType.value = 1;
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
    getTheUserBalanceInfo();
  }
};

const findSeries = (event) => {
  return collections.value.findIndex(e => e.contractAddress == event) > -1;
}

// 获取系统Nft列表
const fetchSystemNft = async (isSearch = true) => {
  let _page = page.value;
  if (isSearch) {
    page.value = 1;
    _page = 1;
  }

  const collections = params.collections && params.collections.split("+") || [];

  loading.value = true;
  const res = await getSystemNft({
    contractType: params.type,
    contractAddress: collections[0],
    keyword: params.nftName,
    tokenId: collections[1] && collections[1] || undefined,
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
    userId: props.isDeposit ? null : userInfo?.id,
    type: "ALL"
  });

  collections.value = res.data;

  if (props.isDeposit) {
    getWalletNftApi();
  }
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

  const collections = params.collections && params.collections.split("+") || [];

  loading.value = true;
  if (accountAddress.value) {
    const res = await getWalletNft({
      contractAddress: collections[0] && collections[0],
      address: accountAddress.value,
      cursor: pageList.value[_page],
      size: size.value,
      chatId: config.ENV == "pro" ? 1 : null,
      keyword: params.nftName,
      tokenId: collections[1] && collections[1] || undefined,
    })

    loading.value = false;

    if (res && res.code === 200 && res.data) {
      count.value = res.data.total;
      addCursor(res.data.cursor);

      chooseNftData.value = JSON.parse(
        JSON.stringify(res.data.records)
      )
    }
  }
};

// 关闭弹窗
const handleCancel = async () => {
  dialogType.value = 1;
  showWithdraw.value = false;
  chooseNft.value = [];
  transactionId.value = "";

  // 加载数据
  if (props.isDeposit) {
    getWalletNftApi(false);
  } else {
    fetchSystemNft(false);
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

// 翻页
const addCursor = (event) => {
  const isRepeat = pageList.value.findIndex(e => e == event) > -1;

  if (!isRepeat) {
    pageList.value.push(event);
  }
}

// 翻页
const handlePageChange = (event) => {
  if (event < 0 && !pageCount.value.prev || event > 0 && !pageCount.value.next) return
  page.value += event;
  getWalletNftApi(false);
}

// 翻页
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
<style lang="scss">
@media screen and (max-width: 950px) {
  .recharge-coin {
    width: 90%;
    background-image: none !important;

    .el-dialog__body {
      padding: 1rem 0.25rem;
    }

    .operating_title {
      font-size: 1.5rem;
    }

    .operating_tips {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .choose_panel {
      margin: 0;
      padding: 0;
      background-color: transparent;
    }

    .el-input .el-select__caret {
      font-size: 1rem !important;
    }

    .search_box {
      &>div+div {
        margin-left: 0.5rem;

        &:first-child {
          margin-left: 0;
        }
      }

      .collections_box {
        flex: 1;
        border-radius: 0.25rem;

        .collections_text {
          font-size: 0.75rem;
          left: 0.5rem;
        }

        &.type_box {
          width: 7.6875rem;
          flex: none;

          .el-input__wrapper {
            padding-left: 2.7rem !important;
          }
        }

        .nft_type {
          min-width: auto;

          .el-input__wrapper {
            height: 1.5rem;
            padding-left: 4.9rem;
            padding-right: 0.5rem;
          }

          input {
            font-size: 0.75rem;
          }
        }
      }

      .nft_input {
        .el-input__wrapper {
          height: 1.5rem !important;
          padding: 0 0.5rem;
          border-radius: 0.25rem;

          input {
            font-size: 0.75rem;
          }
        }

        .el-input__prefix-inner {
          display: none;
        }
      }

      .nft_input {
        // margin-left: 0.5rem;
      }
    }

    .choose_nft {
      &>div:nth-child(n + 3) {
        margin-top: 0.25rem;
      }

      &>div:nth-child(3n + 1) {
        margin-left: 0;
      }

      &>div:nth-child(3n + 2) {
        margin-left: 0.25rem;
      }

      .no_date {
        height: auto;
        margin-top: 1.875rem;

        span {
          padding: 0 1rem;
          height: 1.875rem;
          font-size: 0.75rem;
          line-height: 1.875rem;
          border-radius: 0.25rem;
        }
      }

      .choose_nft_item {
        width: calc((100% - 0.5rem) / 3);
        padding-bottom: 0.875rem;

        .img_box {
          width: 100%;
          height: 29vw;

          .nft_img {
            width: 100%;
            height: 100%
          }

          ;

          .tips {
            padding: 0.2rem 0.4rem;
            line-height: 1;
            font-size: .75rem;
          }

          .num_tips {
            font-size: .75rem;
            padding: 0rem 0.5rem;
            line-height: 1.8;
            bottom: .75rem;
          }
        }

        .nft_name {
          font-size: 0.75rem;
          padding: 0.25rem 0;
        }

        .confirm_btn {
          height: 1.5rem;
          line-height: 1.5rem;
          font-size: 0.75rem;
          border-radius: 0.25rem;
          margin: 0 0.25rem;
        }

        .disabled_mask {
          .tips_text {
            font-size: 0.75rem;
          }
        }
      }

      &>div+div {
        margin-left: 0.25rem;
      }

    }

    .pagination_boxs {
      .page_box {
        font-size: 1rem;
      }

      .total_box {
        font-size: 0.75rem;
      }

      .prev,
      .next {
        width: 2rem;
        height: 2rem;
        font-size: 0.75rem;
      }
    }

    .condition_item {
      padding: 0.5rem !important;
      margin-top: 0.625rem !important;
    }

    .withdraw_condition {
      width: 100%;
      margin-bottom: 0.625rem !important;

      .wallet_network {
        .el-input__wrapper {
          height: 1.875rem;
          border-radius: 0.25rem;

          input {
            font-size: 0.875rem;
          }
        }
      }
    }

    .wallet_input {
      .el-input__wrapper {
        height: 1.875rem !important;
      }
    }
  }
}

@media screen and (max-width: 440px) {
  .recharge-coin {
    .choose_panel {
      .search_box {
        flex-wrap: wrap;

        .type_box {
          margin-left: 0;
        }

        .nft_input {
          width: 100%;
          flex: inherit;
          margin: 0.25rem 0;

          .el-input__wrapper {
            width: 100%;
          }
        }
      }
    }

    .choose_nft {
      &>div:nth-child(n + 3) {
        margin-top: 0.25rem;
      }

      &>div:nth-child(2n + 1) {
        margin-left: 0;
      }

      &>div:nth-child(2n) {
        margin-left: 0.25rem;
      }

      .choose_nft_item {
        width: calc((100% - 0.25rem) / 2);

        .img_box {
          height: 46vw;
        }
      }
    }
  }
}</style>