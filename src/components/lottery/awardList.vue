<template>
  <el-carousel
    :class="[
      'award-carousel',
      autoPlay ? 'autoplay-box' : 'no-autoplay-box',
      { 'no-autoplay-box2': stopPlay },
    ]"
    :height="`${height * 3}`"
    :interval="interval"
    :autoplay="false"
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
      :class="[
        'lottery-moreLuck-list',
        {
          'is-active':
            item.map((x) => x.tokenId).includes(winData.tokenId) && stopPlay,
        },
      ]"
    >
      <div
        v-for="(_img, imgIndex) in item"
        :class="[
          'lottery-moreLuck-list-content',
          _img.qualityType,
          { 'is-active-item': winData.tokenId == _img.tokenId && stopPlay },
        ]"
        :key="`img-${imgIndex}`"
      >
        <image-view
          class="lottery-moreLuck-list-img"
          :src="
            winData.nftImg == _img.nftImg ? _img.nftImg : _img.nftCompressImg
          "
        />
        <div v-if="winData && winData.nftImg == _img.nftImg && stopPlay">
          <p class="lottery-moreLuck-seriesName">
            {{ winData.seriesName }}
          </p>
          <p class="lottery-moreLuck-price">
            <img
              class="public-dialog-list-img"
              src="@/assets/svg/user/icon_ethereum.svg"
              alt=""
            />
            {{ winData.price }}
          </p>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import ImageView from "../imageView";
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
  components: {
    ImageView,
  },
  data() {
    return {
      index: 0,
      poolList: JSON.parse(JSON.stringify(this.prizePoolList)).concat(
        JSON.parse(JSON.stringify(this.prizePoolList))
      ),
      autoPlay: this.autoplay,
      stopTime: 0,
      stopPlay: false,
    };
  },
  mounted() {
    const time = this.poolList.length * 0.13;
    this.stopTime = time / 5;
    this.$emit("delayTime", this.stopTime);
    document.documentElement.style.setProperty("--linear-time", time + "s");
    document.documentElement.style.setProperty(
      "--stop-time",
      this.stopTime + "s"
    );
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
        let index = parseInt(this.poolList.length * Math.abs(0.5));
        this.poolList[index] = [
          ...this.poolList[index].map((x) =>
            x.tokenId == newData.tokenId ? { ...x, tokenId: "" } : x
          ),
        ];
        this.poolList[index].splice(1, 1, newData);
      }
    },
    autoplay: function (newData) {
      this.autoPlay = newData;
      if (!newData) {
        setTimeout(() => {
          this.stopPlay = true;
        }, this.stopTime * 1000);
      }
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
  color: #a9a4b4;
}
.lottery-moreLuck-list-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 0.25rem;
  :deep(.el-image__inner) {
    filter: brightness(30%);
  }
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
  width: 5.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
  margin-top: 0.25rem;
}
.lottery-moreLuck-price {
  font-family: Tomorrow;
  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 0.125rem;
  img {
    width: 1rem;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
}
.lottery-moreLuck-tokenId {
  font-size: 12px;
  color: #0cbb3e;
}
</style>
<style lang="scss">
$linear-time: var(--linear-time);
$stop-time: var(--stop-time);
@keyframes verticalScroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
@keyframes verticalScroll2 {
  0% {
    transform: translateY(-40%);
  }
  100% {
    transform: translateY(-50%);
  }
}
.el-carousel {
  &::-webkit-scrollbar {
    display: none;
  }
}
.el-carousel__container {
  height: auto !important;
  animation: verticalScroll $linear-time linear infinite;
  animation-fill-mode: forwards;
}

.el-carousel__item {
  transform: translateY(0) scale(1) !important;
  position: inherit;
}
.award-carousel {
  &.no-autoplay-box2 {
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
        // top: -0.875rem;
      }
      .lottery-moreLuck-list-content:nth-child(3) {
        position: relative;
        // top: -25px;
      }
    }
  }
  &.no-autoplay-box {
    .el-carousel__container {
      animation: verticalScroll2 $stop-time linear 1;
      animation-fill-mode: forwards;
    }
  }
  .el-carousel__container {
    height: 100%;
  }
}
</style>
