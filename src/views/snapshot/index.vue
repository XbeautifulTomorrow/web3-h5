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
                placeholder="Search by Reward ID">
                <template #prefix>
                  <el-icon class="el-input__icon" @click="handleSearch()">
                    <search />
                  </el-icon>
                </template>
              </el-input>
            </template>
            <template #default="scope">
              <div class="user_info">
                <Image fit="cover" class="nft_img" :src="scope.row.nftImg" />
                <span class="text-ellipsis">{{ `#${scope.row.nftName}` }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="tokenId" label="TOKEN ID" align="left">
            <template #default="scope">
              <span class="text-ellipsis" v-if="scope.row.nftType == 'EXTERNAL'">{{ `#${scope.row.tokenId}` }}</span>
              <span class="text-ellipsis" v-else>--</span>
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
          <el-table-column prop="refundValue" label="Resale Price" align="left">
            <template #default="scope">
              {{ `${scope.row.refundValue} ETH` }}
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
import { getSnapshotDetail } from "@/services/api/blindBox";
import Image from "@/components/imageView";
export default {
  name: 'boxSnapshot',
  components: {
    Image
  },
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