<template>
  <div class="wrapper_bg">
    <div class="my_wallet_wrapper">
      <div class="wallet_panel" :style="{
        backgroundImage: `url(${bg['point']})`,
        height: '44.3125rem'
      }">
        <div class="balance_box">
          <div class="balance_l">
            <div class="title_text">BALANCES</div>
            <div class="num">
              <img src="@/assets/svg/icon_eth.svg" alt="">
              <span>0.005 ETH</span>
            </div>
          </div>
          <div class="balance_r" @click="showRecharge = true">CASHIER</div>
        </div>
        <div class="wallet_interval"></div>
        <div class="wallet_operating">
          <div class="title_text">DEPOSIT & WITHDRAWAL HISTORY</div>
          <div class="choose_box">
            <div class="coin_item" v-for="(item, index) in coinList" :key="index" @click="coin = item"
              :class="coin == item && ['active']">{{ item }}</div>
            <div class="replenish">Missing contract ETH deposit?</div>
            <div class="retrieve" @click="showReplenish = true">Request deposit address sweep</div>
          </div>
        </div>
        <el-table :data="logsData" class="table_container" style="width: 100%">
          <el-table-column prop="log_type" label="LOG TYPE" align="center" />
          <el-table-column prop="amount" label="Amount" align="center" />
          <el-table-column prop="eth_amount" label="ETH AMOUNT" align="center" />
          <el-table-column prop="status" label="STATUS" align="center" />
          <el-table-column prop="creation_time" label="DATE/TIME" align="center">
            <template #default="scope">
              {{ timeFormat(scope.row.creation_time) }}
            </template>
          </el-table-column>
          <el-table-column label="TRANSACTION" align="center">
            <template #default="scope">
              {{ timeFormat(scope.row.creation_time) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="more">
          <span>Show more</span>
          <img src="@/assets/svg/user/icon_more.svg" alt="">
        </div>
      </div>
      <assets></assets>
    </div>
    <!-- 查询补足余额 -->
    <el-dialog v-model="showReplenish" width="50rem" lock-scroll :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="replenish_box">
        <div class="operating_title">
          <span>Enter transaction Id</span>
        </div>
        <el-input class="wallet_addr" v-model="walletAddr" placeholder="Paste your ERC20 wallet address here">
        </el-input>
        <div class="btns_box">
          <div class="btn_item cancel" @click="handleClose()">Cancel</div>
          <div class="btn_item submit">Submit</div>
        </div>
      </div>
    </el-dialog>
    <!-- 充值ETH USDT -->
    <el-dialog v-model="showRecharge" width="50rem" lock-scroll :close-on-click-modal="false" :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="recharge_box">
        <div class="operating_box">
          <div class="operating_btn" :class="[walletOperating == 1 && 'active']" @click="walletOperating = 1">DEPOST</div>
          <div class="operating_btn" :class="[walletOperating == 2 && 'active']" @click="walletOperating = 2">WITHDRAW
          </div>
        </div>
        <div class="choose_operating" v-if="operatingCoin == null">
          <div class="operating_title">
            <span v-if="walletOperating == 1">DEPOSIT OPTIONS</span>
            <span v-else>WITHDRAW OPTIONS</span>
          </div>
          <div class="wallet_operating">
            <div class="wallet_operating_item" @click="operatingCoin = 'ETH'">
              <img src="@/assets/svg/user/icon_ethereum.svg" alt="">
              <span>Ethereum [ETH]</span>
            </div>
            <div class="wallet_operating_item" @click="operatingCoin = 'USDT'">
              <img src="@/assets/svg/user/icon_usdt.svg" alt="">
              <span>Tether [USDT]</span>
            </div>
          </div>
        </div>
        <div class="recharge_panel" v-else>
          <div class="recharge_title">
            <el-icon class="icon_arrow" @click="operatingCoin = null">
              <ArrowLeftBold />
            </el-icon>
            <img v-if="operatingCoin == 'ETH'" src="@/assets/svg/user/icon_ethereum.svg" alt="">
            <img v-else src="@/assets/svg/user/icon_usdt.svg" alt="">
            <div class="recharge_title_text">
              <span v-if="walletOperating == 1">{{ `DEPOSIT ${operatingCoin}` }}</span>
              <span v-else>{{ `WITHDRAW ${operatingCoin}` }}</span>
            </div>
          </div>
          <div class="recharge_relevant" v-if="walletOperating == 1">
            <div class="QR_code">
              <div class="img_box"><img src="" alt=""></div>
              <div class="wallet_addr">
                <div class="tips_text">
                  Send the amount of Ethereum of your choice to the following address to receive the equivalent in Coins.
                </div>
                <el-input class="wallet_addr_input" v-model="walletAddr"
                  placeholder="Paste your ERC20 wallet address here">
                  <template #append>COPY</template>
                </el-input>
              </div>
            </div>
            <div class="recharge_hint_box">
              <div class="hint_item">
                <div class="hint_l">
                  <img src="@/assets/svg/user/icon_warning.svg" alt="">
                </div>
                <div class="hint_r">
                  Only deposit over the Ethereum network. Do not use BNB or BSC networks. Also do not use third-party
                  smart contracts for transfers.
                </div>
              </div>
              <div class="hint_item">
                <div class="hint_l">
                  <img style="visibility: hidden;" src="@/assets/svg/user/icon_warning.svg" alt="">
                </div>
                <div class="hint_r">
                  Do NOT send NFT's to this ETH deposit address. In order to recover NFTs deposited to this address an
                  administrative fee will be charged.
                </div>
              </div>
            </div>
          </div>
          <div class="recharge_estimated_price" v-if="walletOperating == 1">
            <div class="price_convert">
              <el-input class="price_input" v-model="walletAmount" placeholder="">
                <template #prefix>
                  <img v-if="operatingCoin == 'ETH'" src="@/assets/svg/user/icon_ethereum.svg" alt="">
                  <img v-else src="@/assets/svg/user/icon_usdt.svg" alt="">
                </template>
              </el-input>
              <div class="convert_interval">~</div>
              <el-input class="price_input" readonly="readonly" v-model="convertUsdt" placeholder="">
                <template #prefix>
                  <img src="@/assets/svg/user/icon_ethereum.svg" alt="">
                </template>
              </el-input>
            </div>
            <div class="price_convert_text">The value of ETH may change between now and the time we receive your payment
            </div>
          </div>
          <div class="withdraw_relevant" v-else>
            <div class="withdraw_tips_text">
              Please enter the Ethereum wallet address you wish to receive the funds on. Once confirmed, the withdrawal is
              usually processed within a few minutes.
            </div>
            <div class="withdraw_item">
              <div class="withdraw_item_lable">
                <span>RECEIVING ETHEREUM ADDRESS</span>
                <span class="required">*</span>
              </div>
              <el-input class="withdraw_addr_input" v-model="walletAddr"
                placeholder="Paste your Ethereum wallet address here"></el-input>
            </div>
            <div class="withdraw_item">
              <div class="withdraw_item_lable">
                <span>RECEIVING ETHEREUM ADDRESS</span>
                <span class="required">*</span>
              </div>
              <div class="withdraw_convert">
                <div class="price_convert">
                  <el-input class="price_input" v-model="walletAmount" placeholder="">
                    <template #prefix>
                      <img v-if="operatingCoin == 'ETH'" src="@/assets/svg/user/icon_ethereum.svg" alt="">
                      <img v-else src="@/assets/svg/user/icon_usdt.svg" alt="">
                    </template>
                  </el-input>
                  <div class="convert_interval">~</div>
                  <el-input class="price_input" readonly="readonly" v-model="convertUsdt" placeholder="">
                    <template #prefix>
                      <img src="@/assets/svg/user/icon_ethereum.svg" alt="">
                    </template>
                  </el-input>
                </div>
                <div class="withdraw_btn">REQUEST WITHDRAW</div>
              </div>
              <div class="withdraw_fee">
                {{ `Network fee: 0.03 ${operatingCoin}` }}
              </div>
              <div class="withdraw_item_error">
                Insufficient amount to cover withdrawal feeMinimum
              </div>
            </div>
            <div class="withdraw_hint">
              <p>*You will receive the specified Ethereum amount to your withdrawal address</p>
              <p>*The value subtracted from your balance may vary between now and the time we process your withdrawal</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Assets from "./assets.vue";
export default {
  name: 'myWallet',
  components: {
    Assets
  },
  data() {
    return {
      coin: "ETH",
      coinList: ["ETH", "USDT", "BTC"],
      logsData: [
        { log_type: "DEPOST", amount: 0.001, eth_amount: 0.001, status: "SUCCESS", creation_time: "2023/03/05 12:10:00" },
        { log_type: "WITHDRAW", amount: 0.001, eth_amount: 0.001, status: "IN PROGRESS", creation_time: "2023/03/05 12:10:00" },
        { log_type: "DEPOST", amount: 0.001, eth_amount: 0.001, status: "SUCCESS", creation_time: "2023/03/05 12:10:00" },
        { log_type: "WITHDRAW", amount: 0.001, eth_amount: 0.001, status: "REJECTED", creation_time: "2023/03/05 12:10:00" },
        { log_type: "DEPOST", amount: 0.001, eth_amount: 0.001, status: "FAILED", creation_time: "2023/03/05 12:10:00" },
      ],
      bg: {
        point: require("@/assets/svg/user/point_bg.svg"),
        purchase_history: require("@/assets/svg/user/purchase_history_bg.svg")
      },

      showRecharge: false,
      walletOperating: 1, // 1 充币；2 提币；
      operatingCoin: null, // 操作币种
      walletAmount: null,

      showReplenish: false, // 充值补充
      walletAddr: null,
    };
  },
  computed: {
    convertUsdt() {
      const { walletAmount } = this;
      return walletAmount
    }
  },
  methods: {
    // 关闭创建弹窗
    handleClose(done) {
      if (done) {
        done();
        return
      }

      this.showReplenish = false;
      this.showRecharge = false;
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
};
</script>
<style lang="scss" scoped>
@import "./components/wallet.scss";
</style>