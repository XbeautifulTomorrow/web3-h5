<template>
  <div class="wrapper_bg">
    <div class="my_setting_wrapper">
      <div class="wallet_panel" :style="{
        backgroundImage: `url(${userBg})`,
        height: '44.3125rem'
      }">
        <div class="user_panel">
          <div class="avatar_box">
            <div class="avatar_img" :style="{ backgroundImage: `url(${avatarImg})` }"></div>
            <img class="edit" src="@/assets/svg/user/icon_edit.svg" alt="">
          </div>
          <div class="username_box">
            <div class="name_text">Useranme</div>
            <div class="wallet_text">0x58484561648546f465s6dfs64d6f54s65d46f4</div>
          </div>
          <div class="username_modify">
            <el-input class="modify_input" v-model="username" placeholder="User name" />
            <div class="modify_btn">CHANGE PASSWORD</div>
          </div>
          <div class="communication_setting">
            <div class="setting_text">COMMUNICATION SETTINGS</div>
            <div class="email_setting">
              <el-switch v-model="communication"
                style="--el-switch-on-color: #927A51; --el-switch-off-color: rgba(60, 60, 67, 0.3)" />
              <span>Send me marketing emails from time to time</span>
            </div>
          </div>
          <div class="other_box">
            <div class="log_btn">LOG</div>
            <div class="history_btn">Unbox History</div>
            <div class="exit_btn">
              <span class="exit_text">Log out</span>
              <img src="@/assets/svg/user/log_out.svg" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>    
<script>
export default {
  name: 'myWallet',
  data() {
    return {
      avatarImg: require("@/assets/svg/user/avatar.svg"),
      username: null,
      communication: false,
      userBg: require("@/assets/svg/user/point_bg.svg"),
    };
  },
  methods: {
    upload() { },
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
@import "./components/setting.scss";
</style>
  