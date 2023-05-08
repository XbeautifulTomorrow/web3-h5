<template>
  <div class="user_wrapper">
    <div class="one_buy_box">
      <div class="stock_box">
        <div class="more_btn">show more</div>
        <div class="module_title">NFTs In Inventory</div>
        <div class="operating_box">
          <div class="operating_btn">WITHDRAW</div>
        </div>
        <div class="nft_list">
          <div class="nft_item" v-for="(item, index) in stockNftList" :key="index">
            <div class="image_box">
              <div class="image_tag">#{{ item && item.tokenId }}</div>
              <img :src="item && item.img" alt="">
            </div>
            <div class="nft_name">{{ item && item.name }}</div>
            <div class="create_btn" @click="createCompetition(item)">创建赛事</div>
          </div>
        </div>
      </div>
      <div class="wallet_box">
        <div class="module_title">NFTs In Connecting Wallet</div>
        <div class="operating_box">
          <div class="operating_btn">DEPOSIT</div>
        </div>
        <div class="nft_list">
          <div class="nft_item" v-for="(item, index) in walletNftList" :key="index">
            <div class="image_box">
              <div class="image_tag">#{{ item && item.tokenId }}</div>
              <img :src="item && item.nftImg" alt="">
            </div>
            <div class="nft_name">{{ item && item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="showCompetition" title="创建赛事" width="360px" class="dialog_competition"
      :close-on-click-modal="false" :before-close="handleClose">
      <div class="image_box">
        <img :src="competitionNft && competitionNft.img" alt="">
      </div>
      <div class="nft_info">
        <div class="nft_name">{{ competitionNft && competitionNft.name }}</div>
        <div class="nft_id">#{{ competitionNft && competitionNft.tokenId }}</div>
      </div>
      <el-tabs v-model="activeType" class="type-tabs" @tab-click="handleClick">
        <el-tab-pane label="Limited Time" name="LIMITED_TIME"></el-tab-pane>
        <el-tab-pane label="Limit Price" name="LIMITED_PRICE"></el-tab-pane>
      </el-tabs>
      <el-form ref="competitionForm" :rules="rules" :model="competitionForm" label-width="100px" label-position="top">
        <el-form-item label="价格" prop="price">
          <el-input v-model="competitionForm.price" type="number" min="0">
            <template #append>
              ETH
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="总票数" prop="limitNum" v-if="activeType == 'LIMITED_PRICE'">
          <el-input v-model.number="competitionForm.limitNum" type="number" min="2"></el-input>
        </el-form-item>
        <el-form-item label="持续时间" prop="limitDay" v-if="activeType == 'LIMITED_TIME'">
          <el-autocomplete v-model.number="competitionForm.limitDay" type="number" style="flex: 1" min="0"
            :fetch-suggestions="querySearch" clearable @select="handleSelect">
            <template #append>
              天
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="单份价值" prop="ticketPrice">
          <el-input v-model="competitionForm.ticketPrice" placeholder="">
            <template #append>
              ETH
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="售卖时长" prop="limitDay" v-if="activeType == 'LIMITED_PRICE'">
          <el-autocomplete v-model.number="competitionForm.limitDay" type="number" style="flex: 1" min="0"
            :fetch-suggestions="querySearch" clearable @select="handleSelect">
            <template #append>
              天
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-button style="width: 100%;" type="primary" @click="submitCompetition()">CONTINUE</el-button>
        <div class="hint-text" v-if="activeType == 'LIMITED_TIME'">
          <p>一元购一但售出无法撤销，持续时间结束后将会自动开奖，请设置合理的价格，过于高估的价格可能导致亏损</p>
          <P>创建的赛事一旦有用户参与就无法取消，请确认您设置的价格无误。</P>
        </div>
        <div class="hint-text" v-else>
          <p>请设置合理的价格，售卖时间结束未能卖完所有票数则售卖失败，将自动为所有参与的用户退款</p>
          <P>创建的赛事一旦有用户参与就无法取消，请确认您设置的价格无误。</P>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
     
<script>
import {
  getWalletNft,
  getSystemNft,
  addNftOrder,
  // cancelNftOrder,
} from "@/services/api/oneBuy";
export default {
  name: 'User-index',
  data() {
    return {
      stockNftList: [],
      walletNftList: [],
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
      rules: {},
      dayData: [
        { value: "7" },
        { value: "14" },
        { value: "30" }
      ],
      wallet: {
        page: 1,
        size: 8
      }
    };
  },
  mounted() {
  },
  methods: {
    // 获取钱包Nft列表
    async fetchWalletNft() {
      const { size } = this.wallet;
      const res = await getWalletNft({
        size: size
      });
      if (res && res.code == 200) {
        this.walletNftList = res.data.records;
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
      this.showCompetition = false
    },
    // 选择类型
    handleClick(event) {
      console.log(event)
    },
    // 输入框候选择
    handleSelect(event) {
      console.log(event)
    },
    // 输入框候选项
    querySearch(event, cb) {
      if (!event) {
        const results = this.dayData.filter(e => {
          e.value.indexOf(event) === 0
        });
        cb(results)
      } else {
        cb(this.dayData)
      }
    }
  },
  created() {
    this.fetchSystemNft();
    this.fetchWalletNft();
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
@import "./components/index.scss";
</style>
