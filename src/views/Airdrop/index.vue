<template>
  <div class="wrapper_bg">
    <div class="airdrop_container">
      <div class="banner_container">
        <div class="banner_l">
          <div class="operation">CONNECT WALLET FOR</div>
          <div class="title">GET AIRDROP</div>
          <div class="description">
            Connect your usual wallets to earn points rewards, the transaction
            history of your wallet will determine the rewards you can earn.
          </div>
        </div>
        <div class="banner_r">
          <img src="@/assets/svg/airdrop/banner.svg" alt="" />
        </div>
      </div>
      <div class="taps_box">
        <div :class="[
          'taps_item',
          currentActive == 'point' && 'border_bg',
          currentActive == 'point' && 'active',
        ]" @click="handleChange('point')">
          <img src="@/assets/svg/airdrop/icon_point_active.svg" alt="" />
          <span>MY POINT</span>
        </div>
        <div :class="[
          'taps_item',
          currentActive == 'leaderboard' && 'border_bg',
          currentActive == 'leaderboard' && 'active',
        ]" @click="handleChange('leaderboard')">
          <img src="@/assets/svg/airdrop/icon_leaderboard.svg" alt="" />
          <span>LEADERBOARD</span>
        </div>
        <div :class="[
          'taps_item',
          currentActive == 'referral' && 'border_bg',
          currentActive == 'referral' && 'active',
        ]" @click="handleChange('referral')">
          <img src="@/assets/svg/airdrop/icon_referral.svg" alt="" />
          <span>MY REFERRAL LINK</span>
        </div>
      </div>
      <div class="connect_wallet" v-if="!isConnect">
        <div class="connect_wallet_l">
          <img src="@/assets/svg/user/default_avatar.svg" alt="" />
          <div class="user_box">
            <div class="username_text">Nobody</div>
            <div class="tips_text">
              <img src="@/assets/svg/airdrop/icon_wallet.svg" alt="" />
              <span>Wallet is not connected.</span>
            </div>
          </div>
        </div>
        <div class="connect_wallet_r">
          <div class="connect_btn" @click="handleConnect()">Connect Wallet</div>
          <div class="connect_tips">
            The wallet will not be replaced when it is connected.
          </div>
        </div>
      </div>
      <div v-else class="content_container">
        <Point v-if="currentActive == 'point'"></Point>
        <Leaderboard v-if="currentActive == 'leaderboard'"></Leaderboard>
        <Referral v-if="currentActive == 'referral'"></Referral>
      </div>
    </div>
  </div>
</template>

<script>
import Point from "./point.vue";
import Leaderboard from "./leaderboard.vue";
import Referral from "./referral.vue";
export default {
  name: "AirdropX",
  components: {
    Point,
    Leaderboard,
    Referral
  },
  data() {
    return {
      currentActive: "point",
      isConnect: false
    };
  },
  methods: {
    handleChange(event) {
      this.currentActive = event;
    },
    handleConnect() {
      this.isConnect = true;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
