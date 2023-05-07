<template>
  <div class="ntf-tickets public-width">
    <div class="home-public-title ntf-tickets-title">
      <img src="@/assets/img/home/ntfTickets.png" alt="" />
      <div class="ntf-tickets-all" @click="openAll()">
        <span class="ntf-tickets-all-text">View all tickets</span>
        <img class="ntf-tickets-all-img" src="@/assets/img/home/icon-chickhover.png" alt="" />
      </div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li class="boxes-list ntf-tickets-list" v-if="index < 5" :key="`tickets-${index}`">
          <img class="tickets-boxs-list-img" :src="item.nftImage" alt="" />
          <p class="boxes-title text-ellipsis">
            <span class="ntf-tickets-content-title text-ellipsis">
              {{ item.seriesName || "-" }}
            </span>
            <img class="ntf-tickets-img" :src="item.nftImage" alt="" />
          </p>
          <p class="tickets-boxs-text text-ellipsis">
            {{ `${item.price} ETH` }}
          </p>
          <div class="boxes-button">
            <div class="boxes-button-enter" @click="handleTickets(item)">
              <span class="boxes-button-text">ENTER NOW</span>
            </div>
          </div>
          <p class="ntf-tickets-text text-ellipsis">
            {{ item.text }}
          </p>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NtfTickets',
  props: ['ticketList'],
  data() {
    return {
      tickets: [],
    };
  },
  methods: {
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
    openAll() {
      this.$router.push({ name: "NftTicketsList" });
    }
  }
};
</script>
<style lang="scss" scoped>
.ntf-tickets {
  --imgWidth: 16px;
  --imgMargin: 3px;
}

.ntf-tickets-list {
  height: 363px;
  padding-bottom: 10px;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-20px);

    .boxes-button {
      border-image-source: linear-gradient(to bottom,
          #ffffff 12%,
          #ffffff 53%,
          #ffffff 70%);
      background-image: linear-gradient(to bottom, #1b082b, #1b082b),
        linear-gradient(to bottom, #ffffff 12%, #ffffff 53%, #ffffff 70%);
    }

    .boxes-button-enter {
      width: 100%;
      height: 100%;
      border-radius: 17px;
      background-image: linear-gradient(to bottom,
          #5fe3ef,
          #00689d 54%,
          #b063f5 75%);
    }

    .boxes-button-text {
      background-image: linear-gradient(to bottom,
          #ffffff,
          #ffffff 54%,
          #ffffff 75%);
    }
  }
}

.tickets-boxs-list-img {
  $imgWidth: 200px;
  width: 100%;
  height: $imgWidth;
}

.boxes-title {
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
}

.ntf-tickets-content-title {
  width: 100px;
}

.ntf-tickets-img {
  width: var(--imgWidth);
  height: var(--imgWidth);
  margin-left: var(--imgMargin);
}

.tickets-boxs-text {
  text-align: center;
  width: 100%;
  background-image: linear-gradient(to bottom,
      #c7c3cc 3%,
      #e2e3cf 24%,
      #d94ba5 78%);
  font-size: 24px;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.ntf-tickets-text {
  width: 100%;
  font-size: 16px;
  color: #a896b5;
  margin-top: 10px;
}

.ntf-tickets-all-text {
  background-image: linear-gradient(to bottom,
      #768098 10%,
      #eceacf 47%,
      #edbed2 70%);
  font-size: 18px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.ntf-tickets-all-img {
  width: 16px;
  margin-left: 4px;
}

.ntf-tickets-title,
.ntf-tickets-all {
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
}

.ntf-tickets-all {
  cursor: pointer;
}
</style>
