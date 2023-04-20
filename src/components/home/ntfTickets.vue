<template>
  <div class="ntf-tickets public-width">
    <div class="home-public-title ntf-tickets-title">
      <img src="@/assets/img/home/ntfTickets.png" alt="" />
      <div class="ntf-tickets-all">
        <span class="ntf-tickets-all-text">View all tickets</span>
        <img
          class="ntf-tickets-all-img"
          src="@/assets/img/home/icon-chickhover.png"
          alt=""
        />
      </div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li
          class="boxes-list ntf-tickets-list"
          v-if="index < 5"
          :key="`tickets-${index}`"
        >
          <img class="tickets-boxs-list-img" :src="item.url" alt="" />
          <p class="boxes-title text-ellipsis">
            <span class="ntf-tickets-content-title text-ellipsis">
              {{ item.seriesName }}
            </span>
            <img class="ntf-tickets-img" :src="item.nftImg" alt="" />
          </p>
          <p class="tickets-boxs-text text-ellipsis">
            {{ `${item.price} ${item.coin}` }}
          </p>
          <div class="boxes-button">
            <span class="boxes-button-text"> ENTER NOW </span>
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
  props:["ticketList"],
  data() {
    return {
      tickets: []
    };
  },
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
  background-image: linear-gradient(
    to bottom,
    #c7c3cc 3%,
    #e2e3cf 24%,
    #d94ba5 78%
  );
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
  background-image: linear-gradient(
    to bottom,
    #768098 10%,
    #eceacf 47%,
    #edbed2 70%
  );
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
