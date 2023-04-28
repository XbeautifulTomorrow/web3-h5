<template>
  <el-carousel
    class="award-carousel"
    :height="`${height}`"
    :interval="interval"
    :autoplay="autoPlay"
    :pause-on-hover="false"
    indicator-position="none"
    arrow="never"
    ref="carousel"
    @change="changeFun"
    :style="{ height: `${height}px` }"
  >
    <el-carousel-item
      v-for="(item, index) in poolList"
      :key="`list-${index}`"
      class="lottery-moreLuck-list"
    >
      <!-- lottery-moreLuck-list -->
      <div class="lottery-moreLuck-bor">
        <img class="lottery-list-img" :src="item.nftImg" />
      </div>
      <div class="lottery-moreLuck-nftNumber">#&nbsp;{{ item.tokenId }}</div>
      <p class="public-color-three lottery-moreLuck-seriesName">
        {{ item.seriesName }}
      </p>
      <div class="lottery-moreLuck-text">
        <img class="lottery-moreLuck-img" src="@/assets/img/eth.png" alt="" />
        <span class="public-color-two lottery-moreLuck-minPrice">
          {{ item.price }}
        </span>
        <span class="public-color-two lottery-moreLuck-conin">
          {{ item.coin }}
        </span>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  name: 'AwardsList',
  props: {
    autoplay: {
      type: Boolean,
      default: false,
    },
    interval: {
      type: Number,
      default: 300,
    },
    prizePoolList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    height: {
      type: Number,
      default: 300,
    },
    winData: {
      default: '',
    },
  },
  data() {
    return {
      index: 0,
      poolList: JSON.parse(JSON.stringify(this.prizePoolList)),
      autoPlay: this.autoplay,
    };
  },
  methods: {
    changeFun(index) {
      this.index = index;
    },
    winFun(data) {
      this.poolList.splice(this.index, 1, data);
    },
  },
  watch: {
    winData: function (newData) {
      if (newData) {
        console.log(newData);
        this.poolList.splice(this.index, 1, newData);
      }
    },
    autoplay: function (newData) {
      this.autoPlay = newData;
    },
  },
};
</script>
<style lang="scss" scoped>
.award-carousel {
  width: var(--luckBorHeight);
}
.lottery-moreLuck-list {
  height: 100%;
}
.lottery-moreLuck-bor {
  height: var(--luckBorHeight);
}
.lottery-moreLuck-nftNumber {
  font-size: 12px;
  top: 5px;
  left: 5px;
  padding: 0 6px;
  position: absolute;
  border-radius: 7px;
  background-image: linear-gradient(
    to bottom,
    #768098 119%,
    #eceacf 46%,
    #edbed2
  );
  height: 17px;
  line-height: 20px;
  color: #2e0d4a;
}
.ottery-moreLuck-seriesName {
  font-size: 13px;
  line-height: 13px;
}
.lottery-moreLuck-img {
  width: 15px;
  height: 15px;
}
.lottery-moreLuck-minPrice,
.lottery-moreLuck-conin {
  font-size: 14px;
  line-height: 14px;
}
</style>
<style lang="scss">
.award-carousel {
  .el-carousel__container {
    height: 100%;
  }
}
</style>
