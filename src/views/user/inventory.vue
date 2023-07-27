<template>
  <div :class="['my_inventory_wrapper', !count > 0 && 'no_data_bg']">
    <div class="nft_box">
      <div class="nft_operating">
        <div class="title_text">
          <img src="@/assets/svg/user/icon_inventory.svg" alt="">
          <span>{{ $t("user.inventory") }}</span>
        </div>
        <div class="operating_btns">
          <div class="operating_item" @click="onDeposit()">{{ $t("user.deposit") }}</div>
          <div class="operating_item" @click="onWithdraw()">{{ $t("user.withdraw") }}</div>
        </div>
      </div>
      <div class="search_box">
        <el-input class="nft_input" v-model="nftParams.nftName" clearable @keyup.enter="fetchSystemNft()"
          :placeholder="$t('homeReplenish.searchNft')">
          <template #prefix>
            <el-icon class="el-input__icon" @click="fetchSystemNft()">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="collections_box type_box">
          <div class="collections_text">{{ $t("homeReplenish.type") }}</div>
          <el-select v-model="nftParams.type" @change="fetchSystemNft()" class="nft_type" clearable
            :placeholder="$t('homeReplenish.all')">
            <el-option v-for="(item, index) in nftTypes" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="collections_box">
          <div class="collections_text">{{ $t("homeReplenish.sortCollections") }}</div>
          <el-select v-model="nftParams.collections" @change="fetchSystemNft()" class="nft_type"
            :placeholder="$t('homeReplenish.all')" clearable :popper-append-to-body="false">
            <el-option v-for="(item, index) in collections" :key="index" :label="item.seriesName"
              :value="item.contractAddress" />
          </el-select>
        </div>
      </div>
      <div class="nft_list" v-if="count > 0">
        <div class="nft_item" v-for="(item, index) in stockNftList" @click="viewNft(item)" :key="index">
          <div class="img_box">
            <div class="tips text-ellipsis" v-if="item.isType == 'EXTERNAL'">{{ `#${item.tokenId}` }}</div>
            <Image fit="cover" class="nft_img" :src="item.img" />
          </div>
          <div class="nft_name">{{ item.name || "--" }}</div>
          <div class="nft_btn view_nft" v-if="item.currentStatus == 'ONE_DOLLAR'">
            {{ $t("user.viewCompetitions") }}
          </div>
          <div class="nft_btn withdrawling" v-else-if="item.currentStatus == 'WITHDRAW'">
            {{ $t("user.withdrawing") }}
          </div>
          <div class="nft_btn withdrawling" v-else-if="item.isType != 'EXTERNAL'">
            {{ $t("user.createCompetitions") }}
          </div>
          <div class="nft_btn create" @click="createCompetition(item, index)" v-else>
            {{ $t("user.createCompetitions") }}
          </div>
        </div>
      </div>
      <div v-else class="no_date">
        <span>{{ $t("user.noDataNft") }}</span>
      </div>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
      </div>
    </div>
    <!-- 钱包链接弹窗 -->
    <wallet v-if="showLink" :dialogVisible="showLink" :title="title" @linkWallet="linkWallet"
      @closeDialogFun="handleClose" />

    <!-- 创建一元购弹窗 -->
    <el-dialog v-model="showCompetition" width="43.75rem" lock-scroll class="dialog_competition"
      :close-on-click-modal="false" :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_title">{{ $t("user.createCompetition") }}</div>
      <div class="image_box">
        <Image fit="cover" class="nft_img" :src="competitionNft && competitionNft.img" />
      </div>
      <div class="nft_info">
        <div class="nft_name">{{ competitionNft && competitionNft.name }}</div>
        <div class="nft_id text-ellipsis">
          #{{ competitionNft && competitionNft.tokenId }}
        </div>
      </div>
      <div class="type_tabs">
        <div :class="['tabs_item', activeType == 'LIMITED_TIME' && 'active']" @click="activeType = 'LIMITED_TIME'">
          {{ $t("user.timeLimit") }}
        </div>
        <div :class="['tabs_item', activeType == 'LIMITED_PRICE' && 'active']" @click="activeType = 'LIMITED_PRICE'">
          {{ $t("user.priceLimit") }}
        </div>
      </div>
      <el-form ref="competitionForm" class="form_box" :rules="rules" :model="competitionForm" hide-required-asterisk
        label-position="top">
        <el-form-item :label="$t('user.totalPrice')" prop="price">
          <el-input v-model="competitionForm.price" type="number" min="0">
            <template #prefix>
              <img class="icon_eth" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('user.totalEntries')" v-if="activeType == 'LIMITED_PRICE'">
          <el-input readonly="readonly" class="disabled" v-model.number="limitNum" type="number" min="2">
            <template #prefix>
              <img class="icon_eth" src="@/assets/svg/user/icon_tiket.svg" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('user.duration')" prop="limitDay" v-if="activeType == 'LIMITED_TIME'">
          <div class="input_days">
            <el-input class="nft_type" v-model="competitionForm.limitDay" type="number" min="0"
              :placeholder="$t('user.enterTimeHint')">
            </el-input>
            <div class="days_text" v-if="competitionForm.limitDay > 1">{{ $t("user.days") }}</div>
            <div class="days_text" v-else>{{ $t("user.day") }}</div>
          </div>
          <div class="choose_days">
            <div class="choose_days_item" v-for="(item, index) in daysData" :key="index" :class="[
              'choose_days_item',
              competitionForm.limitDay == item && 'active',
            ]" @click="competitionForm.limitDay = item">
              <span v-if="item > 1">{{ $t("user.numDays", { num: item }) }}</span>
              <span v-else>{{ $t("user.numDay", { num: item }) }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('user.entriesPrice')">
          <el-input readonly="readonly" class="disabled" v-model="competitionForm.ticketPrice" placeholder="">
            <template #prefix>
              <img class="icon_eth" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('user.maxDuration')" prop="limitDay" v-if="activeType == 'LIMITED_PRICE'">
          <div class="input_days">
            <el-input class="nft_type" v-model="competitionForm.limitDay" type="number" min="0"
              :placeholder="$t('user.enterTimeHint')">
            </el-input>
            <div class="days_text" v-if="competitionForm.limitDay > 1">{{ $t("user.days") }}</div>
            <div class="days_text" v-else>{{ $t("user.day") }}</div>
          </div>
          <div class="choose_days">
            <div class="choose_days_item" v-for="(item, index) in daysData" :key="index" :class="[
              'choose_days_item',
              competitionForm.limitDay == item && 'active',
            ]" @click="competitionForm.limitDay = item">
              <span v-if="item > 1">{{ $t("user.numDays", { num: item }) }}</span>
              <span v-else>{{ $t("user.numDay", { num: item }) }}</span>
            </div>
          </div>
        </el-form-item>
        <div class="continue_btn" @click="submitCompetition()">CREATE</div>
        <div class="hint-text" v-if="activeType == 'LIMITED_TIME'">
          <p>{{ $t("user.createHint1") }}</p>
        </div>
        <div class="hint-text" v-else>
          <p>{{ $t("user.createHint2") }}</p>
          <p>{{ $t("user.createHint3") }}</p>
        </div>
      </el-form>
    </el-dialog>
    <recharge v-if="rechargeDialog" :isDeposit="title === 'DEPOSIT'" :dialogVisible="rechargeDialog"
      @closeDialogFun="handleClose" />
  </div>
