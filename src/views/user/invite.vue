<template>
  <div class="wrapper_bg">
    <div class="my_invite_wrapper">
      <el-tabs v-model="activeType" class="type_tabs" @tab-change="handleChange">
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
          <el-input class="create_input" @blur="onVerify()" v-model="inviteCode" placeholder="Set referral code...">
            <template #append>
              <div class="create_btn" @click="createInvite()">CREATE</div>
            </template>
          </el-input>
          <div class="create_error">{{ inviteTips }}</div>
        </div>
        <div class="statistics_panel">
          <div class="statistics_title">YOUR STATISTICS</div>
          <div class="statistics_box">
            <div class="statistics_item" v-for="(item, index) in statisticsRow" :key="index">
              <div class="statistics_type">
                <div class="title">{{ item.statisticsType }}</div>
                <div class="val">{{ item.totalData }}</div>
              </div>
              <div class="statistics_time">
                <div class="title">Today</div>
                <div class="val">{{ item.todayData }}</div>
              </div>
              <div class="statistics_time">
                <div class="title">Yesterday</div>
                <div class="val">{{ item.yesterdayData }}</div>
              </div>
              <div class="statistics_time">
                <div class="title">This month</div>
                <div class="val">{{ item.thisMonthData }}</div>
              </div>
              <div class="statistics_time">
                <div class="title">Last month</div>
                <div class="val">{{ item.lastMonthData }}</div>
              </div>
            </div>
          </div>
          <el-table :data="inviteList" class="table_container" style="width: 100%">
            <el-table-column prop="inviteCode" label="CODE" align="center" />
            <el-table-column prop="totalAmount" label="CLAIMED" align="center" />
            <el-table-column prop="invitePeople" label="REFS" align="center" />
            <el-table-column prop="pointAmount" label="POINT" align="center" />
            <el-table-column prop="traAmount" label="CONSUMPTION" align="center" />
            <el-table-column label="CLAIM" align="center">
              <template #default="scope">
                <div class="claim_box" @click="handleReceive(scope.row)">
                  <span>CLAIM</span>
                  <img src="@/assets/svg/user/icon_invite_ethereum.svg" alt="">
                  <span>{{ new bigNumber(scope.row.totalAmount || 0).minus(scope.row.receiveAmount || 0) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="COPY" align="center">
              <template #default="scope">
                <div class="copy_btn">
                  <img src="@/assets/svg/user/icon_invite_copy.svg" @click="onCopy(scope.row.inviteCode)" alt="">
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="referred_user_box" v-else>
        <el-table :data="detailList" class="table_container" style="width: 100%">
          <el-table-column prop="inviteCode" label="REFERRAL CODE" align="center" />
          <el-table-column prop="userName" label="USERNAME" align="center" />
          <el-table-column prop="rebatesAmount" label="CONSUMPTION" align="center">
            <template #default="scope">
              <div class="consumption_box">
                <span>{{ scope.row.rebatesAmount }}</span>
                <img src="@/assets/svg/user/icon_invite_ethereum.svg" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="pointAmount" label="POINT" align="center" />
          <el-table-column prop="createTime" label="REFERRED AT" align="center">
            <template #default="scope">
              {{ timeFormat(scope.row.createTime) }}
            </template>
          </el-table-column>
        </el-table>
        <div v-if="this.count > 6">
          <div class="more" v-if="!isMore" @click="loadMore()">
            <span>Show more</span>
            <img src="@/assets/svg/user/icon_more.svg" alt="">
          </div>
          <div class="pagination-box" v-else>
            <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
              layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  userInvateStatistics,
  rebatesCreateCode,
  rebatesFindList,
  rebatesReceive,
  rebatesDetailPageList
} from "@/services/api/invite";
import bigNumber from "bignumber.js";
export default {
  name: 'myInvite',
  data() {
    return {
      activeType: "summary",
      isMore: false,
      invite: require("@/assets/svg/user/invite_bg.svg"),
      inviteMore: require("@/assets/svg/user/point_more_bg.svg"),
      inviteCode: null,
      verifys: false,
      inviteTips: null,
      statisticsRow: null,
      inviteList: [],
      detailList: [],
      page: 1,
      size: 6,
      count: 0,
    };
  },
  methods: {
    bigNumber: bigNumber,
    handleChange(event) {

      this.page = 1;
      this.size = 4;
      this.count = 0;
      this.isMore = false;

      if (event == "summary") {
        this.fetchInvateStatistics();
        this.fetchRebatesFindList();
      } else {
        this.fetchDetailPageList();
      }
    },
    // 验证
    onVerify() {
      const { inviteCode } = this;
      if (!inviteCode) {
        this.inviteTips = "Please enter the invitation code here";
        this.verifys = false;
        return
      } else if (inviteCode.length < 3) {
        this.inviteTips = "Must be at least 3 characters";
        this.verifys = false;
        return
      }

      this.inviteTips = "";
      this.verifys = true;
    },
    // 邀请统计
    async createInvite() {
      this.onVerify();
      if (!this.verifys) return
      const res = await rebatesCreateCode({
        code: this.inviteCode
      });
      if (res && res.code == 200) {
        this.inviteCode = null;
        this.$message.success("Created successfully");
        this.fetchRebatesFindList();
      }
    },
    // 邀请统计
    async fetchInvateStatistics() {
      const res = await userInvateStatistics();
      if (res && res.code == 200) {
        this.statisticsRow = res.data;
      }
    },
    // 邀请资产列表
    async fetchRebatesFindList() {
      const res = await rebatesFindList();
      if (res && res.code == 200) {
        this.inviteList = res.data;
      }
    },
    // 邀请详情列表
    async fetchDetailPageList() {
      const res = await rebatesDetailPageList({
        page: this.page,
        size: this.size
      });
      if (res && res.code == 200) {
        this.detailList = res.data.records;
        this.count = res.data.total;
      }
    },
    async handleReceive(event) {
      const res = await rebatesReceive({
        inviteCode: event.inviteCode
      });
      if (res && res.code == 200) {
        this.$message.success("Receive success");
        this.fetchRebatesFindList();
      }
    },
    loadMore() {
      this.isMore = true;
      this.size = 20;
      this.fetchDetailPageList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchDetailPageList();
    },
    /**
     * @description: Copy
     */
    onCopy(event) {
      const oInput = document.createElement("input");
      oInput.value = event;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.success("Copy successfully");
      oInput.remove();
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
        return 'Today ' + zeroize(H) + ':' + zeroize(i);
      } else {
        let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
          return 'Yesterday ' + zeroize(H) + ':' + zeroize(i);
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
    this.fetchInvateStatistics();
    this.fetchRebatesFindList();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/invite.scss";
</style>
    