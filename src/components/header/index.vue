<template>
  <div class="header">
    <div class="header-main public-width">
      <div class="header-left">
        <img
          class="header-logo"
          src="@/assets/img/headerFooter/logo.png"
          alt="logo"
          @click="goTo()"
        />
        <ul class="header-nav">
          <li
            class="header-nav-text"
            v-for="(item, index) in nav"
            :key="`nav-${index}`"
            @click="goTo(item.page)"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="header-button">Connect Wallet</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderCom',
  components: {},
  data() {
    return {
      nav: [
        {
          text: 'Airdrop',
          page: 'home',
        },
        {
          text: 'Mystery Box',
          page: 'MysteryBox',
        },
        {
          text: 'Stake',
          page: 'Stake',
        },
        {
          text: 'INO',
          page: 'INO',
        },
        {
          text: 'Market Place',
          page: 'MarketPlace',
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
$header-height: 64px;
.header {
  // position: fixed;
  // top: 0;
  // left: 0;
  width: 100%;
  // z-index: 10;
}
.header-main {
  height: $header-height;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  justify-items: center;
}
.header-logo {
  max-height: $header-height - 10px;
  cursor: pointer;
}
.header-nav-text {
  height: 20px;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.11;
  letter-spacing: normal;
  color: #fff;
}
.header-left,
.header-nav {
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
}
.header-nav {
  margin-left: 90px;
}
.header-nav-text {
  margin-right: 24px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
}
.header-button {
  width: 140px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  border: solid 2px #fff;
  background-image: linear-gradient(0, #b164f6 15%, #026aa1 58%, #42e2f0 79%);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
</style>
