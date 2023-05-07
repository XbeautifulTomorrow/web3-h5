<template>
    <div class="ntf_tickets_list_wrapper">
        <div class="banner_box"></div>
        <div class="search_box">
            <el-input v-model="searchVal" class="search_input" type="text" :placeholder="搜索NFT">
            </el-input>
            <el-select v-model="value" class="m-2" placeholder="Sort by Popularity" size="large">
                <el-option label="Sort by Popularity" value="1" />
                <el-option label="Sort by Price Low" value="2" />
                <el-option label="Sort by Price High" value="3" />
            </el-select>
            <el-select v-model="value" class="m-2" placeholder="Collections ALL" size="large">
                <el-option label="Collections ALL" value="1" />
                <el-option label="BAYC" value="2" />
                <el-option label="AZUKI" value="3" />
            </el-select>
        </div>
        <ul class="boxes-content">
            <li class="boxes-list ntf-tickets-list" v-for="(item, index) in ticketList" :key="`tickets-${index}`">
                <img class="tickets-boxs-list-img" :src="item.nftImage" alt="" />
                <p class="boxes-title text-ellipsis">
                    <span class="ntf-tickets-content-title text-ellipsis">
                        {{ item.seriesName || "-" }}
                    </span>
                    <img class="ntf-tickets-img" :src="item.nftImage" alt="" />
                </p>
                <p class="tickets-boxs-text text-ellipsis">
                    {{ `${item.price} ETH` }}
                </p>
                <div class="boxes-button">
                    <div class="boxes-button-enter" @click="handleTickets(item)">
                        <span class="boxes-button-text">ENTER NOW</span>
                    </div>
                </div>
                <p class="ntf-tickets-text text-ellipsis">
                    {{ item.text }}
                </p>
            </li>
        </ul>
    </div>
</template>
<script>
import { getCheckAllOrders } from "@/services/api/oneBuy";
export default {
    name: 'ntfTicketsList',
    data() {
        return {
            searchVal: null,
            sort: null,
            nftType: null,
            ticketList: [],
            page: 1,
            size: 9999,
            total: 0,
            finished: false,
        };
    },
    computed: {},
    methods: {
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
        this.fetchCheckAllOrders();
    }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTicketsList.scss";
</style>