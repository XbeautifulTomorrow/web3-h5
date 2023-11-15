<template>
  <div class="banner_wrapper">
    <div class="banner_bg">
      <div class="banner_txt_box">
        <div>
          <p>GET 200% BONUS</p>
          <p>UP TO 1,000,000 USDT</p>
        </div>
        <div class="join_button" @click="goUrl(bgUrl)">JOIN NOW</div>
      </div>
    </div>
    <div class="swiper_box">
      <swiper
        v-if="bannerList?.length > 0"
        :slides-per-view="innerWidth > 950 ? 3 : 2"
        :slides-per-group="innerWidth > 950 ? 3 : 2"
        :space-between="16"
        :loop="true"
        :pagination="{
          clickable: true,
        }"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
        :modules="modules"
      >
        <swiper-slide v-for="item in bannerList" :key="item.id">
          <img :src="item.bannerImage" :class="[{ url_img: item.bannerUrl }]" @click="goUrl(item)" alt="" />
        </swiper-slide>
      </swiper>
    </div>
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
      innerWidth: 0,
      bgUrl: { bannerUrl: "/user/promotions" },
    };
  },
  created() {
    if (localStorage.getItem("banner")) {
      this.bannerList = JSON.parse(localStorage.getItem("banner"));
    }
    this.getBannerListFunc();
  },
  mounted() {
    this.innerWidth = window.innerWidth;
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
        this.bannerList = res?.data?.records;
        if (this.bannerList) {
          localStorage.setItem("banner", JSON.stringify(this.bannerList));
        }
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
    width: 0.75rem;
    height: 0.75rem;
    background: #e4e7f5;
    opacity: 1;
    &.swiper-pagination-bullet-active {
      width: 1rem;
      height: 1rem;
      background: #fbd851;
    }
  }
  .swiper-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 4.375rem;
  }
}
</style>
