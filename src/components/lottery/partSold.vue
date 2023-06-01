<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    class="public-dialog"
    width="700"
    :before-close="closeDialogFun"
    :append-to-body="true"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon
          v-on="{ click: [close, closeDialogFun] }"
          color="#2d313f"
          size="16"
          class="public-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title">Notice</h2>
      <p class="public-dialog-illustrate">
        The prize is in your backpack. Please go to your backpack and check it
        out
      </p>
      <p class="public-dialog-illustrate">
        {{ text }}
      </p>
      <template v-if="chooseIds.length">
        <h3 class="public-dialog-title-other">NFTs</h3>
        <ul class="public-dialog-lists">
          <template v-for="(item, index) in soldList">
            <li
              v-if="chooseIds.includes(item.id) && !failList.includes(item.id)"
              :class="['public-dialog-list', item.qualityType]"
              :key="`portrait-${index}`"
            >
              <img
                :class="['public-dialog-portrait']"
                :src="item.nftImg"
                alt=""
              />
            </li>
          </template>
        </ul>
      </template>
      <template v-if="chooseIds.length !== soldList.length || failList.length">
        <h3 class="public-dialog-title-other">ETH</h3>
        <ul class="public-dialog-lists">
          <template v-for="(item, index) in soldList">
            <li
              v-if="failList.includes(item.id)"
              class="public-dialog-list"
              :key="`portrait-${index}`"
            >
              <div :class="['portrait-img', item.qualityType]">
                <img
                  :class="['public-dialog-portrait']"
                  :src="item.nftImg"
                  alt=""
                />
                <span class="public-dialog-list-result refund"> Refund </span>
              </div>
              <p class="public-dialog-list-text">
                <img
                  class="public-dialog-list-img"
                  src="@/assets/img/eth.png"
                  alt=""
                />
                <span class="public-dialog-list-number">
                  {{ item.price }}
                </span>
              </p>
            </li>
          </template>
          <template v-for="(item, index) in soldList">
            <li
              v-if="!chooseIds.includes(item.id) && !failList.includes(item.id)"
              class="public-dialog-list"
              :key="`portrait-${index}`"
            >
              <div :class="['portrait-img', item.qualityType]">
                <img
                  :class="['public-dialog-portrait']"
                  :src="item.nftImg"
                  alt=""
                />
                <span class="public-dialog-list-result sold"> Sold </span>
              </div>
              <p class="public-dialog-list-text">
                <img
                  class="public-dialog-list-img"
                  src="@/assets/img/eth.png"
                  alt=""
                />
                <span class="public-dialog-list-number">
                  {{ item.price }}
                </span>
              </p>
            </li>
          </template>
        </ul>
        <p class="public-dialog-total">
          <span class="public-dialog-total-title">Total:</span>
          <span class="public-dialog-total-number"> {{ total }} ETH </span>
        </p>
      </template>
      <el-button class="public-button" @click="closeDialogFun">
        Check my inventory
      </el-button>
      <el-button class="public-button public-continue" @click="closeDialogFun">
        Continue
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import {
  ref,
  defineEmits,
  defineProps,
  onBeforeMount,
  watchEffect,
  onUpdated,
} from "vue";
import { BigNumber } from "bignumber.js";

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
});
// Prizes have entered your backpack, please go to the backpack to check,
//         due to congestion on the chain, part of the prizes can not be accounted
//         for, we will be converted to the final value of the NFT directly into
//         the ETH transferred to your balance
const emit = defineEmits(["inventoryFun", "closeDialogFun"]);

const visible = ref(true);
const total = ref(0);
const text = ref("");
onBeforeMount(() => {
  const { failList } = props;
  if (failList.length) {
    text.value =
      "Prizes have entered your backpack, please go to the backpack to check,due to congestion on the chain, part of the prizes can not be accounted for, we will be converted to the final value of the NFT directly into the ETH transferred to your balance";
  } else {
    text.value =
      "The prize has been transferred to your warehouse, please go to the inventory to check it.";
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
    if (!chooseIds.includes(item.id) || !failList.includes(item.id)) {
      total.value = BigNumber(total.value).plus(Number(item.price));
    }
  });
};
const closeDialogFun = () => {
  emit("closeDialogFun");
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
.public-dialog-total {
  margin-top: 30px;
}
.public-dialog-list-text {
  margin-top: 5px;
}
.public-dialog-list-img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.public-dialog-list-number {
  font-size: 20px;
  color: #e4e7f5;
}
.public-dialog-list-result {
  bottom: 0;
}
.portrait-img {
  position: relative;
}
.public-dialog-portrait {
  height: auto;
  border-radius: 5px;
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
</style>
