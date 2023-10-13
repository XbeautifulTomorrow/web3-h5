<template>
  <div :class="['my_inventory_wrapper', !count > 0 && 'no_data_bg']">
    <div class="nft_box">
      <div class="nft_operating">
        <div class="title_text">
          <img src="@/assets/svg/user/icon_inventory.svg" alt="" />
          <span>{{ $t("user.inventory") }}</span>
        </div>
        <div class="operating_btns">
          <div class="operating_item" @click="onDeposit()">
            {{ $t("user.deposit") }}
          </div>
          <div class="operating_item" @click="onWithdraw()">
            {{ $t("user.withdraw") }}
          </div>
        </div>
      </div>
      <div class="search_box">
        <el-input
          class="nft_input"
          v-model="nftParams.nftName"
          clearable
          @keyup.enter="fetchSystemNft()"
          :placeholder="$t('homeReplenish.searchNft')"
        >
          <template #prefix>
            <el-icon class="el-input__icon" @click="fetchSystemNft()">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="collections_box type_box">
          <div class="collections_text">{{ $t("homeReplenish.type") }}</div>
          <el-select
            v-model="nftParams.type"
            @change="fetchSystemNft()"
            class="nft_type"
            clearable
            :placeholder="$t('homeReplenish.all')"
          >
            <el-option
              v-for="(item, index) in nftTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="collections_box">
          <div class="collections_text">
            {{ $t("homeReplenish.sortCollections") }}
          </div>
          <el-select
            v-model="nftParams.collections"
            @change="fetchSystemNft()"
            class="nft_type"
            :placeholder="$t('homeReplenish.all')"
            clearable
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(item, index) in collections"
              :key="index"
              :label="item.seriesName"
              :value="`${item.contractAddress}${
                (Number(item.tokenId) > -1 && '+' + item.tokenId) || ''
              }`"
            />
          </el-select>
        </div>
      </div>
      <div class="nft_list" v-if="count > 0">
        <div
          class="nft_item"
          v-for="(item, index) in stockNftList"
          @click="viewNft(item)"
          :key="index"
        >
          <div class="img_box">
            <div class="tips text-ellipsis" v-if="item.isType == 'EXTERNAL'">
              {{ `#${item.tokenId}` }}
            </div>
            <div class="new_dot" v-if="item.redDotStatus == 'FALSE'"></div>
            <Image fit="cover" class="nft_img" :src="item.img" />
          </div>
          <div class="nft_name">{{ item.name || "--" }}</div>
          <div
            class="nft_btn view_nft"
            v-if="item.currentStatus == 'ONE_DOLLAR'"
          >
            {{ $t("user.viewCompetitions") }}
          </div>
          <div
            class="nft_btn withdrawling"
            v-else-if="item.currentStatus == 'WITHDRAW'"
          >
            {{ $t("user.withdrawing") }}
          </div>
          <div
            class="nft_btn withdrawling"
            v-else-if="item.isType != 'EXTERNAL'"
          >
            {{ $t("user.createCompetitions") }}
          </div>
          <div class="nft_btn create" @click="createCompetition(item)" v-else>
            {{ $t("user.createCompetitions") }}
          </div>
        </div>
      </div>
      <div v-else class="no_date">
        <span>{{ $t("user.noDataNft") }}</span>
      </div>
      <div class="pagination-box" v-if="count > size">
        <el-pagination
          v-model="page"
          :page-size="size"
          @current-change="handleCurrentChange"
          :pager-count="7"
          layout="prev, pager, next"
          :total="count"
          :prev-text="$t('common.prev')"
          :next-text="$t('common.next')"
        />
      </div>
    </div>
    <!-- 钱包链接弹窗 -->
    <wallet
      v-if="showLink"
      :dialogVisible="showLink"
      @linkWallet="linkWallet"
      @closeDialogFun="handleClose"
    />

    <!-- 创建一元购弹窗 -->
    <el-dialog
      v-model="showCompetition"
      width="43.75rem"
      lock-scroll
      class="dialog_competition"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_title">{{ $t("user.createCompetition") }}</div>
      <div class="image_box">
        <Image fit="cover" class="nft_img" :src="competitionNft?.img" />
      </div>
      <div class="nft_info">
        <div class="nft_name">{{ competitionNft?.name }}</div>
        <div class="nft_id text-ellipsis">#{{ competitionNft?.tokenId }}</div>
      </div>
      <el-form
        ref="competitionForm"
        class="form_box"
        :rules="rules"
        :model="competitionForm"
        hide-required-asterisk
        label-position="top"
      >
        <el-form-item :label="$t('user.totalPrice')" prop="price">
          <div class="choose_price">
            <div
              class="price_item"
              @click="competitionForm.price = competitionNft?.floorPrice"
            >
              <span class="title">Floor Price</span>
              <span class="val"
                >{{
                  competitionNft.floorPrice
                    ? `${competitionNft?.floorPrice} ETH`
                    : "--"
                }}
              </span>
            </div>
            <div
              class="price_item"
              @click="competitionForm.price = historyPrice"
            >
              <span class="title">Last Sale</span>
              <span class="val"
                >{{ historyPrice ? `${historyPrice} ETH` : "--" }}
              </span>
            </div>
          </div>
          <el-input v-model="competitionForm.price" type="number" min="0">
            <template #prefix>
              <img
                class="icon_eth"
                src="@/assets/svg/user/icon_ethereum.svg"
                alt=""
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item_wrap" :label="$t('user.entriesPrice')">
          <div class="num_item">
            <span>{{ competitionForm.ticketPrice }}</span>
            <img
              class="icon_eth"
              src="@/assets/svg/user/icon_ethereum.svg"
              alt=""
            />
          </div>
        </el-form-item>
        <el-form-item class="form-item_wrap" :label="$t('user.feeRate')">
          <div class="num_item">
            <span
              >{{
                new bigNumber(serverFees).multipliedBy(100).toFixed(2)
              }}%</span
            >
          </div>
        </el-form-item>
        <el-form-item class="form-item_wrap" :label="$t('user.realIncome')">
          <div class="num_item">
            <span>{{ realIncome }}</span>
            <img
              class="icon_eth"
              src="@/assets/svg/user/icon_ethereum.svg"
              alt=""
            />
          </div>
        </el-form-item>
        <el-form-item :label="$t('user.maxDuration')" prop="limitDay">
          <div class="input_days">
            <el-input
              class="nft_type"
              v-model="competitionForm.limitDay"
              type="number"
              min="0"
              :placeholder="$t('user.enterTimeHint')"
            >
            </el-input>
            <div class="days_text" v-if="competitionForm.limitDay > 1">
              {{ $t("user.days") }}
            </div>
            <div class="days_text" v-else>{{ $t("user.day") }}</div>
          </div>
          <div class="choose_days">
            <div
              class="choose_days_item"
              v-for="(item, index) in daysData"
              :key="index"
              :class="[
                'choose_days_item',
                competitionForm.limitDay == item && 'active',
              ]"
              @click="competitionForm.limitDay = item"
            >
              <span v-if="item > 1">{{
                $t("user.numDays", { num: item })
              }}</span>
              <span v-else>{{ $t("user.numDay", { num: item }) }}</span>
            </div>
          </div>
        </el-form-item>
        <div class="share_box">
          <div class="form-rember">
            <span class="form-rember-rectangle" @click="showRememberFun()">
              <span
                v-show="freeParams.isOpen"
                class="form-rember-rectangle-fill"
              ></span>
            </span>
            <span class="form-rember-text">
              <span>{{ $t("user.tweetText") }}</span>
              <el-tooltip popper-class="tips_box" effect="dark" placement="top">
                <template #content>
                  <p>{{ $t("user.tweetHint1") }}</p>
                  <br />
                  <p>{{ $t("user.tweetHint2") }}</p>
                </template>
                <img src="@/assets/svg/user/icon_help.svg" alt="" />
              </el-tooltip>
            </span>
          </div>
          <div class="invitation_box" v-if="freeParams.isOpen">
            <el-select
              @click="showCreate()"
              :disabled="!inviteDrop.length > 0"
              v-model="freeParams.inviteCode"
              class="invite_select"
              :placeholder="$t('user.chooseCodeHint')"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="(item, index) in inviteDrop"
                :key="index"
                :label="item.inviteCode"
                :value="item.inviteCode"
              />
            </el-select>
            <el-input
              class="invite_select tickets_num"
              v-model="freeParams.sendTicketsNum"
              type="number"
              min="0"
              :placeholder="$t('user.freeNumHint')"
            >
            </el-input>
          </div>
        </div>
        <div class="continue_btn" @click="confirmCop()">
          {{ $t("user.create") }}
        </div>
        <div class="hint-text" v-if="activeType == 'LIMITED_TIME'">
          <p>{{ $t("user.createHint1") }}</p>
        </div>
        <div class="hint-text" v-else>
          <p>{{ $t("user.createHint2") }}</p>
          <p>{{ $t("user.createHint3") }}</p>
        </div>
      </el-form>
      <el-dialog
        v-model="showTips"
        destroy-on-close
        :close-on-click-modal="false"
        :show-close="false"
        :align-center="true"
        class="public-dialog"
        :append-to-body="true"
        width="43.75rem"
        :before-close="
          () => {
            showTips = false;
          }
        "
      >
        <template #header="{ close }">
          <div
            class="close_btn"
            v-on="{
              click: [
                close,
                () => {
                  showTips = false;
                },
              ],
            }"
          >
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
            <p
              v-html="
                $t('user.createTips2', {
                  price: formatText(1),
                  nft: formatText(2),
                  floorPrice: formatText(3),
                })
              "
            ></p>
          </div>
          <div class="tips_panel" v-else>
            <p
              v-html="
                $t('user.createTips4', {
                  price: formatText(1),
                  nft: formatText(2),
                })
              "
            ></p>
          </div>
          <div class="btn_box">
            <el-button
              class="public-button cancel-button"
              @click="showTips = false"
            >
              {{ $t("common.cancelUpper") }}
            </el-button>
            <el-button
              class="public-button form-button"
              @click="submitCompetition()"
            >
              {{ $t("airdrop.confirm") }}
            </el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        v-model="showInvite"
        destroy-on-close
        :close-on-click-modal="false"
        :show-close="false"
        :align-center="true"
        class="public-dialog"
        :append-to-body="true"
        width="43.75rem"
        :before-close="inviteClose"
      >
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
            <el-input
              class="invite_code_input"
              v-model="inviteCode"
              @blur="onVerify()"
              clearable
              :placeholder="$t('user.createEnterHint')"
            >
            </el-input>
            <div class="create_error">{{ inviteTips }}</div>
          </div>
          <div class="btn_box">
            <el-button
              class="public-button cancel-button"
              @click="inviteClose()"
            >
              {{ $t("common.cancelUpper") }}
            </el-button>
            <el-button
              class="public-button form-button"
              @click="createInvite()"
            >
              {{ $t("user.create") }}
            </el-button>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
    <nft-list
      v-if="showNftOperating"
      :isDeposit="operatingType === 1"
      @closeDialogFun="handleClose()"
    />
  </div>
