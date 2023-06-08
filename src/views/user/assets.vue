<template>
  <div>
    <div class="nft_box">
      <div class="nft_operating">
        <div class="title_text">NFTS IN INVENTORY</div>
        <div class="operating_btns">
          <div class="operating_item" @click="onDeposit()">DEPOSIT</div>
          <div class="operating_item" @click="onWithdraw()">WITHDRAW</div>
        </div>
      </div>
      <div class="nft_list">
        <div
          class="nft_item"
          v-for="(item, index) in stockNftList"
          :key="index"
        >
          <div class="img_box">
            <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
            <img :src="item.img" alt="" />
          </div>
          <div class="nft_name">{{ item.name }}</div>
          <div
            class="nft_btn view_nft"
            v-if="item.currentStatus == 'ONE_DOLLAR'"
            @click="viewNft(item)"
          >
            VIEW COMPETITIONS
          </div>
          <div
            class="nft_btn withdrawling"
            v-else-if="item.currentStatus == 'WITHDRAW'"
          >
            WITHDRAWLING
          </div>
          <div class="nft_btn create" @click="createCompetition(item)" v-else>
            CREATE COMPETITIONS
          </div>
        </div>
      </div>
    </div>
    <!-- 钱包链接弹窗 -->
    <wallet
      v-if="showLink"
      :dialogVisible="showLink"
      :title="title"
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
      <div class="create_title">Create competition</div>
      <div class="image_box">
        <img :src="competitionNft && competitionNft.img" alt="" />
      </div>
      <div class="nft_info">
        <div class="nft_name">{{ competitionNft && competitionNft.name }}</div>
        <div class="nft_id text-ellipsis">
          #{{ competitionNft && competitionNft.tokenId }}
        </div>
      </div>
      <el-tabs
        v-model="activeType"
        class="type_tabs"
        @tab-change="handleChange"
      >
        <el-tab-pane label="TIME LIMIT" name="LIMITED_TIME"></el-tab-pane>
        <el-tab-pane label="LIMIT PRICE" name="LIMITED_PRICE"></el-tab-pane>
      </el-tabs>
      <el-form
        ref="competitionForm"
        class="form_box"
        :rules="rules"
        :model="competitionForm"
        hide-required-asterisk
        label-position="top"
      >
        <el-form-item label="TOTAL PRICE" prop="price">
          <el-input v-model="competitionForm.price" type="number" min="0">
            <template #prefix>
              <img
                class="icon_eth"
                src="@/assets/svg/user/icon_eth.svg"
                alt=""
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="TOTAL ENTRIES"
          v-if="activeType == 'LIMITED_PRICE'"
        >
          <el-input
            readonly="readonly"
            class="disabled"
            v-model.number="limitNum"
            type="number"
            min="2"
          >
            <template #prefix>
              <img
                class="icon_eth"
                src="@/assets/svg/user/icon_tiket.svg"
                alt=""
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="DURATION"
          prop="limitDay"
          v-if="activeType == 'LIMITED_TIME'"
        >
          <div class="input_days">
            <el-input
              class="nft_type"
              v-model="competitionForm.limitDay"
              type="number"
              min="0"
              placeholder="Please enter a number from 1-30"
            >
            </el-input>
            <div class="days_text">DAY</div>
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
              {{ `${item} Days` }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="ENTRIES PRICE">
          <el-input
            readonly="readonly"
            class="disabled"
            v-model="competitionForm.ticketPrice"
            placeholder=""
          >
            <template #prefix>
              <img
                class="icon_eth"
                src="@/assets/svg/user/icon_eth.svg"
                alt=""
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="MAX DURATION"
          prop="limitDay"
          v-if="activeType == 'LIMITED_PRICE'"
        >
          <div class="input_days">
            <el-input
              class="nft_type"
              v-model="competitionForm.limitDay"
              type="number"
              min="0"
              placeholder="Please enter a number from 1-30"
            >
            </el-input>
            <div class="days_text">DAY</div>
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
              {{ `${item} Days` }}
            </div>
          </div>
        </el-form-item>
        <div class="continue_btn" @click="submitCompetition()">CONTINUE</div>
        <div class="hint-text" v-if="activeType == 'LIMITED_TIME'">
          <p>
            This mode cannot be cancelled once the contest starts, so please set
            the price reasonably to avoid losses.
          </p>
        </div>
        <div class="hint-text" v-else>
          <p>
            Please set a reasonable price, if you do not sell all tickets by the
            end of the sale time, the sale will fail and all participating users
            will be refunded automatically.
          </p>
          <p>
            Once a user has participated in the competition, it cannot be
            cancelled. Please make sure that the price you set is correct.
          </p>
        </div>
      </el-form>
    </el-dialog>
    <recharge
      v-if="rechargeDialog"
      :isDeposit="title === 'Deposit'"
      :dialogVisible="rechargeDialog"
      @closeDialogFun="handleClose"
    />
  </div>
</template>
<script>
import { addNftOrder, getSystemNft } from "@/services/api/oneBuy";

import { openUrl, timeFormat } from "@/utils";
import bigNumber from "bignumber.js";

import wallet from "../wallet/index.vue";
import recharge from "@/components/recharge/index.vue";

export default {
  name: "myWallet",
  components: {
    wallet,
    recharge,
  },
  data() {
    return {
      rechargeDialog: false,
      title: "Deposit",
      showLink: false, // 登录链上
      operatingType: 1, // 1 充NFT；2 提NFT；
      collections: [],
      chooseNftData: [],
      stockNftList: [],
      // 一元购创建
      showCompetition: false,
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
    };
  },
  watch: {
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
    // 总票数
    limitNum() {
      const { price, ticketPrice } = this.competitionForm;
      if (!price) return 0;
      const maxNum = Number(new bigNumber(price).dividedBy(ticketPrice));
      if (this.activeType == "LIMITED_TIME") return 0;
      return maxNum;
    },
  },
  methods: {
    timeFormat: timeFormat,
    bigNumber: bigNumber,
    onDeposit() {
      this.title = "Deposit";
      this.operatingType = 1;
      const awardItem = localStorage.getItem("awardItem");
      if (awardItem) {
        this.linkWallet();
      } else {
        this.showLink = true;
      }
    },
    linkWallet() {
      this.rechargeDialog = true;
    },
    onWithdraw() {
      this.title = "Withdraw";
      this.operatingType = 2;
      const awardItem = localStorage.getItem("awardItem");
      if (awardItem) {
        this.linkWallet();
      } else {
        this.showLink = true;
      }
    },
    // 获取系统Nft列表
    async fetchSystemNft() {
      const res = await getSystemNft({
        page: 1,
        size: 9999,
      });
      if (res && res.code == 200) {
        const stockNft = res.data.records;
        this.stockNftList = [];
        if (stockNft && !stockNft.length > 0) return;
        stockNft.forEach((element) => {
          if (!element.tokenId) return;
          this.stockNftList.push(element);
        });
      }
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
            this.$message.success("Created successfully");
            this.fetchSystemNft();
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
      this.params = {
        nftName: null,
        type: null,
        collections: null,
        wallet: null,
        chain: null,
      };

      this.chooseNftData = [];
      this.chooseNft = [];

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
      let routeData = this.$router.resolve({
        name: "NftTicketsInfo",
        query: { id: event.orderNumber },
      });
      openUrl(routeData.href);
    },
    // 选择类型
    handleChange(event) {
      console.log(event);
    },
  },
  created() {
    this.fetchSystemNft();
    this.rules = {
      //总价格
      price: [
        {
          required: true,
          message: "Please enter a price",
          trigger: ["blur", "change"],
        },
      ],
      //天数
      limitDay: [
        {
          required: true,
          message: "Please enter the number of days",
          trigger: ["blur", "change"],
        },
      ],
      //单份价值
      // ticketPrice: [{ required: true, message: "Please enter a single serving value", trigger: ["blur", "change"] }],
      //最大数量
      // limitNum: [{ required: true, message: "Please enter the total number of votes", trigger: ["blur", "change"] }],
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
