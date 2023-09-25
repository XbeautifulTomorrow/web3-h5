<template>
  <div class="award-multi-h5">
    <div class="turntable-box">
      <div class="turntable-content">
        <img :src="blindDetailInfo.showImgTwo" :class="['nft-img', , { autoplay: isPlay }]" alt="" />
        <ImageView :src="currentItem.nftCompressImg || currentItem.nftImg" class="award-img" />
      </div>
      <div class="turntable-middle">
        <img :src="blindDetailInfo.showImgOne" class="nft-logo" alt="" />
        <img src="@/assets/img/h5/lottery/02.webp" :class="['nft-close', { 'nft-open': isOpen }]" alt="" />
        <img :src="EPICLight" class="light" v-if="isLight && currentItem.qualityType == 'EPIC'" alt="" />
        <img :src="LEGENDLight" class="light" v-if="isLight && currentItem.qualityType == 'LEGEND'" alt="" />
        <img :src="NORMALLight" class="light" v-if="isLight && currentItem.qualityType == 'NORMAL'" alt="" />
        <img :src="RARELight" class="light" v-if="isLight && currentItem.qualityType == 'RARE'" alt="" />
        <div :class="['nft-img', currentItem.qualityType, { 'nft-img-big': isNft, 'nft-img-hidden': isStop }]">
          <ImageView :src="currentItem.nftCompressImg || currentItem.nftImg" />
        </div>
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
import EPICLight from "@/assets/img/h5/lottery/EPIC.gif";
import LEGENDLight from "@/assets/img/h5/lottery/LEGEND.gif";
import NORMALLight from "@/assets/img/h5/lottery/NORMAL.gif";
import RARELight from "@/assets/img/h5/lottery/RARE.gif";

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
      isPlay: true,
      isOpen: false,
      isLight: false,
      isNft: false,
      isStop: false,
      winDataArr: [],
      winDataArrClone: [],
      delayTime: 0,
      currentItem: {},
      EPICLight,
      LEGENDLight,
      NORMALLight,
      RARELight,
    };
  },
  mounted() {
    this.$emit("delayTime", this.delayTime);
  },
  beforeCreate() {
    let count = 0;
    let imgs = [EPICLight, LEGENDLight, NORMALLight, RARELight, this.blindDetailInfo.showImgOne, this.blindDetailInfo.showImgTwo];
    for (let img of imgs) {
      let image = new Image();
      image.onload = () => {
        count++;
      };
      image.src = img;
    }
  },
  methods: {
    animationFunc() {
      if (this.winDataArrClone.length === 0) {
        this.isPlay = false;
        return;
      }
      this.isPlay = true;
      this.isOpen = false;
      this.isLight = false;
      this.isNft = false;
      this.isStop = false;
      setTimeout(() => {
        this.currentItem = this.winDataArrClone.shift();
        this.isOpen = true;
        this.isPlay = false;
      }, 200);
      setTimeout(() => {
        this.isLight = true;
      }, 300);
      setTimeout(() => {
        this.isNft = true;
      }, 500);
      setTimeout(() => {
        this.isOpen = false;
        this.isLight = false;
      }, 900);
      setTimeout(() => {
        this.isLight = false;
        this.isStop = true;
        this.winDataArr.push(this.currentItem);
        this.animationFunc(this.winDataArrClone);
      }, 1000);
    },
  },
  watch: {
    winData: function (newData) {
      if (newData) {
        this.winDataArrClone = JSON.parse(JSON.stringify(newData));
        setTimeout(() => {
          this.animationFunc(newData);
        }, this.delayTime * 1000);
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

@keyframes nftImgAnimation {
  0% {
    transform: scale(0);
    top: -2%;
    left: 24%;
  }
  10% {
    transform: scale(1);
    top: -2%;
    left: 24%;
  }
  80% {
    transform: scale(1);
    top: -2%;
    left: 24%;
  }
  100% {
    transform: scale(1) translateX(-50%);
    top: 170%;
    left: 50%;
  }
}

.award-multi-h5 {
  padding: 0 1rem;
  .turntable-box {
    position: relative;
    width: 60vw;
    height: 60vw;
    margin: 0 auto;
    padding: 0.2rem;
    .turntable-content {
      position: relative;
      display: flex;
      background: url("@/assets/img/h5/lottery/01.webp") no-repeat center;
      background-size: 100% 100%;
      padding: 5%;
      .award-img {
        position: absolute;
        width: 26%;
        left: 31%;
        top: 5%;
      }
    }
    .nft-img {
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      &.autoplay {
        animation: rotateAnimation 0.3s infinite linear;
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
        width: 78%;
        height: 55%;
        position: absolute;
        bottom: 3%;
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
          // backdrop-filter: blur(10px);
        }
      }
      .light {
        position: absolute;
        top: -155%;
        left: -131%;
        width: 350%;
      }
      .nft-img {
        position: absolute;
        z-index: 3000;
        width: 23vw;
        top: -2%;
        left: 24%;
        transform: scale(0);
        padding: 0.25rem;
      }
      .nft-img-big {
        animation: nftImgAnimation 0.5s ease-out;
        animation-fill-mode: forwards;
      }
      .nft-img-hidden {
        display: none;
      }
    }
  }
  .award-multi-result {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 0.25rem;
    margin-top: 1.875rem;
    .award-item {
      width: 100%;
    }
    .award-item-img {
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
