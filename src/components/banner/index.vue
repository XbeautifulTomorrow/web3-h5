<template>
  <swiper :slides-per-view="1" :space-between="50">
    <swiper-slide>
      <div class="banner-main">
        <div class="banner-content">
          <img
            class="banner-main-img"
            src="@/assets/img/banner/bgslice.png"
            alt=""
          />
          <ul class="banner-link">
            <li class="banner-link-icon">
              <img src="@/assets/svg/twitterBanner.svg" alt="" />
            </li>
            <li class="banner-link-icon">
              <img src="@/assets/svg/discord.svg" alt="" />
            </li>
          </ul>
          <img
            class="banner-img0"
            src="@/assets/img/banner/image0.png"
            alt=""
          />
          <img
            class="banner-img1"
            src="@/assets/img/banner/image1.png"
            alt=""
          />
          <img
            class="banner-img2"
            src="@/assets/img/banner/image2.png"
            alt=""
          />
          <img
            class="banner-img3"
            src="@/assets/img/banner/image3.png"
            alt=""
          />
          <img
            class="banner-img4"
            src="@/assets/img/banner/image4.png"
            alt=""
          />
          <img
            class="banner-img5"
            src="@/assets/img/banner/image5.png"
            alt=""
          />
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>Slide 2</swiper-slide>
    <swiper-slide>Slide 3</swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
export default {
  name: "BannerPage",
  components: { Swiper, SwiperSlide },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.banner-main {
  width: 1290px;
  margin: 0 auto;
  position: relative;
  object-fit: contain;
  padding: 39px 30px 15px 50px;
  box-sizing: border-box;
}
.banner-content {
  width: 100%;
  height: 100%;
}
.banner-main-img {
  width: 100%;
  height: 100%;
}
.banner-link {
  display: flex;
  align-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  bottom: 33%;
  transform: translate(-50%);
  cursor: pointer;
}
.banner-link-icon {
  width: 36px;
  height: 36px;
  margin-right: 36px;
  &:last-child {
    margin-right: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.banner-main {
  .banner-img0 {
    width: 120px;
    height: 120px;
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
  }
  .banner-img1 {
    width: 124px;
    height: 153px;
    position: absolute;
    top: 80px;
    right: 0;
  }
  .banner-img2 {
    width: 111px;
    height: 109px;
    position: absolute;
    bottom: 110px;
    right: 120px;
  }
  .banner-img3 {
    width: 104px;
    height: 138px;
    position: absolute;
    bottom: 80px;
    right: 430px;
  }
  .banner-img4 {
    width: 104px;
    height: 126px;
    position: absolute;
    bottom: 0;
    left: 420px;
  }
  .banner-img5 {
    width: 109px;
    height: 144px;
    position: absolute;
    top: 110px;
    left: 35px;
  }
}
</style>
