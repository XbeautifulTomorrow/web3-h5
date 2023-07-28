<template>
  <div class="slider_wrapper">
    <div class="slider">
      <div class="slider__viewport">
        <div class="slider__viewbox">
          <div class="slider__container" :style="{ transform: `translateX(-${50 * sliderActive}%)` }">
            <div class="slider-item" :style="{ left: `${50 * index}%` }" :class="[
              index - 1 == sliderActive && 'next',
              sliderActive == index && 'active',
              index + 1 == sliderActive && 'prev',
            ]" v-for="(item, index) in nftParams" :key="index">
              <div class="slider-item__inner">
                <div class="slider-item__trigger" @click="sliderActive = index"></div>
                <a class="card" :style="`--card-image:url('${item.nftImg}')`"
                  :class="[`series_level_bg_${typrFormat(item)}`]">
                  <div class="card__container">
                    <div class="card__image"></div>
                    <div class="card__content">
                      <div class="card-name">
                        <span>{{ sName }}</span>
                        <img src="@/assets/svg/home/icon_certified.svg" alt="" />
                      </div>
                      <div class="card-probability text-ellipsis">
                        <span v-show="nftType == 'EXTERNAL'">{{ `#${item.tokenId}` }}</span>
                        <span>{{ $t("mysteryBox.rewardIdNum", { idx: item.idx }) }}</span>
                      </div>
                      <div class="card-price">{{ item.price }}{{ item.coin }}</div>
                      <div class="card-market">
                        <!-- 市场图标？ -->
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="btns_box">
          <div class="close_dialog_btn" @click="handleClose()">{{ $t("mysteryBox.close") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "boxSlider",
  props: {
    nftType: {
      type: String,
      default: null
    },
    nftParams: {
      type: Array,
      default: () => {
        return [];
      },
    },
    sName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      sliderActive: 0
    };
  },
  watch: {
    nftParams() {
      this.sliderActive = Math.ceil(this.nftParams.length / 2) - 1;
    }
  },
  methods: {
    handleActive(event) {
      console.log(event);
    },
    typrFormat(event) {
      if (event.qualityType == "LEGEND") {
        return "1"
      }
      if (event.qualityType == "RARE") {
        return "2"
      }
      if (event.qualityType == "EPIC") {
        return "3"
      } else {
        return "4"
      }
    },
    handleClose() {
      this.$emit("closeFun")
    }
  },
};
</script>
<style lang="scss" scoped>
$component: "slider";
$slider-visible-item: 3;
$slider-viewport-width: 100%;
$slider-viewbox-ratio: 2/3;
$slider-item-active: 3;
$slider-viewbox-width: 22.375rem;
$slider-viewbox-height: 28.625rem;
$slider-viewbox-max-width: calc(50vh);
$transition-scale: 1;
$transition-duration: 0.6s;
$transition-timing-function: cubic-bezier(0.62, 0.28, 0.23, 0.99);
@import "./components/slider.scss";
</style>
