<template>
  <div class="roll-one-content">
    <div class="roll-text">
      <p class="public-color-one roll-title">{{ blindDetailInfo.boxName }}</p>
      <p class="roll-text-official">{{ $t("lottery.tips_txt") }}</p>
    </div>
    <div class="con-box">
      <div :class="['con']">
        <div ref="boxesContainer" :class="[
          'sub-con',
          {
            'scroll-linear': isAutoplay,
            active: isActive,
          },
        ]">
          <div v-for="(list, index) in awardsList" :key="index">
            <div class="roll-one-carousel" ref="subAwards">
              <div :class="['roll-one-carousel-list', list.qualityType]" :style="liStyle">
                <div class="roll-one-list-bor" ref="light" :style="borStyle">
                  <image-view class="roll-one-list-img" :src="list.nftCompressImg" />
                </div>
                <p class="roll-one-list-seriesName">
                  <span class="roll-one-list-seriesName-text text-ellipsis">
                    {{ list.seriesName }}
                  </span>
                </p>
                <div class="roll-one-list-text">
                  <!-- <img class="roll-one-list-logo" :src="list.seriesImg" /> -->
                  <div class="roll-one-list-price">
                    <span class="roll-one-list-minPrice text-ellipsis">
                      <el-tooltip class="box-item" effect="dark" :content="`${list.price}`">
                        <p class="price-box">
                          <img class="coin-icon" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
                          <span>{{ list.price }}</span>
                        </p>
                      </el-tooltip>
                    </span>
                    <!-- <span class="roll-one-list-conin">
                      {{ list.coin }}
                    </span> -->
                  </div>
                  <div class="roll-one-list-nftNumber text-ellipsis" v-if="list.tokenId">
                    <el-tooltip class="box-item" effect="dark" :content="`# ${list.tokenId}`"> #&nbsp;{{ list.tokenId }}
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list_mask"></div>
      </div>
    </div>
    <div class="result-link-box">
      <result-link></result-link>
    </div>
  </div>
