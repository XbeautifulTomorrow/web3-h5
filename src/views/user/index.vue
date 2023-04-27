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
              <div class="image_tag">#{{ item }}</div>
              <img src="" alt="">
            </div>
            <div class="nft_name">Mutant Ape Yacht Club</div>
            <div class="create_btn" @click="createCompetition()">创建赛事</div>
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
              <div class="image_tag">#123</div>
              <img src="" alt="">
            </div>
            <div class="nft_name">Mutant Ape Yacht Club</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="showCompetition" title="创建赛事" width="480px" class="dialog_competition"
      :close-on-click-modal="false" :before-close="handleClose">
      <div class="image_box"></div>
      <div class="nft_info">
        <div class="nft_name">Mutant Ape Yacht Club</div>
        <div class="nft_id">#11111</div>
      </div>
      <el-tabs v-model="activeType" class="type-tabs" @tab-click="handleClick">
        <el-tab-pane label="Limited Time" name="time"></el-tab-pane>
        <el-tab-pane label="Limit Price" name="price"></el-tab-pane>
      </el-tabs>
      <el-form ref="competitionForm" :rules="rules" :model="competitionForm" label-width="100px" label-position="top">
        <el-form-item label="价格" prop="boxName">
          <el-input v-model="competitionForm.boxName" placeholder="">
            <template #append>
              111
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="总票数" prop="boxName">
          <el-input v-model="competitionForm.boxName" placeholder="">
            <template #append>
              111
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="持续时间" prop="boxName">
          <el-autocomplete v-model="competitionForm.day" style="flex: 1" :fetch-suggestions="querySearch" clearable
            placeholder="Please Input" @select="handleSelect" />
        </el-form-item>
        <el-form-item label="单份价值" prop="boxName">
          <el-input v-model="competitionForm.boxName" placeholder="">
            <template #append>
              111
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="售卖时长" prop="boxName">
          <el-input v-model="competitionForm.boxName" placeholder="">
            <template #append>
              111
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
     
<script>
export default {
  name: 'User-index',
  data() {
    return {
      stockNftList: [1, 2, 3, 4],
      walletNftList: [1, 2, 3, 4],
      showCompetition: false,
      activeType: "time",
      competitionForm: {
        day: null
      },
      rules: {},
      dayData: [
        { value: "7" },
        { value: "14" },
        { value: "30" }
      ]
    };
  },
  mounted() {
  },
  methods: {
    handleClose(done) {
      if (done) {
        done();
        return
      }
      this.showCompetition = false
    },
    createCompetition() {
      this.showCompetition = true;
    },
    handleClick(event) {
      console.log(event)
    },
    handleSelect(event) {
      console.log(event)
    },
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
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
