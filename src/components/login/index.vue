<template>
  <div class="login">
    <popup-page
      :model-value="test"
      title="Connect wallet"
      @closePopup="closePopup"
    >
      <p class="explain-text">Choose a wallet connection method</p>
      <Link
        class="login-margin-top"
        :src="require('@/assets/img/login/icon-metamask.png')"
        text="MetaMask"
        link="home"
      />
      <Link
        class="login-margin-top"
        :src="require('@/assets/img/login/icon-walletconnect.png')"
        text="WalletConnect"
        link="https://translate.google.com"
      />
    </popup-page>
  </div>
</template>
<script>
import PopupPage from '../popup/index.vue';
import Link from './link.vue';
export default {
  name: 'LoginPage',
  components: {
    PopupPage,
    Link,
  },
  data() {
    return {
      test: true,
    };
  },
  methods: {
    closePopup() {
      this.test = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.explain-text {
  font-size: 18px;
  color: #a896b5;
}
.login-margin-top {
  margin-top: 16px;
}
</style>
