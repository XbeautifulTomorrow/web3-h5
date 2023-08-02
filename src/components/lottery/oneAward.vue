<template>
  <div class="roll-one-content">
    <div class="roll-text">
      <p class="public-color-one roll-title">{{ blindDetailInfo.boxName }}</p>
      <p class="roll-text-offcial">{{ $t("lottery.tips_txt") }}</p>
    </div>
    <div class="con-box">
      <div :class="['con']">
        <div
          ref="boxesContainer"
          :class="[
            'sub-con',
            {
              'scroll-linear': isAutoplay,
              active: isActive,
            },
          ]"
        >
          <div v-for="(list, index) in awardsList" :key="index">
            <div class="roll-one-carousel" ref="subAwards">
              <div
                :class="['roll-one-carousel-list', list.qualityType]"
                :style="liStyle"
              >
                <div class="roll-one-list-bor" ref="light" :style="borStyle">
                  <image-view
                    class="roll-one-list-img"
                    :src="list.nftCompressImg"
                  />
                </div>
                <p class="roll-one-list-seriesName">
                  <span class="roll-one-list-seriesName-text text-ellipsis">
                    {{ list.seriesName }}
                  </span>
                  <img
                    class="roll-one-list-seriesName-img"
                    src="@/assets/svg/user/icon_ethereum.svg"
                    alt=""
                  />
                </p>
                <div class="roll-one-list-text">
                  <!-- <img class="roll-one-list-logo" :src="list.seriesImg" /> -->
                  <div class="roll-one-list-price">
                    <span class="roll-one-list-minPrice text-ellipsis">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="`${list.price}`"
                      >
                        &nbsp;{{ list.price }}
                      </el-tooltip>
                    </span>
                    <span class="roll-one-list-conin">
                      {{ list.coin }}
                    </span>
                  </div>
                  <div
                    class="roll-one-list-nftNumber text-ellipsis"
                    v-if="list.tokenId"
                  >
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="`# ${list.tokenId}`"
                    >
                      #&nbsp;{{ list.tokenId }}
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
      awardsList: JSON.parse(JSON.stringify(this.awards)).concat(
        JSON.parse(JSON.stringify(this.awards))
      ),
      intervalId: null,
      delay: 50,
      linearTime: 3, //匀速动画duration时间
      slowTime: 6, //减速动画duration时间
      increment: 10,
      boxOffsetWidth: 0,
      subAwardsWidth: 0,
      slipe: "https://www.bitzing.io/prd/music/slipe.mp3",
      advanced: "https://www.bitzing.io/prd/music/advanced.mp3",
      usually: "https://www.bitzing.io/prd/music/usually.mp3",
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
      this.linearTime = this.boxOffsetWidth * 0.00016;
      document.documentElement.style.setProperty(
        "--linear-time",
        this.linearTime + "s"
      );
      document.documentElement.style.setProperty(
        "--slow-time",
        this.slowTime + "s"
      );
    }, 1000);
    if (!result) {
      setTimeout(() => {
        if (!this.apiIsError) {
          this.isAutoplay = true;
        }
      }, 100);
      setTimeout(() => {
        this.musicSpeedFunc("up");
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
    playSound(_music) {
      const audioObj = new Howl({ src: [_music] });
      audioObj.stop();
      audioObj.play();
    },
    slowPlayFunc() {
      const intervalId = setInterval(() => {
        if (this.delay > this.slowTime * 500) {
          clearInterval(this.intervalId);
        } else {
          this.slowPlayFunc();
        }
        this.playSound(this.slipe);
        this.delay += this.increment;
        this.increment *= 1.5;
        clearInterval(intervalId);
      }, this.delay);
    },
    musicSpeedFunc(type) {
      if (type == "up") {
        this.intervalId = setInterval(() => {
          this.playSound(this.slipe);
        }, 50);
      } else {
        this.slowPlayFunc();
      }
    },
    stopScroll(data) {
      clearInterval(this.intervalId);
      if (data && data.qualityType) {
        if (data.qualityType === "NORMAL") {
          this.playSound(this.usually);
        } else {
          this.playSound(this.advanced);
        }
      }
      setTimeout(() => {
        this.$emit("showResultFun");
      }, 500);
    },
    slowScrollFunc(data, state) {
      const getCurrentTranslateX = this.getCurrentTranslateX();
      const translateLen = getCurrentTranslateX / this.subAwardsWidth;
      const len = parseInt(Math.abs(translateLen)) + 12;
      const slowTranslateX = -this.subAwardsWidth * len + "px";
      document.documentElement.style.setProperty(
        "--linearEnd-translateX",
        getCurrentTranslateX + "px"
      );
      document.documentElement.style.setProperty(
        "--slow-translateX",
        slowTranslateX
      );
      data.nftCompressImg = data.nftImg;
      this.awardsList.splice(len + 2, 1, data);
      this.isActive = true;
      this.isAutoplay = false;
      clearInterval(this.intervalId);
      if (!state) {
        this.musicSpeedFunc();
      }
    },
  },
  watch: {
    apiIsError: function (newData) {
      if (newData) {
        this.isAutoplay = false;
        clearInterval(this.intervalId);
      }
    },
    awardItem: {
      deep: true,
      handler: function (newData) {
        if (newData.length > 0) {
          this.slowScrollFunc(newData[0]);
          setTimeout(() => {
            this.stopScroll(newData[0]);
          }, this.slowTime * 1000);
        }
      },
    },
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>
<style lang="scss" scoped>
@import url("./css/one.scss");
$slow-translateX: var(--slow-translateX);
$linear-time: var(--linear-time);
$slow-time: var(--slow-time);
$linearEnd-translateX: var(--linearEnd-translateX);
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
  & > div {
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
    transform: translate3d($linearEnd-translateX, 0, 0);
  }

  100% {
    transform: translate3d($slow-translateX, 0, 0);
  }
}

.scroll-up {
  animation: slide 4s 1 linear;
  animation-fill-mode: forwards;
}

.scroll-linear {
  animation: slide $linear-time infinite linear;
  animation-fill-mode: forwards;
}

.active {
  animation: slide-down $slow-time 1 cubic-bezier(0, 0.08, 0.11, 1);
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
}
</style>
