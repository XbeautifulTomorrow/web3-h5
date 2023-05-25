<template>
  <div class="my_profile_wrapper">
    <div class="user_panel" :style="{
      backgroundImage: `url(${bg[activeType]})`,
      height: activeType == 'point' ? '44.3125rem' : `63.6875rem`
    }">
      <div class="user_info">
        <img src="@/assets/img/user/avatar.png" alt="">
        <div class="user_box">
          <div class="user_name">User name</div>
          <div class="user_wallet">
            <span>0x58484561648546f465s6dfs64d6f54s65d46f4</span>
            <img src="@/assets/svg/user/icon_link.svg" alt="">
          </div>
          <div class="create_time">Joined Mar 2023</div>
        </div>
      </div>
      <el-tabs v-model="activeType" class="type_tabs" @tab-click="handleClick">
        <el-tab-pane label="Point" name="point"></el-tab-pane>
        <el-tab-pane label="Purchase History" name="purchase_history"></el-tab-pane>
      </el-tabs>
      <div class="point_box" v-if="activeType == 'point'">
        <div class="point_total">
          <img src="@/assets/svg/user/icon_profile.svg" alt="">
          <span>1231 Point</span>
        </div>
        <div class="point_details">
          <div class="point_details_title">POINT DETAILS</div>
          <el-table :data="pointData" class="table_container" style="width: 100%">
            <el-table-column prop="snapshot_id" label="TYPE" align="center" />
            <el-table-column prop="nftName" label="POINT" align="center">
              <template #default="scope">
                <div class="point_info">
                  <span>{{ `+${scope.row.nftId || 0}` }}</span>
                  <img src="@/assets/svg/user/icon_copy.svg" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="usdtPrice" label="ETH AMOUNT" align="center" />
            <el-table-column prop="boxName" label="DETAIL" align="center" />
            <el-table-column prop="boxName" label="DATE/TIME" align="center">
              <template #default="scope">
                {{ timeFormat(scope.row.time) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="more">
          <span>Show more</span>
          <img src="@/assets/svg/user/icon_more.svg" alt="">
        </div>
      </div>
      <div class="purchase_history_box" v-if="activeType == 'purchase_history'">
        <div class="history_item" v-for="(item, index) in purchaseHistory" :key="index">
          <div class="box_info">
            <div class="box_img">
              <img src="" alt="">
            </div>
            <div class="box_buy">
              <div class="box_name">Top Blue-chip Box</div>
              <div class="box_num">x 10</div>
              <div class="box_order">ID:123123123213123123</div>
            </div>
          </div>
          <div class="nft_info">
            <div class="nft_list"></div>
            <div class="price_box">
              <div class="price">1.45 ETH</div>
              <div class="time">2023.1.3 21:21:13</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>    
<script>
export default {
  name: 'myProfile',
  data() {
    return {
      activeType: "point",
      pointData: [1, 2, 3, 4],
      purchaseHistory: [1, 2, 3, 4],
      bg: {
        point: require("@/assets/svg/user/point_bg.svg"),
        purchase_history: require("@/assets/svg/user/purchase_history_bg.svg")
      }
    };
  },
  methods: {
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
  }
};
</script>
<style lang="scss" scoped>
@import "./components/myProfile.scss";
</style>
