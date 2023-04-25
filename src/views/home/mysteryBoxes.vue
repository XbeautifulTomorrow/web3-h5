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
          @click="$router.push('blindBoxDetail?boxId='+item.id)"
        >
          <img class="mystery-boxs-list-img" :src="item.url" alt="" />
          <p class="boxes-title text-ellipsis">
            {{ item.boxName }}
          </p>
          <p class="mystery-boxs-text text-ellipsis">
            {{ item.sales }}
          </p>
          <div class="boxes-button text-ellipsis">
            <span class="boxes-button-name">UNBOX</span>
            <span class="boxes-button-coin">
              <span class="boxes-button-text">
                {{ `${item.price} ${item.coin}` }}
              </span>
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
.mystery-boxes-list {
  height: 333px;
  padding: 0 10px 10px;
  &:hover {
    .boxes-button {
      border-image-source: linear-gradient(
        to bottom,
        #ffffff 12%,
        #ffffff 53%,
        #ffffff 70%
      );
      background-image: linear-gradient(to bottom, #1b082b, #1b082b),
        linear-gradient(to bottom, #ffffff 12%, #ffffff 53%, #ffffff 70%);
    }
    .boxes-button-name {
      opacity: 1;
      width: 68px;
    }
    .boxes-button-coin {
      height: 100%;
      flex: 1;
      line-height: 1.7em;
      background-image: linear-gradient(
        to bottom,
        #5fe3ef,
        #00689d 54%,
        #b063f5 75%
      );
    }
    .boxes-button-text {
      color: #ffffff;
      background-image: linear-gradient(to bottom, #ffffff, #ffffff);
    }
  }
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
.boxes-button-name {
  width: 0;
  height: 100%;
  line-height: 1.8em;
  color: #fff;
  overflow: hidden;
  border-radius: 17px 0 0 17px;
  transition: width 0.2s;
  opacity: 0;
  background-image: linear-gradient(
    to bottom,
    #41dae8,
    #3786d7 54%,
    #9085ee 75%
  );
}
</style>
