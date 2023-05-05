<template>
    <div class="competitions_wrapper">
        <div class="competitions_text">COMPETITIONS</div>
        <el-tabs v-model="activeType" class="type-tabs" @tab-click="handleClick">
            <el-tab-pane label="ENTERED" name="ENTERED"></el-tab-pane>
            <el-tab-pane label="MY COMPETITIONS" name="MY_COMPETITIONS"></el-tab-pane>
            <el-tab-pane label="HISTORY" name="HISTORY"></el-tab-pane>
        </el-tabs>
        <div class="entered_box" v-if="activeType == 'ENTERED'">
            <div class="entered_item" v-for="(item, index) in enteredList" :key="index">
                <div class="image_box">
                    <div class="status_tag" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'num'">
                        <span v-if="item.orderType == 'LIMITED_TIME'">{{ `${item.limitDay} DAY LEFT` }}</span>
                        <span v-else>{{ `${item.limitNum} TICKETS LEFT` }}</span>
                    </div>
                    <div class="image_tag">#{{ item && item.tokenId }}</div>
                    <img :src="item && item.nftImage" alt="">
                </div>
                <div class="nft_name">{{ item && item.seriesName }}</div>
                <div class="nft_price">{{ item && item.price }}ETH</div>
                <div class="buy_btn" @click="enterNow(item)">ENTER NOW</div>
                <div class="remaining_votes">
                    {{ `You used ${item && item.numberOfTicketsSold || 0} of ${item && item.limitNum || 0} tickets` }}
                </div>
            </div>
        </div>
        <div class="my_competitions_box" v-else-if="activeType == 'MY_COMPETITIONS'">
            <div class="entered_item" v-for="(item, index) in enteredList" :key="index">
                <div class="image_box">
                    <div class="status_tag" v-if="item.currentStatus == 'IN_PROGRESS'"
                        :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'num'">
                        <span v-if="item.orderType == 'LIMITED_TIME'">{{ `${item.limitDay} DAY LEFT` }}</span>
                        <span v-else>{{ `${item.limitNum} TICKETS LEFT` }}</span>
                    </div>
                    <div class="status_tag" v-else :class="item.currentStatus == 'CANCELLED' ? 'cancel' : 'sale'">
                        <span v-if="item.currentStatus == 'CANCELLED'">CANCEL</span>
                        <span v-else>SALE</span>
                    </div>
                    <div class="image_tag">#{{ item && item.tokenId }}</div>
                    <img :src="item && item.nftImage" alt="">
                </div>
                <div class="nft_name">{{ item && item.seriesName }}</div>
                <div class="nft_price">{{ item && item.price }}ETH</div>
                <div class="buy_btn" v-if="item.currentStatus == 'IN_PROGRESS'"
                    :class="{ disabled: item.numberOfTicketsSold }" @click="cancelOrder(item)">下架</div>
                <div class="buy_btn delete" v-else @click="delOrder(item)">Delete</div>
                <div class="remaining_votes">
                    {{ `${item && item.limitNum || 0} TICKETS SOLD` }}
                </div>
            </div>
        </div>
        <div class="history_box" v-else>
            <el-table :data="enteredList" style="width: 100%" class="tabel_box">
                <el-table-column prop="date" label="NFT DETAIL">
                    <template #default="scope">
                        <div class="nft_info">
                            <img :src="scope.row.nftImage" alt="">
                            <div class="info_text">
                                <div class="name">{{ `${scope.row.seriesName} #${scope.row.tokenId}` }}</div>
                                <div class="price">{{ `${scope.row.price} ETH` }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="LIMIT">
                    <template #default="scope">
                        <div v-if="scope.row.orderType == 'LIMITED_TIME'">{{ `${scope.row.limitDay} Days` }}</div>
                        <div v-else>{{ `${scope.row.limitNum} Tickets` }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="UNIT PRICE">
                    <template #default="scope">
                        {{ `${scope.row.ticketPrice} ETH` }}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="YOUR TICKETS">
                    <template #default="scope">
                        {{ `${scope.row.numberOfTicketsSold} Tickets` }}
                    </template>
                </el-table-column>
                <el-table-column prop="WINNER" label="WINNER">
                    <template #default="scope">
                        <div class="winner" v-if="scope.row.orderStatus == 'DRAWN'">
                            {{ formatAddr(scope.row.winningAddress) }}
                        </div>
                        <div class="cancel" v-if="scope.row.orderStatus == 'CANCELLED'">CANCELED</div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="END DATE">
                    <template #default="scope">
                        {{ timeFormat(scope.row.endTime) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog v-model="showCabcel" title="取消赛事" width="360px" class="dialog_competition" :close-on-click-modal="false"
            :before-close="handleClose">
            <div class="tips_text">
                <span v-if="isCancel">确定要取消您创建的赛事吗？取消后以下NFT将会回到您的库存，随时可以创建新的赛事</span>
                <span v-else>已经有用户参与您创建的赛事，为了保障参与者的权益，赛事无法取消</span>
            </div>
            <div class="image_box">
                <img :src="competitionNft && competitionNft.nftImage" alt="">
            </div>
            <div class="nft_info">
                <div class="nft_name">{{ competitionNft && competitionNft.seriesName }}</div>
                <div class="nft_id">#{{ competitionNft && competitionNft.tokenId }}</div>
            </div>
            <div class="btn-group">
                <div class="cancel" @click="handleClose()">
                    <span v-if="isCancel">再想想</span>
                    <span v-else>关闭</span>
                </div>
                <div v-if="isCancel" class="confirm">取消赛事</div>
            </div>
        </el-dialog>
    </div>
</template>    
<script>
import {
    getOneBuyList,
    cancelNftOrder
} from "@/services/api/oneBuy";
export default {
    name: 'UserCompetitions',
    data() {
        return {
            activeType: "ENTERED",
            enteredList: [],
            showCabcel: false,
            competitionNft: null,
            isCancel: true
        };
    },
    methods: {
        handleClick(event) {
            console.log(event);
        },
        // 用户相关订单
        async fetchOneBuyList() {
            const res = await getOneBuyList({ type: this.activeType, page: 1, size: 9999 });
            if (res && res.code == 200) {
                this.enteredList = res.data.records;
            }
        },
        // 参加赛事
        enterNow(event) {
            this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
        },
        // 取消赛事
        cancelOrder(event) {
            if (event.numberOfTicketsSold > 0) {
                this.$message.error("该赛事已有用户参与，下架失败");
                return
            }

            this.competitionNft = event;
            this.showCabcel = true;
        },
        // 取消订单确认
        async onCancel() {
            const res = await cancelNftOrder({
                orderNumber: this.competitionNft.orderNumber
            });
            if (res && res.code == 200) {
                this.$message.success("下架成功");
            } else {
                this.isCancel = false;
            }
        },
        // 删除订单
        delOrder(evnet) {
            console.log(evnet)
        },
        // 关闭弹窗
        handleClose(done) {
            if (done) {
                done();
                return
            }
            this.showCabcel = false
        },
        /** 
         * @description 友好的时间显示
         * @param string event 时间
         */
        timeFormat(event) {
            const timestamp = new Date(event).getTime() / 1000;

            function zeroize(num) {
                return (String(num).length == 1 ? '0' : '') + num;
            }

            let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
            let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

            let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
            let tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象

            let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
            let H = tmDate.getHours(), i = tmDate.getMinutes();
            // let s = tmDate.getSeconds();

            if (timestampDiff < 60) { // 一分钟以内
                return "Just";
            } else if (timestampDiff < 3600) { // 一小时前之内
                return Math.floor(timestampDiff / 60) + "minutes ago";
            } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
                return 'Today' + zeroize(H) + ':' + zeroize(i);
            } else {
                let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
                if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
                    return 'Yesterday' + zeroize(H) + ':' + zeroize(i);
                } else if (curDate.getFullYear() == Y) {
                    // return zeroize(m) + 'Month' + zeroize(d) + 'day ' + zeroize(H) + ':' + zeroize(i);
                    return `${this.monthFormat(zeroize(m))} ${parseInt(zeroize(d))} ${zeroize(H)}:${zeroize(i)}`;
                } else {
                    // return Y + 'Year' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
                    return `${this.monthFormat(zeroize(m))} ${parseInt(zeroize(d))} ${zeroize(H)}:${zeroize(i)}，${Y}`;
                }
            }
        },
        /** 
         * @description 月份转化
         * @param string event 时间
         */
        monthFormat(event) {
            const monthData = {
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December"
            }

            return monthData[parseInt(event)]
        },
        /**
         * @description: 格式化地址
         */
        formatAddr(event) {
            if (!event) return "";
            var reg = /^(\S{6})\S+(\S{4})$/;
            return event.replace(reg, "$1...$2");
        },
    },
    watch: {
        activeType() {
            this.fetchOneBuyList();
        }
    },
    created() {
        this.fetchOneBuyList();

        // 获取展示类型
        const { type } = this.$route.query;
        this.activeType = type || "ENTERED";
    }
};
</script>
<style lang="scss" scoped>
@import "./components/competitions.scss";
</style>
