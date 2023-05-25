<template>
  <div class="wrapper_bg">
    <div class="snapshot_wrapper">
      <div class="contents-info">
        <div class="home-public-title">
          <div class="title-box-l">
            <div class="title_text">BOX SNAPSHOT</div>
          </div>
        </div>
        <el-table :data="nftData" class="table_container" style="width: 100%">
          <el-table-column prop="snapshot_id" label="Snapshot ID" max-width="250" align="center">
            <template #header>
              <el-input v-model="search" class="search_input" placeholder="Search by ID" />
            </template>
            <template #default="scope">
              <div class="user_info">
                <img :src="scope.row.nftImg" alt="">
                <span>{{ `#${scope.row.nftId}` }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nftName" label="Collections" align="center" />
          <el-table-column prop="usdtPrice" label="Price" align="center">
          </el-table-column>
          <el-table-column prop="boxName" label="USD Price" align="center" />
          <el-table-column prop="boxName" label="Refund Value" align="center" />
          <el-table-column prop="boxName" label="Reward ID" align="center" />
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
export default {
  name: 'boxSnapshot',
  data() {
    return {
      search: null,
      page: 1,
      size: 10,
      count: 20,
      nftData: [1, 2, 3, 4, 5, 6, 7, 8]
    };
  },
  methods: {
    handleActive(event) {
      console.log(event);
    },
    handleSearch() { },
    handleCurrentChange(page) {
      this.page = page;
    },
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