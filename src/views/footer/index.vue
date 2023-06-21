<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <img src="@/assets/img/headerFooter/footer_logo.png" alt="logo" />
        <span>Copyright © 2023 Bitzing.io. All rights reserved.</span>
      </div>
      <div class="footer-nav-box">
        <img src="@/assets/svg/home/footer_interval.svg" alt="">
        <div class="footer-nav-items">
          <li class="footer-nav-text active">
            MENU
          </li>
          <ul class="footer-nav">
            <li class="footer-nav-text" v-for="(item, index) in nav" :key="`footer-nav-${index}`"
              @click="goTo(item.page)">
              {{ item.text }}
            </li>
          </ul>
        </div>
        <img src="@/assets/svg/home/footer_interval.svg" alt="">
      </div>
      <div class="link_box">
        <p class="footer-social">Social Media</p>
        <ul class="footer-link">
          <li class="footer-link-icon">
            <img src="@/assets/svg/twitter.svg" @click="goLink(1)" alt="" />
          </li>
          <li class="footer-link-icon">
            <img src="@/assets/svg/telegram.svg" @click="goLink(2)" alt="" />
          </li>
          <li class="footer-link-icon">
            <img src="@/assets/svg/discord_btn.svg" @click="goLink(3)" alt="" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { openUrl } from "@/utils";
export default {
  name: 'FooterCom',
  components: {},
  data() {
    return {
      nav: [
        {
          text: 'Home',
          page: 'home',
        },
        {
          text: 'Airdrop',
          page: 'Airdrop',
        },
        {
          text: 'Whitebook',
          page: 'Whitebook',
        },
        {
          text: 'FAQ',
          page: 'FAQ',
        },
      ],
    };
  },
  methods: {
    goTo(page = 'home') {
      if (page === "Whitebook") {
        openUrl("https://bitzing.gitbook.io/bitzing-whitepaper/the-nft-market-landscape/what-are-nfts");
        return
      }

      this.$router.push({ path: `/${page}` });
    },
    goLink(event) {
      if (event === 1) {
        openUrl("https://twitter.com/Bitzing_io");
        return
      } else if (event === 2) {
        openUrl("t.me/bitzing_io");
        return
      } else if (event === 3) {
        openUrl("https://discord.gg/eN9e22Q2cN");
        return
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
