<template>
  <div class="ntf-tickets">
    <div class="home-public-title">
      <div class="title_text">{{ $t("home.nftTicketTitle") }}</div>
      <div class="title_description">{{ $t("home.nftTicketTips") }}</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li class="ntf-tickets-item" @click="handleTickets(item)" v-if="index < 4" :key="`tickets-${index}`">
          <div class="img-box">
            <Image fit="cover" class="nft_img" :src="item.nftImage" />
            <div class="type-box">
              <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                <img src="@/assets/svg/home/icon_time.svg" alt="">
                <span v-if="dateDiff(item.endTime) > 1">
                  {{ $t("home.dayLeft", { day: Math.ceil(dateDiff(item.endTime)) }) }}
                </span>
                <countDown v-else v-slot="timeObj" @onEnd="fetchCheckAllOrders(false)" :time="item.endTime">
                  {{ $t("home.timeLeft", { time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}` }) }}
                </countDown>
              </div>
              <div class="price" v-else>
                <img src="@/assets/svg/home/icon_price.svg" alt="">
                <span v-if="Number(new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold ||
                  0)) > 1">
                  {{ $t("home.ticketsLeft", {
                    num: Number(new bigNumber(item.limitNum ||
                      0).minus(item.numberOfTicketsSold || 0))
                  }) }}</span>
                <span v-else>
                  {{ $t("home.ticketLeft", {
                    num: Number(new bigNumber(item.limitNum ||
                      0).minus(item.numberOfTicketsSold ||
                        0))
                  }) }}
                </span>
              </div>
            </div>
          </div>
          <div class="nft-name">
            <div class="nft-name-l">
              <div class="name-text text-ellipsis">{{ item.seriesName || "-" }}</div>
              <img src="@/assets/svg/home/icon_certified.svg" alt="">
            </div>
            <div class="nft-name-r text-ellipsis">{{ `#${item.tokenId}` }}</div>
          </div>
          <div class="price-box">
            {{ `${item.price} ETH` }}
          </div>
          <div class="boxes-button">
            <span class="boxes-button-name">{{ $t("home.nftTicketBtn") }}</span>
          </div>
          <div class="sold-box" v-if="item.numberOfTicketsSold > 1">
            {{ $t("home.ticketsSold", { num: item.numberOfTicketsSold || 0 }) }}
          </div>
          <div class="sold-box" v-else>
            {{ $t("home.ticketSold", { num: item.numberOfTicketsSold || 0 }) }}
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
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { dateDiff } from "@/utils";

import { getCheckAllOrders } from "@/services/api/oneBuy";

import Image from "@/components/imageView";
export default {
  name: 'NtfTickets',
  components: {
    countDown,
    Image
  },
  data() {
    return {
      ticketList: []
    };
  },
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    // 获取一元购列表
    async fetchCheckAllOrders() {
      const res = await getCheckAllOrders({ page: 1, size: 5 })
      if (res && res.code == 200) {
        this.ticketList = res.data.records;
      }
    },
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
    openAll() {
      this.$router.push({ name: "TreasureDraw" });
    }
  },
  created() {
    this.fetchCheckAllOrders();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTickets.scss";
</style>