<template>
  <div class="ntf-tickets">
    <div class="home-public-title">
      <div class="title_text">COMPETITION</div>
      <div class="title_description">
        Enter now for a chance to win a blue chip NFT
      </div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li class="ntf-tickets-list" v-if="index < 5" :key="`tickets-${index}`">
          <div class="img-box">
            <img class="tickets-boxs-list-img" :src="item.nftImage" alt="" />
            <div class="type-box">
              <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                <img src="@/assets/svg/home/icon_time.svg" alt="">
                <span v-if="dateDiff(item && item.endTime) > 1">
                  {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                </span>
                <countDown v-else v-slot="timeObj" :time="item && item.endTime">
                  {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                </countDown>
              </div>
              <div class="price" v-else>
                <img src="@/assets/svg/home/icon_price.svg" alt="">
                <span>
                  {{
                    `${new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold || 0).toString()} TICKETS LEFT`
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="nft-name">
            <div class="nft-name-l">
              <div class="name-text">{{ item.seriesName || "-" }}</div>
              <img src="@/assets/svg/home/icon_certified.svg" alt="">
            </div>
            <div class="nft-name-r text-ellipsis">{{ `#${item.tokenId}` }}</div>
          </div>
          <div class="price-box">
            {{ `${item.price} ETH` }}
          </div>
          <div class="boxes-button">
            <span class="boxes-button-name">ENTER NOW</span>
          </div>
          <div class="sold-box">{{ `${item.numberOfTicketsSold || 0} Tickets sold` }}</div>
        </li>
      </template>
    </ul>
    <div class="ntf-tickets-all">
      <span>View all competition</span>
      <img src="@/assets/svg/home/icon_more.svg" alt="" />
    </div>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { dateDiff } from "@/utils";
export default {
  name: 'NtfTickets',
  props: ['ticketList'],
  components: {
    countDown
  },
  data() {
    return {
      tickets: [
        {
          url: '',
          orderType: "LIMITED_TIME",
          seriesName: 'Bored Ape Yacht Club Box',
          sale: 'Sale: 1234',
          price: '69.84',
          currency: 'ETH',
        },
        {
          url: '',
          seriesName: 'Bored Ape Yacht Club Box',
          sale: 'Sale: 1234',
          price: '69.84',
          currency: 'ETH',
        },
        {
          url: '',
          seriesName: 'Bored Ape Yacht Club Box',
          sale: 'Sale: 1234',
          price: '69.84',
          currency: 'ETH',
        },
        {
          url: '',
          seriesName: 'Bored Ape Yacht Club Box',
          sale: 'Sale: 1234',
          price: '69.84',
          currency: 'ETH',
        },
      ],
    };
  },
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
    openAll() {
      this.$router.push({ name: "NftTicketsList" });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTickets.scss";
</style>