</template>
<script>
import bigNumber from "bignumber.js";
import { mapStores } from "pinia";
import { i18n } from '@/locales';
const { t } = i18n.global;

import { useWalletStore } from "@/store/wallet"
import { addNftOrder, getSystemNft, getTheExternalNFTSeries } from "@/services/api/oneBuy";

import { openUrl, timeFormat } from "@/utils";

import { useUserStore } from "@/store/user.js";

import wallet from "../wallet/index.vue";
import recharge from "@/components/recharge/index.vue";
import Image from "@/components/imageView"

export default {
  name: "myInventory",
  components: {
    wallet,
    recharge,
    Image
  },
  data() {
    return {
      rechargeDialog: false,
      title: "DEPOSIT",
      showLink: false, // 登录链上
      operatingType: 1, // 1 充NFT；2 提NFT；
      nftParams: {
        nftName: null,
        type: null,
        collections: null
      },
      nftTypes: [
        { label: "ERC-721", value: "ERC721" },
        { label: "ERC-1155", value: "ERC1155" },
      ],
      collections: [],
      stockNftList: [],

      // 一元购创建
      showCompetition: false,
      nftIndex: null, // 需要记录索引来即时更改列表
      activeType: "LIMITED_TIME",
      competitionNft: null,
      competitionForm: {
        price: null, //价格
        limitDay: null, //天数
        orderType: null, // 限时:LIMITED_TIME;限价:LIMITED_PRICE
        ticketPrice: 0.0001, //单次价格
      },
      daysData: [1, 7, 14, 30],
      rules: {},
      wallet: {
        page: 1,
        size: 8,
      },
      timer: null,
      externalSeries: null,

      page: 1,
      size: 15,
      count: 0,
    };
  },
  watch: {
    "competitionForm.price"(newV) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!newV) return;

      this.timer = setTimeout(() => {
        if (newV.length > 5) {
          this.competitionForm.price = newV.slice(0, 5);
        }
        this.$forceUpdate();
      }, 300);
    },
    "competitionForm.limitDay"(newV) {
      const max = 30;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!newV) return;
      this.timer = setTimeout(() => {
        if (newV > max) {
          this.competitionForm.limitDay = max;
        }
        this.$forceUpdate();
      }, 300);
    },
  },
  computed: {
    ...mapStores(useUserStore, useWalletStore),
    // 总票数
    limitNum() {
      const { price, ticketPrice } = this.competitionForm;
      if (!price) return 0;
      const maxNum = Number(new bigNumber(price).dividedBy(ticketPrice));
      if (this.activeType == "LIMITED_TIME") return 0;
      return maxNum;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    }
  },
  methods: {
    timeFormat: timeFormat,
    bigNumber: bigNumber,
    onDeposit() {
      this.title = "DEPOSIT";
      this.operatingType = 1;
      const { web3 } = this.walletStore;
      const defaultAccount = web3?.eth?.defaultAccount || "";
      if (defaultAccount) {
        this.linkWallet();
      } else {
        this.showLink = true;
      }
    },
    linkWallet() {
      this.rechargeDialog = true;
    },
    onWithdraw() {
      this.title = "WITHDRAW";
      this.operatingType = 2;
      const { web3 } = this.walletStore;
      const defaultAccount = web3?.eth?.defaultAccount || "";
      if (defaultAccount) {
        this.linkWallet();
      } else {
        this.showLink = true;
      }
    },
    // 获取系统Nft列表
    async fetchSystemNft(isSearch = true) {
      const { size, nftParams } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }
      const res = await getSystemNft({
        contractType: nftParams.type,
        contractAddress: nftParams.collections,
        keyword: nftParams.nftName,
        page: _page,
        size: size,
      });
      if (res && res.code == 200) {
        const stockNft = res.data.records;
        this.count = res.data.total;
        this.stockNftList = [];

        if (stockNft && !stockNft.length > 0) return;
        for (let i = 0; i < stockNft.length; i++) {
          if (!stockNft[i].tokenId) return;
          if (this.findExternalSeries(stockNft[i].tokenAddress)) {
            stockNft[i].isType = "EXTERNAL";
          }
        }

        this.stockNftList = stockNft;
        this.$forceUpdate();
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchSystemNft(false);
    },
    // 获取所有系列，用做筛选
    async fetchAllSeries() {
      const res = await getTheExternalNFTSeries({
        userId: this.userInfo?.id,
        type: "ALL"
      });
      this.collections = res.data;
    },
    // 获取外部系列
    async fetchExternalSeries() {
      const res = await getTheExternalNFTSeries({
        type: "EXTERNAL"
      });
      this.externalSeries = res.data;
      this.fetchSystemNft();
    },
    findExternalSeries(event) {
      const { externalSeries } = this;
      return externalSeries.findIndex(e => e.contractAddress == event) > -1;
    },
    // 弹出创建弹出
    createCompetition(event) {
      this.competitionNft = event;
      this.showCompetition = true;
    },
    // 创建一元购赛事
    submitCompetition() {
      this.$refs.competitionForm.validate(async (valid) => {
        if (valid) {
          const { activeType, competitionNft } = this;

          if (this.competitionForm.price.length > 5) {
            this.competitionForm.price = this.competitionForm.price.slice(0, 5);
          }

          let ruleForm = {
            ...this.competitionForm,
            limitNum: this.limitNum,
            orderType: activeType,
            contractAddress: competitionNft.tokenAddress, //合约地址
            tokenId: competitionNft.tokenId, //nftId
          };
          const res = await addNftOrder({ ...ruleForm });
          if (res && res.code == 200) {
            this.handleClose();
            this.$message.success(t("user.createSuccess"));
            this.fetchSystemNft(false);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭创建弹窗
    handleClose(done) {
      this.competitionForm = {
        price: null, //价格
        limitDay: null, //天数
        orderType: null, // 限时:LIMITED_TIME;限价:LIMITED_PRICE
        ticketPrice: 0.0001, //单次价格
      };

      this.operatingType = 1;
      this.collections = [];
      this.nftParams = {
        nftName: null,
        type: null,
        collections: null
      };


      if (this.$refs["competitionForm"]) {
        this.$refs["competitionForm"].resetFields();
      }

      this.$forceUpdate();

      if (done) {
        done();
        return;
      }
      this.showCompetition = false;
      this.showReplenish = false;
      this.showLink = false;
      this.showRecharge = false;
      this.rechargeDialog = false;
    },
    // 查看赛事
    viewNft(event) {
      if (event.currentStatus != 'ONE_DOLLAR') return

      let routeData = this.$router.resolve({
        name: "NftTicketsInfo",
        query: { id: event.orderNumber },
      });
      openUrl(routeData.href);
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchAllSeries();
      this.fetchExternalSeries();
    }

    this.rules = {
      //总价格
      price: [
        {
          required: true,
          message: t("user.priceEnter"),
          trigger: ["blur", "change"],
        },
      ],
      //天数
      limitDay: [
        {
          required: true,
          message: t("user.limitDayEnter"),
          trigger: ["blur", "change"],
        },
      ]
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./components/wallet.scss";
</style>

<style lang="scss">
.el-select__popper {
  border: none !important;
  background-color: #1d0f36 !important;

  .el-scrollbar__view {
    margin: 0.625rem 0 !important;
    padding: 0 0.625rem !important;
  }

  .el-select-dropdown__item {
    color: #a9a4b4;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.6;
    padding: 0.625rem 0.825rem;
    height: auto;

    &.selected {
      color: #fad54d;
    }

    &:hover,
    &.hover {
      border-radius: 0.5rem;
      background-color: #13151f;
    }
  }

  .el-popper__arrow {
    display: none;
  }
}
</style>
