<template>
  <div class="banner_wrapper">
    <swiper
      v-if="bannerList?.length > 0"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :centeredSlides="true"
      :pagination="{
        clickable: true,
      }"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
      :modules="modules"
    >
      <swiper-slide v-for="item in bannerList" :key="item.id">
        <img :src="item.bannerImage" @click="goUrl(item)" :class="[{ url_img: item.bannerUrl }]" alt="" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, A11y } from "swiper";
import { getBannerList } from "@/services/api";
import "swiper/css";
import "swiper/css/pagination";
export default {
  name: "BannerPage",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [Autoplay, Pagination, A11y],
      bannerList: [],
    };
  },
  created() {
    this.getBannerListFunc();
  },

  methods: {
    goUrl(item) {
      const { bannerUrl } = item;
      if (bannerUrl) {
        if (bannerUrl.indexOf("http") > -1) {
          window.open(bannerUrl);
        } else {
          this.$emit("bannerGo", bannerUrl);
        }
      }
    },
    async getBannerListFunc() {
      const res = await getBannerList({
        page: 1,
        size: 100,
      });
      if (res) {
        this.bannerList = res.data.records;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./components/banner.scss";

:deep(.swiper) {
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    &.url_img {
      cursor: pointer;
    }
  }
  .swiper-pagination-bullet {
    background: #ce42ff;
  }
  .swiper-pagination {
    bottom: 1.875rem;
  }
}
</style>
