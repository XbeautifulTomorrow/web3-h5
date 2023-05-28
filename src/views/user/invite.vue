<template>
  <div class="wrapper_bg">
    <div class="my_invite_wrapper">
      <el-tabs v-model="activeType" class="type_tabs" @tab-click="handleClick">
        <el-tab-pane label="SUMMARY" name="summary"></el-tab-pane>
        <el-tab-pane label="REFERRED USERS" name="referred_user"></el-tab-pane>
      </el-tabs>
      <div class="summary_box" v-if="activeType == 'summary'">
        <div class="invite_panel" :style="{
          backgroundImage: `url(${invite})`,
          height: '16.125rem'
        }">
          <div class="title_text">Earn ETH and cent by sharing XXX!</div>
          <div class="invite_description">
            Post your unique tracker in your socials, in your Discord and send it to anyone
            with a passion for NFTs with a little explanation of xxx.
            You’ll be rewarded handsomely with 2.5% of their Competition entry purchases day after day paid to you in ETH.
          </div>
        </div>
        <div class="create_invite_code">
          <div class="create_title">Set custom referrals code</div>
          <el-input class="create_input" v-model="inviteCode" placeholder="Set referral code...">
            <template #append>CREATE</template>
          </el-input>
          <div class="create_error">Must be at least 3 characters</div>
        </div>
        <div class="statistics_panel">
          <div class="statistics_title">YOUR STATISTICS</div>
          <div class="statistics_box">
            <div class="statistics_item" v-for="(item, index) in statisticsData" :key="index">
              <div class="statistics_type">
                <div class="title">{{ item.title }}</div>
                <div class="val">1000</div>
              </div>
              <div class="statistics_time">
                <div class="title">Today</div>
                <div class="val">1</div>
              </div>
              <div class="statistics_time">
                <div class="title">Yesterday</div>
                <div class="val">1</div>
              </div>
              <div class="statistics_time">
                <div class="title">This month</div>
                <div class="val">1</div>
              </div>
              <div class="statistics_time">
                <div class="title">Last month</div>
                <div class="val">1</div>
              </div>
            </div>
          </div>
          <el-table :data="inviteList" class="table_container" style="width: 100%">
            <el-table-column prop="code" label="CODE" align="center" />
            <el-table-column prop="amount" label="CLAIMED" align="center" />
            <el-table-column prop="eth_amount" label="REFS" align="center" />
            <el-table-column prop="status" label="POINT" align="center" />
            <el-table-column prop="status" label="TOTAL" align="center" />
            <el-table-column prop="claim" label="CLAIM" align="center">
              <template #default="scope">
                <div class="claim_box">
                  <span>CLAIM</span>
                  <img src="@/assets/svg/user/icon_invite_ethereum.svg" alt="">
                  <span>{{ scope.row.claim }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="COPY" align="center">
              <template #default="scope">
                <div class="copy_btn">
                  <img src="@/assets/svg/user/icon_invite_copy.svg" @click="copyInvite(scope.row)" alt="">
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="referred_user_box" v-else>
        <el-table :data="inviteList" class="table_container" style="width: 100%">
          <el-table-column prop="code" label="REFERRAL CODE" align="center" />
          <el-table-column prop="amount" label="USERNAME" align="center" />
          <el-table-column prop="eth_amount" label="CONSUMPTION" align="center">
            <template #default="scope">
              <div class="consumption_box">
                <span>{{ scope.row.claim }}</span>
                <img src="@/assets/svg/user/icon_invite_ethereum.svg" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="POINT" align="center" />
          <el-table-column prop="status" label="REFERRED AT" align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myInvite',
  data() {
    return {
      activeType: "summary",
      invite: require("@/assets/svg/user/invite_bg.svg"),
      inviteCode: null,
      statisticsRow: null,
      inviteList: [
        { code: "1324", claim: 2.5 },
        { code: "1324", claim: 2.5 },
        { code: "1324", claim: 2.5 },
        { code: "1324", claim: 2.5 }
      ],
    };
  },
  computed: {
    statisticsData() {
      const { statisticsRow } = this;
      console.log(statisticsRow);
      return [
        { title: "CLICKS" },
        { title: "REFERRALS" },
        { title: "POINTS" },
        { title: "REVENUE" }
      ]
    }
  },
  methods: {
    copyInvite(event) {
      console.log(event);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./components/invite.scss";
</style>
    