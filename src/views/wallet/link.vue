<template>
  <div class="link">
    <div class="link-logo">
      <img v-if="src" class="link-img" :src="src" alt="" />
      <p class="link-text" v-if="text">
        {{ text }}
      </p>
    </div>
    <img v-if="!showIcon" class="link-img-go" src="@/assets/img/login/icon-chickdefault.png" alt="" @click="goToLink" />
  </div>
</template>

<script>
export default {
  name: "LinkCom",
  props: {
    text: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goToLink() {
      const { link } = this;
      if (link.indexOf("http") > -1) {
        window.open(link);
      } else {
        this.$router.push(`/${link}`);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.link {
  height: 4.375rem;
  border-radius: 0.5rem;
  border: solid 1px #363945;
  background-color: #13151f;
  margin-top: 1.25rem;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.link-logo {
  display: flex;
  align-content: center;
  align-items: center;

  .link-img {
    width: 1.875rem;
    height: 1.875rem;
    margin-right: 0.625rem;
  }
}

.link-img-go {
  width: 1.5rem;
  height: 1.5rem;
}

.link-text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #a9a4b4;
}
</style>
