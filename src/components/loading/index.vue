<template>
  <Teleport to="body" v-if="loading">
    <div class="loading">
      <div class="loading-content">
        <img class="loading-img" src="@/assets/img/loading/l.png" alt="" />
        <img class="loading-img" src="@/assets/img/loading/o.png" alt="" />
        <img class="loading-img" src="@/assets/img/loading/a.png" alt="" />
        <img class="loading-img" src="@/assets/img/loading/d.png" alt="" />
        <img class="loading-img" src="@/assets/img/loading/i.png" alt="" />
        <img class="loading-img" src="@/assets/img/loading/n.png" alt="" />
        <img class="loading-img" src="@/assets/img/loading/g.png" alt="" />
        <img
          class="loading-img round-img one-round"
          src="@/assets/img/loading/round.png"
          alt=""
        />
        <img
          class="loading-img round-img two-round"
          src="@/assets/img/loading/round.png"
          alt=""
        />
        <img
          class="loading-img round-img three-round"
          src="@/assets/img/loading/round.png"
          alt=""
        />
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { defineProps, watchEffect } from "vue";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
watchEffect(() => {
  if (props.loading) {
    document.body.classList.add("modal-open-hidde");
  } else {
    document.body.classList.remove("modal-open-hidde");
  }
});
</script>
<style>
.modal-open-hidde {
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
$time: 0.2s;
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(19, 7, 27, 0.7);
  z-index: 999999;
}
.loading-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loading-img {
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
}
.round-img {
  opacity: 0;
  animation: ball-fall 1s ease-in-out infinite;
}
.one-round {
  animation-delay: -200ms;
}
.two-round {
  animation-delay: -100ms;
}
.three-round {
  animation-delay: 0ms;
}
@keyframes ball-fall {
  0% {
    opacity: 0;
    transform: translateY(-145%);
  }

  10% {
    opacity: 0.5;
  }

  20% {
    opacity: 1;
    transform: translateY(0);
  }

  80% {
    opacity: 1;
    transform: translateY(0);
  }

  90% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
    transform: translateY(145%);
  }
}
</style>
