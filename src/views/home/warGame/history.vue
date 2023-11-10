<template>
  <div class="war_history_wrapper">
    <div class="history_filter">
      <el-switch
        v-model="myStatus"
        @change="handleChange"
        active-value="TRUE"
        inactive-value="FALSE"
        style="
          --el-switch-on-color: #927a51;
          --el-switch-off-color: rgba(60, 60, 67, 0.8);
        "
      />
      <span>{{ $t("tokenWar.onlyYourRounds") }}</span>
    </div>
    <div class="history_data_box">
      <div class="history_data_bg">
        <el-table
          :data="historyData"
          class="table_container"
          height="76.5rem"
          style="width: 100%"
          @row-click="handleHistory"
        >
          <el-table-column
            prop="id"
            :label="$t('tokenWar.round')"
            align="left"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span style="color: #a9a4b4">
                {{ scope.row.id }}
              </span>
            </template></el-table-column
          >
          <el-table-column
            prop="winerUserName"
            :label="$t('tokenWar.winner')"
            align="left"
            width="260"
          >
            <template #default="scope">
              <div class="buy_box" v-if="scope.row.winerUserName">
                <div class="avatar_box">
                  <img src="@/assets/svg/user/default_avatar.svg" alt="" />
                  <span class="name">{{ scope.row.winerUserName }}</span>
                </div>
              </div>
              <div v-if="!scope.row.winerUserName" class="buy_box">
                <div class="status_box" v-if="page == 1 && scope.$index == 0">
                  <div class="status_img">
                    <img
                      src="@/assets/svg/home/warGame/icon_current_round.svg"
                      alt=""
                    />
                  </div>
                  <div>{{ $t("tokenWar.currentRound") }}</div>
                </div>
                <div class="status_box" v-else>
                  <div class="status_img">
                    <img
                      src="@/assets/svg/home/warGame/icon_canceled.svg"
                      alt=""
                    />
                  </div>
                  <div>{{ $t("tokenWar.canceled") }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="jackpot"
            :label="$t('tokenWar.prizePool')"
            align="left"
          >
            <template #default="scope">
              <div class="buy_box" v-if="scope.row.jackpot">
                <div class="prize_pool">
                  <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                  <span>{{ formatUsd(scope.row.jackpot) }}</span>
                </div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="winerBuyPrice"
            :label="$t('tokenWar.winnerTickets')"
            align="left"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="buy_box" v-if="scope.row.winerBuyPrice">
                <div class="buy_num">
                  <div class="num">
                    <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                    <span v-priceFormat="scope.row.winerBuyPrice"></span>
                  </div>
                  <div class="rate">
                    {{ getWinningRate(scope.row, scope.row.winerBuyPrice) }}%
                  </div>
                </div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="winerMultipleRate"
            :label="$t('tokenWar.winLabel')"
            align="left"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span v-if="scope.row.winerMultipleRate">
                {{
                  `x ${accurateDecimal(scope.row.winerMultipleRate || 0, 2)}`
                }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="yourBuyPrice"
            :label="$t('tokenWar.yourTickets')"
            align="left"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="buy_box" v-if="scope.row.yourBuyPrice">
                <div class="buy_num">
                  <div class="num">
                    <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                    <span>{{ formatUsd(scope.row.yourBuyPrice) }}</span>
                  </div>
                  <div class="rate">
                    {{ getWinningRate(scope.row, scope.row.yourBuyPrice) }}%
                  </div>
                </div>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="player"
            :label="$t('tokenWar.players')"
            align="left"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span v-if="!scope.row.player">0</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lotteryTime"
            :label="$t('tokenWar.time')"
            align="left"
            width="200"
          >
            <template #default="scope">
              <span style="color: #a9a4b4">
                {{ timeFormat(scope.row.lotteryTime) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="Verify"
            :label="$t('tokenWar.verify')"
            align="center"
          >
            <template #default="scope">
              <div class="buy_box center" v-if="scope.row.winerUserId">
                <img
                  style="cursor: pointer"
                  src="@/assets/svg/user/icon_link.svg"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-box" v-if="this.count > size">
      <el-pagination
        v-model="page"
        :page-size="size"
        @current-change="handleCurrentChange"
        :pager-count="7"
        layout="prev, pager, next"
        :total="count"
        prev-text="Pre"
        next-text="Next"
      />
    </div>
  </div>
</template>
<script>
import { timeFormat, openUrl, accurateDecimal, formatUsd } from "@/utils";
import { getWarHistory } from "@/services/api/tokenWar";
import bigNumber from "bignumber.js";
export default {
  name: "TokenWarHistory",
  data() {
    return {
      pageType: "warGame", // warGame / history
      myStatus: "FALSE", // TRUE / FALSE
      historyData: [],
      page: 1,
      size: 20,
      count: 0,
    };
  },
  computed: {},
  methods: {
    formatUsd: formatUsd,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    // 只看登录用户
    handleChange() {
      this.fetchWarHistory();
    },
    // 获取未领取奖金
    async fetchWarHistory(isSearch = true) {
      const { myStatus, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      const res = await getWarHistory({
        page: _page,
        size: size,
        myStatus: myStatus,
      });

      if (res.code == 200) {
        this.historyData = res.data.records;
        this.count = res.data.total;
      }
    },
    // 格式化胜率
    getWinningRate(row, event) {
      const { jackpot } = row;
      const amount = Number(event || 0);
      if (!amount || !Number(jackpot)) return 0;

      const rate = new bigNumber(event).div(Number(jackpot)).multipliedBy(100);

      return accurateDecimal(rate, 2);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchWarHistory(false);
    },
    handleHistory(row, column) {
      const { property } = column;
      if (property == "Verify") {
        this.handleVerify(row);
      } else {
        const data = this.historyData[0];

        if (row.id == data.id && this.page == 1) {
          this.$emit("toWar");
        } else {
          this.$emit("toHistory", row);
        }
      }
    },
    handleVerify(event) {
      let chainLink = process.env.VUE_APP_TRANSACTION_ADDR;
      if (event.lotteryChainType == "OKT_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_TEST_ADDR;
      } else if (event.lotteryChainType == "BSC_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_TEST_ADDR;
      } else if (event.lotteryChainType == "BASE") {
        chainLink = process.env.VUE_APP_CHAIN_BASE_ADDR;
      } else if (event.lotteryChainType == "BSC") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_ADDR;
      } else if (event.lotteryChainType == "OKT") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_ADDR;
      } else if (event.lotteryChainType == "ThunderCore") {
        chainLink = process.env.VUE_APP_CHAIN_THUNDERCORE_ADDR;
      } else if (event.lotteryChainType == "TRC_20_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_TRC20TEST_ADDR;
      } else if (event.lotteryChainType == "TRC_20") {
        chainLink = process.env.VUE_APP_CHAIN_TRC20_ADDR;
      }

      openUrl(`${chainLink}${event.hash}`);
    },
  },
  created() {
    this.fetchWarHistory();
  },
};
</script>
  <style lang="scss" scoped>
@import "./components/history.scss";
</style>
      