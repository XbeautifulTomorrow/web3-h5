<template>
  <div>
    <el-dialog v-model="show" destroy-on-close :close-on-click-modal="false" :show-close="false" :align-center="true"
      class="create_dialog" width="43.75rem" :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_com" v-if="!operatingType">
        <p class="create_com_title">SELECT CRYPTO ASSET TYPE</p>
        <div class="wallet_operating">
          <div class="wallet_operating_item" @click="handleChoose('ETH')">
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            <span class="wallet_operating_val">ETH</span>
          </div>
          <div class="wallet_operating_item" @click="handleChoose('NFT')">
            <img src="@/assets/svg/user/icon_nft.svg" alt="" />
            <span class="wallet_operating_val">NFT</span>
          </div>
        </div>
        <div class="form-hint">
          <p>{{ $t("user.createComTips1") }}</p>
          <p>{{ $t("user.createComTips2") }}</p>
        </div>
      </div>
      <div class="dialog_competition" v-else>
        <div class="create_title">{{ $t("user.createCompetition") }}</div>
        <div class="image_box">
          <Image fit="cover" class="nft_img" v-if="operatingType == 'NFT'" :src="competitionNft?.img" />
          <Image fit="cover" class="nft_img" v-else :src="require('@/assets/svg/user/create_eth.webp')" />
        </div>
        <div class="nft_info" v-if="operatingType == 'NFT'">
          <div class="nft_name">{{ competitionNft?.name }}</div>
          <div class="nft_id text-ellipsis">
            #{{ competitionNft?.tokenId }}
          </div>
        </div>
        <div class="nft_info" v-else>
          <div class="nft_name">{{ operatingType }}</div>
        </div>
        <div class="type_tabs" v-if="operatingType == 'NFT'">
          <div :class="['tabs_item', 'disabled']">
            {{ $t("user.timeLimit") }}
          </div>
          <div :class="['tabs_item', activeType == 'LIMITED_PRICE' && 'active']" @click="activeType = 'LIMITED_PRICE'">
            {{ $t("user.priceLimit") }}
          </div>
        </div>
        <el-form ref="competitionForm" class="form_box" :rules="rules" :model="competitionForm" hide-required-asterisk
          label-position="top">
          <el-form-item :label="$t('user.totalPrice')" prop="price">
            <div class="choose_price" v-if="operatingType == 'NFT'">
              <div class="price_item" @click="competitionForm.price = competitionNft?.floorPrice">
                <span class="title">Floor Price</span>
                <span class="val">{{ competitionNft?.floorPrice || "--" }} ETH</span>
              </div>
              <div class="price_item" @click="competitionForm.price = historyPrice">
                <span class="title">Last Sale</span>
                <span class="val">{{ historyPrice ? `${historyPrice} ETH` : "--" }} </span>
              </div>
            </div>
            <el-input v-model="competitionForm.price" type="number" min="0">
              <template #prefix>
                <img class="icon_eth" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form-item_wrap" v-if="operatingType == 'ETH'" :label="$t('user.entriesPrice')">
            <div class="num_item">
              <span>{{ competitionForm.ticketPrice }}</span>
              <img class="icon_eth" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </div>
          </el-form-item>
          <el-form-item :label="$t('user.totalEntries')" prop="limitNum" v-if="operatingType == 'ETH'">
            <el-input v-model="competitionForm.limitNum" type="number" min="0">
              <template #prefix>
                <img class="icon_eth" src="@/assets/svg/user/icon_tickets_num.svg" alt="" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form-item_wrap" :label="$t('user.totalEntries')"
            v-if="operatingType == 'NFT' && activeType == 'LIMITED_PRICE'">
            <div class="num_item">
              <span>{{ limitNum }}</span>
              <img class="icon_eth" src="@/assets/svg/user/icon_tickets_num.svg" alt="" />
            </div>
          </el-form-item>
          <el-form-item class="form-item_wrap" :label="$t('user.totalPrice')" v-if="operatingType == 'ETH'">
            <div class="num_item">
              <span>{{ totalPrice }}</span>
              <img class="icon_eth" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </div>
          </el-form-item>
          <el-form-item class="form-item_wrap" :label="$t('user.feeRate')" v-if="operatingType == 'ETH'">
            <div class="num_item">
              <span>{{ new bigNumber(serverFees).multipliedBy(100).toFixed(2) }}%</span>
            </div>
          </el-form-item>
          <el-form-item class="form-item_wrap" :label="$t('user.realIncome')" v-if="operatingType == 'ETH'">
            <div class="num_item">
              <span>{{ realIncome }}</span>
              <img class="icon_eth" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </div>
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
          <el-form-item class="form-item_wrap" v-if="operatingType == 'NFT'" :label="$t('user.entriesPrice')">
            <div class="num_item">
              <span>{{ competitionForm.ticketPrice }}</span>
              <img class="icon_eth" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </div>
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
          <div class="share_box">
            <div class="form-rember">
              <span class="form-rember-rectangle" @click="showRememberFun()">
                <span v-show="freeParams.isOpen" class="form-rember-rectangle-fill"></span>
              </span>
              <span class="form-rember-text">
                <span>{{ $t("user.tweetText") }}</span>
                <el-tooltip popper-class="tips_box" effect="dark" placement="top">
                  <template #content>
                    <p>{{ $t("user.tweetHint1") }}</p>
                    <br>
                    <p>{{ $t("user.tweetHint2") }}</p>
                  </template>
                  <img src="@/assets/svg/user/icon_help.svg" alt="">
                </el-tooltip>
              </span>
            </div>
            <div class="invitation_box" v-if="freeParams.isOpen">
              <el-select @click="showCreate()" :disabled="!inviteDrop.length > 0" v-model="freeParams.inviteCode"
                class="invite_select" :placeholder="$t('user.chooseCodeHint')" :popper-append-to-body="false">
                <el-option v-for="(item, index) in inviteDrop" :key="index" :label="item.inviteCode"
                  :value="item.inviteCode" />
              </el-select>
              <el-input class="invite_select tickets_num" v-model="freeParams.sendTicketsNum" type="number" min="0"
                :placeholder="$t('user.freeNumHint')">
              </el-input>
            </div>
          </div>
          <div class="continue_btn" @click="confirmCop()">{{ $t("user.create") }}</div>
          <div class="hint-text" v-if="activeType == 'LIMITED_TIME'">
            <p>{{ $t("user.createHint1") }}</p>
          </div>
          <div class="hint-text" v-else>
            <p>{{ $t("user.createHint2") }}</p>
            <p>{{ $t("user.createHint3") }}</p>
          </div>
        </el-form>
      </div>
      <el-dialog v-model="showChooseNft" :destroy-on-close="true" width="78.125rem" :append-to-body="true"
        :show-close="false" :align-center="true" :before-close="handleCloseChoose" :close-on-click-modal="false"
        class="public-dialog recharge-coin">
        <template #header="{ close }">
          <div class="close_btn" v-on="{ click: [close, handleCloseChoose] }">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </template>
        <div class="operating_title">
          <span>{{ $t("user.selectNft") }}</span>
        </div>
        <div class="choose_panel">
          <div class="search_box">
            <el-input class="nft_input" @keyup.enter="fetchSystemNft()" v-model="params.nftName" clearable
              placeholder="Search NFTs">
              <template #prefix>
                <el-icon class="el-input__icon search_icon" @click="fetchSystemNft()">
                  <search />
                </el-icon>
              </template>
            </el-input>
            <div class="collections_box">
              <div class="collections_text">Collections:</div>
              <el-select v-model="params.collections" @change="fetchSystemNft" class="nft_type" placeholder="All"
                clearable :popper-append-to-body="false">
                <el-option v-for="(item, index) in seriesDrop" :key="index" :label="item.seriesName"
                  :value="`${item.contractAddress}${Number(item.tokenId) > -1 && '+' + item.tokenId || ''}`" />
              </el-select>
            </div>
          </div>
          <div class="choose_nft" v-if="count > 0">
            <div class="choose_nft_item" v-for="(item, index) in stockNftList" :key="index">
              <div class="img_box">
                <Image fit="cover" class="nft_img" :src="item.img" />
                <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
              </div>
              <div class="nft_name">{{ item.name || "--" }}</div>
              <div class="confirm_btn disabled" v-if="item.currentStatus == 'WITHDRAW'">
                {{ $t("user.withdrawing") }}
              </div>
              <div class="confirm_btn disabled" v-else-if="item.currentStatus == 'ONE_DOLLAR'">
                {{ $t("user.onSale") }}
              </div>
              <div class="confirm_btn disabled" v-else-if="item.isType != 'EXTERNAL'">
                {{ $t("user.createCompetitions") }}
              </div>
              <div class="confirm_btn" v-else @click="handleChooseNft(item)">
                {{ $t("user.createCompetitions") }}
              </div>
            </div>
          </div>
          <div class="choose_nft" v-else>
            <div class="no_date">
              <span>{{ $t("user.noDataNft") }}</span>
            </div>
          </div>
          <div class="pagination-box" v-if="count > size">
            <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
              layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="showTips" destroy-on-close :close-on-click-modal="false" :show-close="false"
        :align-center="true" class="public-dialog" :append-to-body="true" width="43.75rem"
        :before-close="() => { showTips = false }">
        <template #header="{ close }">
          <div class="close_btn" v-on="{ click: [close, () => { showTips = false }] }">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </template>
        <div class="public-dialog-content form-content">
          <div class="operating_title">
            <span>{{ $t("lottery.notice") }}</span>
          </div>
          <div class="tips_panel" v-if="!priceVerify()">
            <p v-if="operatingType == 'ETH'"
              v-html="$t('user.createTips1', { price: formatText(1), coin: formatText(2) })">
            </p>
            <p v-else
              v-html="$t('user.createTips2', { price: formatText(1), nft: formatText(2), floorPrice: formatText(3) })">
            </p>
          </div>
          <div class="tips_panel" v-else>
            <p v-if="operatingType == 'ETH'"
              v-html="$t('user.createTips3', { price: formatText(1), coin: formatText(2) })"></p>
            <p v-else v-html="$t('user.createTips4', { price: formatText(1), nft: formatText(2) })"></p>
          </div>
          <div class="btn_box">
            <el-button class="public-button cancel-button" @click="showTips = false">
              {{ $t("common.cancelUpper") }}
            </el-button>
            <el-button class="public-button form-button" @click="submitCompetition()">
              {{ $t("airdrop.confirm") }}
            </el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="showInvite" destroy-on-close :close-on-click-modal="false" :show-close="false"
        :align-center="true" class="public-dialog" :append-to-body="true" width="43.75rem" :before-close="inviteClose">
        <template #header="{ close }">
          <div class="close_btn" v-on="{ click: [close, inviteClose] }">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </template>
        <div class="public-dialog-content form-content">
          <div class="operating_title">
            <span>{{ $t("user.create") }}</span>
          </div>
          <div class="invite_code">
            <el-input class="invite_code_input" v-model="inviteCode" @blur="onVerify()" clearable
              :placeholder="$t('user.createEnterHint')">
            </el-input>
            <div class="create_error">{{ inviteTips }}</div>
          </div>
          <div class="btn_box">
            <el-button class="public-button cancel-button" @click="inviteClose()">
              {{ $t("common.cancelUpper") }}
            </el-button>
            <el-button class="public-button form-button" @click="createInvite()">
              {{ $t("user.create") }}
            </el-button>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
    
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";
import bigNumber from "bignumber.js";
import {
  addNftOrder,
  getSystemNft,
  getNftActivityCharts,
  getTheExternalNFTSeries,
  getServiceFee
} from "@/services/api/oneBuy";

