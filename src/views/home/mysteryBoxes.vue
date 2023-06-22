<template>
  <div class="mystery-boxes">
    <div class="home-public-title">
      <div class="title_text">MYSTERY BOXES</div>
      <div class="title_description">Verify fairness, 100% wins, choose to withdraw or sell.</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in boxList">
        <li class="mystery-boxes-item" @click="handleMysteryBoxes(item)" v-if="index < 4" :key="`mystery-${index}`">
          <div class="img_box">
            <img class="mystery-boxs-list-img" :src="item.boxImg" alt="" />
          </div>
          <div class="mystery-boxs-title text-ellipsis">
            <div class="box-name text-ellipsis">{{ item.boxName }}</div>
            <img src="@/assets/svg/box/icon_eth.svg" alt="">
          </div>
          <div class="box-price">
            <div class="price-box">
              {{ `${item.price} ${item.coin}` }}
            </div>
          </div>
          <div class="other">
            <div class="sale">Sale</div>
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
import { ElMessage } from "element-plus";
export default {
  name: 'MysteryBoxes',
  // props: ['boxList'],
  data() {
    return {
      boxList: [{
        boxImg: require("@/assets/img/home/win_bayc.png"),
        boxName: "Win BAYC for 0.01 ETH",
        price: 0.01,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/teamazuki_collections.png"),
        boxName: "TeamAzuki Collections",
        price: 0.05,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/yugalabs_collections.png"),
        boxName: "Yugalabs Collections",
        price: 0.1,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/blue_chip_package.png"),
        boxName: "Blue-Chip Package",
        price: 0.2,
        coin: "ETH",
        sales: "0"
      }]
    };
  },
  methods: {
    handleMysteryBoxes(event) {
      ElMessage.warning("Comming soon");
      return
      // eslint-disable-next-line no-unreachable
      this.$router.push({ path: "/mysteryBox", query: { boxId: event.id } });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./components/mysteryBoxes.scss";
</style>
