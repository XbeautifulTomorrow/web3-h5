<template>
  <div class="ntf-tickets">
    <div class="home-public-title">
      <div class="title_text">{{ $t("home.nftTicketTitle") }}</div>
      <div class="title_description">{{ $t("home.nftTicketTips") }}</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li
          class="ntf-tickets-item"
          @click="handleTickets(item)"
          v-if="index < 4"
          :key="`tickets-${index}`"
        >
          <div class="discount" v-if="item.sendTicketsSwitch == 1">
            <div class="val">FREE</div>
          </div>
          <div class="img-box">
            <Image
              fit="cover"
              class="nft_img"
              v-if="item.orderType == 'LIMITED_PRICE_COIN'"
              :src="require('@/assets/svg/user/create_eth.webp')"
            />
            <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
            <div class="type-box" v-if="item.currentStatus == 'IN_PROGRESS'">
              <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                <img src="@/assets/svg/home/icon_time.svg" alt="" />
                <span v-if="dateDiff(item.endTime) > 1">
                  {{
                    $t("home.dayLeft", {
                      day: Math.ceil(dateDiff(item.endTime)),
                    })
                  }}
                </span>
                <countDown
                  v-else
                  v-slot="timeObj"
                  @onEnd="fetchCheckAllOrders(false)"
                  :time="item.endTime"
                >
                  {{
                    $t("home.timeLeft", {
                      time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}`,
                    })
                  }}
                </countDown>
              </div>
              <div class="price" v-else>
                <img src="@/assets/svg/home/icon_price.svg" alt="" />
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
              </div>
            </div>
            <div
              class="tips_round end"
              v-else-if="item.currentStatus == 'DRAWN'"
            >
              {{ $t("user.endStatus", { date: timeFormat(item.endTime) }) }}
            </div>
            <div
              class="nft-token"
              v-if="item.orderType != 'LIMITED_PRICE_COIN'"
            >
              {{ `#${item.tokenId}` }}
            </div>
          </div>
          <div class="nft-name">
            <div class="nft-name-l">
              <div class="name-text text-ellipsis">
                <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">{{
                  item.seriesName || "--"
                }}</span>
                <span v-else>{{ `${item.price} ETH` }}</span>
              </div>
              <img src="@/assets/svg/home/icon_certified.svg" alt="" />
            </div>
          </div>
          <div class="price-box">
            <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">
              {{ `$ ${Number(item.price).toLocaleString()}` }}
            </span>
            <span v-else>
              {{
                `$ ${Number(
                  accurateDecimal(
                    new bigNumber(exchangeRate).multipliedBy(item.price),
                    4
                  )
                ).toLocaleString()}`
              }}
            </span>
          </div>
          <div
            class="boxes-button boxes-free-button"
            v-if="item.currentStatus == 'IN_PROGRESS' && item.sendTicketsSwitch == 1"
          >
            <span class="boxes-button-name name-free">{{
              $t("home.nftTicketBtn2")
            }}</span>
          </div>
          <div class="boxes-button" v-else-if="item.currentStatus == 'IN_PROGRESS'">
            <span class="boxes-button-name">{{ $t("home.nftTicketBtn") }}</span>
          </div>
          <div class="buy_btn winner" v-else-if="item.currentStatus == 'DRAWN'">
            <span>{{ $t("ticketsInfo.winner") }}</span>
            <img src="@/assets/svg/user/default_avatar.svg" alt="" />
            <span
              v-if="userInfo && userInfo?.id == item.winningAddress"
              class="you"
              >{{ $t("user.you") }}</span
            >
            <span v-else class="text-ellipsis">
              {{ item.winningName || item.winningAddress }}
            </span>
          </div>
          <div class="sold-box" v-html="$t('home.ticketsSold', { num: item.numberOfTicketsSold || 0 })" v-if="item.numberOfTicketsSold > 1">
          </div>
          <div class="sold-box" v-html="$t('home.ticketSold', { num: item.numberOfTicketsSold || 0 })" v-else>
          </div>
        </li>
      </template>
    </ul>
    <div class="ntf-tickets-all" @click="openAll()">
      <span>{{ $t("homeReplenish.viewCompetitions") }}</span>
      <img src="@/assets/svg/home/icon_more.svg" alt="" />
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

import bigNumber from "bignumber.js";
import countDown from "@/components/countDown";
import { accurateDecimal, dateDiff, timeFormat } from "@/utils";

import { getCheckAllOrders } from "@/services/api/oneBuy";
import { getCacheTicker } from "@/services/api";

import Image from "@/components/imageView";
export default {
  name: "NtfTickets",
  components: {
    countDown,
    Image,
  },
  data() {
    return {
      exchangeRate: null,
      ticketList: [],
    };
  },
  computed: {
    ...mapStores(useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
  },
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    // 获取一元购列表
    async fetchCheckAllOrders() {
      const res = await getCheckAllOrders({ page: 1, size: 5 });
      if (res && res.code == 200) {
        this.ticketList = res.data.records;
      }
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
    handleTickets(event) {
      this.$router.push({ name: "FreeNFT", query: { id: event.orderNumber } });
    },
    openAll() {
      this.$router.push({ name: "TreasureDraw" });
    },
  },
  created() {
    this.fetchCheckAllOrders();
    this.fetchCacheTicker();
  },
};
</script>
<style lang="scss" scoped>
@import "./components/nftTickets.scss";
</style>