import {
  rebatesCreateCode,
  rebatesFindList
} from "@/services/api/invite";

import Image from "@/components/imageView";
import { i18n } from '@/locales';
const { t } = i18n.global;
export default {
  name: 'modifyName',
  components: {
    Image
  },
  data() {
    return {
      show: true,
      operatingType: null,
      serverFees: 0,
      activeType: "LIMITED_PRICE",
      competitionNft: null,
      competitionForm: {
        price: null, //价格
        limitNum: null, //票数
        limitDay: null, //天数
        orderType: null, // 限时:LIMITED_TIME;限价:LIMITED_PRICE
        ticketPrice: 0.0001, //单次价格
      },
      daysData: [1, 7, 14, 30],
      rules: {},
      historyPrice: null,

      // 选择nft
      showChooseNft: false,
      params: {
        nftName: null,
        type: "ERC721",
        collections: null
      },
      collections: [],
      stockNftList: [],

      page: 1,
      size: 10,
      count: 0,

      showTips: false,

      showInvite: false,
      inviteDrop: [],
      inviteCode: null,
      inviteTips: null,
      verifys: null,
      freeParams: {
        isOpen: false,
        inviteCode: null,
        sendTicketsNum: null
      }
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore?.balance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    seriesDrop() {
      const { type } = this.params;
      const chooseNfts = [];
      if (!type) return this.collections;

      this.collections.forEach((element) => {
        if (element.seriesNftType == type) chooseNfts.push(element);
      });

      return chooseNfts;
    },
    // 总票数
    limitNum() {
      const { price, ticketPrice } = this.competitionForm;
      if (!price) return 0;
      const maxNum = Number(new bigNumber(price).dividedBy(ticketPrice));
      if (this.activeType == "LIMITED_TIME") return 0;
      return maxNum;
    },
    // 总价值
    totalPrice() {
      const { limitNum, ticketPrice } = this.competitionForm;
      if (!limitNum) return 0
      return new bigNumber(limitNum).multipliedBy(ticketPrice);
    },
    // 实际收益
    realIncome() {
      const { totalPrice, serverFees } = this;
      if (!totalPrice || !serverFees) return 0;
      const feeNum = new bigNumber(totalPrice).multipliedBy(serverFees);

      return new bigNumber(totalPrice).minus(feeNum);
    }
  },
  methods: {
    bigNumber: bigNumber,
    onConfirm() {
      this.$emit("closeDialogFun");
    },
    /**
     * @description: 格式化地址
     */
    handleChoose(event) {
      if (event == "NFT") {
        this.fetchExternalSeries();
        this.fetchSystemNft();
        this.showChooseNft = true;
      } else {
        this.operatingType = event;
      }

      this.fetchRebatesFindList();
    },
    showRememberFun() {
      this.freeParams.isOpen = !this.freeParams.isOpen;
    },
    // 选择nft
    handleChooseNft(event) {
      this.competitionNft = event;
      this.fetchNftActivitySale(event);
      this.handleCloseChoose();
      this.operatingType = "NFT";
    },
    // 一元购历史折线图
    async fetchNftActivitySale(event) {
      let res = await getNftActivityCharts({
        contractAddress: event.tokenAddress,
        tokenId: event.tokenId,
        page: 1,
        size: 100,
        currentStatus: "DRAWN"
      });

      if (res && res.code == 200) {
        if (res.data.records.length > 0) {
          this.historyPrice = res.data.records[0].price;
        }
      }
    },
    // 设置
    async fetchSetting() {
      const res = await getServiceFee();
      if (res && res.code == 200) {
        this.serverFees = res.data;
        this.$forceUpdate();
      }
    },
    // 获取系统Nft列表
    async fetchSystemNft(isSearch = true) {
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      const collections = this.params.collections && this.params.collections.split("+") || [];

      const res = await getSystemNft({
        contractType: this.params.type,
        contractAddress: collections[0],
        keyword: this.params.nftName,
        tokenId: collections[1] && collections[1] || undefined,
        page: _page,
        size: this.size,
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
    // 获取外部系列
    async fetchExternalSeries() {
      const { userInfo } = useUserStore();
      const res = await getTheExternalNFTSeries({
        userId: userInfo?.id || null,
        type: "ALL"
      });

      this.collections = res.data;
    },
    findExternalSeries(event) {
      const { collections } = this;
      return collections.findIndex(e => e.contractAddress == event) > -1;
    },
    // 确认弹窗
    confirmCop() {
      this.$refs.competitionForm.validate(async (valid) => {
        if (valid) {
          const { freeParams } = this;

          if (this.operatingType == "NFT") {
            if (Number(this.competitionForm.price) < 0.1) {
              this.$message.error(t("user.priceError"));
              return
            }
          } else {
            if (Number(this.totalPrice) < 0.1) {
              this.$message.error(t("user.priceError"));
              return
            }
          }

          if (freeParams.isOpen) {
            if (!freeParams.inviteCode) {
              this.$message.error(t("user.freeInviteCodeEnter"));
              return
            }

            if (!freeParams.sendTicketsNum || !Number(freeParams.sendTicketsNum) > 0) {
              this.$message.error(t("user.freeTicketsEnter"));
              return
            }
          }

          this.showTips = true;
        }
      })
    },
    // 创建一元购赛事
    submitCompetition() {
      this.$refs.competitionForm.validate(async (valid) => {
        if (valid) {
          const { activeType, competitionNft, freeParams } = this;

          if (this.operatingType == "NFT") {
            if (Number(this.competitionForm.price) < 0.1) {
              this.$message.error(t("user.priceError"));
              return
            }
          } else {
            if (Number(this.totalPrice) < 0.1) {
              this.$message.error(t("user.priceError"));
              return
            }
          }

          if (freeParams.isOpen) {
            if (!freeParams.inviteCode) {
              this.$message.error(t("user.freeInviteCodeEnter"));
              return
            }

            if (!freeParams.sendTicketsNum || !Number(freeParams.sendTicketsNum) > 0) {
              this.$message.error(t("user.freeTicketsEnter"));
              return
            }
          }

          let ruleForm = {
            ...this.competitionForm,
            limitNum: this.operatingType == "NFT" ? this.limitNum : this.competitionForm.limitNum,
            orderType: this.operatingType == "NFT" ? activeType : "LIMITED_PRICE_COIN",
            contractAddress: competitionNft?.tokenAddress || "", //合约地址
            tokenId: competitionNft?.tokenId || "", //nftId
          };

          if (freeParams.isOpen) {
            ruleForm.sendTicketsSwitch = 1;
            ruleForm.inviteCode = freeParams.inviteCode;
            ruleForm.sendTicketsNum = freeParams.sendTicketsNum;
          }

          this.timer = setTimeout(async () => {
            const res = await addNftOrder({ ...ruleForm });
            if (res && res.code == 200) {
              this.showTips = false;
              this.handleClose();
              this.$message.success(t("user.createSuccess"));
            }
          }, 100);

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 验证
    onVerify() {
      const { inviteCode } = this;
      if (!inviteCode) {
        this.inviteTips = t("user.enterCodeError1");
        this.verifys = false;
        return
      } else if (inviteCode.length < 3) {
        this.inviteTips = t("user.enterCodeError2");
        this.verifys = false;
        return
      }

      this.inviteTips = "";
      this.verifys = true;
    },
    // 打开创建弹窗
    showCreate() {
      if (this.inviteDrop.length > 0) return;
      this.showInvite = true;
    },
    // 创建邀请吗
    async createInvite() {
      this.onVerify();
      if (!this.verifys) return
      const res = await rebatesCreateCode({
        code: this.inviteCode
      });
      if (res && res.code == 200) {
        this.inviteClose();
        this.$message.success(t("common.createdTips"));
        this.fetchRebatesFindList();
      }
    },
    // 邀请资产列表
    async fetchRebatesFindList() {
      const res = await rebatesFindList({
        page: 1,
        size: 20
      });
      if (res && res.code == 200) {
        this.inviteDrop = res.data;
        this.inviteDrop.forEach(element => {
          if (element.defaultStatus == "TRUE") {
            this.freeParams.inviteCode = element.inviteCode;
          }
        })
      }
    },
    // 关闭选择弹窗
    handleCloseChoose() {
      this.showChooseNft = false;
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialogFun");
    },
    // 关闭邀请码创建弹窗
    inviteClose() {
      this.inviteCode = null;
      this.showInvite = false;
    },
    validatePrice(rule, value, callback) {
      if (value === "") {
        callback(new Error(t("user.priceEnter")));
      } else if (value && Number(value) > Number(this.ethBalance)) {
        callback(new Error(t("user.enterError4")));
      } else {
        callback();
      }
    },
    validateTPrice(rule, value, callback) {
      const { price, ticketPrice } = this.competitionForm;
      if (!price) {
        callback();
      } else if (value === "") {
        callback(new Error(t("user.limitNumEnter")));
      } else if (value && Number(value * ticketPrice) > Number(price * 1.2)) {
        callback(new Error(t("user.ticketsHint")));
      } else {
        callback();
      }
    },
    priceVerify() {
      const { operatingType, competitionNft, competitionForm: { price, ticketPrice }, limitNum, totalPrice } = this;
      if (operatingType == "NFT") {
        return Number(limitNum * ticketPrice) > Number(competitionNft?.floorPrice);
      } else {
        return Number(totalPrice) >= Number(price);
      }
    },
    // ETH确认
    formatText(event) {
      if (this.operatingType == "NFT") {
        if (event == 1) {
          return `<span style='line-height: 1rem;'>${this.totalPrice}</span><img style='display: inline-block; width: 1rem;height: auto;margin-left: 0.25rem; vertical-align: middle;' src="${require("@/assets/svg/user/icon_ethereum.svg")}" />`;
        } else if (event == 2) {
          const { competitionNft, formatSeries } = this;
          return formatSeries(competitionNft) ? `${competitionNft?.name} #${competitionNft?.tokenId}` : `${competitionNft?.name}`;
        } else {
          return `<span style='line-height: 1rem;'>${this.competitionNft?.floorPrice}</span><img style='display: inline-block; width: 1rem;height: auto;margin-left: 0.25rem; vertical-align: middle;' src="${require("@/assets/svg/user/icon_ethereum.svg")}" />`;
        }
      } else {
        if (event == 1) {
          return `<span style='line-height: 1rem;'>${this.totalPrice}</span><img style='display: inline-block;width: 1rem;height: auto;margin-left: 0.25rem; vertical-align: middle;' src="${require("@/assets/svg/user/icon_ethereum.svg")}" />`;
        } else {
          return `<span style='line-height: 1rem;'>${this.competitionForm.price}</span><img  style='display: inline-block;width: 1rem;height: auto;margin-left: 0.25rem; vertical-align: middle;' src="${require("@/assets/svg/user/icon_ethereum.svg")}" />`;
        }
      }
    },
    formatSeries(event) {
      if (!event) return false;
      const { name, tokenId } = event;
      if (!name || !tokenId) return false;
      const isShow = name.indexOf(tokenId) > -1;
      return !isShow
    },
    handleCurrentChange(event) {
      this.page = event;
      this.fetchSystemNft(false);
    }
  },
  watch: {
    "competitionForm.price"(newV) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!newV) return;

      this.timer = setTimeout(() => {
        if (Number(newV) > 99999) {
          this.competitionForm.price = 99999;
        }
        this.$forceUpdate();
      }, 300);
    },
    "competitionForm.limitNum"(newV) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!newV) return;
      this.timer = setTimeout(() => {
        this.competitionForm.limitNum = Math.floor(newV);
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
    "freeParams.sendTicketsNum"(newV) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      if (!newV) return;

      this.timer = setTimeout(() => {
        this.freeParams.sendTicketsNum = Math.floor(newV);
        this.$forceUpdate();
      }, 300);
    }
  },
  created() {
    this.rules = {
      //总价格
      price: [
        {
          required: true,
          message: t("user.priceEnter"),
          trigger: ["blur", "change"],
        },
        {
          validator: this.validatePrice,
          trigger: ["blur", "change"],
        }
      ],
      //天数
      limitDay: [
        {
          required: true,
          message: t("user.limitDayEnter"),
          trigger: ["blur", "change"],
        },
      ],
      // 票数
      limitNum: [
        {
          required: true,
          message: t("user.limitNumEnter"),
          trigger: ["blur", "change"],
        },
        {
          validator: this.validateTPrice,
          trigger: ["blur", "change"],
        },
      ],
    };

    this.fetchSetting();
  },
};
</script>
    
<style lang="scss" scoped>
@import "./createComponents.scss";
</style>

<style lang="scss">
.tips_box {
  width: 20rem !important;
}

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

  .el-select-dropdown__empty {
    font-size: 1rem;
    color: #a9a4b4;
  }
}
</style>