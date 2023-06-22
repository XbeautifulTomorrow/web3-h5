<template>
  <div class="home">
    <banner />
    <mystery-boxes :boxList="boxList" />
    <nft-tickets :ticketList="ticketList" />
    <!-- <contents-info :boxList="boxList" /> -->
  </div>
</template>

<script>
import Banner from './banner.vue';
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
    // eslint-disable-next-line vue/no-unused-components
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