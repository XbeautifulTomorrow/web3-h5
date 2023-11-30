<template>
  <div class="coupons_wrapper">
    <img
      class="icon_coupons"
      src="@/assets/svg/user/icon_coupon_code.svg"
      alt=""
    />
    <div class="coupons_title">{{ $t("user.couponTitle") }}</div>
    <el-form
      ref="ruleFormCoupons"
      label-position="top"
      label-width="max-content"
      :model="couponsForm"
      :rules="rules"
      :hide-required-asterisk="true"
      class="public-form"
    >
      <el-form-item prop="code">
        <el-input
          class="coupons_input"
          @change="handleChange"
          @blur="handleChange"
          v-model="couponsForm.code"
          :placeholder="$t('user.enterCode')"
        />
      </el-form-item>
      <div class="twitter_promotion">
        <div class="twitter_text">{{ $t("user.linkIllustrate") }}</div>
        <div class="twitter_link" @click="openUrl(linkData.url)">
          {{ linkData.channelName }}
        </div>
      </div>
      <el-button
        class="coupons_button"
        @click="handleExchange('ruleFormCoupons')"
      >
        {{ $t("user.claimText") }}
      </el-button>
    </el-form>
  </div>
</template>
    
<script>
import { getRedeemTextSetting, exchangeCoupons } from "@/services/api/user";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { openUrl } from "@/utils";

export default {
  name: "userCoupons",
  data() {
    return {
      showModify: true,
      isRepeat: false,
      couponsForm: {
        code: null,
      },
      rules: {},
      linkData: {},
      codeStatus: null,
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    openUrl: openUrl,
    handleChange() {
      this.codeStatus = null;
    },
    // 使用兑换码
    async handleExchange(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await exchangeCoupons({
            cardamom: this.couponsForm.code, //用户名
          });
          if (res.code == 200) {
            this.couponsForm.code == null;
            this.$message.success(this.$t("common.operationTips"));
            this.$emit("couponsTips", res.data);
          } else {
            const { data } = res;
            this.codeStatus = data.messageKey;
            this.$refs[formName].validate(async () => {});
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 使用兑换码
    async fetchRedeemTextSetting() {
      let res = await getRedeemTextSetting();
      if (res.code == 200) {
        this.linkData = res.data;
      }
    },
  },
  created() {
    const validateStatus = async (rule, value, callback) => {
      const { codeStatus } = this;
      if (codeStatus == "redeem_code_not_found") {
        callback(new Error(this.$t("errorTips.redeem_code_not_found")));
      } else if (codeStatus == "redeem_code_used") {
        callback(new Error(this.$t("errorTips.redeem_code_used")));
      } else if (codeStatus == "redeem_code_type_repeat") {
        callback(new Error(this.$t("errorTips.redeem_code_type_repeat")));
      } else {
        callback();
      }
    };

    this.rules = {
      code: [
        {
          required: true,
          message: this.$t("user.enterCode"),
          trigger: ["blur", "change"],
        },
        { validator: validateStatus, trigger: ["blur", "change"] },
      ],
    };

    this.fetchRedeemTextSetting();
  },
};
</script>
    
<style lang="scss" scoped>
.coupons_wrapper {
  padding: 1.875rem;

  .icon_coupons {
    width: 7.5rem;
    height: auto;
  }

  .coupons_title {
    font-family: Inter;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.58;
    text-align: center;
    color: #fff;
    margin: 1rem 0;
  }
}

:deep(.coupons_input) {
  .el-input__wrapper {
    height: 3.75rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px #363945 inset;
    background-color: #13151f;

    input {
      font-family: Inter;
      font-size: 0.875rem;
      text-align: left;
      color: white;
    }
  }
}

.twitter_promotion {
  display: flex;
  align-items: center;
  padding-bottom: 1.875rem;

  font-family: Inter;
  font-size: 0.875rem;
  font-weight: bold;
  line-height: 1.57;
  text-align: left;
  color: #fff;

  .twitter_link {
    padding-left: 0.25rem;
    color: #fad54d;
    cursor: pointer;
  }
}

.coupons_button {
  width: 100%;
  height: 3.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-image: linear-gradient(to top, #e3a406, #fbd851);
  box-shadow: none;
  outline: none;
  border: none;

  opacity: 0.9;
  font-family: Inter;
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1.6;
  text-align: center;
  color: #13151f !important;
}

@media screen and (max-width: 950px) {
  .coupons_wrapper {
    padding: 1.5rem 0;

    .icon_coupons {
      width: 5rem;
      height: auto;
    }

    .coupons_title {
      font-size: 1.5rem;
      margin: 0.5rem 0;
    }
  }

  :deep(.coupons_input) {
    .el-input__wrapper {
      height: 2.5rem;
      border-radius: 0.25rem;

      input {
        font-size: 0.75rem;
      }
    }
  }

  .twitter_promotion {
    padding-bottom: 1rem;
    font-size: 0.75rem;

    .twitter_link {
      padding-left: 0.25rem;
      color: #fad54d;
      cursor: pointer;
    }
  }

  .coupons_button {
    height: 2.5rem;
    border-radius: 0.25rem;

    font-size: 1rem;
  }
}
</style>