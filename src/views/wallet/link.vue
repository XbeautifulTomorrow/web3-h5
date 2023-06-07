<template>
  <div class="link">
    <div class="link-logo">
      <img v-if="src" class="link-img" :src="src" alt="" />
      <p class="link-text" v-if="text">
        {{ text }}
      </p>
    </div>
    <img
      v-if="link"
      class="link-img-go"
      src="@/assets/img/login/icon-chickdefault.png"
      alt=""
      @click="goToLink"
    />
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
  height: 69px;
  border-radius: 8px;
  border: solid 1px #363945;
  background-color: #13151f;
  margin-top: 20px;
  padding: 0 20px;
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
}
.link-img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
</style>
