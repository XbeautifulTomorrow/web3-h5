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
    :style="{ height: `${height}px` }"
    @change="changeFun"
  >
    <el-carousel-item v-for="(item, index) in poolList" :key="`list-${index}`">
        {{ item }}
      <!-- <div class="lottery-carousel-list">
        <div class="lottery-list-bor">
          <img class="lottery-list-img" :src="list.pz" />
        </div>
        <div class="lottery-list-nftNumber">#&nbsp;{{ item.nftNumber }}</div>
        <p class="public-color-three lottery-list-seriesName">
          {{ item.seriesName }}
        </p>
        <div class="lottery-list-text">
          <img class="lottery-list-logo" :src="item.seriesImg" />
          <span class="public-color-two lottery-list-minPrice">
            {{ item.minPrice }}
          </span>
          <span class="public-color-two lottery-list-conin">
            {{ item.coin }}
          </span>
        </div>
      </div> -->
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
      if (newData || newData === 0) {
        this.poolList.splice(this.index, 1, newData);
      }
    },
    autoplay: function (newData) {
      console.log(newData);
      this.autoPlay = this.autoplay;
    },
  },
};
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.award-carousel {
  .el-carousel__container {
    height: 100%;
  }
}
</style>
