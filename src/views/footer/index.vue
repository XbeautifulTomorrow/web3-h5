<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <img src="@/assets/img/headerFooter/footer_logo.png" alt="logo" />
        <span>{{ $t("footer.copyright", { year: year }) }}</span>
      </div>
      <div class="footer-nav-box">
        <img src="@/assets/svg/home/footer_interval.svg" alt="">
        <div class="footer-nav-items">
          <li class="footer-nav-text active">
            {{ $t("footer.menu") }}
          </li>
          <ul class="footer-nav">
            <li class="footer-nav-text" v-for="(item, index) in nav" :key="`footer-nav-${index}`"
              @click="goTo(item.page)">
              {{ item.text }}
            </li>
          </ul>
        </div>
        <img src="@/assets/svg/home/footer_interval.svg" alt="">
      </div>
      <div class="link_box">
        <p class="footer-social">{{ $t("footer.link") }}</p>
        <ul class="footer-link">
          <li class="footer-link-icon">
            <img src="@/assets/svg/twitter.svg" @click="goLink(1)" alt="" />
          </li>
          <li class="footer-link-icon">
            <img src="@/assets/svg/telegram.svg" @click="goLink(2)" alt="" />
          </li>
          <li class="footer-link-icon">
            <img src="@/assets/svg/discord_btn.svg" @click="goLink(3)" alt="" />
          </li>
        </ul>
        <el-select class="language_select" v-model="language" @change="languageChange" size="large" effect="dark">
          <el-option v-for="(item, index) in langDrop" :key="index" :label="item.name" :value="item.key" />
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "footerCom"
}
</script>
<script setup>
import { openUrl } from "@/utils";
import { getLang, setLang } from '@/locales';
import { useI18n } from "vue-i18n";
import router from "@/router"
import { ref, reactive, computed, inject } from 'vue';
const { t, locale } = useI18n();

const reload = inject("reload");
const language = ref(getLang());

const nav = computed(() => {
  return [{
    text: t("header.home"),
    page: "home",
  },
  {
    text: t("header.airdrop"),
    page: "Airdrop",
  },
  {
    text: t("header.whitebook"),
    page: "Whitebook",
  },
  {
    text: t("header.faq"),
    page: "FAQ",
  },]
});

const year = ref(new Date().getUTCFullYear());
const langDrop = reactive([
  { name: "English", key: "en_US" },
  { name: "繁體中文", key: "zh_CN" },
]);

const languageChange = (event) => {
  setLang(event);
  locale.value = event;
  language.value = event;

  //重新加载页面
  reload();

}

const goTo = (page = 'home') => {
  if (page === "Whitebook") {
    openUrl("https://bitzing.gitbook.io/litepaper/");
    return
  }

  router.push({ path: `/${page}` });
};
const goLink = (event) => {
  if (event === 1) {
    openUrl("https://twitter.com/Bitzing_io");
    return
  } else if (event === 2) {
    openUrl("https://t.me/bitzing_io");
    return
  } else if (event === 3) {
    openUrl("https://discord.gg/eN9e22Q2cN");
    return
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
.el-select__popper {
  &.is-dark {
    background-color: #1d0f36;
    border: none;
  }

  .el-select-dropdown__list {
    margin: 0.5rem 0 !important;
  }

  .el-select-dropdown__item {
    height: 3.3125rem;
    line-height: 3.3125rem;
    font-size: 1.125rem;
    font-weight: 500;

    &.selected,
    &.hover {
      color: white;
      background-color: #281d31;
    }
  }

  .el-popper__arrow {
    display: none;
  }
}


@media screen and (max-width: 950px) {
  .el-select__popper {
    .el-select-dropdown__item {
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 0.75rem;
    }
  }
}
</style>