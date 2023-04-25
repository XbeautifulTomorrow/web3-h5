<template>
  <div class="login">
    <popup-page :model-value="test" :title="title" @closePopup="closePopup">
      <p class="explain-text" v-if="tab === 0">
        Register your account and email address to earn more points
      </p>
      <el-form
        :label-width="0"
        :model="formData"
        style="max-width: 100%"
        ref="registerForm"
        :rules="rules"
        class="register-form"
        v-if="tab === 0"
      >
        <el-form-item class="login-margin-top" label="" prop="username">
          <input-com v-model="formData.username" placeholder="Username" />
        </el-form-item>
        <el-form-item class="login-margin-top" label="" prop="email">
          <input-com v-model="formData.email" placeholder="Email" />
        </el-form-item>
        <el-form-item class="login-margin-top" label="">
          <div class="check-box-item">
            <div class="check-box" @click.stop="isAgree = true">
              <img
                v-if="isAgree"
                class="check-box-img"
                @click.stop="isAgree = false"
                src="@/assets/img/login/checkboxactive.png"
                alt=""
              />
            </div>
            <p>
              By creating your account, you confirm that you are at least 18
              years old and agree to our Terms and Conditions
            </p>
          </div>
        </el-form-item>
        <el-form-item
          :class="['login-margin-top', { 'button-item': !isAgree }]"
        >
          <div class="form-button" @click="registrationFun">
            Complete registration
          </div>
        </el-form-item>
        <el-form-item
          :class="['login-margin-top', { 'button-item': !isAgree }]"
        >
          <div class="form-button-skip">
            <span class="form-button-skip-text" @click="closePopup">
              Skip
            </span>
          </div>
        </el-form-item>
      </el-form>
      <code-com v-if="tab === 1" />
    </popup-page>
  </div>
</template>
<script>
import PopupPage from '@/components/popup/index.vue';
import InputCom from '@/components/input/index.vue';
import CodeCom from './code.vue';
export default {
  name: 'LoginPage',
  components: {
    PopupPage,
    InputCom,
    CodeCom,
  },
  data() {
    return {
      test: true,
      isAgree: true,
      tab: 1,
      title: 'Welcome',
      formData: {
        username: '',
        email: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: 'Username is a required field',
            trigger: 'blur',
          },
          //   {
          //     min: 3,
          //     max: 5,
          //     message: 'Please choose a different username',
          //     trigger: ['blur', 'change'],
          //   },
        ],
        email: [
          {
            required: true,
            message: 'Email is a required field',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: 'Email must be a valid email',
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  methods: {
    closePopup() {
      this.test = false;
    },
    registrationFun() {
      const { isAgree } = this;
      if (!isAgree) return;
      this.$refs.registerForm.validate(async (valid) => {
        if (valid && isAgree) {
          // const res = await ;
          this.tab = 1;
          this.title = 'Verification code';
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.register-form {
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
}
.check-box {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: pointer;
}
.check-box-img {
  width: 100%;
  height: 100%;
}
.check-box {
  background-color: #232554;
}
.check-box-item {
  display: flex;
  align-items: start;
  align-content: center;
  line-height: 20px;
  text-align: left;
}
.form-button {
  width: 362px;
  height: 48px;
  border-radius: 24px;
  font-size: 24px;
  color: #fff;
  border: solid 2px #fffaff;
  background-image: linear-gradient(
    to bottom,
    #5fe3ef,
    #00689d 54%,
    #b063f5 75%
  );
  cursor: pointer;
}
.form-button-skip {
  width: 362px;
  height: 52px;
  line-height: 52px;
  padding: 1px;
  border-radius: 24px;
  background-color: #1b082b;
  box-sizing: border-box;
  border-style: solid;
  border-width: 1px;
  border-image-source: linear-gradient(
    to bottom,
    #5fe3ef,
    #00689d 54%,
    #b063f5 75%
  );
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #1b082b, #1b082b),
    linear-gradient(to bottom, #5fe3ef, #00689d 54%, #b063f5 75%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
}
.form-button-skip-text {
  font-size: 24px;
  background-image: linear-gradient(
    to bottom,
    #5fe3ef,
    #00689d 54%,
    #b063f5 75%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.button-item {
  opacity: 0.3;
}
</style>
<style lang="scss">
.explain-text {
  font-size: 18px;
  color: #a896b5;
  text-align: center;
}
.login-margin-top {
  margin-top: 16px;
}
.register-form {
  .el-form-item__error {
    font-size: 16px;
    color: #c00002;
  }
  .is-success {
    .check-icon {
      opacity: 1;
    }
  }
}
.el-form-item.is-error .el-input__wrapper {
  box-shadow: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
