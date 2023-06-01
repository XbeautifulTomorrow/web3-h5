<template>
  <div class="wrapper_bg">
    <div class="competitions_wrapper">
      <div class="competitions_text">COMPETITIONS</div>
      <div class="competitions_panel_bg border_bg">
        <div class="competitions_panel">
          <el-tabs v-model="activeType" class="type_tabs" @tab-change="handleChange">
            <el-tab-pane label="ENTERED" name="ENTERED"></el-tab-pane>
            <el-tab-pane label="MY COMPETITIONS" name="MY_COMPETITIONS"></el-tab-pane>
            <el-tab-pane label="HISTORY" name="HISTORY"></el-tab-pane>
          </el-tabs>
          <div class="entered_box" v-if="activeType == 'ENTERED'">
            <div class="entered_item" v-for="(item, index) in enteredList" :key="index">
              <div class="image_box">
                <img :src="item && item.nftImage" alt="">
                <div class="tips_round" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
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
                <div class="image_tag text-ellipsis">#{{ item && item.tokenId }}</div>
              </div>
              <div class="nft_name">
                <span>{{ item && item.seriesName }}</span>
                <img src="@/assets/svg/home/icon_certified.svg" alt="">
              </div>
              <div class="nft_price">{{ item && item.price }}ETH</div>
              <div class="buy_btn" @click="enterNow(item)">
                <span>ENTER NOW</span>
              </div>
              <div class="remaining_votes">
                You used <span>{{ item && item.userNum || 0 }}</span> of <span>
                  {{ item && item.numberOfTicketsSold || 0 }}
                </span> tickets
              </div>
            </div>
          </div>
          <div class="my_competitions_panel" v-else-if="activeType == 'MY_COMPETITIONS'">
            <div class="my_competitions_box">
              <div class="entered_item" v-for="(item, index) in enteredList" :key="index">
                <div class="image_box">
                  <img :src="item && item.nftImage" alt="">
                  <div class="tips_round" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
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
                  <div class="image_tag text-ellipsis">#{{ item && item.tokenId }}</div>
                </div>
                <div class="nft_name">{{ item && item.seriesName }}</div>
                <div class="nft_price">{{ item && item.price }}ETH</div>
                <div class="cancel_btn" :class="{ disabled: item.numberOfTicketsSold }" @click="cancelOrder(item)">
                  <span>Take down</span>
                </div>
                <div class="remaining_votes">
                  {{ `${item && item.numberOfTicketsSold || 0} TICKETS SOLD` }}
                </div>
              </div>
            </div>
            <div class="closed_panel">
              <div class="closed_interval">
                <img src="@/assets/svg/user/icon_closed_interval.svg" alt="">
                <span>CLOSED</span>
                <img src="@/assets/svg/user/icon_closed_interval.svg" alt="">
              </div>
              <div class="my_competitions_box">
                <div class="entered_item" v-for="(item, index) in finishList" :key="index">
                  <div class="image_box">
                    <img :src="item && item.nftImage" alt="">
                    <div class="tips_round" :class="item.currentStatus == 'CANCELLED' ? 'cancel' : 'sale'">
                      <span v-if="item.currentStatus == 'CANCELLED'">CANCEL</span>
                      <span v-else>SALE</span>
                    </div>
                    <div class="image_tag text-ellipsis">#{{ item && item.tokenId }}</div>
                  </div>
                  <div class="nft_name">{{ item && item.seriesName }}</div>
                  <div class="nft_price">{{ item && item.price }}ETH</div>
                  <div class="delete_btn " @click="delOrder(item)">Delete</div>
                  <div class="remaining_votes">
                    {{ `${item && item.numberOfTicketsSold || 0} TICKETS SOLD` }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="history_box" v-else>
            <el-table :data="enteredList" style="width: 100%" class="table_container">
              <el-table-column prop="nftImage" min-width="160px" label="NFT DETAIL">
                <template #default="scope">
                  <div class="nft_info">
                    <img :src="scope.row.nftImage" alt="">
                    <div class="info_text">
                      <div class="name text-ellipsis">{{ `${scope.row.seriesName} #${scope.row.tokenId}` }}</div>
                      <div class="price">{{ `${scope.row.price} ETH` }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="limitNum" label="LIMIT">
                <template #default="scope">
                  <div v-if="scope.row.orderType == 'LIMITED_TIME'">
                    {{ `${scope.row.limitDay || 0} Days` }}
                  </div>
                  <div v-else>
                    {{ `${scope.row.limitNum || 0} Tickets` }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="ticketPrice" label="UNIT PRICE">
                <template #default="scope">
                  {{ `${scope.row.ticketPrice || 0} ETH` }}
                </template>
              </el-table-column>
              <el-table-column prop="userNum" label="YOUR TICKETS">
                <template #default="scope">
                  {{ `${scope.row.userNum || 0} Tickets` }}
                </template>
              </el-table-column>
              <el-table-column prop="winningAddress" label="WINNER">
                <template #default="scope">
                  <div class="winner" v-if="scope.row.currentStatus == 'DRAWN'">
                    <img src="@/assets/svg/user/default_avatar.svg" alt="">
                    <span v-if="userInfo.id != scope.row.winningAddress">
                      {{ scope.row.winningAddress && formatAddr(scope.row.winningAddress) || "userName" }}
                    </span>
                    <span v-else>YUO</span>
                  </div>
                  <div class="cancel" v-if="scope.row.currentStatus == 'CANCELLED'">CANCELED</div>
                </template>
              </el-table-column>
              <el-table-column prop="endTime" label="END DATE">
                <template #default="scope">
                  {{ timeFormat(scope.row.endTime) }}
                </template>
              </el-table-column>
              <el-table-column label="DETAIL">
                <template #default="scope">
                  <div class="link_box">
                    <img @click="enterNow(scope.row)" src="@/assets/svg/user/icon_share.svg" alt="">
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-box" v-if="count > 20">
              <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
                layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="showCabcel" width="43.75rem" lock-scroll class="dialog_competition" :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_title">Create competition</div>
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
      activeType: "ENTERED",
      enteredList: [],
      finishList: [],
      showCabcel: false,
      competitionNft: null,
      isCancel: true,
      page: 1,
      size: 5,
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
      console.log(event);
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
        size: this.activeType == "HISTORY" ? size : 9999
      });
      if (res && res.code == 200) {
        const nftTickets = res.data.records;
        this.count = res.data.total;
        if (this.activeType == "MY_COMPETITIONS") {
          this.enteredList = [];
          this.finishList = [];
          nftTickets.forEach(element => {
            if (element.currentStatus == "IN_PROGRESS") {
              this.enteredList.push(element);
            } else {
              this.finishList.push(element);
            }
          });

          return
        }

        this.enteredList = nftTickets;
      }
    },
    // 参加赛事
    enterNow(event) {
      let routeData = this.$router.resolve({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
      openUrl(routeData.href)
    },
    // 取消赛事
    cancelOrder(event) {
      if (event.numberOfTicketsSold > 0) {
        this.$message.error("该赛事已有用户参与，下架失败");
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
    // 获取展示类型
    const { type } = this.$route.query;
    if (!type) {
      this.fetchOneBuyList();
    }
    this.activeType = type || "ENTERED";
  }
};
</script>
<style lang="scss" scoped>
@import "./components/competitions.scss";
</style>
