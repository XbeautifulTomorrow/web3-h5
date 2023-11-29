<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    class="public-dialog mystery-dialog"
    width="43.75rem"
    :before-close="closeDialogFun"
    :append-to-body="true"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img class="public-dialog-header-icon" src="@/assets/svg/close.svg" alt="" v-on="{ click: [close, closeDialogFun] }" />
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title">{{ $t("lottery.notice") }}</h2>
      <p class="public-dialog-illustrate">
        {{ text }}
      </p>
      <div class="public-dialog-module" v-if="chooseIds.length && chooseIds.length > failList.length">
        <h3 class="public-dialog-title-other">ASSETS</h3>
        <ul :class="['public-dialog-lists', { 'public-dialog-lists-all': chooseIds.length == soldList.length }]">
          <template v-for="(item, index) in soldList">
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${item.seriesName}  ${item.tokenId && item.nftType != 'PLATFORM' ? '# ' + item.tokenId : ''}`"
              placement="bottom-end"
              v-if="chooseIds.includes(item.id) && !failList.includes(item.id)"
              :key="`portrait-${index}`"
            >
              <li :class="['public-dialog-list', item.qualityType]">
                <image-view class="public-dialog-portrait" :src="item.nftImg" />
                <span class="public-dialog-list-result waiting" v-if="item.nftType == 'EXTERNAL'">
                  {{ $t("lottery.waiting") }}
                </span>
              </li>
            </el-tooltip>
          </template>
        </ul>
      </div>
      <div class="public-dialog-module" v-if="chooseIds.length !== soldList.length || failList.length">
        <h3 class="public-dialog-title-other">{{ $t("lottery.balance") }}</h3>
        <ul class="public-dialog-lists">
          <template v-for="(item, index) in soldList">
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${item.seriesName} ${item.tokenId && item.nftType != 'PLATFORM' ? '# ' + item.tokenId : ''}`"
              placement="bottom-end"
              v-if="failList.includes(item.id)"
              :key="`portrait-${index}`"
            >
              <li class="public-dialog-list">
                <div :class="['portrait-img', item.qualityType]">
                  <image-view class="public-dialog-portrait" :src="item.nftImg" />
                  <span class="public-dialog-list-result refund">
                    {{ $t("lottery.refund") }}
                  </span>
                </div>
                <p class="public-dialog-list-text">
                  <img class="public-dialog-list-img" src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                  <span class="public-dialog-list-number">
                    {{ item.initPrice }}
                  </span>
                </p>
              </li>
            </el-tooltip>
          </template>
          <template v-for="(item, index) in soldList">
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${item.seriesName}  ${item.tokenId && item.nftType != 'PLATFORM' ? '# ' + item.tokenId : ''}`"
              placement="bottom-end"
              v-if="!chooseIds.includes(item.id) && !failList.includes(item.id)"
              :key="`portrait-${index}`"
            >
              <li class="public-dialog-list">
                <div :class="['portrait-img', item.qualityType]">
                  <image-view class="public-dialog-portrait" :src="item.nftImg" />
                  <span class="public-dialog-list-result sold">
                    {{ $t("lottery.sold") }}
                  </span>
                </div>
                <p class="public-dialog-list-text">
                  <img class="public-dialog-list-img" src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                  <span class="public-dialog-list-number">
                    {{ item.price }}
                  </span>
                </p>
              </li>
            </el-tooltip>
          </template>
        </ul>
        <div class="public-dialog-funds">
          <span class="public-dialog-total-title">{{ $t("lottery.total") }}:</span>
          <img class="public-dialog-list-img" src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
          <span class="public-dialog-total-number" v-priceFormat="total"></span>
          <template v-if="soldList[0].point > 0">
            <img class="public-dialog-list-img" src="@/assets/svg/user/icon_point.svg" alt="" />
            <span class="public-dialog-total-number">
              {{ soldList[0].point }}
            </span>
          </template>
        </div>
      </div>
      <el-button class="public-button" @click="unboxAgainFunc">
        {{ $t("lottery.unBox_again") }}
        <p class="public-dialog-price-box">
          <img class="public-dialog-icon" src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
          <span v-priceFormat="blindPrice"></span>
        </p>
      </el-button>
      <el-button class="public-button public-continue" @click="closeDialogFun">
        {{ $t("lottery.return") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps, onBeforeMount, watchEffect, onUpdated } from "vue";
import { BigNumber } from "bignumber.js";
import ImageView from "@/components/imageView";

import { i18n } from "@/locales";
const { t } = i18n.global;

const props = defineProps({
  chooseIds: {
    type: Object,
    default: () => {
      return [];
    },
  },
  soldList: {
    type: Object,
    default: () => {
      return [];
    },
  },
  failList: {
    type: Object,
    default: () => {
      return [];
    },
  },
  blindPrice: {
    type: Number,
    requird: true,
  },
});
// Prizes have entered your backpack, please go to the backpack to check,
//         due to congestion on the chain, part of the prizes can not be accounted
//         for, we will be converted to the final value of the NFT directly into
//         the ETH transferred to your balance
const emit = defineEmits(["inventoryFun", "closeDialogFun", "unboxAgain"]);
const visible = ref(true);
const total = ref(0);
const text = ref("");
onBeforeMount(() => {
  const { failList } = props;
  if (failList.length) {
    text.value = t("lottery.tips2");
  } else {
    text.value = t("lottery.tips3");
  }
  totalFun();
});
onUpdated(() => {
  if (props.failList.length) {
    totalFun();
  }
});
const totalFun = () => {
  total.value = 0;
  const { soldList, chooseIds, failList } = props;
  soldList.forEach((item) => {
    if (!chooseIds.includes(item.id) || (chooseIds.includes(item.id) && failList.includes(item.id))) {
      if (failList.includes(item.id)) {
        total.value = BigNumber(total.value).plus(Number(item.initPrice));
      } else {
        total.value = BigNumber(total.value).plus(Number(item.price));
      }
    }
  });
};
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const unboxAgainFunc = () => {
  emit("unboxAgain");
};

// const inventoryFun = () => {
//   if (props.failList.length) {
//     closeDialogFun();
//   } else {
//     emit("inventoryFun");
//   }
// };
watchEffect();
</script>
<style lang="scss" scoped>
.public-dialog-list {
  height: 7.375rem;
}
.public-dialog-list-text {
  margin-top: 0.3125rem;
}
.public-dialog-list-img {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.625rem;
}
.public-dialog-list-number {
  font-size: 1.25rem;
  color: #e4e7f5;
}
.portrait-img {
  position: relative;
}
.public-dialog-portrait {
  border-radius: 0.3125rem;
  object-fit: cover;
  border-radius: 0.5rem;
}
.LEGEND {
  padding: 2px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  background-image: url("@/assets/img/lottery/LEGEND_more_choose.png");
}
.EPIC {
  padding: 2px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  background-image: url("@/assets/img/lottery/EPIC_more_choose.png");
}
.RARE {
  padding: 2px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  background-image: url("@/assets/img/lottery/RARE_more_choose.png");
}
.NORMAL {
  padding: 2px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  background-image: url("@/assets/img/lottery/NORMAL_more_choose.png");
}
.public-dialog-illustrate {
  margin-bottom: 0;
  color: #a9a4b4;
  line-height: 1.75rem;
}
.public-dialog-title-other {
  margin-bottom: 0.625rem;
  margin-top: 0;
}
.public-dialog-module {
  background: #13151f;
  padding: 0.625rem;
  border-radius: 0.625rem;
  margin: 1rem 0;
}
.public-dialog-funds {
  display: flex;
  align-items: center;
  margin-top: 1.875rem;
  .public-dialog-total-title {
    margin-right: 0.625rem;
    color: #a9a4b4;
  }
  .public-dialog-list-img {
    width: 1.5rem;
    height: 1.5rem;
  }
}
.public-dialog-lists {
  gap: 0.46rem;
}
.public-dialog-total-number {
  color: #e4e7f5;
  font-size: 1.5rem;
  margin-left: 0;
  margin-right: 1.5rem;
}
.public-button {
  margin-top: 1.875rem;
}
.public-continue {
  margin-top: 0.625rem;
}
.public-dialog-lists-all {
  margin-bottom: 0;
}
@media (max-width: 950px) {
  .public-dialog-illustrate {
    font-size: 0.75rem;
  }
  .public-dialog-title-other {
    font-size: 0.75rem;
  }
  .public-dialog-list {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.25rem;
    .public-dialog-portrait {
      border-radius: 0.25rem;
    }
    .public-dialog-list-result {
      border-radius: 0 0 0.25rem 0.25rem;
    }
  }
  .portrait-img {
    width: 3.5rem;
    height: 3.5rem;
  }

  .public-dialog-lists {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 0.5rem;
  }
  .public-dialog-module {
    padding: 0.25rem;
  }
  .public-dialog-illustrate {
    line-height: inherit;
  }
  .public-dialog-total-title {
    font-size: 0.75rem;
  }
  .public-dialog-list-img {
    width: 1rem !important;
    height: 1rem !important;
    margin-right: 0.3rem;
  }
  .public-dialog-total-number {
    font-size: 0.875rem !important;
    margin-right: 0.625rem;
  }
}
</style>
