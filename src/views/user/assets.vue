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
        <div class="nft_item" v-for="(item, index) in stockNftList" :key="index">
          <div class="img_box">
            <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
            <img :src="item.img" alt="">
          </div>
          <div class="nft_name">{{ item.name }}</div>
          <div class="create_btn" @click="createCompetition(item)" v-if="!item.orderNumber">
            <span class="create_text">CREATE COMPETITIONS</span>
          </div>
          <div class="view_nft" v-else @click="viewNft(item)">VIEW COMPETITIONS</div>
        </div>
      </div>
    </div>
    <!-- 钱包链接弹窗 -->
    <el-dialog v-model="showLink" width="43.75rem" lock-scroll :close-on-click-modal="false" :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span v-if="operatingType == 1">Deposit NFT'S</span>
          <span v-else>Withdraw NFT’S</span>
        </div>
        <div class="operating_tips">Choose a wallet connection method</div>
        <div class="operating_item" @click="linkWallet()">
          <div class="item_l">
            <img src="@/assets/svg/user/meta_mask.svg" alt="" srcset="">
            <span>MetaMask</span>
          </div>
          <img src="@/assets/svg/user/icon_arrow.svg" alt="" srcset="">
        </div>
        <div class="operating_item" @click="linkWallet()">
          <div class="item_l">
            <img src="@/assets/svg/user/wallet_connect.svg" alt="" srcset="">
            <span>WalletConnect</span>
          </div>
          <img src="@/assets/svg/user/icon_arrow.svg" alt="" srcset="">
        </div>
      </div>
    </el-dialog>
    <!-- 提现充值NFT弹窗 -->
    <el-dialog v-model="showInventory" width="78.125rem" lock-scroll :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="operating_title">
        <span v-if="operatingType == 1">Deposit NFT'S</span>
        <span v-else>Withdraw NFT’S</span>
      </div>
      <div class="operating_tips" v-if="operatingType == 1">Choose a wallet connection method</div>
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
            <img src="" alt="">
            <span>
              Ensure you've selected the same network for both withdrawal and deposit. Please check if the
              depositing
              platform supports the selected network; otherwise, you may lose your assets.
            </span>
          </div>
        </div>
        <div class="condition_item">
          <div class="withdraw_tpis">
            Please enter the ERC20 wallet address you wish to receive the NFT'S on. Once confirmed,
            the withdrawal is usually processed within a few minutes.
          </div>
          <div class="condition_label">
            <span>RECEIVING NFT'S ADDRESS</span>
            <span class="required">*</span>
          </div>
          <el-input class="wallet_input" v-model="params.wallet" placeholder="Paste your ERC20 wallet address here">
          </el-input>
        </div>
      </div>
      <div class="choose_panel">
        <div class="search_box">
          <el-input class="nft_input" v-model="params.nftName" placeholder="Search NFT TokenId">
            <template #prefix>
              <el-icon class="el-input__icon search_icon">
                <search />
              </el-icon>
            </template>
          </el-input>
          <div class="collections_box type_box">
            <div class="collections_text">Type:</div>
            <el-select v-model="params.type" class="nft_type" clearable placeholder="All">
              <el-option v-for="item in nftTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="collections_box">
            <div class="collections_text">Collections:</div>
            <el-select v-model="params.collections" class="nft_type" placeholder="All" clearable
              :popper-append-to-body="false">
              <el-option v-for="item in collections" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <c-scrollbar class="choose_nft" width="100%" height="69.8125rem">
          <div class="choose_nft">
            <div class="choose_nft_item" :class="[nftFind(item.id) > -1 && 'active']" @click="chooseNfts(item)"
              v-for="(item, index) in chooseNftList" :key="index">
              <div class="img_box">
                <img :src="item.img" alt="" />
                <div class="tips text-ellipsis">{{ `#${item.tokenId}` }}</div>
              </div>
              <div class="nft_name">{{ item.name }}</div>
              <div class="mask_box">
                <img src="@/assets/svg/user/icon_selected.svg" alt="">
              </div>
            </div>
          </div>
        </c-scrollbar>
      </div>
      <div v-if="operatingType == 1" class="confirm_btn">
        <span>{{ `DEPOSIT ${chooseNft.length} NFTs` }}</span>
      </div>
      <div v-else class="confirm_btn" @click="onWithdrawalNft()">
        <span>{{ `WITHDRAW ${chooseNft.length} NFTs` }}</span>
      </div>
      <div class="valuable_text">{{ `Withdrawal fee of ${calculatedNftValue} ETH applies.` }}</div>
    </el-dialog>
    <!-- 创建一元购弹窗 -->
    <el-dialog v-model="showCompetition" width="43.75rem" lock-scroll class="dialog_competition"
      :close-on-click-modal="false" :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_title">Create competition</div>
      <div class="image_box">
        <img :src="competitionNft && competitionNft.img" alt="">
      </div>
      <div class="nft_info">
        <div class="nft_name">{{ competitionNft && competitionNft.name }}</div>
        <div class="nft_id">#{{ competitionNft && competitionNft.tokenId }}</div>
      </div>
      <el-tabs v-model="activeType" class="type_tabs" @tab-change="handleChange">
        <el-tab-pane label="TIME LIMIT" name="LIMITED_TIME"></el-tab-pane>
        <el-tab-pane label="LIMIT PRICE" name="LIMITED_PRICE"></el-tab-pane>
      </el-tabs>
      <el-form ref="competitionForm" class="form_box" :rules="rules" :model="competitionForm" hide-required-asterisk
        label-position="top">
        <el-form-item label="TOTAL PRICE" prop="price">
          <el-input v-model="competitionForm.price" type="number" min="0">
            <template #prefix>
              <img class="icon_eth" src="@/assets/svg/user/icon_eth.svg" alt="">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="TOTAL ENTRIES" v-if="activeType == 'LIMITED_PRICE'">
          <el-input readonly="readonly" v-model.number="limitNum" type="number" min="2"></el-input>
        </el-form-item>
        <el-form-item label="DURATION" prop="limitDay" v-if="activeType == 'LIMITED_TIME'">
          <div class="input_days">
            <el-input class="nft_type" v-model="competitionForm.limitDay" type="number" min="0"
              placeholder="Time can be selected or entered manually, maximum 30 days">
            </el-input>
            <div class="days_text">DAY</div>
          </div>
          <div class="choose_days">
            <div class="choose_days_item" v-for="(item, index) in daysData" :key="index"
              :class="['choose_days_item', competitionForm.limitDay == item && 'active']"
              @click="competitionForm.limitDay = item">{{ `${item} Days` }}</div>
          </div>
        </el-form-item>
        <el-form-item label="ENTRIES PRICE" prop="ticketPrice">
          <el-input readonly="readonly" v-model="competitionForm.ticketPrice" placeholder="">
            <template #prefix>
              <img class="icon_eth" src="@/assets/svg/user/icon_eth.svg" alt="">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="MAX DURATION" prop="limitDay" v-if="activeType == 'LIMITED_PRICE'">
          <div class="input_days">
            <el-input class="nft_type" v-model="competitionForm.limitDay" type="number" min="0"
              placeholder="Time can be selected or entered manually, maximum 30 days">
            </el-input>
            <div class="days_text">DAY</div>
          </div>
          <div class="choose_days">
            <div class="choose_days_item" v-for="(item, index) in daysData" :key="index"
              :class="['choose_days_item', competitionForm.limitDay == item && 'active']"
              @click="competitionForm.limitDay = item">{{ `${item} Days` }}</div>
          </div>
        </el-form-item>
        <div class="continue_btn" @click="submitCompetition()">CONTINUE</div>
        <div class="hint-text" v-if="activeType == 'LIMITED_TIME'">
          <p>
            This mode cannot be cancelled once the contest starts, so please set the price reasonably to avoid losses.
          </p>
        </div>
        <div class="hint-text" v-else>
          <p>
            Please set a reasonable price, if you do not sell all tickets by the end of the sale time, the sale will fail
            and all participating users will be refunded automatically.
          </p>
          <p>
            Once a user has participated in the competition, it cannot be cancelled. Please make sure that the price you
            set is correct.
          </p>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSystemNft,
  addNftOrder
} from "@/services/api/oneBuy";

