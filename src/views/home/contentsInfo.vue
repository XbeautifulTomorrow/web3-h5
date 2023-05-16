<template>
  <div class="contents-info">
    <div class="home-public-title">
      <div class="title-box-l">
        <div class="title_text">CONTENTS INFORMATION</div>
        <div class="title_description">
          Amet ornare massa praesent lacus. In mi tristique enim tellus amet semper a. Donec ac congue nunc porta semper
          auctor enim.
        </div>
      </div>
      <el-select class="title-box-r" v-model="value" @change="othersideBoxFun" placeholder="Select" size="large"
        effect="dark">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <el-table :data="tableData" class="table_container" style="width: 100%">
      <el-table-column prop="userId" label="User ID">
        <template #default="scope">
          <div class="user_info">
            <img src="" alt="">
            <span>{{ `#${scope.row.userId}` }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="collections" label="Collections" />
      <el-table-column prop="price" label="Price">
        <template #default="scope">
          {{ `${scope.row.price} ${scope.row.unit}` }}
        </template>
      </el-table-column>
      <el-table-column prop="usd_price" label="USD Price">
        <template #default="scope">
          {{ `$${scope.row.usd_price}` }}
        </template>
      </el-table-column>
      <el-table-column prop="last_sale" label="Last Sale">
        <template #default="scope">
          {{ `${scope.row.last_sale} ${scope.row.unit}` }}
        </template>
      </el-table-column>
      <el-table-column prop="recommended" label="Recommended" />
      <el-table-column prop="date" label="Action" align="right">
        <template #default="scope">
          <div class="active_btn">
            <img @click="active(scope.row)" src="@/assets/svg/home/icon_active.svg" alt="">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination :page-size="20" :pager-count="7" layout="prev, pager, next" :total="1000" prev-text="Pre"
        next-text="Next" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentsInfo',
  data() {
    return {
      tickets: [],
      value: null,
      options: [
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
        {
          value: 'Option3',
          label: 'Option3',
        },
        {
          value: 'Option4',
          label: 'Option4',
        },
        {
          value: 'Option5',
          label: 'Option5',
        },
      ],
      tableData: [
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", },
        { userId: "12231", collections: "RENGA Black Box", price: "44.231", unit: "ETH", 'usd_price': "62,541.12", 'last_sale': '22.3', recommended: "TopBlue-chip Box", }
      ]
    };
  },
  methods: {
    othersideBoxFun(item) {
      console.log(item);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./components/contentsInfo.scss";
</style>
<style lang="scss">
.el-select__popper {
  &.is-dark {
    background-color: #1d0f36;
    border: none;
  }

  .el-select-dropdown__list {
    margin: 0.5rem 0 !important;
  }

  .el-select-dropdown__item {
    height: 3.3125rem;
    line-height: 3.3125rem;
    font-size: 1.125rem;
    font-weight: 500;

    &.hover {
      background-color: #281d31;
    }
  }

  .el-popper__arrow {
    display: none;
  }
}
</style>