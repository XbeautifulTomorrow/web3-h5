<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <img src="@/assets/img/headerFooter/footer_logo.png" alt="logo" />
        <span>Copyright © 2023 Bitzing.io. All rights reserved.</span>
      </div>
      <div class="footer-nav-box">
        <img src="@/assets/svg/home/footer_interval.svg" alt="">
        <ul class="footer-nav">
          <li class="footer-nav-text active">
            Menu
          </li>
          <li class="footer-nav-text " v-for="(item, index) in nav" :key="`footer-nav-${index}`" @click="goTo(item.page)">
            {{ item.text }}
          </li>
        </ul>
        <img src="@/assets/svg/home/footer_interval.svg" alt="">
      </div>
      <div class="link_box">
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
            <img src="@/assets/svg/telegram.svg" alt="" />
          </li>
        </ul>
      </div>
    </div>
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
      this.$router.push({ path: `/${page}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  height: 44.8125rem;
  text-align: center;
  background: url('@/assets/img/home/footer_bg.png') no-repeat;
  background-repeat: no-repeat;
  background-size: 100% 44.8125rem;
  background-position: center center;
}

.footer-container {
  width: 95rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.footer-logo {
  display: flex;
  flex-direction: column;

  img {
    width: 9.625rem;
    height: auto;
    margin-bottom: 1.25rem;
  }

  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  color: rgba(255, 255, 255, 0.7);
}


.footer-nav-box {
  display: flex;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  padding: 0 12.5rem;

  &>li+li {
    margin-top: 0.625rem;
  }

  &>li {
    font-size: 1.125rem;
    line-height: 1.6;
    text-align: left;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;

    &.active {
      font-family: Tomorrow;
      font-size: 1.375rem;
      font-weight: bold;
      color: white;
      margin-bottom: 0.625rem;
      cursor: auto;
    }
  }
}

.footer-social {
  font-family: Tomorrow;
  font-size: 1.375rem;
  font-weight: bold;
  line-height: 1.5;
  text-align: left;
  color: white;
  padding-bottom: 1.875rem;
}

.footer-link {
  display: flex;

  &>li+li {
    margin-left: 0.75rem;
  }
}

.footer-link-icon {
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
  }
}
</style>
