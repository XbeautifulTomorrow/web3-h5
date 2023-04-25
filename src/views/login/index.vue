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
        @click="connectParent"
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
import PopupPage from '@/components/popup/index.vue';
import Link from './link.vue';
export default {
  name: 'LoginPage',
  components: {
    PopupPage,
    Link,
  },
  props: ['connect', 'close'],
  data() {
    return {
      test: true,
    };
  },
  methods: {
    connectParent() {
      this.$emit('connectWallet');
    },
    closePopup() {
      this.test = false;
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped></style>
<style lang="scss" scoped>
.popup {
  z-index: 999;
}
.explain-text {
  font-size: 18px;
  color: #a896b5;
}
.login-margin-top {
  margin-top: 16px;
}
</style>
