<template>
  <div class="roll-one-content">
    <div class="roll-text">
      <p class="public-color-one roll-title">TOP BLUE-CHIPS BOX</p>
      <p class="roll-text-offcial">An offcial box by Bitzing</p>
    </div>
    <div class="con">
      <el-carousel
        height="280"
        :interval="interval"
        :autoplay="autoplay"
        :pause-on-hover="false"
        indicator-position="none"
        arrow="never"
        @change="changeFun"
        ref="carousel"
      >
        <el-carousel-item v-for="(item, index) in awardsList" :key="index">
          <div class="roll-one-carousel" :style="carouselStyle">
            <div
              v-for="(list, _listIndex) in item"
              :key="`list-${_listIndex}`"
              class="roll-one-carousel-list"
            >
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
                      :content="`# ${list.price}`"
                    >
                      #&nbsp;{{ list.price }}
                    </el-tooltip>
                  </span>
                  <span class="roll-one-list-conin">
                    {{ list.coin }}
                  </span>
                </div>
                <div
                  class="roll-one-list-nftNumber text-ellipsis"
                  v-if="item.tokenId"
                >
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="`# ${item.tokenId}`"
                  >
                    #&nbsp;{{ item.tokenId }}
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
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
      interval: 280,
      slidesPerView: Math.floor(document.body.clientWidth / itemWidth),
      autoplay: false,
      musicLoop: true,
      itemWidth: itemWidth, //每张卡牌的宽度
      borStyle: {
        width: `${itemWidth}px`,
        height: `${itemWidth}px`,
      },
      carouselStyle: { transform: `translateX(-${(itemWidth + 20) / 2}px)` },
      showIndex: 0,
      awardsList: JSON.parse(JSON.stringify(this.awards)),
    };
  },
  mounted() {
    const { clientWidth } = document.body;
    this.interval = Math.ceil(clientWidth / 1920) * this.interval;
    if (this.interval >= 330) {
      this.interval = 330;
    }
    // if (!localStorage.getItem("ONE")) {
    // this.autoplay = true;
    // this.playMusicFun(slipe);
    // }
  },
  methods: {
    playMusicFun(_music, musicLoop = true, _ref = "music") {
      this.musicLoop = musicLoop;
      const music = this.$refs[_ref];
      music.src = _music;
      music.play();
    },
    changeFun(index) {
      this.showIndex = index;
    },
    getRand(start, end) {
      return Math.floor(Math.random() * (end - start + 1) + start);
    },
    stopScroll(data) {
      this.autoplay = false;
      const { showIndex, awardsList } = this;
      const showNumber = awardsList[0].length;
      const _showNumber = Math.floor(showNumber / 2) - 1;
      this.awardsList[showIndex].splice(_showNumber, 1, data);
      localStorage.setItem("awardItem", JSON.stringify(data));
      const _x = this.getRand(10, itemWidth - 60);
      this.carouselStyle = { transform: `translateX(-${_x}px` };
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
        this.autoplay = false;
        const music = this.$refs.music;
        music.pause();
      }
    },
    awardItem: {
      deep: true,
      handler: function (newData) {
        if (newData.length > 0) {
          this.stopScroll(newData[0]);
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("./css/one.scss");
</style>
