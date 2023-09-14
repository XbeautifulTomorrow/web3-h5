<template>
  <div class="award-multi-h5">
    <div class="turntable-box">
      <div class="turntable-content">
        <img :src="blindDetailInfo.showImgTwo" :class="['nft-img', , { autoplay: play }]" alt="" />
      </div>
      <div class="turntable-middle">
        <img :src="blindDetailInfo.showImgOne" class="nft-logo" alt="" />
        <img src="@/assets/img/h5/lottery/02.webp" :class="['nft-close', { 'nft-open': winData?.length > 0 }]" alt="" />
        <img src="@/assets/img/h5/lottery/light.gif" class="light" v-if="isLight" alt="" />
        <img :src="awardImg" :class="['ball', { 'ball-big': isBall, 'ball-hidden': isStop }]" alt="" />
      </div>
    </div>
    <div class="result-link-box">
      <result-link></result-link>
    </div>
    <div class="award-multi-result">
      <div class="award-item" v-for="(item, index) in winDataArr" :key="index">
        <div :class="item.qualityType" class="award-item-img">
          <ImageView :src="item.nftCompressImg || item.nftImg" />
        </div>
        <div class="award-price">
          <img class="award-icon" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          <span v-priceFormat="item.initPrice"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ResultLink from "../resultLink";
import ImageView from "../imageView";

export default {
  name: "AwardsList",
  props: {
    prizePoolList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    blindDetailInfo: {
      type: Object,
      default: () => {
        return {};
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
      awardImg: "",
      winDataArr: [],
      winDataArrClone: [],
      delayTime: 0,
    };
  },
  mounted() {
    this.$emit("delayTime", this.delayTime);
  },
  methods: {
    animationFunc() {
      if (this.winDataArrClone.length === 0) {
        this.play = false;
        return;
      }
      this.isLight = false;
      this.isBall = false;
      this.isStop = false;

      const currentItem = this.winDataArrClone.shift();
      this.awardImg = currentItem.nftImg;
      setTimeout(() => {
        this.isLight = true;
      }, 300);
      setTimeout(() => {
        this.isLight = false;
        this.isBall = true;
      }, 800);
      setTimeout(() => {
        this.isStop = true;
        this.winDataArr.push(currentItem);
        this.animationFunc(this.winDataArrClone);
      }, 1000);
    },
  },
  watch: {
    winData: function (newData) {
      if (newData) {
        this.winDataArrClone = JSON.parse(JSON.stringify(newData));
        this.animationFunc(newData);
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
    padding: 0.2rem;
    .turntable-content {
      display: flex;
      background: url("@/assets/img/h5/lottery/01.webp") no-repeat center;
      background-size: 100% 100%;
      padding: 5%;
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
      background: url("@/assets/img/h5/lottery/05.gif") no-repeat;
      background-size: 100% 100%;
      .nft-logo {
        width: 76%;
        height: 52.97%;
        position: absolute;
        bottom: 4%;
        left: 50.5%;
        transform: translateX(-50%);
        border-radius: 0.25rem;
      }
      .nft-close {
        position: absolute;
        top: 0.3125rem;
        left: 28%;
        width: 48%;
        &.nft-open {
          left: 10%;
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
        top: 200%;
        left: 50%;
        transform: translateX(-50%);
        transition: all 0.3s ease-out;
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
      width: 100%;
      min-height: calc((100vw - 5rem) / 5);
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
