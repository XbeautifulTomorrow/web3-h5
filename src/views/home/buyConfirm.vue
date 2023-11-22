<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="50rem"
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
        <p class="public-dialog-title">{{ $t("ticketsInfo.buyTipsTitle") }}</p>
        <div class="confirm-description">
          <span
            v-html="
              $t('ticketsInfo.buyTipsText1', {
                tickets: ticketsNum(),
                num: buyNum(),
              })
            "
          ></span>
        </div>
        <div class="deposit_tx_id">
          <span>{{ $t("ticketsInfo.buyTipsShare") }}</span>
          <img
            src="@/assets/svg/airdrop/icon_twitter_btn.svg"
            @click="shareInviteLink()"
            alt=""
          />
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
import priceImg from "@/assets/svg/home/icon_info_price.svg";
import usdtImg from "@/assets/svg/user/icon_usdt_gold.svg";

export default {
  name: "modifyName",
  props: {
    nftInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    orderId: {
      type: String,
      default: "",
    },
    tickets: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    inviteCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: true,
      screenWidth: null,
      setting: {},
    };
  },
  methods: {
    ticketsNum() {
      let strV = ``;
      if (this.screenWidth > 950) {
        strV += `<img style='width: 1.5rem;height: auto;margin-right: 0.25rem;vertical-align: text-bottom;' src='${priceImg}'>`;
        strV += `<span style='font-size: 1.25rem;color: #fad54d;' >${this.tickets}</span></div>`;
      } else {
        strV += `<img style='width: 1rem;height: auto;margin-right: 0.25rem;vertical-align: top;' src='${priceImg}'>`;
        strV += `<span style='font-size: 1rem;color: #fad54d;' >${this.tickets}</span>`;
      }
      return strV;
    },
    buyNum() {
      let strV = ``;
      if (this.screenWidth > 950) {
        strV += `<img style='width: 1.5rem;height: auto;margin-right: 0.25rem;vertical-align: text-bottom;' src='${usdtImg}'>`;
        strV += `<span style='font-size: 1.25rem;color: #fad54d;' >${this.price}</span></div>`;
      } else {
        strV += `<img style='width: 1rem;height: auto;margin-right: 0.25rem;vertical-align: top;' src='${usdtImg}'>`;
        strV += `<span style='font-size: 1rem;color: #fad54d;' >${this.price}</span>`;
      }
      return strV;
    },
    onConfirm() {
      this.$emit("closeDialogFun");
    },
    // 分享邀请链接到推特
    shareInviteLink() {
      let seriesName = null;

      if (this.nftInfo?.orderType == "LIMITED_PRICE_COIN") {
        seriesName = `${this.nftInfo?.totalPrice} ETH`;
      } else {
        if (!this.formatSeries(this.nftInfo)) {
          seriesName = `${this.nftInfo?.name}`;
        } else {
          seriesName = `${this.nftInfo?.name} #${this.nftInfo?.tokenId}`;
        }
      }

      const series = `⚡️ Bitzers! Grab a chance to WIN an ${seriesName} on BITZING!\n\n`;
      const description = `Less than ${
        this.nftInfo?.maximumPurchaseQuantity || 0
      } TICKETS remaining.\n\n`;

      const inviteLink = `Enter NOW:`;
      const currentLink = "https://www.bitzing.io";
      let link = currentLink + "/FreeNFT";

      if (this.inviteCode) {
        link += "/" + this.inviteCode;
      }
      link += "?id=" + this.orderId;

      let inviteText = series;
      inviteText += description;

      inviteText += inviteLink;

      // 构建推特的分享链接
      var twitterUrl =
        "https://twitter.com/share?text=" +
        encodeURIComponent(inviteText) +
        "&url=" +
        link;
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
        return;
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
    });
  },
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

    span + span {
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

  & > .public-button + .public-button {
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
