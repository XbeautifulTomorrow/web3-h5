<template>
  <div class="mystery-boxes public-width">
    <div class="home-public-title">
      <img src="@/assets/img/home/mysteryBoxes.png" alt="" />
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in boxList">
        <li
          class="boxes-list mystery-boxes-list"
          v-if="index < 5"
          :key="`mystery-${index}`"
        >
          <img class="mystery-boxs-list-img" :src="item.url" alt="" />
          <p class="boxes-title text-ellipsis">
            {{ item.boxName }}
          </p>
          <p class="mystery-boxs-text text-ellipsis">
            {{ item.sales }}
          </p>
          <div class="boxes-button text-ellipsis">
            <span class="boxes-button-text">
              {{ `${item.price} ${item.coin}` }}
            </span>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MysteryBoxes',
  props:["boxList"],
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
.mystery-boxes-list {
  height: 333px;
  padding: 0 10px 10px;
}
.mystery-boxs-list-img {
  width: 134px;
  height: 189px;
  margin: 16px auto;
}
.mystery-boxs-text {
  width: 201px;
  font-size: 16px;
  color: #a896b5;
}
</style>
