<template>
  <!-- 查询补足余额 -->
  <el-dialog v-model="showDialog" class="my_points" destroy-on-close :align-center="true" width="78.125rem" lock-scroll
    :close-on-click-modal="false">
    <div class="close_btn" @click="handleClose()">
      <el-icon>
        <Close />
      </el-icon>
    </div>
    <div class="point_details">
      <div class="point_details_title">{{ $t("user.pointDetails") }}</div>
      <el-table height="28.25rem" :data="pointData" class="table_container" style="width: 100%">
        <el-table-column prop="source" :label="$t('user.pointTable1')" align="center" />
        <el-table-column prop="integral" :label="$t('user.pointTable2')" align="center">
          <template #default="scope">
            <div class="point_info">
              <span v-if="scope.row.integral > 0">{{
                `+${scope.row.integral || 0}`
              }}</span>
              <span v-else class="minus">{{
                `${scope.row.integral || 0}`
              }}</span>
              <img src="@/assets/svg/user/icon_profile.svg" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" :label="$t('user.balanceTabel5')" align="center">
          <template #default="scope">
            {{ timeFormat(scope.row.date) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

import { getAListOfUserPoints } from "@/services/api/user";
import { timeFormat } from "@/utils";
export default {
  name: "myPoints",
  data() {
    return {
      showDialog: true,
      pointData: [],
      page: 1,
      size: 10,
      count: 0,
    };
  },
  computed: {
    ...mapStores(useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    }
  },
  methods: {
    timeFormat: timeFormat,
    // 获取用户积分
    async fetchUserPoints() {
      const res = await getAListOfUserPoints({
        page: this.page,
        size: this.size,
      });
      if (res.code == 200) {
        this.pointData = res.data.records;
        this.count = res.data.total;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchUserPoints();
    },
    // 关闭创建弹窗
    handleClose() {
      this.$emit("closeDialogFun");
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchUserPoints();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/history.scss";
</style>
