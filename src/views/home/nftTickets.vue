<template>
  <div class="ntf-tickets">
    <div class="home-public-title">
      <div class="title_text">COMPETITION</div>
      <div class="title_description">
        Amet ornare massa praesent lacus. In mi tristique enim tellus amet semper a. Donec ac
        congue nunc porta semper auctor enim.
      </div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li class="ntf-tickets-list" v-if="index < 5" :key="`tickets-${index}`">
          <div class="img-box">
            <div class="type-box">
              <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                <img src="@/assets/svg/home/icon_time.svg" alt="">
                <span> {{ `${getDiffDay(item.endTime)} DAY LEFT` }}</span>
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
            <img class="tickets-boxs-list-img" :src="item.nftImage" alt="" />
          </div>
          <div class="nft-name">
            <div class="nft-name-l">
              <div class="name-text">{{ item.seriesName || "-" }}</div>
              <img src="@/assets/svg/home/icon_certified.svg" alt="">
            </div>
            <div class="nft-name-r">{{ `#${item.tokenId}` }}</div>
          </div>
          <div class="price-box">
            {{ `${item.price} ETH` }}
          </div>
          <div class="boxes-button">
            <span class="boxes-button-name" @click="handleTickets(item)">ENTER NOW</span>
          </div>
          <div class="sold-box">{{ `${item.numberOfTicketsSold} Tickets sold` }}</div>
        </li>
      </template>
    </ul>
    <div class="ntf-tickets-all" @click="openAll()">
      <span>View all competition</span>
      <img src="@/assets/svg/home/icon_more.svg" alt="" />
    </div>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
export default {
  name: 'NtfTickets',
  props: ['ticketList'],
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
    bigNumber: bigNumber,
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
    openAll() {
      this.$router.push({ name: "NftTicketsList" });
    },
    getDiffDay(endTime) {
      // 计算两个日期之间的差值
      let totalDays, diffDate
      let myWEndTime = endTime && new Date(endTime) || new Date();
      let currentTime = new Date();
      // 将两个日期都转换为毫秒格式，然后做差
      diffDate = Math.abs(myWEndTime - currentTime) // 取相差毫秒数的绝对值

      totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整

      return totalDays    // 相差的天数
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTickets.scss";
</style>