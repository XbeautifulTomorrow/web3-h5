<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="create_dialog"
      width="43.75rem"
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_com" v-if="!operatingType">
        <p class="create_com_title">SELECT ASSET</p>
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
      <div class="dialog_competitions" v-else>
        <div class="create_title">{{ $t("user.createCompetition") }}</div>
        <div class="image_box">
          <Image
            fit="cover"
            class="nft_img"
            v-if="operatingType == 'NFT'"
            :src="competitionNft?.img"
          />
          <Image
            fit="cover"
            class="nft_img"
            v-else
            :src="require('@/assets/svg/user/create_eth.webp')"
          />
        </div>
        <div class="nft_info" v-if="operatingType == 'NFT'">
          <div class="nft_name">{{ competitionNft?.name }}</div>
          <div class="nft_id text-ellipsis" v-if="competitionNft?.name.indexOf(competitionNft?.tokenId)==-1">#{{ competitionNft?.tokenId }}</div>
        </div>
        <div class="nft_info" v-else>
          <div class="nft_name">{{ operatingType }}</div>
        </div>
        <el-form
          ref="competitionForm"
          class="form_box"
          :rules="rules"
          :model="competitionForm"
          hide-required-asterisk
          label-position="top"
        >
          <div class="input_label">
            <p>
              {{
              operatingType == 'NFT'
                ? $t('user.setPrice')
                : $t('user.totalSupply')
            }}
            </p>
            <p class="balance_box" v-if="operatingType !== 'NFT'">
              {{ $t("user.available") }} {{ ethBalance.toFixed(4) + " ETH" }}
            </p>
          </div>
          <el-form-item
            label=""
            prop="price"
            class="total_price_box"
          >
            
            <div class="choose_price" v-if="operatingType == 'NFT'">
              <div
                class="price_item"
                @click="addPrice(competitionNft?.floorPrice)"
              >
                <span class="title">{{ $t("user.floorPrice") }}</span>
                <span class="val">
                  <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                  <span>{{ formatUSDT(competitionNft?.floorPrice) }}</span>
                </span>
              </div>
              <div class="price_item" @click="addPrice(historyPrice)">
                <span class="title">{{ $t("user.lastSale") }}</span>
                <span class="val">
                  <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                  <span>{{ formatUSDT(historyPrice) }}</span>
                </span>
              </div>
            </div>
            <el-input v-model="competitionForm.price" type="number" min="0">
              <template #prefix>
                <img
                  v-if="operatingType == 'NFT'"
                  class="icon_eth"
                  src="@/assets/svg/user/icon_usdt_gold.svg"
                  alt=""
                />
                <img
                  v-else
                  class="icon_eth"
                  src="@/assets/svg/user/coin/icon_eth.svg"
                  alt=""
                />
              </template>
              <template #append>
                <div v-if="operatingType == 'ETH'" class="convert_box">
                  {{
                    `~ ${new bigNumber(competitionForm.price || 0)
                      .multipliedBy(exchangeRate)
                      .toFixed(2)} USDT`
                  }}
                </div>
              </template>
            </el-input>
          </el-form-item>
          <!-- <div class="input_label">
            {{$t("user.setPrice")}}
          </div> -->
          <el-form-item
            label=""
            prop="usdtPrice"
            v-if="operatingType == 'ETH'"
          >
            <el-input v-model="competitionForm.usdtPrice" type="number" min="0">
              <template #prefix>
                <img
                  class="icon_eth"
                  src="@/assets/svg/user/icon_usdt_gold.svg"
                  alt=""
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form-item_wrap" :label="$t('user.entriesPrice')">
            <div class="num_item">
              <span>{{ Number(competitionForm.ticketPrice).toFixed(2) }}</span>
              <img
                class="icon_eth"
                src="@/assets/svg/user/icon_usdt_gold.svg"
                alt=""
              />
            </div>
          </el-form-item>
          <el-form-item class="form-item_wrap" :label="$t('user.totalEntries')">
            <div class="num_item">
              <span v-priceFormat="limitNum"></span>
              <img
                class="icon_eth"
                src="@/assets/svg/user/icon_tickets_num.svg"
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
              <span v-priceFormat="realIncome"></span>
              <img
                class="icon_eth"
                src="@/assets/svg/user/icon_usdt_gold.svg"
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
                <el-tooltip
                  popper-class="tips_box"
                  effect="dark"
                  placement="top"
                >
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
                :readonly="!inviteDrop.length > 0"
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
      </div>
      <el-dialog
        v-model="showChooseNft"
        :destroy-on-close="true"
        width="78.125rem"
        :append-to-body="true"
        :show-close="false"
        :align-center="true"
        :before-close="handleCloseChoose"
        :close-on-click-modal="false"
        class="public-dialog recharge-coin"
      >
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
            <el-input
              class="nft_input"
              @keyup.enter="fetchSystemNft()"
              v-model="params.nftName"
              clearable
              placeholder="Search NFTs"
            >
              <template #prefix>
                <el-icon
                  class="el-input__icon search_icon"
                  @click="fetchSystemNft()"
                >
                  <search />
                </el-icon>
              </template>
            </el-input>
            <div class="collections_box">
              <div class="collections_text">Collections:</div>
              <el-select
                v-model="params.collections"
                @change="fetchSystemNft"
                class="nft_type"
                placeholder="All"
                clearable
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="(item, index) in seriesDrop"
                  :key="index"
                  :label="item.seriesName"
                  :value="`${item.contractAddress}${
                    (Number(item.tokenId) > -1 && '+' + item.tokenId) || ''
                  }`"
                />
              </el-select>
            </div>
          </div>
          <div class="choose_nft" v-if="count > 0">
            <div
              class="choose_nft_item"
              v-for="(item, index) in stockNftList"
              :key="index"
            >
              <div class="img_box">
                <Image fit="cover" class="nft_img" :src="item.img" />
                <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
              </div>
              <div class="nft_name">{{ item.name || "--" }}</div>
              <div
                class="confirm_btn disabled"
                v-if="item.currentStatus == 'WITHDRAW'"
              >
                {{ $t("user.withdrawing") }}
              </div>
              <div
                class="confirm_btn disabled"
                v-else-if="item.currentStatus == 'ONE_DOLLAR'"
              >
                {{ $t("user.onSale") }}
              </div>
              <div
                class="confirm_btn disabled"
                v-else-if="item.isType != 'EXTERNAL'"
              >
                {{ $t("user.createCompetitions") }}
              </div>
              <div class="confirm_btn" v-else @click="handleChooseNft(item)">
                {{ $t("user.createCompetitions") }}
              </div>
            </div>
          </div>
          <div class="choose_nft" v-else>
            <div class="no_date">
              <div>
                <p>{{ $t("user.noDataNft") }}</p>
                <p class="deposit_btn" @click="showLink = true">DEPOSIT NFT</p>
              </div>
            </div>
            
          </div>
          <div class="pagination-box" v-if="count > size">
            <el-pagination
              v-model="page"
              :page-size="size"
              @current-change="handleCurrentChange"
              :pager-count="5"
              layout="prev, pager, next"
              :total="count"
              :prev-text="$t('common.prev')"
              :next-text="$t('common.next')"
            />
          </div>
        </div>
      </el-dialog>
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
              v-if="operatingType == 'ETH'"
              v-html="
                $t('user.createTips1', {
                  price: formatText(1),
                  coin: formatText(2),
                })
              "
            ></p>
            <p
              v-else
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
              v-if="operatingType == 'ETH'"
              v-html="
                $t('user.createTips3', {
                  price: formatText(1),
                  coin: formatText(2),
                })
              "
            ></p>
            <p
              v-else
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
            <span>{{ $t("user.createCode") }}</span>
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
    <!-- 钱包链接弹窗 -->
    <wallet
      v-if="showLink"
      :dialogVisible="showLink"
      @linkWallet="linkWallet"
      @closeDialogFun="showLink = false"
    />
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
  getServiceFee,
  getCofingKey,
} from "@/services/api/oneBuy";

import { rebatesCreateCode, rebatesFindList } from "@/services/api/invite";
import { getCacheTicker } from "@/services/api";

import Image from "@/components/imageView";
import wallet from "../../wallet/index";
import { i18n } from "@/locales";
import { accurateDecimal } from "@/utils";
const { t } = i18n.global;
export default {
  name: "modifyName",
  components: {
    Image,
    wallet
  },
  data() {
    return {
      show: true,
      operatingType: null,
      serverFees: 0,
      configK: {},
      activeType: "LIMITED_PRICE",
      competitionNft: null,
      competitionForm: {
        price: null, //价格
        usdtPrice: null, // usdt价格
        limitNum: null, // 总票数
        limitDay: null, //天数
        orderType: null, // 限时:LIMITED_TIME;限价:LIMITED_PRICE
        ticketPrice: 0.2, //单次价格
      },
      daysData: [1, 7, 14, 30],
      rules: {},
      historyPrice: null,

      // 选择nft
      showChooseNft: false,
      params: {
        nftName: null,
        type: "ERC721",
        collections: null,
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
        sendTicketsNum: null,
      },

      exchangeRate: null,
      showLink:false
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    // ethBalance() {
    //   const headerStore = useHeaderStore();
    //   return headerStore?.balance;
    // },
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.getCoinBalance('ETH');
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
      const {
        operatingType,
        competitionForm: { price, usdtPrice, ticketPrice },
      } = this;

      if (operatingType == "NFT" && !price) return 0;
      if (operatingType == "ETH" && !usdtPrice) return 0;

      let maxNum = 0;
      if (this.operatingType == "NFT") {
        maxNum = Number(new bigNumber(price || 0).dividedBy(ticketPrice));
      } else {
        maxNum = Number(new bigNumber(usdtPrice || 0).dividedBy(ticketPrice));
      }
      if (this.activeType == "LIMITED_TIME") return 0;
      return maxNum;
    },
    // 实际收益
    realIncome() {
      const {
        operatingType,
        competitionForm: { price, usdtPrice },
        serverFees,
      } = this;
      if (operatingType != "NFT") {
        if (!usdtPrice || !serverFees) return 0;
        const feeNum = new bigNumber(usdtPrice).multipliedBy(serverFees);

        return new bigNumber(usdtPrice).minus(feeNum);
      } else {
        if (!price || !serverFees) return 0;
        const feeNum = new bigNumber(price).multipliedBy(serverFees);

        return new bigNumber(price).minus(feeNum);
      }
    },
  },
  methods: {
    bigNumber: bigNumber,
    linkWallet() {
      this.showNftOperating = true;
    },
    onConfirm() {
      this.$emit("closeDialogFun");
    },
    /**
     * @description: 格式化地址
     */
    handleChoose(event) {
      const { configK } = this;
      if (event == "NFT") {
        this.fetchExternalSeries();
        this.fetchSystemNft();
        this.showChooseNft = true;
        this.daysData = [1, 7, 14, configK?.ONE_NFT_LIMIT_DAY || 30];
      } else {
        this.operatingType = event;
        this.daysData = [1, 7, 14, configK?.ONE_ETH_LIMIT_DAY || 30];
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
        currentStatus: "DRAWN",
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

      const collections =
        (this.params.collections && this.params.collections.split("+")) || [];

      const res = await getSystemNft({
        contractType: this.params.type,
        contractAddress: collections[0],
        keyword: this.params.nftName,
        tokenId: (collections[1] && collections[1]) || undefined,
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
        type: "ALL",
      });

      this.collections = res.data;
    },
    findExternalSeries(event) {
      const { collections } = this;
      return collections.findIndex((e) => e.contractAddress == event) > -1;
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
            if (Number(this.competitionForm.usdtPrice) < 0.1) {
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

          if (this.operatingType == "NFT") {
            if (Number(this.competitionForm.price) < 0.1) {
              this.$message.error(t("user.priceError"));
              return;
            }
          } else {
            if (Number(this.competitionForm.usdtPrice) < 0.1) {
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

          let ruleForm = {
            ...this.competitionForm,
            limitNum: this.limitNum,
            orderType:
              this.operatingType == "NFT" ? activeType : "LIMITED_PRICE_COIN",
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
        return;
      } else if (inviteCode.length < 3) {
        this.inviteTips = t("user.enterCodeError2");
        this.verifys = false;
        return;
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
    // 获取配置
    async fetchCofingKey() {
      const res = await getCofingKey({
        str: `ONE_ETH_LIMIT_PREMIUM,ONE_ETH_LIMIT_DAY,ONE_NFT_LIMIT_DAY`,
      });

      if (res && res.code == 200) {
        const configKey = res.data;
        let config = {};

        configKey.forEach((element) => {
          config[element.k] = element.v;
        });

        this.configK = config;
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
      const { operatingType } = this;
      if (value === "") {
        callback(new Error(t("user.priceEnter")));
      } else if (
        value &&
        operatingType == "ETH" &&
        Number(value) > Number(this.ethBalance)
      ) {
        callback(new Error(t("user.enterError4")));
      } else {
        callback();
      }
    },
    validateTPrice(rule, value, callback) {
      const {
        competitionForm: { price },
        configK,
        exchangeRate,
      } = this;
      if (!price) {
        callback();
      } else if (value === "") {
        callback(new Error(t("user.limitNumEnter")));
      } else if (
        value &&
        Number(value) / Number(exchangeRate || 0) >
          Number(price) * Number(configK?.ONE_ETH_LIMIT_PREMIUM || 0)
      ) {
        callback(
          new Error(
            t("user.ticketsHint", {
              ratio: `${new bigNumber(
                configK?.ONE_ETH_LIMIT_PREMIUM || 0
              ).multipliedBy(100)}%`,
            })
          )
        );
      } else {
        callback();
      }
    },
    priceVerify() {
      const {
        operatingType,
        competitionNft,
        competitionForm: { price, ticketPrice, usdtPrice },
        limitNum,
      } = this;
      if (operatingType == "NFT") {
        return (
          Number(limitNum * ticketPrice) > Number(competitionNft?.floorPrice)
        );
      } else {
        const nftPrice = new bigNumber(price).multipliedBy(this.exchangeRate);
        return Number(usdtPrice) >= Number(nftPrice);
      }
    },
    // ETH确认
    formatText(event) {
      if (this.operatingType == "NFT") {
        if (event == 1) {
          return `<img style='display: inline-block; width: 1rem;height: auto;vertical-align: top;' src="${require("@/assets/svg/user/icon_usdt_gold.svg")}" /> <span style='line-height: 0.8;'>${Number(
            accurateDecimal(this.competitionForm?.price || 0, 2)
          ).toLocaleString()}</span>`;
        } else if (event == 2) {
          const { competitionNft, formatSeries } = this;
          return formatSeries(competitionNft)
            ? `${competitionNft?.name} #${competitionNft?.tokenId}`
            : `${competitionNft?.name}`;
        } else {
          return `<img style='display: inline-block; width: 1rem;height: auto;vertical-align: top;' src="${require("@/assets/svg/user/icon_usdt_gold.svg")}" /> <span style='line-height: 1;'>${Number(
            accurateDecimal(this.competitionNft?.floorPrice || 0, 2)
          ).toLocaleString()}</span>`;
        }
      } else {
        if (event == 1) {
          return `<img style='display: inline-block;width: 1rem;height: auto;vertical-align: top;' src="${require("@/assets/svg/user/icon_usdt_gold.svg")}" /> <span style='line-height: 0.8;'>${Number(
            accurateDecimal(this.competitionForm.usdtPrice || 0, 2)
          ).toLocaleString()}</span>`;
        } else {
          return `<img  style='display: inline-block;width: 1rem;height: auto;vertical-align: top;' src="${require("@/assets/svg/user/coin/icon_eth.svg")}" /> <span style='line-height: 0.8;'>${Number(
            accurateDecimal(this.competitionForm.price || 0, 2)
          ).toLocaleString()}</span>`;
        }
      }
    },
    formatSeries(event) {
      if (!event) return false;
      const { name, tokenId } = event;
      if (!name || !tokenId) return false;
      const isShow = name.indexOf(tokenId) > -1;
      return !isShow;
    },
    handleCurrentChange(event) {
      this.page = event;
      this.fetchSystemNft(false);
    },
    // 预置价格
    addPrice(event) {
      this.competitionForm.price = Number(event).toFixed(0);
    },
    // u取整换算
    formatUSDT(event) {
      if (!event) return "--";
      const price = Number(event).toFixed(0);
      return Number(price).toLocaleString();
    },
    // 提款汇率
    async fetchCacheTicker() {
      const res = await getCacheTicker({
        areaCoin: "ETH",
        coinName: "USDT",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
      }
    },
  },
  watch: {
    "competitionForm.price"(newV) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!newV) return;

      const { operatingType } = this;
      this.timer = setTimeout(() => {
        if (operatingType == "ETH" && Number(newV) > 99999) {
          this.competitionForm.price = 99999;
        } else if (operatingType == "NFT" && Number(newV) > 999999999) {
          this.competitionForm.price = 999999999;
        } else if (operatingType == "NFT") {
          this.competitionForm.price = Math.floor(newV);
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
      const { operatingType, configK } = this;
      let max = 30;
      if (operatingType == "NFT") {
        max = configK?.ONE_NFT_LIMIT_DAY || 30;
      } else {
        max = configK?.ONE_ETH_LIMIT_DAY || 30;
      }
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
    },
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
      // usdt价格
      usdtPrice: [
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
    this.fetchCacheTicker();
    this.fetchCofingKey();
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