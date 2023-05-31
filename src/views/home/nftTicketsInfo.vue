<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_info_wrapper">
      <div class="nft_details">
        <div class="nft_details_l border_bg">
          <img :src="nftInfo && nftInfo.img" alt="">
          <div class="tips_round" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'"
            :class="[nftInfo && nftInfo.orderType == 'LIMITED_TIME' ? 'time' : 'price']">
            <span>{{ dayLeft(nftInfo && nftInfo.endTime) }}</span>
            <span>{{ `${nftInfo && nftInfo.maximumPurchaseQuantity} TICKETS LEFT` }}</span>
          </div>
          <div class="tips_round finish" v-else-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
            <span>COMPLETED</span>
          </div>
          <div class="tips_round aborted" v-else-if="nftInfo && nftInfo.orderStatus == 'CLOSED'">
            <span>ABORTED</span>
          </div>
        </div>
        <div class="nft_details_r_bg border_bg">
          <div class="nft_details_r">
            <div class="nft_name text-ellipsis">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}` }}</div>
            <div class="nft_activity">
              <div class="price">
                <span class="title">value：</span>
                <span class="val">{{ nftInfo && nftInfo.totalPrice }}</span>
                <span class="unit">ETH</span>
              </div>
              <div class="time" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'">
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_info_price.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_info_time.svg" alt="">
                <div v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" class="time-text">
                  {{ `${nftInfo && nftInfo.maximumPurchaseQuantity || 0} TICKETS LEFT` }}
                </div>
                <div v-else class="time-text">{{ `CLOSE: ${dateFormat(nftInfo && nftInfo.endTime)}` }}</div>
              </div>
              <div class="finish" v-else-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
                <img src="@/assets/svg/home/icon_time_drawn.svg" alt="">
                <div class="time-text">COMPLETED</div>
              </div>
              <div class="aborted" v-else>
                <img src="@/assets/svg/home/icon_time_aborted.svg" alt="">
                <div class="time-text">ABORTED</div>
              </div>

            </div>
            <div class="creator">
              <div class="created" v-if="nftInfo && nftInfo.projectParty">
                <span class="title">Created by</span>
                <span>{{ nftInfo && nftInfo.projectParty }}</span>
              </div>
              <div class="owner" v-if="nftInfo && nftInfo.owner">
                <span class="title">Owner：</span>
                <span>{{ nftInfo && nftInfo.owner }}</span>
              </div>
            </div>
            <div class="buy_relevant" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'">
              <div class="enter_relevant">
                <div class="title">Enter competition</div>
                <div class="buy_tips" :style="nftInfo.orderType == 'LIMITED_TIME' && 'visibility: hidden;'">
                  You used <span>0</span> of <span>{{ nftInfo && nftInfo.maximumPurchaseQuantity || 0 }}</span> tickets
                </div>
              </div>
              <div class="buy_box">
                <div class="buy_tips">Purchase limited NFT to enter：</div>
                <el-input v-model.number="buyForm.votes" style="width: 100%;" class="buy_input" type="number" min="0"
                  :max="nftInfo && nftInfo.maximumPurchaseQuantity"
                  :placeholder="nftInfo.orderType == 'LIMITED_TIME' ? 'Please enter' : `Please enter 1-${nftInfo && nftInfo.maximumPurchaseQuantity || 0}`">
                </el-input>
              </div>
              <div class="payment_box">
                <!-- <div class="payment_method">
                <div class="balance">Purchase with balance</div>
                <el-switch v-model="buyForm.type" inline-prompt active-text="ON" inactive-text="OFF"
                  active-color="#13ce66" inactive-color="#ff4949" active-value="balance" inactive-value="wallet" />
              </div> -->
                <el-button style="width: 100%;" class="submit_payment" type="primary" @click="submitPayment()">
                  {{ `${buyPrice} ETH` }}
                </el-button>
                <div class="buy_hint">Use the balance to buy without paying GAS</div>
              </div>
            </div>
            <div class="nft_end" v-else>
              <div class="winning_interval"></div>
              <div class="winning_box" v-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
                <div class="winning_text">
                  <span>WINNER</span>
                  <img src="@/assets/svg/home/icon_more.svg" alt="">
                </div>
                <div class="avatar">
                  <img :src="drawnInfo && drawnInfo.userImg" alt="">
                </div>
                <div class="user_name">
                  {{ drawnInfo && drawnInfo.userName || "USER NAME" }}
                </div>
                <div class="tickets_num">
                  {{ `${drawnInfo && drawnInfo.num || 0} Tickets` }}
                </div>
              </div>
              <div class="return_box" v-else>
                The tournament did not reach its sell-out target and your purchased tickets have been refunded to the
                balance, worth
                <span>{{ new bigNumber(nftInfo && nftInfo.price ||
                  0).multipliedBy(drawnInfo &&
                    drawnInfo.num || 0) }}</span>
                ETH
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nft_buy_info">
        <div class="nft_buy_info_l border_bg">
          <el-tabs v-model="activeType" class="type_tabs" @tab-click="handleClick">
            <el-tab-pane label="ACTIVITY" name="activity"></el-tab-pane>
            <el-tab-pane :label="`PARTICIPANTS(${participantsTotal})`" name="participants"></el-tab-pane>
          </el-tabs>
          <div class="buy_list">
            <div class="buy_item" v-for="(item, index) in buyData" :key="index">
              <div class="buy_item_l">
                <img :src="item.userImg">
              </div>
              <div class="buy_item_r" :class="[activeType == 'participants' && 'participants']">
                <div class="buy_info">
                  <div class="buy_name">{{ item.userName }}</div>
                  <div class="buy_time" v-if="activeType != 'participants'">{{ timeFormat(item.time) }}</div>
                </div>
                <div class="buy_other">
                  <div class="buy_val">{{ `${item.total} TICKETS` }} </div>
                  <div class="buy_id" v-if="activeType != 'participants'">
                    {{ `Reward ID：${item.startNum}-${item.endNum}` }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="load_more" v-if="!finished" @click="nextPage()">
            <div class="load_btn">
              <span>Load more</span>
              <img src="@/assets/svg/user/icon_more.svg" alt="">
            </div>
          </div>
        </div>
        <div class="nft_buy_info_r border_bg">
          <div class="description_box">
            <div class="description_text">DESCRIPTION</div>
            <div class="nft_info">
              <span>Enter now for a chance to win</span>
              <span class="nft_name text-ellipsis">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}`
              }}</span>
            </div>
            <div class="nft_description" v-html="detailData && detailData.description"></div>
          </div>
          <div class="traits_box">
            <div class="traits_text">DESCRIPTION</div>
            <div class="traits_list">
              <div class="traits_item" v-for="(item, index) in detailData && detailData.attributes" :key="index">
                <div class="traits_item_name">{{ item.trait_type }}</div>
                <div class="traits_item_val">{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div class="invite_box">
            <div class="invite_text">SHARE THIS COMPETITION</div>
            <div class="choose_invite_code">
              <div>Choose referrals code</div>
              <el-select v-model="inviteVal" @change="onCopy">
                <el-option v-for="(item, index) in inviteDrop" :key="index" :label="item.inviteCode"
                  :value="item.inviteCode" />
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="ending_soon_box">
        <div class="ending_soon_text">ENDING SOON</div>
        <div class="ending_soon_list">
          <div class="ending_soon_item border_bg" v-for="(item, index) in endingSoon" :key="index">
            <div class="image_box">
              <div class="tips_round" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
                <img v-if="item.orderType == 'LIMITED_TIME'" src="@/assets/svg/home/icon_info_time_white.svg" alt="">
                <img v-else src="@/assets/svg/home/icon_info_price_white.svg" alt="">
                <span v-if="item.orderType == 'LIMITED_TIME'">{{ dayLeft(item && item.endTime) }}</span>
                <span v-else>{{ `${item.limitNum} TICKETS LEFT` }}</span>
              </div>
              <div class="image_tag">#{{ item && item.tokenId }}</div>
              <img :src="item && item.nftImage" alt="">
            </div>
            <div class="nft_name">
              <span>{{ item && item.seriesName }}</span>
              <img src="@/assets/svg/home/icon_certified.svg" alt="">
            </div>
            <div class="nft_price">{{ item && item.price }}ETH</div>
            <div class="buy_btn" @click="enterNow(item)">
              <span>ENTER NOW</span>
            </div>
            <div class="remaining_votes">{{ `${item && item.limitNum || 0} TICKETS SOLD` }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getOneBuyInfo,
  buyNftBalance,
  buyNftWallet,
  getLatestBuyRecord,
  getUserBuyRecord,
  getEndingSoon,
  getLottery
} from "@/services/api/oneBuy";
import {
  rebatesFindList,
} from "@/services/api/invite";
import bigNumber from "bignumber.js";
import { useHeaderStore } from '@/store/header.js';
import { accurateDecimal } from "@/utils";
export default {
  name: 'ntfTicketsInfo',
  data() {
    return {
      orderId: null,
      nftInfo: {},
      inviteVal: null,
      inviteDrop: [],
      detailData: null,
      endingSoon: [],
      buyForm: {
        votes: null,
        type: "balance"
      },
      activeType: "activity",
      buyData: [],
      participantsTotal: 0,
      page: 1,
      size: 5,
      total: 0,
      finished: false,
      timer: null,
      drawnInfo: null
    };
  },
  computed: {
    buyPrice() {
      const { buyForm: { votes }, nftInfo } = this;
      if (!votes) return 0;
      if (!nftInfo || !nftInfo.price) return 0;
      return new bigNumber(votes).multipliedBy(nftInfo.price) || 0;
    }
  },
  methods: {
    bigNumber: bigNumber,
    // 获取Nft信息
    async fetchOneBuyInfo() {
      const res = await getOneBuyInfo({
        orderNumber: this.orderId
      });
      if (res && res.code == 200) {
        this.nftInfo = res.data;
        this.detailData = this.nftInfo && JSON.parse(this.nftInfo.detail);
        if (this.nftInfo.orderStatus != 'IN_PROGRESS') {
          const userStore = useHeaderStore();
          const { walletAddr } = userStore;
          const resDrawn = await getLottery({
            orderNumber: this.orderId,
            address: walletAddr && walletAddr || null
          })

          if (resDrawn && resDrawn.code == 200) {
            this.drawnInfo = resDrawn.data
          }
        }
      }
    },
    // 获取即将结束的一元购活动
    async fetchEndingSoon() {
      const res = await getEndingSoon({ page: 1, size: 6 });
      if (res && res.code == 200) {
        this.endingSoon = res.data.records;
      }
    },
    handleClick() {
      this.buyData = [];
      this.fetchBuyRecord();
    },
    // 购买一元购门票
    async submitPayment() {
      const { orderId, buyForm: { votes, type } } = this;
      let res = null;
      if (type == "balance") {
        res = await buyNftBalance({
          orderNumber: orderId,
          num: votes
        });
      } else {
        res = await buyNftWallet({
          orderNumber: orderId,
          num: votes
        });
      }

      if (res && res.code == 200) {
        this.$message.success("购买成功！");
        this.fetchOneBuyInfo();
        this.fetchBuyRecord();
      }

    },
    // 剩余天数
    dayLeft(event) {
      if (!event) return "ENDED"
      const setTime = new Date(event).getTime();
      const nowTime = new Date().getTime();
      if (nowTime >= setTime) return "ENDED";

      const seconds = 1000;
      const minute = seconds * 60;
      const hour = minute * 60;
      const day = hour * 24;
      const restSec = Number(new bigNumber(setTime).minus(nowTime).toFixed(2));
      const days = accurateDecimal(new bigNumber(restSec).dividedBy(day), 2);
      // 剩余天数
      return `${days} DAY LEFT`;
    },
    // 最新购买
    async fetchBuyRecord(isSearch = true) {
      const { size, orderId } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      let res = null;
      if (this.activeType == "activity") {
        res = await getLatestBuyRecord({
          page: _page,
          size: size,
          orderNumber: orderId
        });
      } else {
        res = await getUserBuyRecord({
          page: _page,
          size: size,
          orderNumber: orderId
        });
      }

      if (res && res.code == 200) {

        if (isSearch) {
          this.buyData = res.data.records;
          return
        }

        if (res.data.records.length == 0) {
          this.finished = true;
        }

        this.buyData.push.apply(this.buyData, res.data.records);
      }
    },
    // 获取参与者总数
    async fetchUserBuyRecord() {
      const { page, size, orderId } = this;
      const res = await getUserBuyRecord({
        page: page,
        size: size,
        orderNumber: orderId
      });
      if (res && res.code == 200) {
        this.participantsTotal = res.data.total;
      }
    },
    // 加载更多
    nextPage() {
      this.page++;
      if (this.activeType == "activity") {
        this.fetchBuyRecord(false)
      }
    },
    // 邀请资产列表
    async fetchRebatesFindList() {
      const res = await rebatesFindList();
      if (res && res.code == 200) {
        this.inviteDrop = res.data;
      }
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
    // 参加赛事
    enterNow(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
      this.orderId = event.orderNumber;
      this.buyForm = {
        votes: null,
        type: "balance"
      };
      this.activeType = "activity";
      this.fetchOneBuyInfo();
      this.fetchEndingSoon();
      this.fetchBuyRecord();
    },
    /*
     * 时间戳的 yyyy-MM-dd HH:mm:ss 格式化
     */
    dateFormat(event) {
      let date = new Date(event);
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      let hour = date.getHours()
      let minu = date.getMinutes()
      let sec = date.getSeconds()

      month = month >= 10 ? month : '0' + month
      day = day >= 10 ? day : '0' + day
      hour = hour >= 10 ? hour : '0' + hour
      minu = minu >= 10 ? minu : '0' + minu
      sec = sec >= 10 ? sec : '0' + sec

      return `${year}-${month}-${day} ${hour}:${minu}:${sec}`
    },
    /** 
     * @description 友好的时间显示
     * @param string event 时间
     */
    timeFormat(event) {
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
    /**
     * @description: 格式化地址
     */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{6})\S+(\S{4})$/;
      return event.replace(reg, "$1...$2");
    },
  },
  watch: {
    "buyForm.votes": function (newVal) {
      const { nftInfo } = this;
      const values = new bigNumber(nftInfo.totalPrice).dividedBy(nftInfo.price).toFixed(0); // 总票数

      let available = new bigNumber(values).dividedBy(4).toFixed(0); // 可购买数量 总票数的4/1;

      if (!nftInfo || !nftInfo.totalPrice || !nftInfo.price || values < 1) return

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      if (newVal == 0 || !newVal) return;

      this.timer = setTimeout(() => {
        if (available <= nftInfo.maximumPurchaseQuantity) {
          if (newVal > available) {
            this.buyForm.votes = available;
          }
        }

        this.$forceUpdate();
      }, 300);
    },
  },
  created() {
    // 获取一元购 ID
    const { id } = this.$route.query;
    this.orderId = id;
    this.fetchOneBuyInfo();
    this.fetchEndingSoon();
    this.fetchBuyRecord();
    this.fetchUserBuyRecord();

    this.fetchRebatesFindList(); // 邀请
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTicketsInfo.scss";
</style>
<style lang="scss">
.el-select__popper {
  border: none !important;
  background-color: #1d0f36 !important;

  .el-scrollbar__view {
    margin: 0.625rem 0 !important;
    padding: 0 !important;
  }

  .el-select-dropdown__item {
    color: #a9a4b4;
    font-size: 1rem;
    line-height: 1.6;
    padding: 0.625rem 1.25rem;
    height: auto;

    &.selected {
      color: white;
    }

    &:hover,
    &.hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .el-popper__arrow {
    display: none;
  }
}
</style>