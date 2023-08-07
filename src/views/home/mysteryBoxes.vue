<template>
  <div class="mystery-boxes">
    <div class="home-public-title">
      <div class="title_text">{{ $t("home.boxTitle") }}</div>
      <div class="title_description">{{ $t("home.boxTips") }}</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in boxList">
        <li class="mystery-boxes-item" @click="handleMysteryBoxes(item)" v-if="index < 4" :key="`mystery-${index}`">
          <div class="img_box">
            <Image fit="cover" class="mystery-boxs-list-img" :src="item.boxImg" alt="" />
          </div>
          <div class="mystery-boxs-title text-ellipsis">
            <div class="box-name text-ellipsis">{{ item.boxName }}</div>
          </div>
          <div class="box-price">
            <div class="price-box">
              <img src="@/assets/svg/box/icon_eth.svg" alt="">
              <span>{{ item.price }}</span>
            </div>
          </div>
          <div class="other">
            <div class="sale">{{ $t("home.sale") }}</div>
            <div class="sale-val">{{ item.sales }}</div>
          </div>
          <p class="mystery-boxs-text text-ellipsis">
          </p>
          <div class="boxes-button buy-btn text-ellipsis">
            <span class="boxes-button-name">{{ $t("home.buyBtn") }}</span>
          </div>
        </li>
      </template>
    </ul>
    <div class="ntf-tickets-all" @click="openAll()">
      <span>{{ $t("homeReplenish.viewBox") }}</span>
      <img src="@/assets/svg/home/icon_more.svg" alt="" />
    </div>
  </div>
</template>

<script>
import Image from "@/components/imageView";
export default {
  name: 'MysteryBoxes',
  props: ['boxList'],
  components: {
    Image
  },
  data() {
    return {
      pageType: null,
      boxLists: [{
        boxImg: require("@/assets/img/home/win_bayc.png"),
        boxName: "Win BAYC for 0.01 ETH",
        price: 0.01,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/teamazuki_collections.png"),
        boxName: "TeamAzuki Collections",
        price: 0.02,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/yugalabs_collections.png"),
        boxName: "Yugalabs Collections",
        price: 0.05,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/blue_chip_package.png"),
        boxName: "Blue-Chip Package",
        price: 0.15,
        coin: "ETH",
        sales: "0"
      }]
    };
  },
  methods: {
    handleMysteryBoxes(event) {
      this.$router.push({ path: "/reffleBox", query: { boxId: event.id } });
    },
    openAll() {
      this.$router.push({ name: "ReffleBoxesList" });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./components/mysteryBoxes.scss";
</style>
