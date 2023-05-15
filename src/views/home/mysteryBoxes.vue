<template>
  <div class="mystery-boxes">
    <div class="home-public-title">
      <div class="title_text">MYSTERY BOXES</div>
      <div class="title_description">
        Amet ornare massa praesent lacus. In mi tristique enim tellus amet semper a. Donec ac
        congue nunc porta semper auctor enim.
      </div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in boxList">
        <li class="mystery-boxes-item" v-if="index < 5" :key="`mystery-${index}`"
          @click="$router.push('mysteryBox?boxId=' + item.id)">
          <div class="img_box">
            <img class="mystery-boxs-list-img" src="@/assets/img/home/icon_box.png" alt="" />
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
    return {
      mystery: [
        {
          url: '',
          title: 'Bored Ape Yacht Club Box',
          sale: 'Sale: 1234',
          number: '69.84',
          currency: 'ETH',
        },
        {
          url: '',
          title: 'Bored Ape Yacht Club Box',
          sale: 'Sale: 1234',
          number: '69.84',
          currency: 'ETH',
        },
        {
          url: '',
          title: 'Bored Ape Yacht Club Box',
          sale: 'Sale: 1234',
          number: '69.84',
          currency: 'ETH',
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./components/mysteryBoxes.scss";
</style>
