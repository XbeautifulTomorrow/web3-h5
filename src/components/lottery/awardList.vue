<template>
  <el-carousel
    :class="['award-carousel', { 'no-autoplay-box': !autoPlay }]"
    :height="`${height * 3}`"
    :interval="interval"
    :autoplay="autoPlay"
    :pause-on-hover="false"
    :append-to-body="true"
    indicator-position="none"
    arrow="never"
    direction="vertical"
    ref="carousel"
    @change="changeFun"
    :style="{ height: `${height * 3}px` }"
  >
    <el-carousel-item
      v-for="(item, index) in poolList"
      :key="`list-${index}`"
      class="lottery-moreLuck-list"
    >
      <div
        v-for="(_img, imgIndex) in item"
        :class="[
          'lottery-moreLuck-list-content',
          _img.qualityType,
          { 'is-active-item': winData.nftImg == _img.nftImg },
        ]"
        :key="`img-${imgIndex}`"
      >
        <img class="lottery-moreLuck-list-img" :src="_img.nftImg" alt="" />
        <p
          v-if="winData && winData.nftImg == _img.nftImg"
          class="lottery-moreLuck-seriesName"
        >
          {{ winData.seriesName }}
        </p>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  name: "AwardsList",
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
      default: 118,
    },
    winData: {
      default: "",
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
        this.autoPlay = false;
        this.poolList[this.index].splice(1, 1, newData);
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
  height: 7.375rem * 3 !important;
  transform: rotate(180deg);
  position: relative;
  z-index: 1;
}
.lottery-moreLuck-list-content {
  height: 7.375rem;
  width: 7.375rem;
  padding: 0.2rem;
  box-sizing: border-box;
  transform: rotate(180deg);
  margin: 0 auto;
  position: relative;
}
.LEGEND {
  background-image: url("@/assets/img/lottery/LEGEND_more_choose.png");
  background-size: cover;
  color: #ce42ff;
}
.EPIC {
  background-image: url("@/assets/img/lottery/EPIC_more_choose.png");
  background-size: cover;
  color: #ef962e;
}
.RARE {
  background-image: url("@/assets/img/lottery/RARE_more_choose.png");
  background-size: cover;
  color: #31aff0;
}
.NORMAL {
  background-image: url("@/assets/img/lottery/NORMAL_more_choose.png");
  background-size: cover;
  color: #4a4d58;
}
.lottery-moreLuck-list-img {
  height: 100%;
  width: 100%;
  object-fit: fill;
  filter: brightness(50%);
  border-radius: 0.2rem;
}
.lottery-moreLuck-award {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 18px)) rotate(180deg);
  z-index: 50;
}
.lottery-moreLuck-award-img {
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  padding: 4px;
  height: 139px;
  box-sizing: border-box;
  vertical-align: bottom;
}
.award-LEGEND {
  .lottery-moreLuck-award-img {
    background-image: url("@/assets/img/lottery/LEGEND_more_choose.png");
  }
  .lottery-moreLuck-seriesName {
    color: #ce42ff;
  }
}
.award-EPIC {
  .lottery-moreLuck-award-img {
    background-image: url("@/assets/img/lottery/EPIC_more_choose.png");
  }
  .lottery-moreLuck-seriesName {
    color: #ef962e;
  }
}
.award-RARE {
  .lottery-moreLuck-award-img {
    background-image: url("@/assets/img/lottery/RARE_more_choose.png");
  }
  .lottery-moreLuck-seriesName {
    color: #31aff0;
  }
}
.award-NORMAL {
  .lottery-moreLuck-award-img {
    background-image: url("@/assets/img/lottery/NORMAL_more_choose.png");
  }
  .lottery-moreLuck-seriesName {
    color: #4a4d58;
  }
}
.lottery-moreLuck-seriesName {
  font-size: 16px;
  font-weight: bold;
}
.lottery-moreLuck-tokenId {
  font-size: 12px;
  color: #0cbb3e;
}
</style>
<style lang="scss">
.award-carousel {
  &.no-autoplay-box {
    z-index: 11;
    .is-active {
      .is-active-item {
        position: relative;
        z-index: 11;
        transform: scale(1.2) rotate(180deg);
        img {
          filter: none;
        }
      }
      .lottery-moreLuck-list-content:nth-child(1) {
        position: relative;
        top: 25px;
      }
      .lottery-moreLuck-list-content:nth-child(3) {
        position: relative;
        top: -25px;
      }
    }
  }
  .el-carousel__container {
    height: 100%;
  }
}
</style>
