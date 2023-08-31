<template>
  <div class="award-multi-h5">
    <div class="turntable-box">
      <div class="turntable-content">
        <img src="@/assets/img/h5/lottery/03.webp" :class="['nft-img', , { autoplay: play }]" alt="" />
      </div>
      <div class="turntable-middle">
        <img src="@/assets/img/h5/lottery/04.webp" class="nft-logo" alt="" />
        <img src="@/assets/img/h5/lottery/02.webp" :class="['nft-close', { 'nft-open': !play }]" alt="" />
        <img src="@/assets/img/h5/lottery/light.gif" class="light" v-if="isLight" alt="" />
        <img src="@/assets/img/h5/lottery/03.webp" :class="['ball', { 'ball-big': isBall, 'ball-hidden': isStop }]" alt="" />
      </div>
    </div>
    <div class="result-link-box">
      <result-link></result-link>
    </div>
    <div class="award-multi-result" v-if="isStop">
      <div class="award-item" v-for="(item, index) in winData" :key="index">
        <div :class="item.qualityType" class="award-item-img">
          <ImageView :src="item.nftCompressImg || item.nftImg" />
        </div>
        <div class="award-price">
          <img class="award-icon" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          {{ formatNumber(item.initPrice) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ResultLink from "../resultLink";
import ImageView from "../imageView";
import { formatNumber } from "@/utils";
export default {
  name: "AwardsList",
  props: {
    prizePoolList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    winData: {
      default: [],
    },
  },
  components: {
    ImageView,
    ResultLink,
  },
  data() {
    return {
      poolList: JSON.parse(JSON.stringify(this.prizePoolList)).concat(JSON.parse(JSON.stringify(this.prizePoolList))),
      play: true,
      isLight: false,
      isBall: false,
      isStop: false,
    };
  },
  mounted() {
    this.$emit("delayTime", 6);
  },
  methods: {
    formatNumber: formatNumber,
  },
  watch: {
    winData: function (newData) {
      if (newData?.length > 0) {
        this.play = false;
        setTimeout(() => {
          this.isLight = true;
        }, 300);
        setTimeout(() => {
          this.isLight = false;
          this.isBall = true;
        }, 2000);
        setTimeout(() => {
          this.isStop = true;
        }, 4500);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@keyframes rotateAnimation {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.award-multi-h5 {
  padding: 0 1rem;
  .turntable-box {
    position: relative;
    width: 60%;
    margin: 0 auto;
    padding: 0.75rem;
    .turntable-content {
      display: flex;
      background: url("@/assets/img/h5/lottery/01.webp") no-repeat;
      background-size: 100% 100%;
    }
    .nft-img {
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      &.autoplay {
        animation: rotateAnimation 1s infinite linear;
        animation-fill-mode: forwards;
      }
    }
    .turntable-middle {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: url("@/assets/img/h5/lottery/05.webp") no-repeat;
      background-size: 100% 100%;
      .nft-logo {
        width: 75%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .nft-close {
        position: absolute;
        top: 0.3125rem;
        left: 26%;
        width: 49.52%;
        &.nft-open {
          left: 12%;
        }
      }
      .light {
        position: absolute;
        top: -20%;
        left: 12%;
        width: 80%;
      }
      .ball {
        width: 0;
        position: absolute;
        z-index: 3000;
        top: 20%;
        left: 12%;
      }
      .ball-big {
        width: 30%;
        top: 160%;
        left: 50%;
        transform: translateX(-50%);
        transition: all 1s ease-out;
      }
      .ball-hidden {
        display: none;
      }
    }
  }
  .award-multi-result {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 0.25rem;
    margin-top: 1.875rem;
    .award-item-img {
      padding: 0.25rem;
      padding-bottom: 0;
      img {
        border-radius: 0.25rem;
      }
    }
    .award-price {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
      color: #e4e7f5;
      img {
        width: 0.875rem;
        margin-right: 0.375rem;
      }
    }
  }
}
.result-link-box {
  margin-top: 1.25rem;
}
.LEGEND {
  background-image: url("@/assets/img/lottery/LEGEND_more_choose.png");
  background-size: 100% 100%;
  color: #ef962e;
}
.EPIC {
  background-image: url("@/assets/img/lottery/EPIC_more_choose.png");
  background-size: 100% 100%;
  color: #ce42ff;
}
.RARE {
  background-image: url("@/assets/img/lottery/RARE_more_choose.png");
  background-size: 100% 100%;
  color: #31aff0;
}
.NORMAL {
  background-image: url("@/assets/img/lottery/NORMAL_more_choose.png");
  background-size: 100% 100%;
  color: #a9a4b4;
}
</style>
