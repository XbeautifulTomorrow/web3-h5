<template>
  <swiper :slides-per-view="1" :space-between="50">
    <swiper-slide>
      <div class="banner-main">
        <img src="@/assets/img/banner/bgslice.png" alt="" />
        <ul class="banner-link">
          <li class="banner-link-icon">
            <img src="@/assets/svg/twitterBanner.svg" alt="" />
          </li>
          <li class="banner-link-icon">
            <img src="@/assets/svg/discord.svg" alt="" />
          </li>
        </ul>
      </div>
    </swiper-slide>
    <swiper-slide>Slide 2</swiper-slide>
    <swiper-slide>Slide 3</swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
export default {
  name: 'BannerPage',
  components: { Swiper, SwiperSlide },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.banner-main {
  width: 1170px;
  height: 450px;
  margin: 0 auto;
  position: relative;
  object-fit: contain;
  img {
    width: 100%;
    height: 100%;
  }
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
}
</style>
