<template>
  <div class="home">
    <virtual-currency />
    <banner />
    <mystery-boxes />
    <ntf-tickets />
    <contents-info />
  </div>
</template>

<script>
import VirtualCurrency from './virtualCurrency.vue';
import Banner from '../banner/index.vue';
import MysteryBoxes from './mysteryBoxes.vue';
import NtfTickets from './ntfTickets.vue';
import ContentsInfo from './contentsInfo.vue';
export default {
  name: 'IndexPage',
  components: {
    VirtualCurrency,
    Banner,
    MysteryBoxes,
    NtfTickets,
    ContentsInfo,
  },
};
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.home-public-title {
  text-align: left;
  margin: 48px auto 24px;
}
.boxes-content {
  display: flex;
}
.boxes-list {
  width: 220px;
  margin-right: 16px;
  opacity: 0.3;
  border-radius: 8px;
  background-image: linear-gradient(228deg, #fff, rgba(255, 255, 255, 0) 62%);
  &:last-child {
    margin-right: 0;
  }
}
.boxes-title {
  width: 200px;
  height: max-content;
  margin: 0 auto;
  font-size: 24px;
  background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.boxes-button {
  $width: 200px;
  $height: 40px;
  $border: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  width: $width;
  height: $height;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 12px;
  &:before {
    content: '';
    position: absolute;
    width: $width - $border * 3;
    height: $height - $border * 2;
    border-radius: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: $border solid;
    border-image: linear-gradient(
        to bottom,
        #5fe3ef 12%,
        #00689d 53%,
        #b063f5 70%
      )
      1;
  }
}
.boxes-button-text {
  background-image: linear-gradient(
    to bottom,
    #5fe3ef 12%,
    #00689d 53%,
    #b063f5 70%
  );
  font-size: 18px;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
