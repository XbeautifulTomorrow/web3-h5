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
            <div class="tips">#6688</div>
            <img src="" alt="">
          </div>
          <div class="nft_name">Bored Ape Yacht Club</div>
          <div class="create_btn" @click="createCompetition(item)" v-if="item.type == 1">
            <span class="create_text">CREATE COMPETITIONS</span>
          </div>
          <div class="view_nft" v-else>VIEW COMPETITIONS</div>
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
        <div class="withdraw_tpis">
          Please enter the ERC20 wallet address you wish to receive the NFT'S on. Once confirmed,
          the withdrawal is usually processed within a few minutes.
        </div>
        <div class="condition_item">
          <div class="condition_label">
            <span>RECEIVING NFT'S ADDRESS</span>
            <span class="required">*</span>
          </div>
          <el-input class="wallet_input" v-model="params.wallet" placeholder="Paste your ERC20 wallet address here">
          </el-input>
        </div>
        <div class="condition_item">
          <div class="condition_label">
            <span>WITHDRAWAL NETWORK</span>
            <span class="required">*</span>
          </div>
          <el-select v-model="params.chain" class="nft_type wallet_network" placeholder="Select network"
            :popper-append-to-body="false">
            <el-option v-for="item in nftTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="hint_text">
          <img src="" alt="">
          <span>
            Ensure you've selected the same network for both withdrawal and deposit. Please check if the
            depositing
            platform supports the selected network; otherwise, you may lose your assets.
          </span>
        </div>
      </div>
      <div class="choose_panel">
        <div class="search_box">
          <el-input class="nft_input" v-model="params.nftName" placeholder="Search NFTs">
            <template #prefix>
              <el-icon class="el-input__icon search_icon">
                <search />
              </el-icon>
            </template>
          </el-input>
          <el-select v-model="params.type" class="nft_type" placeholder="Select">
            <el-option v-for="item in nftTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div class="collections_box">
            <div class="collections_text">Collections:</div>
            <el-select v-model="params.type" class="nft_type" placeholder="Select" :popper-append-to-body="false">
              <el-option v-for="item in nftTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
        <c-scrollbar class="choose_nft" width="100%" height="69.8125rem">
          <div class="choose_nft">
            <div class="choose_nft_item" :class="[nftFind(item.nft_id) > -1 && 'active']" @click="chooseNfts(item)"
              v-for="(item, index) in chooseNftList" :key="index">
              <div class="img_box">
                <div class="tips">#6688</div>
                <img src="" alt="">
              </div>
              <div class="nft_name">Bored Ape Yacht Club</div>
              <div class="mask_box">
                <img src="@/assets/svg/user/icon_selected.svg" alt="">
              </div>
            </div>
          </div>
        </c-scrollbar>
      </div>
      <div class="confirm_btn">
        <span v-if="operatingType == 1">{{ `DEPOSIT ${chooseNft.length} NFTs` }}</span>
        <span v-else>{{ `WITHDRAW ${chooseNft.length} NFTs` }}</span>
      </div>
      <div class="valuable_text">Withdrawal fee of 0.005 ETH applies.</div>
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
      <el-tabs v-model="activeType" class="type_tabs" @tab-click="handleClick">
        <el-tab-pane label="TIME LIMIT" name="LIMITED_TIME"></el-tab-pane>
        <el-tab-pane label="LIMIT PRICE" name="LIMITED_PRICE"></el-tab-pane>
      </el-tabs>
      <el-form ref="competitionForm" class="form_box" :rules="rules" :model="competitionForm" hide-required-asterisk
        label-position="top">
        <el-form-item label="PRICE" prop="price">
          <el-input v-model="competitionForm.price" type="number" min="0">
            <template #prefix>
              <img class="icon_eth" src="@/assets/svg/user/icon_eth.svg" alt="">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="TOTALES" prop="limitNum" v-if="activeType == 'LIMITED_PRICE'">
          <el-input v-model.number="competitionForm.limitNum" type="number" min="2"></el-input>
        </el-form-item>
        <el-form-item label="TIME DURATION" prop="limitDay" v-if="activeType == 'LIMITED_TIME'">
          <div class="choose_days">
            <el-select v-model="competitionForm.limitDay" filterable allow-create :reserve-keyword="false"
              class="nft_type" placeholder="Time can be selected or entered manually, maximum 30 days"
              :popper-append-to-body="false">
              <el-option v-for="(item, index) in daysData" :key="index" :label="item" :value="item">
                <span>{{ item }}</span>
              </el-option>
            </el-select>
            <div class="days_text">DAY</div>
          </div>
        </el-form-item>
        <el-form-item label="SINGLE COPY VALUE" prop="ticketPrice">
          <el-input v-model="competitionForm.ticketPrice" placeholder="">
            <template #prefix>
              <img class="icon_eth" src="@/assets/svg/user/icon_eth.svg" alt="">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="SELLING HOURS" prop="limitDay" v-if="activeType == 'LIMITED_PRICE'">
          <div class="choose_days">
            <el-select v-model="competitionForm.limitDay" filterable allow-create :reserve-keyword="false"
              class="nft_type" placeholder="Time can be selected or entered manually, maximum 30 days"
              :popper-append-to-body="false">
              <el-option v-for="(item, index) in daysData" :key="index" :label="item" :value="item">
                <span>{{ `${item} Days` }}</span>
              </el-option>
            </el-select>
            <div class="days_text">DAY</div>
          </div>
        </el-form-item>
        <div class="continue_btn" @click="submitCompetition()">CONTINUE</div>
        <div class="hint-text" v-if="activeType == 'LIMITED_TIME'">
          <p>Once a dollar purchase has been sold it cannot be cancelled and will be automatically opened at the
            end of
            the duration, please set a reasonable price, over-estimated prices may result in a loss</p>
          <P>Once a tournament has been created, it cannot be cancelled once a user has participated, please make
            sure
            you
            have set the correct price.</P>
        </div>
        <div class="hint-text" v-else>
          <p>Please set a reasonable price, if all tickets are not sold at the end of the sale time, the sale will
            fail
            and a refund will be made automatically for all participating users.</p>
          <P>Once a tournament has been created, it cannot be cancelled once a user has participated, please make
            sure
            you
            have set the correct price.</P>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSystemNft,
  addNftOrder,
  // cancelNftOrder,
} from "@/services/api/oneBuy";
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
      nftTypes: [{ label: "ERC-721", value: "7211" }, { label: "ERC-1155", value: "1155" }],
      params: {
        nftName: null,
        type: null,
        wallet: null,
        chain: null
      },
      chooseNftList: [
        { nft_id: 1 },
        { nft_id: 2 },
        { nft_id: 3 },
        { nft_id: 4 },
        { nft_id: 5 },
        { nft_id: 6 },
        { nft_id: 7 },
        { nft_id: 8 },
        { nft_id: 9 },
        { nft_id: 10 },
        { nft_id: 11 },
        { nft_id: 12 },
      ],
      chooseNft: [],
      stockNftList: [
        { name: "Bored Ape Yacht Club Bored Ape Yacht Club", tokenId: "7799", type: 1 },
        { name: "Bored Ape Yacht Club", tokenId: "7799", type: 1 },
        { name: "Bored Ape Yacht Club", tokenId: "7799", type: 1 },
        { name: "Bored Ape Yacht Club", tokenId: "7799", type: 1 },
        { name: "Bored Ape Yacht Club", tokenId: "7799", type: 1 },
      ],

      // 一元购创建
      showCompetition: false,
      activeType: "LIMITED_TIME",
      competitionNft: null,
      competitionForm: {
        price: null, //价格
        limitDay: null, //天数
        orderType: null, // 限时:LIMITED_TIME;限价:LIMITED_PRICE
        ticketPrice: null, //单次价格
        limitNum: null, //最大数量
      },
      daysData: [7, 14, 30],
      rules: {},
      wallet: {
        page: 1,
        size: 8
      },
    };
  },
  methods: {
    onDeposit() {
      this.showLink = true;
      this.operatingType = 1;
    },
    onWithdraw() {
      this.showLink = true;
      this.operatingType = 2;
    },
    linkWallet() {
      this.showInventory = true;
    },
    nftFind(event) {
      const eindex = this.chooseNft.findIndex(e => e.nft_id == event);
      return eindex;
    },
    chooseNfts(event) {
      const eindex = this.nftFind(event.nft_id);
      if (eindex > -1) {
        this.chooseNft.splice(eindex, 1);
      } else {
        this.chooseNft.push(event);
      }
    },
    // 获取系统Nft列表
    async fetchSystemNft() {
      const { size } = this.wallet;
      const res = await getSystemNft({
        size: size
      });
      if (res && res.code == 200) {
        this.stockNftList = res.data.records;
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

          if (competitionNft.price <= competitionNft.ticketPrice) {
            this.$message.success("单份价值不能超过总价格");
          }

          let ruleForm = {
            ...this.competitionForm,
            orderType: activeType,
            contractAddress: competitionNft.tokenAddress, //合约地址
            tokenId: competitionNft.tokenId //nftId
          };
          const res = await addNftOrder({ ...ruleForm });
          if (res && res.code == 200) {
            this.handleClose();
            this.$refs["competitionForm"].resetFields();
            this.$message.success("创建成功！");
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
        ticketPrice: null, //单次价格
        limitNum: null, //最大数量
      }

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
    // 选择类型
    handleClick(event) {
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
      price: [{ required: true, message: "请输入价格", trigger: ["blur", "change"] }],
      //天数
      limitDay: [{ required: true, message: "请输入天数", trigger: ["blur", "change"] }],
      //单份价值
      ticketPrice: [{ required: true, message: "请输入单份价值", trigger: ["blur", "change"] }],
      //最大数量
      limitNum: [{ required: true, message: "请输入总票数", trigger: ["blur", "change"] }],
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
    