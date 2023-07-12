<template>
  <div class="roll-one-content">
    <div class="roll-text">
      <p class="public-color-one roll-title">TOP BLUE-CHIPS BOX</p>
      <p class="roll-text-offcial">An offcial box by Bitzing</p>
    </div>
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
            <div :class="['roll-one-carousel-list', list.qualityType]">
              <div class="roll-one-list-bor" ref="light" :style="borStyle">
                <img class="roll-one-list-img" :src="list.nftImg" />
              </div>
              <p class="roll-one-list-seriesName">
                <span class="roll-one-list-seriesName-text text-ellipsis">
                  {{ list.seriesName }}
                </span>
                <img
                  class="roll-one-list-seriesName-img"
                  src="@/assets/img/eth.png"
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
                      :content="`${list.initPrice}`"
                    >
                      &nbsp;{{ list.initPrice }}
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
    <div class="result-link-box">
      <result-link></result-link>
    </div>
  </div>
</template>
<script>
import resultLink from "../resultLink";
import slipe from "@/assets/music/slipe.mp3";
import advanced from "@/assets/music/advanced.mp3";
import usually from "@/assets/music/usually.mp3";
const itemWidth = 220;
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
  },
  components: { resultLink },
  data() {
    return {
      slowTranslateXPer: 0.7, //横向平移百分比
      slowTranslateX: "-70%", //横向平移距离
      isSpeedUp: false,
      isAutoplay: false,
      isActive: false,
      offetNum: 0,
      itemWidth: itemWidth, //每张卡牌的宽度
      borStyle: {
        width: `${itemWidth}px`,
        height: `${itemWidth}px`,
      },
      carouselStyle: { transform: `translateX(-${(itemWidth + 20) / 2}px)` },
      awardsList: JSON.parse(JSON.stringify(this.awards)).flat(),
      intervalId: null,
      delay: 50,
      upTime: 8, //加速动画duration时间
      linearTime: 3, //匀速动画duration时间
      slowTime: 6, //减速动画duration时间
      increment: 10,
    };
  },
  async mounted() {
    document.documentElement.style.setProperty("--up-time", this.upTime + "s");
    this.getAwardsListFunc();
    console.log(this.awardsList, "awardsList");
    const { clientWidth } = document.body;
    const result = localStorage.getItem("result");
    if (this.apiIsError) {
      return;
    }
    setTimeout(() => {
      const subAwardsWidth =
        this.$refs.subAwards[0].getBoundingClientRect().width;
      this.offetNum = parseInt(clientWidth / subAwardsWidth / 2);
      this.linearTime = this.$refs.boxesContainer.offsetWidth * 0.0001;
      this.slowTranslateX =
        -subAwardsWidth *
          parseInt(this.slowTranslateXPer * this.awardsList.length) +
        "px";
      document.documentElement.style.setProperty(
        "--slow-translateX",
        this.slowTranslateX
      );

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
          // this.isSpeedUp = true;
          this.isAutoplay = true;
        }
      }, 100);
      setTimeout(() => {
        this.musicSpeedFunc("up");
      }, 500);
      // setTimeout(() => {
      //   this.isAutoplay = true;
      //   this.isSpeedUp = false;
      // }, this.upTime * 1000);
    }
  },
  methods: {
    getAwardsListFunc() {
      const newArray = this.awardsList.slice();
      while (newArray.length < 20) {
        newArray.push(...this.awardsList);
        this.awardsList = [...newArray];
      }
    },
    playSound(_music) {
      const audioObj = new Audio(_music);
      audioObj.pause();
      audioObj.play();
    },
    slowPlayFunc() {
      const intervalId = setInterval(() => {
        if (this.delay > this.slowTime * 230) {
          clearInterval(this.intervalId);
        } else {
          this.slowPlayFunc();
        }
        this.playSound(slipe);
        this.delay += this.increment;
        this.increment *= 1.34;
        clearInterval(intervalId);
      }, this.delay);
    },
    musicSpeedFunc(type) {
      if (type == "up") {
        this.intervalId = setInterval(() => {
          this.playSound(slipe);
        }, 50);
      } else {
        this.slowPlayFunc();
      }
    },
    stopScroll(data) {
      clearInterval(this.intervalId);
      if (data && data.qualityType) {
        if (data.qualityType === "NORMAL") {
          this.playSound(usually);
        } else {
          this.playSound(advanced);
        }
      }
      this.$emit("showResultFun");
    },
  },
  watch: {
    apiIsError: function (newData) {
      if (newData) {
        this.isSpeedUp = false;
        const music = this.$refs.music;
        music.pause();
      }
    },
    awardItem: {
      deep: true,
      handler: function (newData) {
        // this.stopScroll(newData[0]);
        // return;
        if (newData.length > 0) {
          clearInterval(this.intervalId);
          const len =
            Math.floor(this.awardsList.length * this.slowTranslateXPer) +
            this.offetNum;
          this.awardsList.splice(len, 1, newData[0]);
          this.isActive = true;
          this.isAutoplay = false;
          this.musicSpeedFunc();
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
$up-time: var(--up-time);
$linear-time: var(--linear-time);
$slow-time: var(--slow-time);

.con {
  overflow-x: auto;
  overflow-y: hidden;
  transform-style: preserve-3d;
  margin-top: 4.25rem;
  &::-webkit-scrollbar {
    display: none;
  }
  .roll-one-list-img {
    width: 100%;
    height: 100%;
  }
}
.sub-con {
  display: flex;
  flex-wrap: nowrap;
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
    transform: translate3d(-20%, 0, 0);
  }
  100% {
    transform: translate3d(-60%, 0, 0);
  }
}
@keyframes slide-down {
  0% {
    transform: translate3d(-60%, 0, 0);
  }
  100% {
    transform: translate3d($slow-translateX, 0, 0);
  }
}
.scroll-up {
  // transform: translate3d(-20%, 0, 0);
  // transition: transform $up-time ease-in;
  animation: slide 4s 1 linear;
  animation-fill-mode: forwards;
}
.scroll-linear {
  // animation: 2s slide-up 1 ease-in forwards,
  //   1.5s slide 1s infinite linear forwards;
  animation: slide $linear-time infinite linear;
  animation-fill-mode: forwards;
}
.active {
  animation: slide-down $slow-time 1 cubic-bezier(0, 0.08, 0.11, 1);
}
.roll-text {
  margin-top: 4rem;
}
.result-link-box {
  margin-top: 7.875rem;
}
@media screen and (max-width: 1600px) {
  .result-link-box {
    margin-top: 1rem;
  }
  .con,
  .roll-text {
    margin: 0;
  }
}
</style>
