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
            'scroll-up': isSpeedUp,
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
    <audio
      id="music"
      ref="music"
      preload="auto"
      webkit-playsinline="true"
      playsinline="true"
      class="bitzing-audio"
    ></audio>
  </div>
</template>
<script>
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
      awardsList: JSON.parse(JSON.stringify(this.awards))
        .concat(
          JSON.parse(JSON.stringify(this.awards)).slice(
            0,
            JSON.parse(JSON.stringify(this.awards)).length * 0.5
          )
        )
        .flat(),
      intervalId: null,
      delay: 100,
      linearTime: 2, //匀速动画duration时间
      slowTime: 5, //减速动画duration时间
    };
  },
  async mounted() {
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
      this.playMusicFun(slipe);
      this.musicSpeedFunc("up");
      setTimeout(() => {
        if (!this.apiIsError) {
          this.isSpeedUp = true;
        }
      });
      setTimeout(() => {
        this.isSpeedUp = false;
        this.isAutoplay = true;
      }, 2000);
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
    playSound() {
      const audioObj = new Audio(slipe);
      audioObj.pause();
      audioObj.play();
    },
    slowPlayFunc() {
      const intervalId = setInterval(() => {
        const d = 2;
        if (this.delay > this.slowTime * 400) {
          clearInterval(this.intervalId);
        } else {
          this.slowPlayFunc();
        }
        this.playSound();
        this.delay += d * 200;
        clearInterval(intervalId);
      }, this.delay);
    },
    pauseMusicFun() {
      const music = this.$refs.music;
      music.pause();
    },
    musicSpeedFunc(type) {
      if (type == "up") {
        this.intervalId = setInterval(() => {
          this.playSound();
        }, 100);
      } else {
        this.slowPlayFunc();
      }
    },
    playMusicFun(_music, musicLoop = true, _ref = "music") {
      this.musicLoop = musicLoop;
      const music = this.$refs[_ref];
      music.src = _music;
      music.play();
    },
    stopScroll(data) {
      clearInterval(this.intervalId);
      if (data && data.qualityType) {
        if (data.qualityType === "NORMAL") {
          this.playMusicFun(usually, false);
        } else {
          this.playMusicFun(advanced, false);
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
};
</script>
<style lang="scss" scoped>
@import url("./css/one.scss");
$slow-translateX: var(--slow-translateX);
$linear-time: var(--linear-time);
$slow-time: var(--slow-time);
.con {
  overflow-x: auto;
  overflow-y: hidden;
  transform-style: preserve-3d;
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
    transform: translate3d(-10%, 0, 0);
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
    transform: translate3d(-60%, 0, 0);
  }
  100% {
    transform: translate3d($slow-translateX, 0, 0);
  }
}
.scroll-up {
  animation: slide-up 2s 1 ease-in;
  animation-fill-mode: forwards;
  transform: translateZ(0);
}
.scroll-linear {
  animation: slide $linear-time infinite linear;
  animation-fill-mode: forwards;
  transform: translateZ(0);
}
.active {
  animation: slide-down $slow-time 1 cubic-bezier(0, 0.08, 0.11, 1);
  animation-fill-mode: forwards;
}
</style>
