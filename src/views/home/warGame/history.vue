<template>
  <div class="war_history_wrapper">
    <div class="history_filter">
      <el-switch
        v-model="isUser"
        style="
          --el-switch-on-color: #927a51;
          --el-switch-off-color: rgba(60, 60, 67, 0.3);
        "
      />
      <span>Only Your Rounds</span>
    </div>
    <div class="history_data_box">
      <el-table
        :data="historyData"
        class="table_container"
        height="76.5rem"
        style="width: 100%"
        @row-click="handleHistory"
      >
        <el-table-column
          prop="id"
          label="Round"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="winerUserName"
          label="Winner"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column prop="jackpot" label="Prize Pool" align="center">
          <template #default="scope">
            <div class="buy_box">
              <div class="prize_pool">
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span v-priceFormat="scope.row.traAmount"></span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="winerBuyPrice"
          label="Winner Tickets"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="buy_box">
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
          </template>
        </el-table-column>
        <el-table-column
          prop="winerMultipleRate"
          label="Win"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ `x ${accurateDecimal(scope.row.winerMultipleRate, 2)}` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="yourBuyPrice"
          label="Your Tickets"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="buy_box">
              <div class="buy_num">
                <div class="num">
                  <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                  <span v-priceFormat="scope.row.yourBuyPrice"></span>
                </div>
                <div class="rate">
                  {{ getWinningRate(scope.row, scope.row.yourBuyPrice) }}%
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="player"
          label="Players"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="lotteryTime"
          label="Time"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ timeFormat(scope.row.lotteryTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Verify"
          label="Verify"
          align="center"
          show-overflow-tooltip
        >
          <template #default>
            <div class="buy_box">
              <img
                style="cursor: pointer"
                src="@/assets/svg/user/icon_link.svg"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import { timeFormat, openUrl, accurateDecimal } from "@/utils";
import { getWarHistory } from "@/services/api/tokenWar";
import bigNumber from "bignumber.js";
export default {
  name: "TokenWarHistory",
  data() {
    return {
      pageType: "warGame", // warGame / history
      isUser: false,
      historyData: [],
      page: 1,
      size: 20,
      count: 0,
    };
  },
  computed: {},
  methods: {
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    // 获取未领取奖金
    async fetchWarHistory(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }

      const res = await getWarHistory({ page: _page, size: size });
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
        this.$emit("toHistory", row);
      }
    },
    handleVerify(event) {
      // openUrl(event);
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
      