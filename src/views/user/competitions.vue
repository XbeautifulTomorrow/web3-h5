<template>
  <div :class="['competitions_wrapper', !count > 0 && 'no_data_bg']">
    <div class="competitions_text">
      <img src="@/assets/svg/user/icon_competitions.svg" alt="">
      <span>COMPETITION</span>
    </div>
    <div class="competitions_panel">
      <div class="choose_box">
        <div class="coin_item" v-for="(item, index) in tabsList" :key="index" @click="handleChange(item)"
          :class="[activeType == item.value && 'active']">
          {{ item.label }}
        </div>
      </div>
      <div class="entered_box" v-if="count > 0 && activeType == 'HISTORY'">
        <div class="entered_item" v-for="(item, index) in enteredList" :key="index">
          <div class="image_box">
            <img class="nft_img" :src="item && item.nftImage" alt="">
            <div class="tips_round" v-if="item.currentStatus == 'IN_PROGRESS'"
              :class="['tips_round', item.orderType == 'LIMITED_TIME' ? 'time' : 'price']">
              <img v-if="item.orderType == 'LIMITED_TIME'" src="@/assets/svg/home/icon_info_time_white.svg" alt="">
              <img v-else src="@/assets/svg/home/icon_info_price_white.svg" alt="">
              <span v-if="item.orderType == 'LIMITED_TIME'">
                <span v-if="dateDiff(item && item.endTime) > 1">
                  {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                </span>
                <countDown v-else v-slot="timeObj" :time="item && item.endTime">
                  {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                </countDown>
              </span>
              <span v-else>
                {{ `${new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold || 0)} TICKETS LEFT` }}
              </span>
            </div>
            <div class="tips_round end" v-else>
              {{ ` Ended on ${timeFormat(item.endTime)}` }}
            </div>
            <div class="image_tag text-ellipsis">#{{ item && item.tokenId }}</div>
          </div>
          <div class="nft_name">
            <span>{{ item && item.seriesName }}</span>
            <img src="@/assets/svg/home/icon_certified.svg" alt="">
          </div>
          <div class="nft_price">{{ item && item.price }}ETH</div>
          <div class="buy_btn" @click="enterNow(item)" v-if="item.currentStatus == 'IN_PROGRESS'">
            <span>BUY MORE</span>
          </div>
          <div class="buy_btn winner" v-else-if="item.currentStatus == 'DRAWN'">
            <span>WINNER</span>
            <img src="@/assets/svg/user/default_avatar.svg" alt="">
            <span v-if="userInfo.id != item.winningAddress">
              {{ item.winningAddress || "userName" }}
            </span>
            <span v-else>YUO</span>
          </div>
          <div class="buy_btn winner" v-else>
            <span>CLOSED</span>
          </div>
          <div class="remaining_votes">
            You used <span>{{ item && item.userNum || 0 }}</span> of <span>
              {{ maxBuyNum(item) }}
            </span> tickets
          </div>
        </div>
      </div>
      <div class="my_competitions_panel" v-else-if="count > 0 && activeType == 'MY_COMPETITIONS'">
        <div class="my_competitions_box">
          <div class="entered_item" v-for="(item, index) in enteredList" :key="index">
            <div class="image_box">
              <img class="nft_img" :src="item && item.nftImage" alt="">
              <div class="tips_round" v-if="item.currentStatus == 'IN_PROGRESS'"
                :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
                <img v-if="item.orderType == 'LIMITED_TIME'" src="@/assets/svg/home/icon_info_time_white.svg" alt="">
                <img v-else src="@/assets/svg/home/icon_info_price_white.svg" alt="">
                <span v-if="item.orderType == 'LIMITED_TIME'">
                  <span v-if="dateDiff(item && item.endTime) > 1">
                    {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                  </span>
                  <countDown v-else v-slot="timeObj" :time="item && item.endTime">
                    {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                  </countDown>
                </span>
                <span v-else>
                  {{ `${new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold || 0)} TICKETS LEFT` }}
                </span>
              </div>
              <div class="tips_round" v-else :class="item.currentStatus == 'CANCELLED' ? 'cancel' : 'sale'">
                <span v-if="item.currentStatus == 'CANCELLED'">CANCEL</span>
                <span v-else>SALE</span>
              </div>
              <div class="image_tag text-ellipsis">#{{ item && item.tokenId }}</div>
            </div>
            <div class="nft_name">{{ item && item.seriesName }}</div>
            <div class="nft_price">{{ item && item.price }}ETH</div>
            <div class="cancel_btn" v-if="item.currentStatus == 'IN_PROGRESS'"
              :class="{ disabled: item.numberOfTicketsSold }" @click="cancelOrder(item)">
              <span>CANCEL COMPETITION</span>
            </div>
            <div class="delete_btn" v-else @click="delOrder(item)">Delete</div>
            <div class="remaining_votes">
              {{ `${item && item.numberOfTicketsSold || 0} ${item && item.numberOfTicketsSold > 1 ? 'TICKETS SOLD' :
                'TICKET SOLD'}` }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no_date">
        <span>NO COMPETITION FOUND</span>
      </div>
    </div>
    <div class="pagination-box" v-if="count > size">
      <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
        layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
    </div>
    <el-dialog v-model="showCabcel" width="43.75rem" lock-scroll class="dialog_competition" :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_title">CLOSE COMPETITION</div>
      <div class="tips_text">
        <span v-if="isCancel">
          Are you sure you want to cancel the tournament you created? After cancellation the following
          NFTs will be returned to your inventory and you can create a new tournament at any time
        </span>
        <span v-else>
          A user has already participated in a tournament you have created and it cannot be cancelled to protect the
          rights of the participants
        </span>
      </div>
      <div class="image_box">
        <img :src="competitionNft && competitionNft.nftImage" alt="">
      </div>
      <div class="nft_info">
        <div class="nft_name">{{ competitionNft && competitionNft.seriesName }}</div>
        <div class="nft_id text-ellipsis">#{{ competitionNft && competitionNft.tokenId }}</div>
      </div>
      <div class="btn-group">
        <div class="cancel" @click="handleClose()">
          <span v-if="isCancel">THINK AGAIN</span>
          <span v-else>CLOSED</span>
        </div>
        <div v-if="isCancel" class="confirm" @click="onCancel()">CANCEL COMPETITION</div>
      </div>
    </el-dialog>
  </div>
</template>    
<script>
import {
  getOneBuyList,
  cancelNftOrder,
  delNftOrder
} from "@/services/api/oneBuy";

import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { openUrl, dateDiff, timeFormat } from "@/utils";
export default {
  name: 'UserCompetitions',
  components: {
    countDown
  },
  data() {
    return {
      tabsList: [{
        label: "ENTERED",
        value: "HISTORY"
      }, {
        label: "MY COMPETITIONS",
        value: "MY_COMPETITIONS"
      }],
      activeType: "HISTORY",
      enteredList: [],
      finishList: [],
      showCabcel: false,
      competitionNft: null,
      isCancel: true,
      page: 1,
      size: 30,
      count: 0,
    };
  },
  computed: {
    ...mapStores(useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
  },
  methods: {
    dateDiff: dateDiff,
    timeFormat: timeFormat,
    bigNumber: bigNumber,
    handleChange(event) {
      this.activeType = event.value;
    },
    // 用户相关订单
    async fetchOneBuyList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      const res = await getOneBuyList({
        type: this.activeType,
        page: _page,
        size: size
      });
      if (res && res.code == 200) {
        this.count = res.data.total;
        this.enteredList = res.data.records;
      }
    },
    // 计算可购买最大票数
    maxBuyNum(event) {
      const { price, ticketPrice, orderType, maximumPurchaseQuantity } = event;

      let maxNum = 0; // 可购买最大票数
      if (orderType == "LIMITED_TIME") {
        if (!price) return 0;
        if (!ticketPrice) return 0;
        maxNum = Number(Math.ceil(new bigNumber(price).dividedBy(ticketPrice).dividedBy(4)));
      } else {
        if (!maximumPurchaseQuantity) return 0;
        maxNum = Number(Math.ceil(new bigNumber(price).dividedBy(ticketPrice).dividedBy(4)));
      }

      return maxNum
    },
    // 参加赛事
    enterNow(event) {
      let routeData = this.$router.resolve({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
      openUrl(routeData.href)
    },
    // 取消赛事
    cancelOrder(event) {
      if (event.numberOfTicketsSold > 0) {
        this.$message.error("There are already users participating in this event, but the removal failed");
        return
      }

      this.competitionNft = event;
      this.showCabcel = true;
    },
    // 取消订单确认
    async onCancel() {
      const res = await cancelNftOrder({
        orderNumber: this.competitionNft.orderNumber
      });
      if (res && res.code == 200) {
        this.$message.success("Cancel successfully");
        this.fetchOneBuyList();
        this.handleClose();
      }
    },
    // 删除订单
    async delOrder(evnet) {
      const res = await delNftOrder({
        orderNumber: evnet.orderNumber
      });
      if (res && res.code == 200) {
        this.$message.success("successfully deleted");
        this.fetchOneBuyList();
      }
    },
    // 关闭弹窗
    handleClose(done) {
      if (done) {
        done();
        return
      }
      this.showCabcel = false;
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchOneBuyList(false);
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
    activeType() {
      this.fetchOneBuyList();
    }
  },
  created() {
    this.fetchOneBuyList();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/competitions.scss";
</style>
