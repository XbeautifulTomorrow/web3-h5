<template>
  <div class="mystery-boxes">
    <div class="home-public-title">
      <div class="title_text">MYSTERY BOXES</div>
      <div class="title_description">
        Verifiable fairness, 100% winning, free choice to withdraw or sell.
      </div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in boxList">
        <li class="mystery-boxes-item" @click="handleMysteryBoxes(item)" v-if="index < 4" :key="`mystery-${index}`">
          <div class="img_box">
            <img class="mystery-boxs-list-img" :src="item.boxImg" alt="" />
          </div>
          <div class="mystery-boxs-title text-ellipsis">
            <div class="box-name">{{ item.boxName }}</div>
            <img src="@/assets/svg/icon_eth.svg" alt="">
          </div>
          <div class="box-price">
            <div class="price-box">
              <div class="val">{{ item.price }}</div>
              <div class="unit">{{ item.coin }}</div>
            </div>
            <div class="sale">Sale</div>
          </div>
          <div class="other">
            <div class="buy">Purchase Now</div>
            <div class="sale-val">{{ item.sales }}</div>
          </div>
          <p class="mystery-boxs-text text-ellipsis">
          </p>
          <div class="boxes-button buy-btn text-ellipsis">
            <span class="boxes-button-name">Unbox Now</span>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MysteryBoxes',
  props: ['boxList'],
  data() {
    return {};
  },
  methods: {
    handleMysteryBoxes(event) {
      this.$router.push({ path: "/mysteryBox", query: { boxId: event.id } });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./components/mysteryBoxes.scss";
</style>