import {
  withdrawalNft
} from "@/services/api/user";
import { openUrl } from "@/utils";
import bigNumber from "bignumber.js";
import { CScrollbar } from 'c-scrollbar';
export default {
  name: 'myWallet',
  components: {
    CScrollbar,
  },
  data() {
    return {
      showLink: false, // 登录链上
      showInventory: false,
      operatingType: 1, // 1 充NFT；2 提NFT；
      networkList: [
        { label: "Goerli", value: "goerli" }
      ],
      nftTypes: [
        { label: "ERC-721", value: "ERC721" },
        { label: "ERC-1155", value: "ERC1155" }
      ],
      collections: [],
      params: {
        nftName: null,
        type: null,
        collections: null,
        wallet: null,
        chain: null
      },
      chooseNftData: [],
      chooseNft: [],
      stockNftList: [],

      // 一元购创建
      showCompetition: false,
      activeType: "LIMITED_TIME",
      competitionNft: null,
      competitionForm: {
        price: null, //价格
        limitDay: null, //天数
        orderType: null, // 限时:LIMITED_TIME;限价:LIMITED_PRICE
        ticketPrice: 0.0001 //单次价格
      },
      daysData: [1, 7, 14, 30],
      rules: {},
      wallet: {
        page: 1,
        size: 8
      },
      timer: null
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
    }
  },
  computed: {
    // 总票数
    limitNum() {
      const { price, ticketPrice } = this.competitionForm;
      if (!price) return 0;
      const maxNum = Number(new bigNumber(price).dividedBy(ticketPrice));
      if (this.activeType == "LIMITED_TIME") return 0
      return maxNum;
    },
    // Nft条件检索
    chooseNftList() {
      const { params: { nftName, type, collections }, chooseNftData } = this;
      let chooseNfts = []
      chooseNftData.forEach(element => {
        if (nftName && !(element.tokenId.indexOf(nftName) > -1)) return
        if (type && element.contractType != type) return
        if (collections && element.name != collections) return
        chooseNfts.push(element);
      })
      return chooseNfts
    },
    // 计算Nft价值
    calculatedNftValue() {
      const { chooseNft } = this;
      let nftVal = 0;

      if (chooseNft.length > 0) {
        chooseNft.forEach(element => {
          nftVal += Number(new bigNumber(nftVal).plus(element.price || 0))
        })
        return nftVal
      }

      return nftVal
    },
  },
  methods: {
    bigNumber: bigNumber,
    onDeposit() {
      this.showLink = true;
      this.operatingType = 1;
    },
    onWithdraw() {
      this.operatingType = 2;
      this.showInventory = true;
      this.fetchWithdrawalSystemNft();
    },
    linkWallet() {
      this.showInventory = true;
    },
    // 选择检索
    nftFind(event) {
      const eindex = this.chooseNft.findIndex(e => e.id == event);
      return eindex;
    },
    // 选择Nft
    chooseNfts(event) {
      const eindex = this.nftFind(event.id);
      if (eindex > -1) {
        this.chooseNft.splice(eindex, 1);
      } else {
        this.chooseNft.push(event);
      }
    },
    // 获取系统Nft列表
    async fetchSystemNft() {
      const res = await getSystemNft({
        page: 1,
        size: 9999
      });
      if (res && res.code == 200) {
        const stockNft = res.data.records;
        this.stockNftList = [];
        if (stockNft && !stockNft.length > 0) return
        stockNft.forEach(element => {
          if (!element.tokenId) return
          this.stockNftList.push(element)
        });
      }
    },
    // 获取系统Nft列表，提取NFT
    async fetchWithdrawalSystemNft() {
      const res = await getSystemNft({
        page: 1,
        size: 9999
      });
      if (res && res.code == 200) {
        const stockNft = res.data.records;
        this.chooseNftData = [];
        if (stockNft && !stockNft.length > 0) return
        stockNft.forEach(element => {
          if (!element.tokenId) return
          this.chooseNftData.push(element);
        });
        this.generateCollections();
      }
    },
    // 生成当前已有系列
    generateCollections() {
      this.collections = [];
      this.chooseNftData.forEach(element => {
        if (this.collectionsFind(element.name)) return
        this.collections.push(element.name);
      });
    },
    // 检索已有系列
    collectionsFind(event) {
      const index = this.collections.findIndex(e => e == event);
      return index > -1;
    },
    // 提取Nft
    async onWithdrawalNft() {
      const { params: { wallet }, chooseNft } = this;
      if (!wallet) {
        this.$message.error("Please enter wallet address");
        return
      }

      if (!chooseNft.length > 0) {
        this.$message.error("Please select the NFT you want to withdraw");
        return
      }

      let knapsackId = [];
      chooseNft.forEach(element => {
        knapsackId.push(element.id)
      })
      const res = await withdrawalNft({
        knapsackIds: knapsackId, //背包ID
        walletAddress: wallet //钱包地址
      });
      if (res && res.code == 200) {
        this.$message.success("Created successfully");
        this.handleClose();
        this.fetchSystemNft();
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

          if (!competitionNft.price) {
            this.$message.error("Please enter the correct total price");
            return
          }

          let ruleForm = {
            ...this.competitionForm,
            limitNum: this.limitNum,
            orderType: activeType,
            contractAddress: competitionNft.tokenAddress, //合约地址
            tokenId: competitionNft.tokenId //nftId
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
        ticketPrice: 0.0001 //单次价格
      }

      this.operatingType = 1;
      this.collections = [];
      this.params = {
        nftName: null,
        type: null,
        collections: null,
        wallet: null,
        chain: null
      };

      this.chooseNftData = [];
      this.chooseNft = [];
      this.$refs["competitionForm"].resetFields();

      if (done) {
        done();
        return
      }
      this.showCompetition = false;
      this.showInventory = false;
      this.showReplenish = false;
      this.showLink = false;
      this.showRecharge = false;
    },
    // 查看赛事
    viewNft(event) {
      let routeData = this.$router.resolve({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
      openUrl(routeData.href)
    },
    // 选择类型
    handleChange(event) {
      console.log(event)
    },
    /** 
     * @description 友好的时间显示
     * @param string event 时间
     */
    timeFormat(event) {
      if (!event) return "-"
      const timestamp = new Date(event).getTime() / 1000;

      function zeroize(num) {
        return (String(num).length == 1 ? '0' : '') + num;
      }

      let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
      let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

      let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
      let tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象

      let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
      let H = tmDate.getHours(), i = tmDate.getMinutes();
      // let s = tmDate.getSeconds();

      if (timestampDiff < 60) { // 一分钟以内
        return "Just";
      } else if (timestampDiff < 3600) { // 一小时前之内
        return Math.floor(timestampDiff / 60) + "minutes ago";
      } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
        return 'Today' + zeroize(H) + ':' + zeroize(i);
      } else {
        let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
          return 'Yesterday' + zeroize(H) + ':' + zeroize(i);
        } else if (curDate.getFullYear() == Y) {
          // return zeroize(m) + 'Month' + zeroize(d) + 'day ' + zeroize(H) + ':' + zeroize(i);
          return `${this.monthFormat(zeroize(m))} ${parseInt(zeroize(d))} ${zeroize(H)}:${zeroize(i)}`;
        } else {
          // return Y + 'Year' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
          return `${this.monthFormat(zeroize(m))} ${parseInt(zeroize(d))} ${zeroize(H)}:${zeroize(i)}，${Y}`;
        }
      }
    },
    /** 
     * @description 月份转化
     * @param string event 时间
     */
    monthFormat(event) {
      const monthData = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
      }

      return monthData[parseInt(event)]
    },
  },
  created() {
    this.fetchSystemNft();
    this.rules = {
      //总价格
      price: [{ required: true, message: "Please enter a price", trigger: ["blur", "change"] }],
      //天数
      limitDay: [{ required: true, message: "Please enter the number of days", trigger: ["blur", "change"] }],
      //单份价值
      ticketPrice: [{ required: true, message: "Please enter a single serving value", trigger: ["blur", "change"] }],
      //最大数量
      // limitNum: [{ required: true, message: "Please enter the total number of votes", trigger: ["blur", "change"] }],
    }
  }
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
    