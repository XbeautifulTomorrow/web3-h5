<template>
  <div class="roll-one-content">
    <div class="roll-text">
      <p class="public-color-one roll-title">TOP BLUE-CHIPS BOX</p>
      <p class="roll-text-offcial">An offcial box by Bitzing</p>
    </div>
    <div :class="['con']">
      <div
        ref="boxesContainer"
        :style="carouselStyle"
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
      :loop="musicLoop"
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
      isSpeedUp: false,
      isAutoplay: false,
      isActive: false,
      interval: 6000,
      slidesPerView: Math.floor(document.body.clientWidth / itemWidth),
      musicLoop: true,
      offetNum: 0,
      itemWidth: itemWidth, //每张卡牌的宽度
      borStyle: {
        width: `${itemWidth}px`,
        height: `${itemWidth}px`,
      },
      carouselStyle: { transform: `translateX(-${(itemWidth + 20) / 2}px)` },
      showIndex: 0,
      awardsList: JSON.parse(JSON.stringify(this.awards))
        .concat(
          JSON.parse(JSON.stringify(this.awards)).slice(
            0,
            JSON.parse(JSON.stringify(this.awards)).length * 0.5
          )
        )
        .flat(),
      targetedIndex: -1,
    };
  },
  async mounted() {
    console.log(this.awardsList, "awardsList");
    const { clientWidth } = document.body;
    this.interval = Math.ceil(clientWidth / 1920) * this.interval;
    if (this.interval >= 330) {
      this.interval = 330;
    }
    const result = localStorage.getItem("result");
    if (this.apiIsError) {
      return;
    }
    setTimeout(() => {
      const subAwardsWidth = this.$refs.subAwards[0].offsetWidth;
      console.log(clientWidth / subAwardsWidth / 2, "offetNum");
      const decimalPlaces =
        clientWidth / subAwardsWidth / 2 -
          parseInt(clientWidth / subAwardsWidth / 2) >
        0.9;
      this.offetNum = decimalPlaces
        ? Math.ceil(clientWidth / subAwardsWidth / 2)
        : parseInt(clientWidth / subAwardsWidth / 2);
    }, 2000);
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
    pauseMusicFun() {
      const music = this.$refs.music;
      music.pause();
    },
    musicSpeedFunc(type) {
      let speed = 1.5;
      const music = this.$refs.music;
      if (type == "up") {
        speed = 0.6;
        const intervalId = setInterval(() => {
          if (speed < 1.3) {
            speed += 0.2;
            music.playbackRate = speed;
          } else {
            clearInterval(intervalId);
          }
          console.log(speed, "speed");
        }, 1000);
      } else {
        const intervalId = setInterval(() => {
          if (speed > 0.3) {
            speed -= 0.3;
            music.playbackRate = speed;
          } else {
            clearInterval(intervalId);
          }
        }, 1000);
      }
    },
    playMusicFun(_music, musicLoop = true, _ref = "music") {
      this.musicLoop = musicLoop;
      const music = this.$refs[_ref];
      music.src = _music;
      music.play();
    },
    stopScroll(data) {
      this.pauseMusicFun();
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
          console.log(this.awardsList.length * 0.7, "len");
          const len = Math.round(this.awardsList.length * 0.7) + this.offetNum;
          this.awardsList.splice(len, 1, newData[0]);
          this.isActive = true;
          this.isAutoplay = false;
          this.musicSpeedFunc();
          setTimeout(() => {
            this.stopScroll(newData[0]);
          }, 5000);
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("./css/one.scss");
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
    transform: translate3d(-70%, 0, 0);
  }
}
.scroll-up {
  animation: slide-up 2s 1 ease-in;
  animation-fill-mode: forwards;
  transform: translateZ(0);
}
.scroll-linear {
  animation: slide 5s infinite linear;
  animation-fill-mode: forwards;
  transform: translateZ(0);
}
.active {
  animation: slide-down 5s 1 cubic-bezier(0, 0.08, 0.11, 1);
  animation-fill-mode: forwards;
}
</style>
