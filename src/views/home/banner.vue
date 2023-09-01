<template>
  <div class="banner_wrapper">
    <div class="banner_box">
      <div class="banner_l">
        <div class="level_description">{{ $t("home.bannerText1") }}</div>
        <div class="level_description">{{ $t("home.bannerText2") }}</div>
        <div class="level_description">{{ $t("home.bannerText3") }}</div>
        <div class="level_description_text">
          {{ $t('home.bannerTips') }}
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'BannerPage'
};
</script>
  
<style lang="scss" scoped>
@import "./components/banner.scss";
</style>
  