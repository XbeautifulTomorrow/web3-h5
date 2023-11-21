<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="31.875rem"
      :before-close="handleClose"
    >
      <template #header>
        <div class="close_btn" @click="handleClose()">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <div class="user_info_box">
          <img class="avatar_img" src="@/assets/svg/user/default_avatar.svg" alt="" />
          <span>{{ userData?.userName }}</span>
        </div>
        <div class="war_title">{{ $t("tokenWar.battleRecord") }}</div>
        <div class="war_items">
          <div class="war_item">
            <div class="title">{{ $t("tokenWar.participateNum") }}</div>
            <div class="val">{{ userData?.joinNumber || "--" }}</div>
          </div>
          <div class="war_item">
            <div class="title">{{ $t("tokenWar.winNumber") }}</div>
            <div class="val">{{ userData?.winNumber || "--" }}</div>
          </div>
          <div class="war_item">
            <div class="title">{{ $t("tokenWar.maxBonus") }}</div>
            <div class="val">
              {{ userData?.maxBouns ? formatUsd(userData?.maxBouns) : "--" }}
            </div>
          </div>
          <div class="war_item">
            <div class="title">{{ $t("tokenWar.luckyMoment") }}</div>
            <div class="val">
              {{ userData?.winerMultipleRate ? `${accurateDecimal(userData?.winerMultipleRate, 2)} x` : "--" }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { accurateDecimal, formatUsd } from "@/utils";
import { getWarUserInfo } from "@/services/api/tokenWar";
export default {
  name: "WarUserInfo",
  props: {
    id: null,
  },
  data() {
    return {
      show: true,
      userData: {},
    };
  },
  methods: {
    formatUsd: formatUsd,
    accurateDecimal: accurateDecimal,
    // 获取信息
    async fetchWarUserInfo() {
      const res = await getWarUserInfo({
        userId: this.id,
      });
      if (res.code == 200) {
        this.userData = res.data;
      }
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialogFun");
    },
  },
  created() {
    this.fetchWarUserInfo();
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
@import "./components/warUserInfo.scss";
</style>
