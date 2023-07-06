<template>
    <div class="banner_wrapper">
        <div class="banner_l">
            <div class="next_box">
                <div class="next_text">NEXT:</div>
                <div class="next_level">
                    <img src="@/assets/svg/banner/logo.svg" alt="">
                    <div class="level_name">BRONZE 1</div>
                </div>
                <img class="interval_img" src="@/assets/svg/banner/interval.svg" alt="">
                <div class="exp_slot">
                    <span>$138.06</span>
                    <span>/</span>
                    <span>$10k</span>
                </div>
            </div>
            <div class="level_description">{{ $t("home.bannerText1") }}</div>
            <div class="level_description">{{ $t("home.bannerText2") }}</div>
            <div class="level_description">{{ $t("home.bannerText3") }}</div>
            <div class="level_description_text">
                {{ $t('home.bannerTips') }}
            </div>
            <div class="invite_button" @click="goAirdrop()">{{ $t("home.bannerBtn") }}</div>
        </div>
        <div class="banner_box">
            <img src="@/assets/svg/home/banner_small.svg" alt="">
            <div class="introduce">{{ $t("home.bannerCopywriting1") }}</div>
            <div class="introduce_details">{{ $t("home.bannerCopywriting2") }}</div>
            <div class="round"></div>
            <!-- <swiper class="banner_swiper" :slides-per-view="1" :space-between="50">
                <swiper-slide>
                    <div class="banner-main">
                        <div class="banner-content">
                            <img class="banner-main-img" src="@/assets/img/banner/bgslice.png" alt="" />
                        </div>
                    </div>
                </swiper-slide>
            </swiper> -->
        </div>
    </div>
</template>
  
<script>
// import { Swiper, SwiperSlide } from 'swiper/vue';
// import 'swiper/css';
export default {
    name: 'BannerPage',
    // components: { Swiper, SwiperSlide },
    data() {
        return {};
    },
    methods: {
        goAirdrop() {
            this.$router.push({ name: "Airdrop" });
        },
    }
};
</script>
  
<style lang="scss" scoped>
@import "./components/banner.scss";
</style>
  