</template>
<script>
import bigNumber from "bignumber.js";
import { mapStores } from "pinia";
import { i18n } from "@/locales";
const { t } = i18n.global;

import { useHeaderStore } from "@/store/header.js";
import { useWalletStore } from "@/store/wallet";
import {
  addNftOrder,
  getSystemNft,
  getTheExternalNFTSeries,
  delNewWalletNftMark,
  getNftActivityCharts,
  getServiceFee,
  getCofingKey,
} from "@/services/api/oneBuy";

import { rebatesCreateCode, rebatesFindList } from "@/services/api/invite";

import { openUrl, timeFormat } from "@/utils";

import { useUserStore } from "@/store/user.js";

import wallet from "../wallet/index.vue";
import Image from "@/components/imageView";
import nftList from "@/components/recharge/nftList.vue";

export default {
  name: "myInventory",
  components: {
    wallet,
    nftList,
    Image,
  },
  data() {
    return {
      title: "DEPOSIT",
      showLink: false, // 登录链上
      operatingType: 1, // 1 充NFT；2 提NFT；
      nftParams: {
        nftName: null,
        type: null,
        collections: null,
      },
      nftTypes: [
        { label: "ERC-721", value: "ERC721" },
        { label: "ERC-1155", value: "ERC1155" },
      ],
      collections: [],
      stockNftList: [],

      // 一元购创建
      showCompetition: false,
      showTips: false,
      nftIndex: null, // 需要记录索引来即时更改列表
      activeType: "LIMITED_PRICE",
      competitionNft: null,
      serverFees: 0, // 服务费
      configK: {}, // 配置
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

      showNftOperating: false,
      historyPrice: null,

      showInvite: false,
      inviteDrop: [],
      inviteCode: null,
      inviteTips: null,
      verifys: null,
      freeParams: {
        isOpen: false,
        inviteCode: null,
        sendTicketsNum: null,
      },
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
        if (Number(newV) > 99999) {
          this.competitionForm.price = 99999;
        }
        this.$forceUpdate();
      }, 300);
    },
    "competitionForm.limitDay"(newV) {
      const { configK } = this;
      const max = configK?.ONE_NFT_LIMIT_DAY || 30;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!newV) return;
      this.timer = setTimeout(() => {
        if (newV > max) {
          this.competitionForm.limitDay = max;
        } else {
          this.competitionForm.limitDay = Math.floor(newV);
        }
        this.$forceUpdate();
      }, 300);
    },
  },
  computed: {
    ...mapStores(useUserStore, useWalletStore, useHeaderStore),
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
    },
    // 实际收益
    realIncome() {
      const { competitionForm, serverFees } = this;
      if (!competitionForm.price || !serverFees) return 0;
      const feeNum = new bigNumber(competitionForm.price).multipliedBy(
        serverFees
      );

      return new bigNumber(competitionForm.price).minus(feeNum);
    },
  },
  methods: {
    timeFormat: timeFormat,
    bigNumber: bigNumber,
    onDeposit() {
      this.operatingType = 1;
      this.showLink = true;
    },
    linkWallet() {
      this.showNftOperating = true;
    },
    onWithdraw() {
      this.operatingType = 2;
      this.showNftOperating = true;
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

      const collections =
        (nftParams.collections && nftParams.collections.split("+")) || [];

      const res = await getSystemNft({
        contractType: nftParams.type,
        contractAddress: collections[0],
        keyword: nftParams.nftName,
        tokenId: (collections[1] && collections[1]) || undefined,
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

        await delNewWalletNftMark();
        const headerStore = useHeaderStore();
        headerStore.fetchGlobalNew();
      }
    },
    // 一元购历史折线图
    async fetchNftActivitySale(event) {
      let res = await getNftActivityCharts({
        contractAddress: event.tokenAddress,
        tokenId: event.tokenId,
        page: 1,
        size: 100,
        currentStatus: "DRAWN",
      });

      if (res && res.code == 200) {
        if (res.data.records.length > 0) {
          this.historyPrice = res.data.records[0].price;
        }
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
        type: "ALL",
      });
      this.collections = res.data;
    },
    // 获取外部系列
    async fetchExternalSeries() {
      const res = await getTheExternalNFTSeries({
        type: "EXTERNAL",
      });
      this.externalSeries = res.data;
      this.fetchSystemNft();
    },
    findExternalSeries(event) {
      const { externalSeries } = this;
      return externalSeries?.findIndex((e) => e.contractAddress == event) > -1;
    },
    // 弹出创建弹出
    createCompetition(event) {
      this.competitionNft = event;
      this.showCompetition = true;
      this.fetchNftActivitySale(event);
      this.fetchRebatesFindList();
      this.fetchSetting();
      this.fetchCofingKey();
    },
    // 确认弹窗
    confirmCop() {
      this.$refs.competitionForm.validate(async (valid) => {
        if (valid) {
          const { freeParams } = this;

          if (this.operatingType == "NFT") {
            if (Number(this.competitionForm.price) < 0.1) {
              this.$message.error(t("user.priceError"));
              return;
            }
          } else {
            if (Number(this.totalPrice) < 0.1) {
              this.$message.error(t("user.priceError"));
              return;
            }
          }

          if (freeParams.isOpen) {
            if (!freeParams.inviteCode) {
              this.$message.error(t("user.freeInviteCodeEnter"));
              return;
            }

            if (
              !freeParams.sendTicketsNum ||
              !Number(freeParams.sendTicketsNum) > 0
            ) {
              this.$message.error(t("user.freeTicketsEnter"));
              return;
            }
          }

          this.showTips = true;
        }
      });
    },
    // 创建一元购赛事
    submitCompetition() {
      this.$refs.competitionForm.validate(async (valid) => {
        if (valid) {
          const { activeType, competitionNft, freeParams } = this;

          if (Number(this.competitionForm.price) < 0.1) {
            this.$message.error(t("user.priceError"));
            return;
          }

          if (freeParams.isOpen) {
            if (!freeParams.inviteCode) {
              this.$message.error(t("user.freeInviteCodeEnter"));
              return;
            }

            if (
              !freeParams.sendTicketsNum ||
              !Number(freeParams.sendTicketsNum) > 0
            ) {
              this.$message.error(t("user.freeTicketsEnter"));
              return;
            }
          }

          let ruleForm = {
            ...this.competitionForm,
            limitNum: this.limitNum,
            orderType: activeType,
            contractAddress: competitionNft.tokenAddress, //合约地址
            tokenId: competitionNft.tokenId, //nftId
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
    priceVerify() {
      const {
        competitionNft,
        competitionForm: { ticketPrice },
        limitNum,
      } = this;
      return (
        Number(limitNum * ticketPrice) >=
        Number(competitionNft?.floorPrice || 0)
      );
    },
    // 确认文本更新
    formatText(event) {
      if (event == 1) {
        return `<img style='display: inline-block; width: 1rem;height: auto;vertical-align: top;' src="${require("@/assets/svg/user/icon_ethereum.svg")}" /> <span style='line-height: 0.8;'>${
          this.competitionForm?.price || 0
        }</span>`;
      } else if (event == 2) {
        const { competitionNft, formatSeries } = this;
        return formatSeries(competitionNft)
          ? `${competitionNft?.name} #${competitionNft?.tokenId}`
          : `${competitionNft?.name}`;
      } else {
        return `<img style='display: inline-block; width: 1rem;height: auto;vertical-align: top;' src="${require("@/assets/svg/user/icon_ethereum.svg")}" /> <span style='line-height: 1;'>${
          this.competitionNft?.floorPrice || 0
        }</span>`;
      }
    },
    formatSeries(event) {
      if (!event) return false;
      const { name, tokenId } = event;
      if (!name || !tokenId) return false;
      const isShow = name.indexOf(tokenId) > -1;
      return !isShow;
    },
    // 验证
    onVerify() {
      const { inviteCode } = this;
      if (!inviteCode) {
        this.inviteTips = t("user.enterCodeError1");
        this.verifys = false;
        return;
      } else if (inviteCode.length < 3) {
        this.inviteTips = t("user.enterCodeError2");
        this.verifys = false;
        return;
      }

      this.inviteTips = "";
      this.verifys = true;
    },
    showRememberFun() {
      this.freeParams.isOpen = !this.freeParams.isOpen;
    },
    // 打开创建弹窗
    showCreate() {
      if (this.inviteDrop.length > 0) return;
      this.showInvite = true;
    },
    // 创建邀请吗
    async createInvite() {
      this.onVerify();
      if (!this.verifys) return;
      const res = await rebatesCreateCode({
        code: this.inviteCode,
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
        size: 20,
      });
      if (res && res.code == 200) {
        this.inviteDrop = res.data;
        this.inviteDrop.forEach((element) => {
          if (element.defaultStatus == "TRUE") {
            this.freeParams.inviteCode = element.inviteCode;
          }
        });
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
    // 获取配置
    async fetchCofingKey() {
      const res = await getCofingKey({
        str: `ONE_NFT_LIMIT_DAY`,
      });

      if (res && res.code == 200) {
        const configKey = res.data;
        let config = {};

        configKey.forEach((element) => {
          config[element.k] = element.v;
        });

        this.configK = config;

        this.daysData = [1, 7, 14, this.configK?.ONE_NFT_LIMIT_DAY || 30];
      }
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
        collections: null,
      };

      if (this.$refs["competitionForm"]) {
        this.$refs["competitionForm"].resetFields();
      }

      this.fetchSystemNft(false);
      this.$forceUpdate();

      if (done) {
        done();
        return;
      }

      this.showCompetition = false;
      this.showReplenish = false;
      this.showLink = false;
      this.showRecharge = false;
      this.showNftOperating = false;

      this.freeParams.isOpen = false;
      this.freeParams.sendTicketsNum = null;
    },
    // 关闭邀请码创建弹窗
    inviteClose() {
      this.inviteCode = null;
      this.showInvite = false;
    },
    // 查看赛事
    viewNft(event) {
      if (event.currentStatus != "ONE_DOLLAR") return;

      let routeData = this.$router.resolve({
        name: "FreeNFT",
        query: { id: event.orderNumber },
      });
      openUrl(routeData.href);
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchAllSeries();
      this.fetchExternalSeries();
      this.fetchRebatesFindList();
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
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./components/inventory.scss";
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

  .el-select-dropdown__empty {
    font-size: 1rem;
    color: #a9a4b4;
  }
}
</style>