</template>
<script>
import { Howl } from "howler";
import { slipe, oneSlow } from "@/utils/audioResource";
import resultLink from "../resultLink";
import ImageView from "../imageView";
const itemWidth = 200;
export default {
  name: "OneAward",
  props: {
    awards: {
      type: Array,
      default: () => {
        return [];
      },
    },
    awardItem: {
      type: Array,
      default: () => {
        return [];
      },
    },
    apiIsError: {
      type: Boolean,
      default: false,
    },
    blindDetailInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { resultLink, ImageView },
  data() {
    return {
      isAutoplay: false,
      isActive: false,
      itemWidth: itemWidth, //每张卡牌的宽度
      borStyle: {
        width: `${itemWidth}px`,
        height: `${itemWidth}px`,
      },
      liStyle: {
        margin: "0 3px",
        padding: "5px 10px",
      },
      awardsList: JSON.parse(JSON.stringify(this.awards)).concat(JSON.parse(JSON.stringify(this.awards))),
      linearTime: null, //匀速动画duration时间
      slowTime: "6s", //减速动画duration时间
      boxOffsetWidth: 0,
      subAwardsWidth: 0,
      slipeMusic: null,
      linearEndTranslateX: null,
      slowTranslateX: null,
    };
  },
  async mounted() {
    this.getAwardsListFunc();
    const result = localStorage.getItem("result");
    if (this.apiIsError) {
      return;
    }
    setTimeout(() => {
      const subAwardsRef = this.$refs.subAwards[0];
      if (!subAwardsRef) return;
      this.subAwardsWidth = subAwardsRef.getBoundingClientRect().width;
      this.boxOffsetWidth = this.$refs.boxesContainer.offsetWidth;
      this.linearTime = this.boxOffsetWidth * 0.00016 + "s";
    }, 100);
    if (!result) {
      setTimeout(() => {
        if (!this.apiIsError) {
          this.isAutoplay = true;
        }
      }, 100);
      setTimeout(() => {
        this.slipeMusic = this.playSound(slipe, true);
      }, 500);
    }
  },
  methods: {
    // 获取匀速动画最后的位置
    getCurrentTranslateX() {
      const myElement = this.$refs.boxesContainer;
      if (!myElement) return;
      const computedStyle = window.getComputedStyle(myElement);
      const transformValue = computedStyle.transform;
      const matrix = transformValue.match(/^matrix\((.+)\)$/);
      if (matrix && matrix[1]) {
        const transformedValues = matrix[1].split(", ");
        const translateX = parseFloat(transformedValues[4]);
        return translateX;
      }
    },
    getAwardsListFunc() {
      const newArray = this.awardsList.slice();
      while (newArray.length < 20) {
        newArray.push(...this.awardsList);
        this.awardsList = [...newArray];
      }
    },
    playSound(_music, musicLoop = false) {
      const audioObj = new Howl({ src: [_music], loop: musicLoop });
      audioObj.pause();
      audioObj.play();
      return audioObj;
    },
    stopScroll() {
      this.stopAudioFunc();
      setTimeout(() => {
        this.$emit("showResultFun", true);
      }, 500);
    },
    slowScrollFunc(data, state) {
      const getCurrentTranslateX = this.getCurrentTranslateX();
      const translateLen = getCurrentTranslateX / this.subAwardsWidth;
      const len = parseInt(Math.abs(translateLen)) + 12;
      const slowTranslateX = -this.subAwardsWidth * len;
      this.linearEndTranslateX = getCurrentTranslateX + "px";
      this.slowTranslateX = slowTranslateX + "px";
      data.nftCompressImg = data.nftImg;
      this.awardsList.splice(len + 2, 1, data);
      this.isActive = true;
      this.isAutoplay = false;
      this.stopAudioFunc();
      if (!state) {
        this.playSound(oneSlow);
      }
    },
    stopAudioFunc() {
      this.slipeMusic && this.slipeMusic.pause();
    },
  },
  watch: {
    apiIsError: function (newData) {
      if (newData) {
        this.isAutoplay = false;
        this.stopAudioFunc();
      }
    },
    awardItem: {
      deep: true,
      handler: function (newData) {
        if (newData.length > 0) {
          this.slowScrollFunc(newData[0]);
          setTimeout(() => {
            this.stopScroll(newData[0]);
          }, parseFloat(this.slowTime) * 1000);
        }
      },
    },
  },
  beforeUnmount() {
    this.stopAudioFunc();
  },
};
</script>
<style lang="scss" scoped>
@import "./css/one.scss";

.roll-one-content {
  overflow: hidden;
}

.con-box {
  width: 100%;
  display: flex;
  justify-content: center;
}

.con {
  position: relative;
  width: 1120px;
  margin-top: 6.3vh;
  overflow: inherit;

  &::-webkit-scrollbar {
    display: none;
  }

  .roll-one-list-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.sub-con {
  display: flex;
  flex-wrap: nowrap;
  transform-style: preserve-3d;
  will-change: transform;
  transform: translate3d(-10%, 0, 0);

  &>div {
    display: inline-block;
  }
}

@keyframes slide-up {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(-20%, 0, 0);
  }
}

@keyframes slide {
  0% {
    transform: translate3d(-10%, 0, 0);
  }

  100% {
    transform: translate3d(-60%, 0, 0);
  }
}

@keyframes slide-down {
  0% {
    transform: translate3d(v-bind("linearEndTranslateX"), 0, 0);
  }

  100% {
    transform: translate3d(v-bind("slowTranslateX"), 0, 0);
  }
}

.scroll-up {
  animation: slide 4s 1 linear;
  animation-fill-mode: forwards;
}

.scroll-linear {
  animation: slide v-bind("linearTime") infinite linear;
  animation-fill-mode: forwards;
}

.active {
  animation: slide-down v-bind("slowTime") 1 cubic-bezier(0, 0.08, 0.11, 1);
  animation-fill-mode: forwards;
}

.roll-text {
  margin-top: 0;
}

.result-link-box {
  margin-top: 6vh;
}

@media screen and (max-width: 1600px) {

  .con,
  .roll-text {
    margin: 0;
  }
}

@media (max-height: 900px) {
  .roll-text {
    margin-top: 0;
  }

  .con {
    margin-top: 0;
  }

  .result-link-box {
    margin-top: 0;
  }
}</style>
