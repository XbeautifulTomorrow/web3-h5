<template>
  <div class="wrapper_bg">
    <div class="snapshot_wrapper">
      <div class="contents-info">
        <div class="home-public-title">
          <div class="title-box-l">
            <div class="title_text">BOX SNAPSHOT</div>
          </div>
        </div>
        <el-table :data="snapshotData" class="table_container" style="width: 100%">
          <el-table-column prop="snapshot_id" label="Snapshot ID" max-width="250" align="left">
            <template #header>
              <el-input v-model="snapshotId" @keyup.enter="handleSearch()" class="search_input"
                placeholder="Search by ID" />
            </template>
            <template #default="scope">
              <div class="user_info">
                <img :src="scope.row.nftImg" alt="">
                <span class="text-ellipsis">{{ `#${scope.row.nftName}` }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="tokenId" label="TOKEN ID" align="left">
            <template #default="scope">
              <span class="text-ellipsis">{{ `#${scope.row.tokenId}` }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="Price" align="left">
            <template #default="scope">
              {{ `${scope.row.price} ETH` }}
            </template>
          </el-table-column>
          <el-table-column prop="usdtPrice" label="USD Price" align="left">
            <template #default="scope">
              {{ `$${scope.row.usdtPrice}` }}
            </template>
          </el-table-column>
          <el-table-column prop="refundValue" label="Refund Value" align="left">
            <template #default="scope">
              {{ `$${scope.row.refundValue}` }}
            </template>
          </el-table-column>
          <el-table-column prop="idx" label="Reward ID" align="left" />
        </el-table>
        <div class="pagination-box">
          <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
            layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import {
  getSnapshotDetail
} from "@/services/api/blindBox";
export default {
  name: 'boxSnapshot',
  data() {
    return {
      snapshotId: null,
      page: 1,
      size: 10,
      count: 0,
      snapshotData: []
    };
  },
  methods: {
    handleActive(event) {
      console.log(event);
    },
    handleSearch() {
      this.page = 1;
      this.fetchSnapshotDetail();
    },
    async fetchSnapshotDetail() {
      const res = await getSnapshotDetail({
        snapshotId: this.snapshotId,
        page: this.page,
        size: this.size
      });

      if (res && res.code == 200) {
        this.snapshotData = res.data.records;
        this.count = res.data.total;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchSnapshotDetail();
    },
  },
  created() {
    // 获取快照 ID
    const { id } = this.$route.query;
    this.snapshotId = id;
    this.fetchSnapshotDetail();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
<style lang="scss">
.el-picker__popper {
  .el-date-picker {
    width: auto;
  }

  .el-popper__arrow {
    display: none;
  }
}
</style>