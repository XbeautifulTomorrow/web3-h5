<template>
  <div class="footer">
    <div class="footer-logo">
      <img src="@/assets/img/headerFooter/footer_logo.png" alt="logo" />
    </div>
    <ul class="footer-nav">
      <li
        class="footer-nav-text"
        v-for="(item, index) in nav"
        :key="`footer-nav-${index}`"
        @click="goTo(item.page)"
      >
        {{ item.text }}
      </li>
    </ul>
    <p class="footer-social">Social Media</p>
    <ul class="footer-link">
      <li class="footer-link-icon">
        <img src="@/assets/svg/twitter.svg" alt="" />
      </li>
      <li class="footer-link-icon">
        <img src="@/assets/svg/youtube.svg" alt="" />
      </li>
      <li class="footer-link-icon">
        <img src="@/assets/svg/facebook.svg" alt="" />
      </li>
      <li class="footer-link-icon">
        <img src="@/assets/svg/invalid.svg" alt="" />
      </li>
    </ul>
    <img
      class="footer-divider"
      src="@/assets/img/headerFooter/divider.png"
      alt=""
    />
    <p class="footer-bitzing">© 2023 Bitzing — Where Surprises Meet Value!</p>
  </div>
</template>

<script>
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
          text: 'About Us',
          page: 'AboutUs',
        },
        {
          text: 'Collection',
          page: 'Collection',
        },
        {
          text: 'Artist',
          page: 'Artist',
        },
      ],
    };
  },
  methods: {
    goTo(page = 'home') {
      this.$router.push({ path: `/${page}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
  background: url('@/assets/img/headerFooter/imagelight.png') no-repeat,
    url('@/assets/img/headerFooter/footerbg.png') center bottom no-repeat;
  padding-bottom: 65px;
}
.footer-nav,
.footer-link {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
  margin-top: 22px;
}
.footer-nav-text {
  font-size: 18px;
  height: 20px;
  line-height: 20px;
  color: #f5e1d6;
  margin-right: 32px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
}
.footer-social {
  margin: 126px auto 25px;
  font-size: 24px;
  color: #f5e1d6;
}
.footer-link-icon {
  width: 46px;
  height: 46px;
  margin-right: 34px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.footer-divider {
  display: inline-block;
  margin: 41px 0 24px;
}
.footer-bitzing {
  font-size: 18px;
  color: #f5e1d6;
  height: 20px;
  line-height: 20px;
}
</style>
