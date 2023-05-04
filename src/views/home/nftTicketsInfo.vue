<template>
    <div class="ntf_tickets_info_wrapper">
        <div class="nft_details">
            <div class="nft_details_l">
                <img :src="nftInfo && nftInfo.img" alt="">
                <div class="end_time">{{ dayLeft(nftInfo && nftInfo.endTime) }}</div>
            </div>
            <div class="nft_details_r">
                <div class="nft_name">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}` }}</div>
                <div class="nft_activity">
                    <div class="price">
                        <span class="title">value：</span>
                        <span class="val">{{ nftInfo && nftInfo.totalPrice }}</span>
                        <span class="unit">ETH</span>
                    </div>
                    <div class="time" v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'">
                        <el-icon>
                            <AlarmClock />
                        </el-icon>
                        <div class="time-text">{{ `CLOSE: ${dateFormat(nftInfo && nftInfo.endTime)}` }}</div>
                    </div>
                    <div class="time" v-else>
                        <el-icon>
                            <Paperclip />
                        </el-icon>
                        <div class="time-text">{{ `${nftInfo && nftInfo.maximumPurchaseQuantity || 0} TICKETS LEFT` }}</div>
                    </div>
                </div>
                <div class="creator">
                    <div class="created" v-if="nftInfo && nftInfo.projectParty">
                        {{ `Created by ${nftInfo && nftInfo.projectParty} party or Unnamed` }}
                    </div>
                    <div class="owner" v-if="nftInfo && nftInfo.owner">{{ `Owner：${nftInfo && nftInfo.owner} ` }}</div>
                </div>
                <div class="buy_relevant">
                    <div class="enter_relevant">
                        <div class="title">ENTER COMPETITION</div>
                        <div class="buy">
                            {{ `You used 0 of ${nftInfo && nftInfo.maximumPurchaseQuantity || 0} tickets` }}
                        </div>
                    </div>
                    <div class="buy_box">
                        <div class="buy_tips">输入您想购买的票数：</div>
                        <el-input v-model.number="buyForm.votes" style="width: 100%;" class="buy_input" type="number"
                            min="0" :max="nftInfo && nftInfo.maximumPurchaseQuantity"
                            :placeholder="`请输入 1-${nftInfo && nftInfo.maximumPurchaseQuantity || 0}`">
                        </el-input>
                    </div>
                    <div class="payment_box">
                        <div class="payment_method">
                            <div class="balance">Purchase with balance</div>
                            <el-switch v-model="buyForm.type" inline-prompt active-text="ON" inactive-text="OFF"
                                active-color="#13ce66" inactive-color="#ff4949" active-value="balance"
                                inactive-value="wallet" />
                        </div>
                        <el-button style="width: 100%;" class="submit_payment" type="primary" @click="submitPayment()">
                            {{ `${buyPrice} ETH` }}
                        </el-button>
                        <div class="buy_hint">使用余额购买不用支付GAS</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="nft_buy_info">
            <div class="nft_buy_info_l">
                <el-tabs v-model="activeType" class="type-tabs" @tab-click="handleClick">
                    <el-tab-pane label="ACTIVITY" name="activity"></el-tab-pane>
                    <el-tab-pane label="PARTICIPANTS(50)" name="participants"></el-tab-pane>
                </el-tabs>
                <div class="buy_list">
                    <div class="buy_item" v-for="(item, index) in buyData" :key="index">
                        <div class="buy_item_l">
                            <img :src="item.userImg">
                        </div>
                        <div class="buy_item_r">
                            <div class="buy_info">
                                <div class="buy_name">{{ formatAddr(item.address) }}</div>
                                <div class="buy_time">{{ timeFormat(item.time) }}</div>
                            </div>
                            <div class="buy_other">
                                <div class="buy_val">{{ `${item.total} TICKETS` }} </div>
                                <div class="buy_id">{{ `Reward ID：${item.startNum}-${item.endNum}` }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="load_more" v-if="!finished" @click="nextPage()">Load more</div>
            </div>
            <div class="nft_buy_info_r">
                <div class="description_box">
                    <div class="description_text">DESCRIPTION</div>
                    <div class="nft_info">
                        <span>Enter now for a chance to win</span>
                        <span class="nft_name">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}` }}</span>
                    </div>
                    <div class="nft_description" v-html="detailData && detailData.description"></div>
                </div>
                <div class="traits_box">
                    <div class="traits_text">DESCRIPTION</div>
                    <div class="traits_list">
                        <div class="traits_item" v-for="(item, index) in detailData && detailData.attributes" :key="index">
                            <div class="traits_item_name">{{ item.trait_type }}</div>
                            <div class="traits_item_val">{{ item.value }}</div>
                        </div>
                    </div>
                </div>
                <div class="invite_box">
                    <div class="invite_text">SHARE THIS COMPETITION</div>
                    <div class="choose_invite_code">
                        <div>Choose referrals code</div>
                        <el-select></el-select>
                    </div>
                </div>
            </div>
        </div>
        <div class="ending_soon_box">
            <div class="ending_soon_text">ENDING SOON</div>
            <div class="ending_soon_list">
                <div class="ending_soon_item" v-for="(item, index) in endingSoon" :key="index">
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
                    <div class="remaining_votes">{{ `${item && item.limitNum || 0} TICKETS SOLD` }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getOneBuyInfo,
    buyNftBalance,
    buyNftWallet,
    getLatestBuyRecord,
    getUserBuyRecord,
    getEndingSoon
} from "@/services/api/oneBuy";
import bigNumber from "bignumber.js";
export default {
    name: 'ntfTicketsInfo',
    data() {
        return {
            orderId: null,
            nftInfo: null,
            detailData: null,
            endingSoon: null,
            buyForm: {
                votes: null,
                type: "balance"
            },
            activeType: "activity",
            buyData: [],
            page: 1,
            size: 5,
            total: 0,
            finished: false,
            timer: null,
        };
    },
    computed: {
        buyPrice() {
            const { buyForm: { votes }, nftInfo } = this;
            if (!votes) return 0;
            if (!nftInfo || !nftInfo.price) return 0;
            return new bigNumber(votes).multipliedBy(nftInfo.price) || 0;
        }
    },
    methods: {
        // 获取Nft信息
        async fetchOneBuyInfo() {
            const res = await getOneBuyInfo({
                orderNumber: this.orderId
            });
            if (res && res.code == 200) {
                this.nftInfo = res.data;
                this.detailData = this.nftInfo && JSON.parse(this.nftInfo.detail);
            }
        },
        // 获取即将结束的一元购活动
        async fetchEndingSoon() {
            const res = await getEndingSoon({ page: 1, size: 6 });
            if (res && res.code == 200) {
                this.endingSoon = res.data.records;
            }
        },
        handleClick() {
            this.fetchBuyRecord();
        },
        // 购买一元购门票
        async submitPayment() {
            const { orderId, buyForm: { votes, type } } = this;
            let res = null;
            if (type == "balance") {
                res = await buyNftBalance({
                    orderNumber: orderId,
                    num: votes
                });
            } else {
                res = await buyNftWallet({
                    orderNumber: orderId,
                    num: votes
                });
            }

            if (res && res.code == 200) {
                this.$message.success("购买成功！");
            }

        },
        // 剩余天数
        dayLeft(event) {
            if (!event) return "ENDED"
            const setTime = new Date(event).getTime();
            const nowTime = new Date().getTime();
            if (nowTime >= setTime) return "ENDED";

            const seconds = 1000;
            const minute = seconds * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const restSec = Number(new bigNumber(setTime).minus(nowTime).toFixed(2));
            const days = new bigNumber(restSec).dividedBy(day);
            // 剩余天数
            return `${days} DAY LEFT`;
        },
        // 最新购买
        async fetchBuyRecord(isSearch = true) {
            const { size, orderId } = this;
            let _page = this.page;
            if (isSearch) {
                this.finished = false;
                this.page = 1;
                _page = 1;
            }

            let res = null;
            if (this.activeType == "activity") {
                res = await getLatestBuyRecord({
                    page: _page,
                    size: size,
                    orderNumber: orderId
                });
            } else {
                res = await getUserBuyRecord({
                    page: _page,
                    size: size,
                    orderNumber: orderId
                });
            }

            if (res && res.code == 200) {

                if (isSearch) {
                    this.buyData = res.data.records;
                    return
                }

                if (res.data.records.length == 0) {
                    this.finished = true;
                }

                this.buyData.push.apply(this.buyData, res.data.records);
            }
        },
        // 加载更多
        nextPage() {
            this.page++;
            if (this.activeType == "activity") {
                this.fetchBuyRecord(false)
            }
        },
        // 参加赛事
        enterNow(event) {
            this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
            this.orderId = event.orderNumber;
            this.buyForm = {
                votes: null,
                type: "balance"
            };
            this.activeType = "activity";
            this.fetchOneBuyInfo();
            this.fetchEndingSoon();
            this.fetchBuyRecord();
        },
        /*
         * 时间戳的 yyyy-MM-dd HH:mm:ss 格式化
         */
        dateFormat(event) {
            let date = new Date(event);
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()

            let hour = date.getHours()
            let minu = date.getMinutes()
            let sec = date.getSeconds()

            month = month >= 10 ? month : '0' + month
            day = day >= 10 ? day : '0' + day
            hour = hour >= 10 ? hour : '0' + hour
            minu = minu >= 10 ? minu : '0' + minu
            sec = sec >= 10 ? sec : '0' + sec

            return `${year}-${month}-${day} ${hour}:${minu}:${sec}`
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
        "buyForm.votes": function (newVal) {
            const { nftInfo } = this;
            const values = new bigNumber(nftInfo.totalPrice).dividedBy(nftInfo.price).toFixed(0); // 总票数

            console.log(values)
            let available = 0; // 可购买数量 总票数的4/1;
            if (nftInfo.orderType == "LIMITED_PRICE") {
                available = new bigNumber(values).dividedBy(4).toFixed(0);
            }   // 暂时不计算限时

            if (!nftInfo || !nftInfo.totalPrice || !nftInfo.price || values <= 1) return

            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            if (newVal == 0 || !newVal) return;

            this.timer = setTimeout(() => {
                if (available <= nftInfo.maximumPurchaseQuantity) {
                    if (newVal > available) {
                        this.buyForm.votes = available;
                    }
                }

                this.$forceUpdate();
            }, 300);
        },
    },
    created() {
        // 获取一元购 ID
        const { id } = this.$route.query;
        this.orderId = "PD230426170340" || id;
        this.orderId = id;
        this.fetchOneBuyInfo();
        this.fetchEndingSoon();
        this.fetchBuyRecord();
    }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTicketsInfo.scss";
</style>
<style>
.el-popper {
    background-color: rgba(255, 255, 255, 0.2) !important;
    border: 0 !important;
}

.el-popper__arrow {
    display: none;
}
</style>