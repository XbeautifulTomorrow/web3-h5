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
            <div class="level_description">INVITE USERS TO</div>
            <div class="level_description">GET MORE POINTS</div>
            <div class="level_description">REWARDS</div>
            <div class="level_description_text">
                Amet Ornare Massa Praesent Lacus. In Mi Tristique Enim Tellus Amet Semper A. Donec Ac Congue Nunc Porta
                Semper Auctor Enim.
            </div>
            <div class="invite_button">Total Rewarded: $4.97</div>
        </div>
        <div class="banner_box">
            <img src="@/assets/img/home/banner.png" alt="">
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
};
</script>
  
<style lang="scss" scoped>
@import "./components/banner.scss";
</style>
  