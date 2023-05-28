<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_list_wrapper">
      <div class="banner_box"></div>
      <div class="search_box">
        <el-input v-model="searchVal" class="search_input" type="text" placeholder="Search NFT">
          <template #prefix>
            <el-icon class="el-input__icon search_icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <div class="sort_box">
          <el-select v-model="sort" class="select_box" placeholder="" size="large">
            <el-option label="Sort by Popularity" value="1" />
            <el-option label="Sort by Price Low" value="2" />
            <el-option label="Sort by Price High" value="3" />
          </el-select>
          <div class="sort_title">Sort by:</div>
        </div>
        <div class="sort_box collections">
          <el-select v-model="nftId" class="select_box" placeholder="ALL" size="large">
            <el-option label="ALL" value="1" />
            <el-option label="BAYC" value="2" />
            <el-option label="AZUKI" value="3" />
          </el-select>
          <div class="sort_title">Collections:</div>
        </div>

      </div>
      <ul class="boxes-content">
        <li class="ntf-tickets-item" v-for="(item, index) in ticketList" :key="`tickets-${index}`">
          <div class="image_box">
            <div class="tips_round" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
              <img v-if="item.orderType == 'LIMITED_TIME'" src="@/assets/svg/home/icon_info_time_white.svg" alt="">
              <img v-else src="@/assets/svg/home/icon_info_price_white.svg" alt="">
              <span v-if="item.orderType == 'LIMITED_TIME'">{{ `${dayLeft(item.endTime)}` }}</span>
              <span v-else>
                {{ `${new bigNumber(item.limitNum).minus(item.numberOfTicketsSold)} TICKETS LEFT` }}
              </span>
            </div>
            <div class="image_tag">#{{ item && item.tokenId }}</div>
            <img :src="item && item.nftImage" alt="">
          </div>
          <div class="nft_name">
            <span>{{ item && item.seriesName }}</span>
            <img src="@/assets/svg/home/icon_certified.svg" alt="">
          </div>
          <div class="nft_price">{{ item && item.price }}ETH</div>
          <div class="buy_btn" @click="enterNow(item)">
            <span>ENTER NOW</span>
          </div>
          <div class="remaining_votes">
            {{ `${item && item.numberOfTicketsSold || 0} Tickets sold` }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getCheckAllOrders } from "@/services/api/oneBuy";
import bigNumber from "bignumber.js";
export default {
  name: 'ntfTicketsList',
  data() {
    return {
      searchVal: null,
      sort: null,
      nftId: null,
      ticketList: [
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
        {
          "orderNumber": "PD230426170340", //订单号，有订单号说明参与订单不能提款
          "orderType": "LIMITED_PRICE", //类型  
          "price": 50, //价格
          "limitDay": 5, //最大天数
          "limitNum": 800, //最大票数
          "listingTime": "2023-04-26T17:03:40", //开始时间
          "endTime": "2023-04-27T17:03:40", //结束时间
          "seriesName": "3Landers", //系列名
          "nftImage": "https://3land.mypinata.cloud/ipfs/QmeXZ2ruhkQ3WRG8em3LWBYbZfGTvtUY8HDzBGdCfRqbFR/8079.png", //nft图片
          "tokenId": "8079", //nftId
          "contractAddress": "0x6447f7d21f19af6c11824b06e3a6618542cedf33", //NFT所属的合约
          "ticketPrice": 0.5, //单票价格
          "numberOfTicketsSold": 209, //已售数量
          "sortAndScore": 0,
          "currentStatus": "IN_PROGRESS", //订单状态
          "winningAddress": null //中奖地址
        },
      ],
      page: 1,
      size: 9999,
      total: 0,
      finished: false,
    };
  },
  computed: {},
  methods: {
    bigNumber: bigNumber,
    // 最新购买
    async fetchCheckAllOrders(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      let res = await getCheckAllOrders({
        page: _page,
        size: size
      });

      if (res && res.code == 200) {

        if (isSearch) {
          this.ticketList = res.data.records;
          return
        }

        if (res.data.records.length == 0) {
          this.finished = true;
        }

        this.ticketList.push.apply(this.ticketList, res.data.records);
      }
    },
    // 加载更多
    nextPage() {
      this.page++;
      if (this.activeType == "activity") {
        this.fetchBuyRecord(false)
      }
    },
    handleTickets(event) {
      this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
    },
  },
  watch: {},
  created() {
    // this.fetchCheckAllOrders();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTicketsList.scss";
</style>
<style lang="scss">
.el-select__popper {
  border: none !important;
  background-color: #1d0f36 !important;

  .el-scrollbar__view {
    margin: 0.625rem 0 !important;
    padding: 0 0.625rem !important;
  }

  .el-select-dropdown__item {
    color: #a9a4b4;
    font-size: 1rem;
    line-height: 1.6;
    padding: 0.625rem 1.25rem;
    height: auto;

    &.selected {
      color: #fad54d;
    }

    &:hover,
    &.hover {
      color: #a9a4b4;
      border-radius: 0.5rem;
      background-color: #13151f;
    }
  }

  .el-popper__arrow {
    display: none;
  }
}
</style>