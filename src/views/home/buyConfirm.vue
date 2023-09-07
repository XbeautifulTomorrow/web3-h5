<template>
  <div>
    <el-dialog v-model="show" destroy-on-close :close-on-click-modal="false" :show-close="false" :align-center="true"
      class="public-dialog" width="50rem" :before-close="handleClose">
      <template #header>
        <div class="close_btn" @click="handleClose()">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <p class="public-dialog-title">{{ $t("ticketsInfo.buyTipsTitle") }}</p>
        <div class="confirm-description">
          <span v-html="$t('ticketsInfo.buyTipsText1', { tickets: ticketsNum(), num: buyNum() })"></span>
          <span v-html="$t('ticketsInfo.buyTipsText2')"></span>
        </div>
        <div class="deposit_tx_id">
          <span>SHARE THIS COMPETITION</span>
          <img src="@/assets/svg/airdrop/icon_twitter_btn.svg" @click="shareInviteLink()" alt="">
        </div>
        <div class="form-buttons">
          <el-button class="public-button" @click="handleClose()">
            <span>{{ $t("airdrop.confirm") }}</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
import { openUrl, handleWindowResize } from "@/utils";

export default {
  name: 'modifyName',
  props: {
    nftInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orderId: {
      type: String,
      default: ""
    },
    tickets: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    inviteCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: true,
      screenWidth: null,
      setting: {}
    };
  },
  methods: {
    ticketsNum() {
      let strV = `<div style="display: inline-flex;align-items: center;margin: 0.25rem">`;
      if (this.screenWidth > 950) {
        strV += `<img style='width: 1.5rem;height: auto;margin-right: 0.25rem' src='${require('@/assets/svg/home/icon_info_price.svg')}'>`;
        strV += `<span style='font-size: 1.25rem;color: #fad54d;' >${this.tickets}</span></div>`;
      } else {
        strV += `<img style='width: 1rem;height: auto;margin-right: 0.25rem' src='${require('@/assets/svg/home/icon_info_price.svg')}'>`;
        strV += `<span style='font-size: 1rem;color: #fad54d;' >${this.tickets}</span></div>`;
      }
      return strV;
    },
    buyNum() {
      let strV = `<div style="display: inline-flex;align-items: center;margin: 0.25rem">`;
      if (this.screenWidth > 950) {
        strV += `<img style='width: 1.5rem;height: auto;margin-right: 0.25rem' src='${require('@/assets/svg/user/icon_ethereum.svg')}'>`;
        strV += `<span style='font-size: 1.25rem;color: #fad54d;' >${this.price}</span></div>`;
      } else {
        strV += `<img style='width: 1rem;height: auto;margin-right: 0.25rem' src='${require('@/assets/svg/user/icon_ethereum.svg')}'>`;
        strV += `<span style='font-size: 1rem;color: #fad54d;' >${this.price}</span></div>`;
      }
      return strV;
    },
    onConfirm() {
      this.$emit("closeDialogFun");
    },
    // 分享邀请链接到推特
    shareInviteLink() {
      const series = `I've entered BITZING's ${this.nftInfo.name} competition, come compete with me\n\n`;
      let description = null;
      if (this.nftInfo.orderType == 'LIMITED_TIME') {
        description = `${this.nftInfo.name} #${this.nftInfo.tokenId} SWEEPSTAKES draws in `
        const { dd, hh } = this.durationFormatter(this.duration);
        if (dd <= 1 && hh <= 1) {
          // 一小时以内
          description += `in an hour!⏳\n`;
        } else if (dd <= 1 && hh > 1) {
          // 一小时以上，一天以内
          description += `${Math.floor(hh)} hours!⏳\n`;
        } else if (dd == 1 && hh > 1) {
          // 两天以内
          description += `${Math.floor(dd)} day ${Math.floor(hh)} hours!⏳\n`;
        } else if (dd > 1 && hh <= 1) {
          // 两天以上整数没有小时
          description += `${Math.floor(dd)} days⏳\n`;
        } else {
          // 两天以上
          description += `${Math.floor(dd)} days ${Math.floor(hh)} hours!⏳\n`;
        }

      } else {
        description = `${this.nftInfo.name} #${this.nftInfo.tokenId} will sell out with ${this.nftInfo.maximumPurchaseQuantity || 0} TICKETS left.\n`;
      }
      const inviteLink = `\nEnter HERE:`;
      const currentLink = window.location;
      let link = currentLink.origin + "/NftTicketsInfo";

      if (this.inviteCode) {
        link += "/" + this.inviteCode;
      }
      link += "?id=" + this.orderId;



      let inviteText = series;
      inviteText += description;

      inviteText += inviteLink;

      // 构建推特的分享链接
      var twitterUrl = "https://twitter.com/share?text=" + encodeURIComponent(inviteText) + "&url=" + link;
      // 在新窗口中打开推特分享链接
      openUrl(twitterUrl);
    },
    /**
 * @description: 格式化地址
 */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{6})\S+(\S{4})$/;
      return event.replace(reg, "$1...$2");
    },
    // 关闭弹窗
    handleClose(done) {
      this.$emit("closeDialogFun");

      if (done) {
        done();
        return
      }
    },
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    })
  }
};
</script>
    
<style lang="scss" scoped>
.public-dialog-title {
  padding-top: 1.875rem;
}

.confirm-description {
  margin: 0 auto;
  font-family: Inter;
  font-size: 1.125rem;
  line-height: 1.875rem;
  text-align: center;
  color: #a9a4b4;

  &>span {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
}

.wait-title {
  font-family: BlenderPro;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.4;
  text-align: center;
  color: white;
}

.wait-text {
  font-family: Inter;
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: center;
  color: #a9a4b4;
  padding: 0.5rem 0 1.25rem;

  &.deposit_nft {
    display: flex;
    align-items: center;
    justify-content: center;

    span+span {
      padding-left: 0.25rem;
    }

    span:last-child {
      font-family: Inter;
      font-size: 0.75rem;
      line-height: 1.6;
      text-align: center;
      color: #11cde9;
    }
  }
}

.deposit_tx_id {
  padding: 3.75rem 0 1.875rem;

  span {
    display: block;
  }

  span:nth-child(1) {
    font-family: Inter;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.4;
    text-align: center;
    color: white;
    padding-bottom: 0.5rem;
  }

  img {
    width: 2rem;
    height: auto;
    cursor: pointer;
  }
}

.form-buttons {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 1.875rem;

  &>.public-button+.public-button {
    margin: 1.5rem 0 0;
  }
}


@media screen and (max-width: 950px) {
  .public-dialog-title {
    padding-top: 1rem;
  }

  .confirm-description {
    font-size: 1rem;
    line-height: 1rem;
  }

  .wait-title {
    font-size: 0.875rem;
  }

  .wait-text {
    font-size: 0.75rem;
    padding: 0.5rem 0 1rem;
  }

  .deposit_tx_id {
    padding: 1.5rem 0 1rem;

    span {
      display: block;
    }

    span:nth-child(1) {
      font-family: Inter;
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.4;
      text-align: center;
      color: white;
      padding-bottom: 0.5rem;
    }

    img {
      width: 1.5rem;
      height: auto;
      cursor: pointer;
    }
  }

  .form-buttons {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-bottom: 0;
  }
}
</style>