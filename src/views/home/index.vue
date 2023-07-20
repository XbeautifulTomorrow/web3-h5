<template>
  <div class="home">
    <banner />
    <mystery-boxes :boxList="boxList" />
    <nft-tickets />
    <contents-info />
  </div>
</template>

<script>
import Banner from './banner.vue';
import MysteryBoxes from './mysteryBoxes.vue';
import NftTickets from './nftTickets.vue';
import ContentsInfo from './contentsInfo.vue';

import { getBoxList, getNFTList } from '@/services/api/index';

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
      NFTList: [],
      generateKey: '',
    };
  },
  created() {
    getBoxList().then((res) => {
      if (res.data && res.data.length > 0) {
        this.boxList = res.data;
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