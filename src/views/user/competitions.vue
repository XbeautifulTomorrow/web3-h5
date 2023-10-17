<template>
  <div :class="['competitions_wrapper', !count > 0 && 'no_data_bg']">
    <div class="competitions_operating">
      <div class="competitions_text">
        <img src="@/assets/svg/user/icon_competitions.svg" alt="" />
        <span>{{ $t("user.competition") }}</span>
      </div>
      <div class="operating_btns">
        <div class="operating_item" @click="showCreateCom = true">
          {{ $t("homeReplenish.startBtn") }}
        </div>
      </div>
    </div>
    <div class="competitions_panel">
      <div class="operating_box">
        <div class="choose_box">
          <div
            class="coin_item"
            v-for="(item, index) in tabsList"
            :key="index"
            @click="handleChange(item)"
            :class="[activeType == item.value && 'active']"
          >
            <span>{{ item.label }}</span>
            <div class="new_dot" v-if="item.showDot"></div>
          </div>
        </div>
        <div class="status_box">
          <div class="status_text">{{ $t("user.status") }}</div>
          <el-select
            v-model="competitionStatus"
            @change="fetchOneBuyList()"
            class="nft_type"
            clearable
            :placeholder="$t('homeReplenish.all')"
          >
            <el-option
              v-for="(item, index) in statuDrop"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="entered_box" v-if="count > 0 && activeType == 'ENTERED'">
        <div
          class="entered_item"
          v-for="(item, index) in enteredList"
          :key="index"
        >
          <div class="image_box" @click="enterNow(item)">
            <Image
              fit="cover"
              class="nft_img"
              v-if="item.orderType == 'LIMITED_PRICE_COIN'"
              :src="require('@/assets/svg/user/create_eth.webp')"
            />
            <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
            <div class="new_dot" v-if="item.redDotStatus == 'FALSE'"></div>
            <div
              class="tips_round"
              v-if="item.currentStatus == 'IN_PROGRESS'"
              :class="[
                'tips_round',
                item.orderType == 'LIMITED_TIME' ? 'time' : 'price',
              ]"
            >
              <img
                v-if="item.orderType == 'LIMITED_TIME'"
                src="@/assets/svg/home/icon_info_time_white.svg"
                alt=""
              />
              <img
                v-else
                src="@/assets/svg/home/icon_info_price_white.svg"
                alt=""
              />
              <span v-if="item.orderType == 'LIMITED_TIME'">
                <span v-if="dateDiff(item && item.endTime) > 1">
                  {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                </span>
                <countDown
                  v-else
                  v-slot="timeObj"
                  @onEnd="fetchOneBuyList(false)"
                  :time="item && item.endTime"
                >
                  {{
                    $t("home.timeLeft", {
                      time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}`,
                    })
                  }}
                </countDown>
              </span>
              <span v-else>
                <span
                  v-if="
                    Number(
                      new bigNumber(item.limitNum || 0).minus(
                        item.numberOfTicketsSold || 0
                      )
                    ) > 1
                  "
                >
                  {{
                    $t("home.ticketsLeft", {
                      num: Number(
                        new bigNumber(item.limitNum || 0).minus(
                          item.numberOfTicketsSold || 0
                        )
                      ),
                    })
                  }}</span
                >
                <span v-else>
                  {{
                    $t("home.ticketLeft", {
                      num: Number(
                        new bigNumber(item.limitNum || 0).minus(
                          item.numberOfTicketsSold || 0
                        )
                      ),
                    })
                  }}
                </span>
              </span>
            </div>
            <div
              class="tips_round end"
              v-else-if="item.currentStatus == 'DRAWN'"
            >
              {{ $t("user.endStatus", { date: timeFormat(item.endTime) }) }}
            </div>
            <div
              class="tips_round aborted"
              v-else-if="item.currentStatus == 'CLOSED'"
            >
              {{ $t("user.abortedStatus", { date: timeFormat(item.endTime) }) }}
            </div>
            <div
              class="image_tag text-ellipsis"
              v-if="item.orderType != 'LIMITED_PRICE_COIN'"
            >
              #{{ item && item.tokenId }}
            </div>
          </div>
          <div class="nft_name">
            <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">{{
              item.seriesName || "--"
            }}</span>
            <span v-else>{{ `${item.price} ETH` }}</span>
            <img src="@/assets/svg/home/icon_certified.svg" alt="" />
          </div>
          <div class="nft_price">
            <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">
              {{ `$ ${item.price}` }}
            </span>
            <span v-else>
              {{
                `$ ${accurateDecimal(
                  new bigNumber(exchangeRate).multipliedBy(item.price),
                  4
                )}`
              }}
            </span>
          </div>
          <div
            class="buy_btn"
            @click="enterNow(item)"
            v-if="item.currentStatus == 'IN_PROGRESS'"
          >
            <span>{{ $t("user.buyMore") }}</span>
          </div>
          <div class="buy_btn winner" v-else-if="item.currentStatus == 'DRAWN'">
            <span>{{ $t("ticketsInfo.winner") }}</span>
            <img src="@/assets/svg/user/default_avatar.svg" alt="" />
            <span
              v-if="userInfo && userInfo?.id == item.winningAddress"
              class="you"
              >{{ $t("user.you") }}</span
            >
            <span v-else>
              {{ item.winningName || item.winningAddress }}
            </span>
          </div>
          <div class="buy_btn winner refunded" v-else>
            <span>{{
              new bigNumber(item.userNum || 0).multipliedBy(item.ticketPrice)
            }}</span>
            <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            <span>{{ $t("user.refunded") }}</span>
          </div>
          <div
            class="remaining_votes"
            v-html="
              $t('user.buyTickets', {
                userNum: item.userNum || 0,
                maxNum: maxBuyNum(item),
              })
            "
          ></div>
        </div>
      </div>
      <div
        class="my_competitions_panel"
        v-else-if="count > 0 && activeType == 'MY_COMPETITIONS'"
      >
        <div class="my_competitions_box">
          <div
            class="entered_item"
            v-for="(item, index) in enteredList"
            :key="index"
          >
            <div class="image_box" @click="enterNow(item)">
              <Image
                fit="cover"
                class="nft_img"
                v-if="item.orderType == 'LIMITED_PRICE_COIN'"
                :src="require('@/assets/svg/user/create_eth.webp')"
              />
              <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
              <div class="new_dot" v-if="item.redDotStatus == 'FALSE'"></div>
              <div
                class="tips_round"
                v-if="item.currentStatus == 'IN_PROGRESS'"
                :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'"
              >
                <img
                  v-if="item.orderType == 'LIMITED_TIME'"
                  src="@/assets/svg/home/icon_info_time_white.svg"
                  alt=""
                />
                <img
                  v-else
                  src="@/assets/svg/home/icon_info_price_white.svg"
                  alt=""
                />
                <span v-if="item.orderType == 'LIMITED_TIME'">
                  <span v-if="dateDiff(item && item.endTime) > 1">
                    {{
                      `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT`
                    }}
                  </span>
                  <countDown
                    v-else
                    v-slot="timeObj"
                    @onEnd="fetchOneBuyList(false)"
                    :time="item && item.endTime"
                  >
                    {{
                      $t("home.timeLeft", {
                        time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}`,
                      })
                    }}
                  </countDown>
                </span>
                <span v-else>
                  <span
                    v-if="
                      Number(
                        new bigNumber(item.limitNum || 0).minus(
                          item.numberOfTicketsSold || 0
                        )
                      ) > 1
                    "
                  >
                    {{
                      $t("home.ticketsLeft", {
                        num: Number(
                          new bigNumber(item.limitNum || 0).minus(
                            item.numberOfTicketsSold || 0
                          )
                        ),
                      })
                    }}</span
                  >
                  <span v-else>
                    {{
                      $t("home.ticketLeft", {
                        num: Number(
                          new bigNumber(item.limitNum || 0).minus(
                            item.numberOfTicketsSold || 0
                          )
                        ),
                      })
                    }}
                  </span>
                </span>
              </div>
              <div
                class="tips_round sale"
                v-else-if="item.currentStatus == 'DRAWN'"
              >
                <span>{{ $t("user.sale") }}</span>
              </div>
              <div
                class="tips_round aborted"
                v-else-if="item.currentStatus == 'CLOSED'"
              >
                <span>{{ $t("user.aborted") }}</span>
              </div>
              <div class="tips_round end" v-else>
                <span>{{ $t("user.cancel") }}</span>
              </div>
              <div
                class="image_tag text-ellipsis"
                v-if="item.orderType != 'LIMITED_PRICE_COIN'"
              >
                #{{ item && item.tokenId }}
              </div>
            </div>
            <div class="nft_name">
              <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">{{
                item.seriesName || "--"
              }}</span>
              <span v-else>{{ `${item.price} ETH` }}</span>
              <img src="@/assets/svg/home/icon_certified.svg" alt="" />
            </div>
            <div class="nft_price">
              <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">
                {{ `$ ${item.price}` }}
              </span>
              <span v-else>
                {{
                  `$ ${accurateDecimal(
                    new bigNumber(exchangeRate).multipliedBy(item.price),
                    4
                  )}`
                }}
              </span>
            </div>
            <div
              class="cancel_btn"
              v-if="item.currentStatus == 'IN_PROGRESS'"
              :class="{ disabled: item.numberOfTicketsSold }"
              @click="cancelOrder(item)"
            >
              <span>{{ $t("user.cancelBtn") }}</span>
            </div>
            <div
              class="buy_btn winner refunded"
              v-else-if="item.currentStatus == 'DRAWN'"
            >
              <span>
                {{
                  new bigNumber(item.numberOfTicketsSold || 0)
                    .multipliedBy(item.ticketPrice)
                    .minus(item.serviceFee)
                }}
              </span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              <span>{{ $t("user.claimed") }}</span>
            </div>
            <div class="delete_btn" v-else @click="delOrder(item)">
              {{ $t("user.delete") }}
            </div>
            <div class="remaining_votes">
              <span v-if="item.numberOfTicketsSold > 1">
                {{
                  $t("home.ticketsSold", { num: item.numberOfTicketsSold || 0 })
                }}
              </span>
              <span v-else>
                {{
                  $t("home.ticketSold", { num: item.numberOfTicketsSold || 0 })
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no_date">
        <span>{{ $t("user.noDataCompetition") }}</span>
      </div>
    </div>
    <div class="pagination-box" v-if="count > size">
      <el-pagination
        v-model="page"
        :page-size="size"
        @current-change="handleCurrentChange"
        :pager-count="7"
        layout="prev, pager, next"
        :total="count"
        prev-text="Pre"
        next-text="Next"
      />
    </div>
    <el-dialog
      v-model="showCabcel"
      width="43.75rem"
      lock-scroll
      class="dialog_competition"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="create_title">{{ $t("user.closeBtn") }}</div>
      <div class="tips_text">
        <span v-if="isCancel">{{ $t("user.cancelHint") }}</span>
        <span v-else>{{ $t("user.noCancelHint") }}</span>
      </div>
      <div class="image_box">
        <Image
          fit="cover"
          class="nft_img"
          v-if="competitionNft.orderType == 'LIMITED_PRICE_COIN'"
          :src="require('@/assets/svg/user/create_eth.webp')"
        />
        <Image
          fit="cover"
          class="nft_img"
          v-else
          :src="competitionNft?.nftImage"
        />
      </div>
      <div class="nft_info">
        <div class="nft_name">
          <span v-if="competitionNft.orderType != 'LIMITED_PRICE_COIN'">{{
            competitionNft.seriesName || "--"
          }}</span>
          <span v-else>{{ `${competitionNft.price} USDT` }}</span>
        </div>
        <div
          class="nft_id text-ellipsis"
          v-if="competitionNft.orderType != 'LIMITED_PRICE_COIN'"
        >
          {{ `#${competitionNft?.tokenId}` }}
        </div>
      </div>
      <div class="btn-group">
        <div class="cancel" @click="handleClose()">
          <span v-if="isCancel">{{ $t("user.thinkAgain") }}</span>
          <span v-else>{{ $t("user.closed") }}</span>
        </div>
        <div v-if="isCancel" class="confirm" @click="onCancel()">
          {{ $t("user.cancelBtn") }}
        </div>
      </div>
    </el-dialog>
    <create-com
      v-if="showCreateCom"
      @closeDialogFun="handleClose()"
    ></create-com>
  </div>
</template>    
<script>
import {
  getOneBuyList,
  cancelNftOrder,
  delNftOrder,
  delNewOrderMark,
} from "@/services/api/oneBuy";
import { getCacheTicker } from "@/services/api";
import { i18n } from "@/locales";
const { t } = i18n.global;

import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import bigNumber from "bignumber.js";
import countDown from "@/components/countDown";
import { accurateDecimal, openUrl, dateDiff, timeFormat } from "@/utils";
import createCom from "./components/createComponents.vue";
import Image from "@/components/imageView";
export default {
  name: "UserCompetitions",
  components: {
    countDown,
    createCom,
    Image,
  },
  data() {
    return {
      activeType: "ENTERED",
      competitionStatus: null,
      statuDrop: [
        { label: "IN PROGRESS", value: "IN_PROGRESS" },
        { label: "SALE", value: "DRAWN" },
        { label: "CANCELLED", value: "CANCELLED" },
        { label: "ABORTED", value: "CLOSED" },
      ],
      exchangeRate: null,
      enteredList: [],
      showCabcel: false,
      competitionNft: null,
      isCancel: true,
      page: 1,
      size: 20,
      count: 0,

      showCreateCom: false,
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    newStatus() {
      const headerStore = useHeaderStore();
      return headerStore.newStatus;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    tabsList() {
      const { enteredStatus, myTreasureDrawStatus } = this.newStatus;

      return [
        {
          label: t("user.entered"),
          value: "ENTERED",
          showDot: enteredStatus,
        },
        {
          label: t("user.myCopmetitions"),
          value: "MY_COMPETITIONS",
          showDot: myTreasureDrawStatus,
        },
      ];
    },
  },
  methods: {
    dateDiff: dateDiff,
    timeFormat: timeFormat,
    bigNumber: bigNumber,
    accurateDecimal: accurateDecimal,
    handleChange(event) {
      this.enteredList = [];
      this.activeType = event.value;
      this.fetchOneBuyList();
    },
    // 用户相关订单
    async fetchOneBuyList(isSearch = true) {
      const { competitionStatus, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      const res = await getOneBuyList({
        type: this.activeType,
        status: competitionStatus,
        page: _page,
        size: size,
      });
      if (res && res.code == 200) {
        this.count = res.data.total;
        this.enteredList = res.data.records;
        await delNewOrderMark({ type: this.activeType });

        const headerStore = useHeaderStore();
        headerStore.fetchGlobalNew();
      }
    },
    // 计算可购买最大票数
    maxBuyNum(event) {
      const { price, ticketPrice, orderType, limitNum } = event;

      let maxNum = 0; // 可购买最大票数
      if (orderType == "LIMITED_TIME") {
        if (!price) return 0;
        if (!ticketPrice) return 0;
        maxNum = Number(
          Math.ceil(new bigNumber(price).dividedBy(ticketPrice).dividedBy(4))
        );
      } else if (orderType == "LIMITED_PRICE_COIN") {
        maxNum = Number(Math.ceil(new bigNumber(limitNum).dividedBy(4)));
      } else {
        maxNum = Number(
          Math.ceil(new bigNumber(price).dividedBy(ticketPrice).dividedBy(4))
        );
      }

      return maxNum;
    },
    // 参加赛事
    enterNow(event) {
      let routeData = this.$router.resolve({
        name: "FreeNFT",
        query: { id: event.orderNumber },
      });
      openUrl(routeData.href);
    },
    // 取消赛事
    cancelOrder(event) {
      if (event.numberOfTicketsSold > 0) return;

      this.competitionNft = event;
      this.showCabcel = true;
    },
    // 取消订单确认
    async onCancel() {
      const res = await cancelNftOrder({
        orderNumber: this.competitionNft.orderNumber,
      });
      if (res && res.code == 200) {
        this.$message.success("Cancel successfully");
        this.fetchOneBuyList();
        const headerStore = useHeaderStore();
        headerStore.getTheUserBalanceApi();
        this.handleClose();
      }
    },
    // 删除订单
    async delOrder(evnet) {
      const res = await delNftOrder({
        orderNumber: evnet.orderNumber,
      });
      if (res && res.code == 200) {
        this.$message.success("Delete successfully.");
        this.fetchOneBuyList();
      }
    },
    // 关闭弹窗
    handleClose(done) {
      if (done) {
        done();
        return;
      }

      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      this.fetchOneBuyList(false);
      this.showCabcel = false;
      this.showCreateCom = false;
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchOneBuyList(false);
    },
    // 提款汇率
    async fetchCacheTicker() {
      const res = await getCacheTicker({
        areaCoin: "ETH",
        coinName: "USDT",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
      }
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
  created() {
    this.statuDrop = [
      { label: t("user.inProgress"), value: "IN_PROGRESS" },
      { label: t("user.sale"), value: "DRAWN" },
      { label: t("user.cancel"), value: "CANCELLED" },
      { label: t("user.aborted"), value: "CLOSED" },
    ];

    this.fetchCacheTicker();
    if (this.isLogin && this.userInfo?.id) {
      this.fetchOneBuyList();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/competitions.scss";
</style>
