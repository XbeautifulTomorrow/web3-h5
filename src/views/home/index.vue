<template>
  <div class="home">
    <banner />
    <mystery-boxes :boxList="boxList" />
    <nft-tickets :ticketList="ticketList" />
    <contents-info :NFTList="NFTList" />
  </div>
</template>

<script>
import Banner from '@/components/banner/index.vue';
import MysteryBoxes from './mysteryBoxes.vue';
import NftTickets from './nftTickets.vue';
import ContentsInfo from './contentsInfo.vue';

import { getBoxList, getNFTList } from '@/services/api/index';
import { getCheckAllOrders } from "@/services/api/oneBuy";

export default {
  name: 'IndexPage',
  components: {
    Banner,
    MysteryBoxes,
    NftTickets,
    ContentsInfo,
  },
  data() {
    return {
      boxList: [],
      ticketList: [],
      NFTList: [],
      generateKey: '',
    };
  },
  mounted() {
    getBoxList().then((res) => {
      if (res.data && res.data.length > 0) {
        this.boxList = res.data;
      }
    });
    getCheckAllOrders({ page: 1, size: 5 }).then((res) => {
      if (res.data && res.data.records.length > 0) {
        this.ticketList = res.data.records;
      }
    });
    getNFTList().then((res) => {
      if (res.data && res.data.length > 0) {
        this.NFTList = res.data;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
// .home {
//   background: url('@/assets/img/home/bg.png') no-repeat 100% 100%;
// }
</style>
<style lang="scss">
body {
  background: url('@/assets/img/home/bg.png') no-repeat;
  background-size: 100% auto;
}

.home-public-title {
  text-align: left;
  margin: 48px auto 24px;
}

.boxes-content {
  display: flex;
}

.boxes-list {
  width: 220px;
  margin-right: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  background-image: linear-gradient(228deg,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0) 62%);

  &:last-child {
    margin-right: 0;
  }
}

.boxes-title {
  width: 200px;
  height: max-content;
  margin: 0 auto;
  font-size: 24px;
  background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.boxes-button {
  $width: 200px;
  $height: 40px;
  $border: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  width: $width;
  height: $height;
  font-size: 24px;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 12px;
  padding: 2px;
  border-image-source: linear-gradient(to bottom,
      #5fe3ef 12%,
      #00689d 53%,
      #b063f5 70%);
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #1b082b, #1b082b),
    linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
}

.boxes-button-text {
  background-image: linear-gradient(to bottom,
      #5fe3ef 12%,
      #00689d 53%,
      #b063f5 70%);
  font-size: 18px;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
