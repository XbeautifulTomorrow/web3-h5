<template>
  <div class="mystery-boxes">
    <div class="home-public-title">
      <div class="title_text">{{ $t("home.boxTitle") }}</div>
      <div class="title_description">{{ $t("home.boxTips") }}</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in boxList">
        <li
          class="mystery-boxes-item"
          @click="handleMysteryBoxes(item)"
          v-if="index < 4"
          :key="`mystery-${index}`"
        >
          <div class="img_box">
            <Image
              fit="cover"
              class="mystery-boxs-list-img"
              :src="item.boxImg"
              alt=""
            />
          </div>
          <div class="mystery-boxs-title text-ellipsis">
            <div class="box-name text-ellipsis">{{ item.boxName }}</div>
          </div>
          <div class="box-price">
            <div class="price-box">
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              <span v-priceFormat="item.price"></span>
            </div>
          </div>
          <div class="other">
            <div class="sale">{{ $t("home.sale") }}</div>
            <div class="sale-val">{{ item.sales }}</div>
          </div>
          <p class="mystery-boxs-text text-ellipsis"></p>
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
  name: "MysteryBoxes",
  props: ["boxList"],
  components: {
    Image,
  },
  data() {
    return {
      pageType: null,
    };
  },
  methods: {
    handleMysteryBoxes(event) {
      this.$router.push({ path: "/raffleBox", query: { boxId: event.id } });
    },
    openAll() {
      this.$router.push({ name: "RaffleBoxesList" });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./components/mysteryBoxes.scss";
</style>
