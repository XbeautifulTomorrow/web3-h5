<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_info_wrapper">
      <div class="nft_details">
        <div class="nft_details_l border_bg">
          <Image
            fit="cover"
            class="nft_img"
            v-if="nftInfo?.orderType == 'LIMITED_PRICE_COIN'"
            :src="require('@/assets/svg/user/create_eth.webp')"
          />
          <Image fit="cover" class="nft_img" v-else :src="nftInfo?.img" />
          <div
            class="tips_round"
            v-if="nftInfo?.orderStatus == 'IN_PROGRESS'"
            :class="[nftInfo?.orderType == 'LIMITED_TIME' ? 'time' : 'price']"
          >
            <div v-if="nftInfo?.orderType == 'LIMITED_TIME'">
              <img src="@/assets/svg/home/icon_info_time_white.svg" alt="" />
              <span v-if="dateDiff(nftInfo?.endTime) > 1">
                {{
                  $t("home.dayLeft", {
                    day: Math.ceil(dateDiff(nftInfo?.endTime)),
                  })
                }}
              </span>
              <countDown
                v-else
                v-slot="timeObj"
                @onEnd="loadInterface()"
                :time="nftInfo?.endTime"
              >
                {{
                  $t("home.timeLeft", {
                    time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}`,
                  })
                }}
              </countDown>
            </div>
            <div v-else>
              <img src="@/assets/svg/home/icon_info_price_white.svg" alt="" />
              <span v-if="nftInfo?.maximumPurchaseQuantity > 1">
                {{
                  $t("home.ticketsLeft", {
                    num: nftInfo?.maximumPurchaseQuantity || 0,
                  })
                }}
              </span>
              <span v-else>
                {{
                  $t("home.ticketLeft", {
                    num: nftInfo?.maximumPurchaseQuantity || 0,
                  })
                }}
              </span>
            </div>
          </div>
          <div
            class="tips_round finish"
            v-else-if="nftInfo?.orderStatus == 'DRAWN'"
          >
            <span>{{ $t("ticketsInfo.completed") }}</span>
          </div>
          <div
            class="tips_round aborted"
            v-else-if="nftInfo?.orderStatus == 'CLOSED'"
          >
            <span>{{ $t("ticketsInfo.aborted") }}</span>
          </div>
          <div class="tips_round cancel" v-else>
            <span>{{ $t("ticketsInfo.cancelled") }}</span>
          </div>
        </div>
        <div class="nft_details_r_bg border_bg">
          <div class="nft_details_r">
            <div class="nft_name text-ellipsis">
              <span v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'">
                {{ nftInfo?.name || "--" }}
              </span>
              <span v-else>
                {{ `${Number(nftInfo?.totalPrice).toLocaleString()} ETH` }}
              </span>
              <span
                v-if="
                  nftInfo?.orderType != 'LIMITED_PRICE_COIN' &&
                  formatSeries(nftInfo)
                "
              >
                {{ ` #${nftInfo?.tokenId}` }}
              </span>
            </div>
            <div class="nft_activity">
              <div class="price_box">
                <div class="price">
                  <span class="title">{{ $t("ticketsInfo.marketValue") }}</span>
                  <span
                    class="val"
                    v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'"
                  >
                    {{ `$ ${Number(nftInfo?.totalPrice).toLocaleString()}` }}
                  </span>
                  <span class="val" v-else>
                    {{
                      `$ ${Number(
                        accurateDecimal(
                          new bigNumber(exchangeRate || 0).multipliedBy(
                            nftInfo?.totalPrice || 0
                          ),
                          4
                        )
                      ).toLocaleString()}`
                    }}
                  </span>
                </div>
                <div
                  class="floor_price"
                  v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'"
                >
                  <span class="title">{{ $t("ticketsInfo.floorPrice") }}</span>
                  <span class="val">
                    {{ `$ ${Number(nftInfo?.floorPrice).toLocaleString()}` }}
                  </span>
                </div>
              </div>
              <div class="time" v-if="nftInfo?.orderStatus == 'IN_PROGRESS'">
                <img src="@/assets/svg/home/icon_info_time.svg" alt="" />
                <div class="time-text">
                  <countDown
                    v-slot="timeObj"
                    @onEnd="loadInterface()"
                    :time="nftInfo?.endTime"
                  >
                    {{
                      $t("ticketsInfo.close", {
                        time: `${timeObj.dd}:${timeObj.hh}:${timeObj.mm}:${timeObj.ss}`,
                      })
                    }}
                  </countDown>
                </div>
              </div>
              <div class="finish" v-else-if="nftInfo?.orderStatus == 'DRAWN'">
                <img
                  v-if="nftInfo?.orderType == 'LIMITED_TIME'"
                  src="@/assets/svg/home/icon_time_drawn.svg"
                  alt=""
                />
                <img
                  v-else
                  src="@/assets/svg/home/icon_price_drawn.svg"
                  alt=""
                />
                <div class="time-text">{{ $t("ticketsInfo.completed") }}</div>
              </div>
              <div class="aborted" v-else-if="nftInfo?.orderStatus == 'CLOSED'">
                <img
                  v-if="nftInfo?.orderType == 'LIMITED_TIME'"
                  src="@/assets/svg/home/icon_time_aborted.svg"
                  alt=""
                />
                <img
                  v-else
                  src="@/assets/svg/home/icon_price_aborted.svg"
                  alt=""
                />
                <div class="time-text">{{ $t("ticketsInfo.aborted") }}</div>
              </div>
              <div class="cancel" v-else>
                <img
                  v-if="nftInfo?.orderType == 'LIMITED_TIME'"
                  src="@/assets/svg/home/icon_time_cancel.svg"
                  alt=""
                />
                <img
                  v-else
                  src="@/assets/svg/home/icon_price_cancel.svg"
                  alt=""
                />
                <div class="time-text">{{ $t("ticketsInfo.cancelled") }}</div>
              </div>
            </div>
            <div class="creator">
              <div class="created">
                <span class="title">{{ $t("ticketsInfo.created") }}</span>
                <span>{{ nftInfo?.projectParty || "Unnamed" }}</span>
              </div>
              <div class="owner">
                <span class="title">{{ $t("ticketsInfo.owner") }}</span>
                <span>{{ nftInfo?.owner }}</span>
              </div>
            </div>
            <div
              class="buy_relevant"
              v-if="nftInfo?.orderStatus == 'IN_PROGRESS'"
            >
              <div class="enter_relevant">
                <div class="title">
                  {{ $t("ticketsInfo.enterCompetition") }}
                </div>
                <div
                  class="buy_tips"
                  v-html="
                    $t('ticketsInfo.buyable', {
                      userNum: (drawnInfo && drawnInfo.userNum) || 0,
                      maxBuyNum: new bigNumber(maxBuyNum || 0)
                        .plus((drawnInfo && drawnInfo.userNum) || 0)
                        .toString(),
                    })
                  "
                ></div>
              </div>
              <div class="buy_box">
                <div class="buy_tips">{{ $t("ticketsInfo.purchaseNum") }}</div>
                <el-input
                  :disabled="!maxBuyNum > 0"
                  v-model.number="buyVotes"
                  style="width: 100%"
                  class="buy_input"
                  type="number"
                  min="0"
                  :max="maxBuyNum"
                  :placeholder="buyText(nftInfo)"
                >
                </el-input>
                <div
                  :class="[
                    !(dateDiff(nftInfo?.endTime) > 0 && maxBuyNum > 0) &&
                      'disabled',
                    'choose_nums',
                  ]"
                >
                  <div
                    v-for="(item, index) in numData"
                    :key="index"
                    :class="[
                      'choose_nums_item',
                      buyVotes == item.value && 'active',
                    ]"
                    @click="changeBuyVotes(item.value)"
                  >
                    <span>{{ item.label }}</span>
                  </div>
                </div>
              </div>
              <div class="payment_box">
                <el-button
                  v-if="
                    nftInfo?.sendTicketsSwitch &&
                    maxBuyNum > 0 &&
                    nftInfo?.sendTicketsStatus == 1
                  "
                  style="width: 100%"
                  @click="shareOpen()"
                  :class="[
                    'free_payment',
                    nftInfo?.sendTicketsStatus != 1 && 'disabled',
                  ]"
                  type="primary"
                >
                  <div class="share_box">
                    <div class="shareText">
                      <img src="@/assets/svg/user/icon_twiteer.svg" alt="" />
                      <span>{{ $t("ticketsInfo.freeText1") }}</span>
                    </div>
                    <div class="shareTips">
                      <span>{{ $t("ticketsInfo.shareTitle") }}</span>
                      <!-- <span v-else-if="nftInfo?.sendTicketsStatus == 2">{{ $t("ticketsInfo.freeText2") }}</span>
                      <span v-else>{{ $t("ticketsInfo.freeText3") }}</span> -->
                    </div>
                  </div>
                </el-button>
                <el-button
                  v-if="dateDiff(nftInfo?.endTime) > 0 && maxBuyNum > 0"
                  style="width: 100%"
                  class="submit_payment"
                  type="primary"
                  @click="submitPayment()"
                >
                  <span v-if="buyVotes > 1">{{
                    `Purchase ${buyVotes || 0} tickets for ${buyPrice} `
                  }}</span>
                  <span v-else>{{
                    $t("ticketsInfo.buyNum", {
                      num: buyVotes || 0,
                      price: buyPrice,
                    })
                  }}</span>
                  <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                </el-button>
                <el-button
                  disabled
                  v-else
                  style="width: 100%"
                  class="submit_payment"
                  type="primary"
                >
                  <span v-if="nftInfo?.orderStatus == 'IN_PROGRESS'">
                    {{ $t("ticketsInfo.endHint") }}
                  </span>
                  <span v-else>
                    {{ $t("ticketsInfo.endHint1") }}
                  </span>
                </el-button>
              </div>
            </div>
            <div class="nft_end" v-else>
              <div class="winning_interval"></div>
              <div class="winning_box" v-if="nftInfo?.orderStatus == 'DRAWN'">
                <div class="winning_text">
                  <span>{{ $t("ticketsInfo.winner") }}</span>
                </div>
                <div class="avatar">
                  <img
                    :src="(drawnInfo && drawnInfo.userImg) || avatarImg"
                    alt=""
                  />
                </div>
                <div class="user_name">
                  {{
                    (drawnInfo && drawnInfo.winningAddress) ||
                    (drawnInfo && drawnInfo.winningAddressId)
                  }}
                </div>
                <div
                  class="tickets_num"
                  v-if="drawnInfo && drawnInfo.winningAddressNum > 1"
                >
                  {{
                    $t("ticketsInfo.numTickets", {
                      num: (drawnInfo && drawnInfo.winningAddressNum) || 0,
                    })
                  }}
                </div>
                <div class="tickets_num" v-else>
                  {{
                    $t("ticketsInfo.numTicket", {
                      num: (drawnInfo && drawnInfo.winningAddressNum) || 0,
                    })
                  }}
                </div>
                <div class="safety_box">
                  <img
                    class="safety_img"
                    src="@/assets/svg/home/icon_safety.svg"
                    alt=""
                  />
                  <div class="safety_text">
                    <span>{{ $t("ticketsInfo.verify1") }}</span>
                    <span>{{ $t("ticketsInfo.verify2") }}</span>
                  </div>
                  <div class="chain_link">
                    <span @click="openLenk(nftInfo)">{{
                      $t("ticketsInfo.verify3")
                    }}</span>
                    <span>{{ $t("ticketsInfo.verify4") }}</span>
                  </div>
                </div>
              </div>
              <div
                class="return_box"
                v-else-if="nftInfo?.orderStatus == 'CLOSED'"
                v-html="
                  $t('ticketsInfo.closeHint', {
                    num: new bigNumber(nftInfo?.price || 0).multipliedBy(
                      (drawnInfo && drawnInfo.userNum) || 0
                    ),
                  })
                "
              ></div>
              <div
                class="return_box"
                v-else
                v-html="
                  $t('ticketsInfo.cancelHint', {
                    name: `${nftInfo?.name} #${nftInfo?.tokenId}`,
                  })
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="nft_buy_info">
        <div class="nft_buy_info_l">
          <div class="buy_record border_bg">
            <el-tabs
              v-model="activeType"
              class="type_tabs"
              @tab-change="handleChange"
            >
              <el-tab-pane
                :label="$t('ticketsInfo.active')"
                name="activity"
              ></el-tab-pane>
              <el-tab-pane
                :label="
                  $t('ticketsInfo.participant', { num: participantsTotal })
                "
                name="participants"
              ></el-tab-pane>
            </el-tabs>
            <c-scrollbar
              class="choose_nft"
              width="100%"
              :height="screenWidth > 950 ? '27.5rem' : '14rem'"
            >
              <div class="buy_list">
                <div
                  class="buy_item"
                  v-for="(item, index) in buyData"
                  :key="index"
                >
                  <div class="buy_item_l">
                    <img :src="item.userImg || avatarImg" />
                  </div>
                  <div
                    class="buy_item_r"
                    :class="[activeType == 'participants' && 'participants']"
                  >
                    <div class="buy_info">
                      <div class="buy_name">
                        {{ item.address || item.userId }}
                      </div>
                      <div class="buy_time" v-if="activeType != 'participants'">
                        {{ timeFormat(item.time) }}
                      </div>
                    </div>
                    <div class="buy_other">
                      <div class="buy_val" v-if="item.total > 1">
                        {{ $t("ticketsInfo.numTickets", { num: item.total }) }}
                      </div>
                      <div class="buy_val" v-else>
                        {{ $t("ticketsInfo.numTicket", { num: item.total }) }}
                      </div>
                      <div class="buy_id" v-if="activeType != 'participants'">
                        {{
                          $t("ticketsInfo.rewardId", {
                            start: item.startNum,
                            end: item.endNum,
                          })
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="load_more"
                v-if="total > buyData?.length && !finished"
                @click="nextPage()"
              >
                <div class="load_btn">
                  <span>{{ $t("ticketsInfo.more") }}</span>
                  <img src="@/assets/svg/user/icon_more.svg" alt="" />
                </div>
              </div>
            </c-scrollbar>
          </div>
          <div
            class="buy_history"
            v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'"
          >
            <div class="history_title">
              <img src="@/assets/svg/home/icon_buy_history.svg" alt="" />
              <span>{{ $t("ticketsInfo.nftAtivity") }}</span>
            </div>
            <div class="history_filter">
              <el-select
                v-model="chooseVal"
                class="status_type"
                @change="historyFilter"
              >
                <el-option
                  v-for="(item, index) in statusDrop"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="choose_array" v-if="chooseStatus.length > 0">
                <div
                  class="status_item"
                  v-for="(item, index) in chooseStatus"
                  :key="index"
                >
                  <span>{{ statusFormat(item) }}</span>
                  <img
                    @click="delStatus(index)"
                    src="@/assets/svg/home/icon_close.svg"
                    alt=""
                  />
                </div>
              </div>
              <el-table
                :data="historyList"
                class="table_container"
                height="13.5rem"
              >
                <el-table-column
                  label="Event"
                  width="90"
                  prop="currentStatus"
                  align="left"
                >
                  <template #default="scope">
                    <div class="price_box">
                      <img
                        v-if="scope.row.currentStatus == 'IN_PROGRESS'"
                        src="@/assets/svg/home/icon_nft_create.svg"
                      />
                      <img
                        v-else-if="scope.row.currentStatus == 'DRAWN'"
                        src="@/assets/svg/home/icon_nft_sale.svg"
                      />
                      <img
                        v-else-if="scope.row.currentStatus == 'CANCELLED'"
                        src="@/assets/svg/home/icon_nft_cancel.svg"
                      />
                      <img v-else src="@/assets/svg/home/icon_nft_abort.svg" />
                      <span v-if="scope.row.currentStatus == 'IN_PROGRESS'"
                        >Create</span
                      >
                      <span
                        v-else-if="scope.row.currentStatus == 'DRAWN'"
                        style="color: rgba(9, 139, 46, 0.8)"
                        >Sale</span
                      >
                      <span v-else-if="scope.row.currentStatus == 'CANCELLED'"
                        >Cancel</span
                      >
                      <span v-else style="color: rgba(187, 54, 12, 0.8)"
                        >Abort</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Price"
                  width="80"
                  prop="price"
                  align="left"
                >
                  <template #default="scope">
                    <div class="price_box">
                      <img
                        v-if="scope.row.price"
                        src="@/assets/svg/user/icon_usdt_gold.svg"
                        alt=""
                      />
                      <span
                        v-if="scope.row.price"
                        v-priceFormat="scope.row.price"
                      ></span>
                      <span v-else>--</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Creator"
                  prop="userName"
                  align="left"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    <div class="price_box">
                      <img v-if="scope.row.userName" :src="avatarImg" alt="" />
                      <span>{{ scope.row.userName || "--" }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Winner"
                  prop="winner"
                  align="left"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    <div class="price_box">
                      <img v-if="scope.row.winner" :src="avatarImg" alt="" />
                      <span>{{ scope.row.winner || "--" }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Date"
                  min-width="100"
                  prop="endTime"
                  align="left"
                >
                  <template #default="scope">
                    <div class="price_box date">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="timeFormat(scope.row.endTime)"
                        placement="top"
                      >
                        <span>{{ timeFormat(scope.row.endTime) }}</span>
                      </el-tooltip>
                      <img
                        v-if="scope.row.currentStatus == 'DRAWN'"
                        @click="enterNow(scope.row)"
                        src="@/assets/svg/home/icon_share.svg"
                        alt=""
                      />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="nft_buy_info_r border_bg">
          <div
            class="charts_box"
            v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'"
          >
            <div class="charts_title_box">
              <div class="charts_title">
                <img src="@/assets/svg/home/icon_price_history.svg" alt="" />
                <span>{{ $t("ticketsInfo.priceHistory") }}</span>
              </div>
              <div class="charts_price">
                <div class="price_title">Last sale:</div>
                <div class="price_val">
                  <span
                    v-if="historyPrice"
                    v-priceFormat:0="historyPrice"
                  ></span>
                  <span v-else>--</span>
                </div>
              </div>
            </div>
            <div class="chart-box">
              <line-chart
                v-if="chartData.length > 0"
                ref="lienChart"
                :chart-data="lineChartData"
              />
              <div class="no_date" v-else>
                <span>No data</span>
              </div>
            </div>
          </div>
          <div class="description_box">
            <div class="description_text">
              <img src="@/assets/svg/home/icon_description.svg" alt="" />
              <span>{{ $t("ticketsInfo.description") }}</span>
            </div>
            <div class="nft_info">
              <span>{{ $t("ticketsInfo.nftDescription") }}</span>
              <span
                class="nft_name text-ellipsis"
                v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'"
              >
                {{
                  formatSeries(nftInfo)
                    ? `${nftInfo?.name} #${nftInfo?.tokenId}`
                    : `${nftInfo?.name}`
                }}
              </span>
              <span class="nft_name text-ellipsis" v-else>
                {{ `${nftInfo?.totalPrice} ETH` }}
              </span>
            </div>
            <div
              class="nft_description"
              v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'"
              v-html="nftInfo?.remark"
            ></div>
            <div class="nft_description" v-else>
              {{ $t("ticketsInfo.ethDescription") }}
            </div>
          </div>
          <div
            class="traits_box"
            v-if="nftInfo?.orderType != 'LIMITED_PRICE_COIN'"
          >
            <div class="traits_text">
              <img src="@/assets/svg/home/icon_traits.svg" alt="" />
              <span>{{ $t("ticketsInfo.traits") }}</span>
            </div>
            <div class="traits_list">
              <div
                class="traits_item"
                v-for="(item, index) in attrData"
                :key="index"
              >
                <div class="traits_item_top">
                  <div class="traits_item_name">{{ item.attrName }}</div>
                </div>
                <div class="traits_item_val">
                  <el-tooltip
                    popper-class="tips_box"
                    effect="dark"
                    placement="top"
                  >
                    <template #content>
                      <span>{{ item.attrValue }}</span>
                    </template>
                    <div class="item_val">{{ item.attrValue }}</div>
                  </el-tooltip>
                  <span class="item_ratio">{{ item.attrNum }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="invite_box">
            <div class="invite_text">{{ $t("ticketsInfo.share") }}</div>
            <div class="choose_invite_code">
              <img
                src="@/assets/svg/user/icon_invite_copy.svg"
                @click="copyInviteLink(inviteVal)"
                alt=""
              />
              <img
                src="@/assets/svg/airdrop/icon_twitter_btn.svg"
                @click="shareInviteLink(inviteVal)"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div class="ending_soon_box" v-if="endingSoon.length > 0">
        <div class="ending_soon_text">{{ $t("ticketsInfo.endSoon") }}</div>
        <div class="ending_soon_list">
          <div
            class="ending_soon_item"
            @click="enterNow(item)"
            v-for="(item, index) in endingSoon"
            :key="index"
          >
            <div class="image_box">
              <div
                class="tips_round"
                :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'"
              >
                <img
                  v-if="item.orderType == 'LIMITED_TIME'"
                  src="@/assets/svg/home/icon_info_time_white.svg"
                  alt=""
                />
                <img
                  v-else
                  src="@/assets/svg/home/icon_info_price_white.svg"
                  alt=""
                />
                <span v-if="item.orderType == 'LIMITED_TIME'">
                  <span v-if="dateDiff(item.endTime) > 1">
                    {{
                      $t("home.dayLeft", {
                        day: Math.ceil(dateDiff(nftInfo?.endTime)),
                      })
                    }}
                  </span>
                  <countDown v-else v-slot="timeObj" :time="item.endTime">
                    {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                  </countDown>
                </span>
                <span v-else>
                  <span
                    v-if="
                      Number(
                        new bigNumber(item.limitNum).minus(
                          item.numberOfTicketsSold || 0
                        )
                      ) > 1
                    "
                  >
                    {{
                      $t("home.ticketsLeft", {
                        num: new bigNumber(item.limitNum).minus(
                          item.numberOfTicketsSold || 0
                        ),
                      })
                    }}
                  </span>
                  <span v-else>
                    {{
                      $t("home.ticketLeft", {
                        num: new bigNumber(item.limitNum).minus(
                          item.numberOfTicketsSold || 0
                        ),
                      })
                    }}
                  </span>
                </span>
              </div>
              <div
                class="image_tag text-ellipsis"
                v-if="item.orderType != 'LIMITED_PRICE_COIN'"
              >
                #{{ item.tokenId }}
              </div>
              <Image
                fit="cover"
                class="nft_img"
                v-if="item.orderType == 'LIMITED_PRICE_COIN'"
                :src="require('@/assets/svg/user/create_eth.webp')"
              />
              <Image fit="cover" class="nft_img" v-else :src="item.nftImage" />
            </div>
            <div class="nft_name">
              <span v-if="item.orderType != 'LIMITED_PRICE_COIN'">{{
                item.seriesName || "--"
              }}</span>
              <span v-else>
                {{ `${Number(item.price).toLocaleString()} ETH` }}
              </span>
              <img src="@/assets/svg/home/icon_certified.svg" alt="" />
            </div>
            <div class="nft_price">
              <span class="val" v-if="item.orderType != 'LIMITED_PRICE_COIN'">
                {{ `${Number(item.price).toLocaleString()} ETH` }}
              </span>
              <p class="val" v-else>
                $
                <span
                  v-priceFormat="
                    new bigNumber(exchangeRate).multipliedBy(item.price)
                  "
                ></span>
              </p>
            </div>
            <div class="buy_btn">
              <span>{{ $t("home.nftTicketBtn") }}</span>
            </div>
            <div class="remaining_votes">
              <span
                v-html="
                  $t('home.ticketsSold', { num: item.numberOfTicketsSold || 0 })
                "
                v-if="item.numberOfTicketsSold > 1"
              >
              </span>
              <span
                v-html="
                  $t('home.ticketSold', { num: item.numberOfTicketsSold || 0 })
                "
                v-else
              >
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="showShare"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      :append-to-body="true"
      width="43.75rem"
      :before-close="shareClose"
    >
      <template #header="{ close }">
        <div class="close_btn" v-on="{ click: [close, shareClose] }">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <div class="operating_title">
          <span>{{ $t("ticketsInfo.verifyTitle") }}</span>
        </div>
        <div class="operating_description">
          <span>{{ $t("ticketsInfo.verifyDescription") }}</span>
        </div>
        <div class="invite_code">
          <el-input
            class="invite_code_input"
            @blur="onVerify()"
            v-model="shareLink"
            clearable
            :placeholder="$t('ticketsInfo.enterLink')"
          >
          </el-input>
          <div class="create_error">{{ errorTips }}</div>
        </div>
        <div class="btn_box">
          <el-button
            class="public-button form-button"
            v-if="!loading"
            @click="verifyLink()"
          >
            {{ $t("ticketsInfo.startVerify") }}
          </el-button>
          <el-button class="public-button form-button loading" v-else>
            <div class="loading_box">
              <img src="@/assets/img/user/loading.png" alt="" />
              <span>{{ $t("ticketsInfo.startVerify") }}</span>
            </div>
          </el-button>
        </div>
        <div class="verify_hint">
          <p>
            <img src="@/assets/svg/user/icon_yellow_warning.svg" alt="" />
            <span>{{ $t("ticketsInfo.verifyTips1") }}</span>
          </p>
          <p>
            <img src="@/assets/svg/user/icon_yellow_warning.svg" alt="" />
            <span>{{ $t("ticketsInfo.verifyTips2") }}</span>
          </p>
        </div>
      </div>
    </el-dialog>
    <Login
      v-if="pageType === 'login'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Register
      v-if="pageType === 'register'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Forgot
      v-if="pageType === 'forgot'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Modify
      v-if="pageType === 'modify'"
      @onModify="closeDialogFun"
      @closeDialogFun="closeDialogFun"
    ></Modify>
    <buyConfirm
      :nftInfo="nftInfo"
      :orderId="orderId"
      :inviteCode="inviteVal"
      :tickets="buyVotes"
      :price="buyPrice"
      v-if="pageType === 'confirm'"
      @closeDialogFun="closeDialogFun"
    ></buyConfirm>
    <Recharge
      v-if="pageType === 'recharge'"
      @closeDialogFun="closeDialogFun"
    ></Recharge>
  </div>
</template>
<script>
import {
  getOneBuyInfo,
  buyNftBalance,
  getAListOfActivities,
  getAListOfParticipants,
  getEndingSoon,
  getLottery,
  getNftAttrRate,
  getNftActivity,
  getNftActivityCharts,
  getTweetInfo,
  getShareTwitter,
  tweetSendTikect,
} from "@/services/api/oneBuy";
import { getCacheTicker } from "@/services/api";
import { getSetting } from "@/services/api/invite";
import bigNumber from "bignumber.js";
import countDown from "@/components/countDown";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";

import { i18n } from "@/locales";
const { t } = i18n.global;

import { CScrollbar } from "c-scrollbar";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import buyConfirm from "./buyConfirm.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Image from "@/components/imageView";
import Recharge from "@/views/user/recharge.vue";
import LineChart from "@/components/charts";
import {
  accurateDecimal,
  openUrl,
  onCopy,
  dateDiff,
  timeFormat,
  handleWindowResize,
} from "@/utils";
export default {
  name: "ntfTicketsInfo",
  components: {
    countDown,
    CScrollbar,
    Login,
    Register,
    Forgot,
    Modify,
    Image,
    buyConfirm,
    Recharge,
    LineChart,
  },
  data() {
    return {
      pageType: "", //登录相关
      orderId: null,
      nftInfo: {},
      inviteVal: null,
      inviteDrop: [],
      attrData: [],
      endingSoon: [],
      buyVotes: 1,
      activeType: "activity",
      buyData: [],
      participantsTotal: 0,
      page: 1,
      size: 4,
      total: 0,
      finished: false,
      timer: null,
      drawnInfo: null,
      avatarImg: require("@/assets/svg/user/default_avatar.svg"),

      chooseVal: null,
      statusDrop: [],
      chooseStatus: ["DRAWN"],
      historyList: [],
      historyPrice: null,
      historyPage: 1,
      historySize: 50,
      historyTotal: 0,
      historyFinished: false,
      chartData: [],
      lineChartData: {},
      screenWidth: null,
      exchangeRate: null,

      // 分享
      showShare: false,
      shareLink: null,
      loading: false,
      verifys: false,
      errorTips: null,

      config: null,
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    buyPrice() {
      const { buyVotes, nftInfo } = this;
      if (!buyVotes) return 0;
      if (!nftInfo || !nftInfo?.price) return 0;
      return new bigNumber(buyVotes).multipliedBy(nftInfo?.price) || 0;
    },
    // 剩余时间
    duration() {
      const { currentTime } = useUserStore();
      if (currentTime) {
        const endstamp = new Date(this.nftInfo?.endTime).getTime();
        let end = String(endstamp).length >= 13 ? +endstamp : +endstamp * 1000;
        end -= new Date(currentTime).getTime();
        return end;
      }
      const timestamp = new Date(this.nftInfo?.endTime).getTime();
      const time = this.isMiniSecond
        ? Math.round(+timestamp / 1000)
        : Math.round(+timestamp);
      return time;
    },
    // 计算可购买最大票数
    maxBuyNum() {
      if (!this.nftInfo) return 0;
      const {
        nftInfo: {
          totalPrice,
          price,
          orderType,
          maximumPurchaseQuantity,
          limitNum,
        },
        drawnInfo,
      } = this;

      let maxNum = 0; // 可购买最大票数
      if (orderType == "LIMITED_TIME") {
        if (!totalPrice) return 0;
        if (!price) return 0;
        maxNum = Number(
          Math.ceil(
            new bigNumber(totalPrice)
              .dividedBy(price)
              .dividedBy(4)
              .minus((drawnInfo && drawnInfo.userNum) || 0)
          )
        );
      } else if (orderType == "LIMITED_PRICE_COIN") {
        maxNum = Number(
          Math.ceil(
            new bigNumber(limitNum)
              .dividedBy(4)
              .minus((drawnInfo && drawnInfo.userNum) || 0)
          )
        );

        // 如果余票不足最大票数，取余票数量
        if (Number(maxNum) > Number(maximumPurchaseQuantity)) {
          maxNum = maximumPurchaseQuantity;
        }
      } else {
        if (!maximumPurchaseQuantity) return 0;
        maxNum = Number(
          Math.ceil(
            new bigNumber(totalPrice)
              .dividedBy(price)
              .dividedBy(4)
              .minus((drawnInfo && drawnInfo.userNum) || 0)
          )
        );

        // 如果余票不足最大票数，取余票数量
        if (Number(maxNum) > Number(maximumPurchaseQuantity)) {
          maxNum = maximumPurchaseQuantity;
        }
      }

      return maxNum;
    },
    numData() {
      return [
        {
          label: "25%",
          value: Math.floor(new bigNumber(this.maxBuyNum).multipliedBy(0.25)),
        },
        {
          label: "50%",
          value: Math.floor(new bigNumber(this.maxBuyNum).multipliedBy(0.5)),
        },
        {
          label: "75%",
          value: Math.floor(new bigNumber(this.maxBuyNum).multipliedBy(0.75)),
        },
        {
          label: "Max",
          value: this.maxBuyNum,
        },
      ];
    },
  },
  methods: {
    onCopy: onCopy,
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    dataLayerFunc(event) {
      try {
        // eslint-disable-next-line no-undef
        dataLayer.push({
          event: event,
          ecommerce: "ok",
        });
      } catch (err) {
        console.log(err);
      }
    },
    // 获取Nft信息
    async fetchOneBuyInfo() {
      const res = await getOneBuyInfo({
        orderNumber: this.orderId,
        userId: this.userInfo?.id || 0,
      });
      if (res && res.code == 200) {
        this.nftInfo = res.data;
        const userStore = useUserStore();
        const { userInfo } = userStore;
        if (this.nftInfo?.orderType != "LIMITED_PRICE_COIN") {
          this.fetchNftAttrRate();
          this.fetchNftActivity();
          this.fetchNftActivitySale();
        }

        if (this.userInfo?.id && this.isLogin) {
          if (
            this.nftInfo?.sendTicketsSwitch &&
            this.nftInfo?.sendTicketsStatus == 1
          ) {
            const userTweet = await getTweetInfo({
              orderNumber: this.orderId,
            });

            const { data } = userTweet;
            if (data?.collectionStatus) {
              this.nftInfo.sendTicketsStatus = 3;
            }
          }
        }

        const resDrawn = await getLottery({
          orderNumber: this.orderId,
          userId: userInfo?.id || 0,
        });

        if (resDrawn && resDrawn.code == 200) {
          this.drawnInfo = resDrawn.data;
        }
      }
    },
    // 购买提示
    buyText(event) {
      const { maximumPurchaseQuantity, orderType } = event;
      let hintText = null;

      if (this.maxBuyNum > 0) {
        hintText = null;
      } else {
        hintText = t("ticketsInfo.buyHint");
      }

      if (orderType == "LIMITED_PRICE") {
        if (!Number(maximumPurchaseQuantity) > 0) {
          hintText = t("ticketsInfo.soldOut");
        }
      }

      return hintText;
    },
    // 获取即将结束的一元购活动
    async fetchEndingSoon() {
      const res = await getEndingSoon({ id: this.orderId, page: 1, size: 6 });
      if (res && res.code == 200) {
        this.endingSoon = res.data.records;
      }
    },
    handleChange() {
      this.buyData = [];
      this.fetchBuyRecord();
    },
    // 购买一元购门票
    async submitPayment() {
      if (!this.isLogin || !this.userInfo?.id) {
        this.pageType = "login";
        return;
      }

      const { orderId, buyVotes, ethBalance, buyPrice } = this;

      if (!buyVotes || buyVotes < 1) {
        this.$message.error(t("ticketsInfo.enterHint"));
        return;
      }
      if (Number(ethBalance) < buyPrice) {
        this.$message.error(t("mysteryBox.rechargeHint"));
        this.pageType = "recharge";
        return;
      }

      const res = await buyNftBalance({
        orderNumber: orderId,
        num: buyVotes,
      });

      if (res && res.code == 200) {
        this.pageType = "confirm";
        this.fetchOneBuyInfo();
        this.getTheUserBalanceInfo();
        this.fetchBuyRecord();
        this.dataLayerFunc("game_one_start");
      } else {
        const { data } = res;
        if (data.messageKey == "pvp_limit") {
          this.$message.error(
            this.$t("errorTips." + data.messageKey, {
              val: this.config?.pvpThresholds,
            })
          );
          return;
        }

        this.$message.error(this.$t("errorTips." + data.messageKey));
      }
    },
    async getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
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
        res = await getAListOfActivities({
          page: _page,
          size: size,
          orderNumber: orderId,
        });
      } else {
        res = await getAListOfParticipants({
          page: _page,
          size: size,
          orderNumber: orderId,
        });

        this.fetchUserBuyRecord();
      }

      if (res && res.code == 200) {
        this.total = res.data.total;

        if (isSearch) {
          this.buyData = res.data.records;
          return;
        }

        if (res.data.records.length == 0) {
          this.finished = true;
        }

        this.buyData.push.apply(this.buyData, res.data.records);
      }
    },
    // 获取参与者总数
    async fetchUserBuyRecord() {
      const { page, size, orderId } = this;
      const res = await getAListOfParticipants({
        page: page,
        size: size,
        orderNumber: orderId,
      });
      if (res && res.code == 200) {
        this.participantsTotal = res.data.total;
      }
    },
    // 获取NFT属性
    async fetchNftAttrRate() {
      const { nftInfo } = this;
      const res = await getNftAttrRate({
        contractAddress: nftInfo?.contractAddress,
        tokenId: nftInfo?.tokenId,
      });
      if (res && res.code == 200) {
        this.attrData = res.data;
      }
    },
    // 加载更多
    nextPage() {
      this.page++;
      this.fetchBuyRecord(false);
    },
    // 一元购历史
    async fetchNftActivity(isSearch = true) {
      const { nftInfo, historySize, chooseStatus } = this;
      let _page = this.historyPage;
      if (isSearch) {
        this.historyFinished = false;
        this.page = 1;
        _page = 1;
      }

      let res = await getNftActivity({
        contractAddress: nftInfo?.contractAddress,
        tokenId: nftInfo?.tokenId,
        page: _page,
        size: historySize,
        currentStatus: chooseStatus.join(","),
      });

      if (res && res.code == 200) {
        this.historyTotal = res.data.total;

        if (isSearch) {
          this.historyList = res.data.records;
          return;
        }

        if (res.data.records.length == 0) {
          this.historyFinished = true;
        }

        this.historyList.push.apply(this.historyList, res.data.records);
      }
    },
    // 一元购历史折线图
    async fetchNftActivitySale() {
      let that = this;
      const { nftInfo } = this;
      let _page = this.historyPage;

      let res = await getNftActivityCharts({
        contractAddress: nftInfo?.contractAddress,
        tokenId: nftInfo?.tokenId,
        page: _page,
        size: 500,
        currentStatus: "DRAWN",
      });

      if (res && res.code == 200) {
        if (res.data.records.length > 0) {
          this.historyPrice = res.data.records[0].price;

          const charts = res.data.records;
          this.chartData = charts.reverse();
        }
        let series = [];
        series.push({
          type: "line",
          data: res.data.records.map(function (item) {
            return item.price;
          }),
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#fad54d", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(255, 255, 255, 0)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          smooth: true,
          symbol: "circle",
          showLegendSymbol: false,
          animationDuration: 2800,
          animationEasing: "quadraticOut",
        });

        let xAxis = res.data.records.map(function (item) {
          return timeFormat(item.endTime);
        });

        let chatrs = {
          xAxis: xAxis,
          series: series,
        };
        that.setOptions(chatrs);
      }
    },
    // 提款汇率
    async fetchCacheTicker() {
      const res = await getCacheTicker({
        areaCoin: "ETH",
        coinName: "USDT",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
      }
    },
    // 筛选历史
    historyFilter(event) {
      const status = this.chooseStatus.findIndex((e) => e == event);

      if (!(status > -1)) {
        this.chooseStatus.push(event);
      }

      this.fetchNftActivity();
    },
    delStatus(index) {
      this.chooseStatus.splice(index, 1);
      this.fetchNftActivity();
    },
    // 默认邀请码
    async fetchSetting() {
      const res = await getSetting({ coin: "USDT" });
      if (res && res.code == 200) {
        this.config = res.data;
        this.inviteVal = res.data.defaultInviteCode;
      }
    },
    // 参加赛事
    enterNow(event) {
      let routeData = this.$router.resolve({
        name: "FreeNFT",
        query: { id: event.orderNumber },
      });
      openUrl(routeData.href);
    },
    /*
     * 时间戳的 yyyy-MM-dd HH:mm:ss 格式化
     */
    dateFormat(event) {
      let date = new Date(event);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      let hour = date.getHours();
      let minu = date.getMinutes();
      let sec = date.getSeconds();

      month = month >= 10 ? month : "0" + month;
      day = day >= 10 ? day : "0" + day;
      hour = hour >= 10 ? hour : "0" + hour;
      minu = minu >= 10 ? minu : "0" + minu;
      sec = sec >= 10 ? sec : "0" + sec;

      return `${year}-${month}-${day} ${hour}:${minu}:${sec}`;
    },
    /**
     * @description: 格式化地址
     */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{6})\S+(\S{4})$/;
      return event.replace(reg, "$1...$2");
    },
    /**
     * @description: 打开链上
     */
    openLenk(event) {
      let chainLink = process.env.VUE_APP_CHAIN_MUMBAI_ADDR;
      if (event.chainType == "OKT_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_TEST_ADDR;
      } else if (event.chainType == "BSC_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_TEST_ADDR;
      } else if (event.chainType == "BASE") {
        chainLink = process.env.VUE_APP_CHAIN_BASE_ADDR;
      } else if (event.chainType == "BSC") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_ADDR;
      } else if (event.chainType == "OKT") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_ADDR;
      } else if (event.chainType == "ThunderCore") {
        chainLink = process.env.VUE_APP_CHAIN_THUNDERCORE_ADDR;
      } else if (event.chainType == "TRC_20_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_TRC20TEST_ADDR;
      } else if (event.chainType == "TRC_20") {
        chainLink = process.env.VUE_APP_CHAIN_TRC20_ADDR;
      }
      openUrl(`${chainLink}${event.txid}`);
    },
    /**
     * @description: 加载接口
     */
    loadInterface() {
      this.fetchOneBuyInfo();
      this.fetchBuyRecord();
      this.fetchEndingSoon();
      this.fetchUserBuyRecord();
      if (this.isLogin && this.userInfo?.id) {
        this.fetchSetting(); // 邀请
      }
    },
    durationFormatter(diff) {
      // 按照传入的格式生成一个simpledateformate对象
      let nd = 1000 * 24 * 60 * 60; // 一天的毫秒数
      let nh = 1000 * 60 * 60; // 一小时的毫秒数
      let nm = 1000 * 60; // 一分钟的毫秒数
      let ns = 1000; // 一秒钟的毫秒数;

      let dd = diff / nd; // 计算差多少天
      // eslint-disable-next-line no-unused-vars
      let hh = (diff % nd) / nh; // 计算差多少小时
      // eslint-disable-next-line no-unused-vars
      let mm = ((diff % nd) % nh) / nm; // 计算差多少分钟
      // eslint-disable-next-line no-unused-vars
      let ss = (((diff % nd) % nh) % nm) / ns; // 计算差多少秒//输出结果
      return { dd, hh, mm, ss };
    },
    // 复制邀请链接
    copyInviteLink(event) {
      const currentLink = "https://www.bitzing.io";
      let link = currentLink + "/FreeNFT";
      if (event) {
        link += "/" + event;
      }
      link += "?id=" + this.orderId;
      onCopy(link);
    },
    // 分享邀请链接到推特
    shareInviteLink(event) {
      let seriesName = null;

      if (this.nftInfo?.orderType == "LIMITED_PRICE_COIN") {
        seriesName = `${this.nftInfo?.totalPrice} ETH`;
      } else {
        if (!this.formatSeries(this.nftInfo)) {
          seriesName = `${this.nftInfo?.name}`;
        } else {
          seriesName = `${this.nftInfo?.name} #${this.nftInfo?.tokenId}`;
        }
      }

      const series = `⚡️ Bitzers! Grab a chance to WIN an ${seriesName} on BITZING!\n\n`;
      const description = `Less than ${
        this.nftInfo?.maximumPurchaseQuantity || 0
      } TICKETS remaining.\n\n`;

      const inviteLink = `Enter NOW:`;
      const currentLink = "https://www.bitzing.io";
      let link = currentLink + "/FreeNFT";

      if (event) {
        link += "/" + event;
      }
      link += "?id=" + this.orderId;

      let inviteText = series;
      inviteText += description;

      inviteText += inviteLink;

      // 构建推特的分享链接
      var twitterUrl =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(inviteText) +
        "&url=" +
        link;
      // 在新窗口中打开推特分享链接
      openUrl(twitterUrl);
    },
    // 分享获取免费门票
    shareInviteFreeLink(event) {
      let seriesName = null;

      if (this.nftInfo?.orderType == "LIMITED_PRICE_COIN") {
        seriesName = `${this.nftInfo?.totalPrice} ETH`;
      } else {
        if (!this.formatSeries(this.nftInfo)) {
          seriesName = `${this.nftInfo?.name}`;
        } else {
          seriesName = `${this.nftInfo?.name} #${this.nftInfo?.tokenId}`;
        }
      }

      const series = `🎉Register on Bitzing.io now to earn a FREE ticket for a chance to win ${seriesName} on BITZING! \n\n`;
      const description = `Grab yours before they're gone: \n\n`;

      const inviteLink = ``;
      const currentLink = "https://www.bitzing.io";
      let link = currentLink + "/FreeNFT";

      if (event) {
        link += "/" + event;
      }
      link += "?id=" + this.orderId;

      let inviteText = series;
      inviteText += description;

      inviteText += inviteLink;

      // 构建推特的分享链接
      var twitterUrl =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(inviteText) +
        "&url=" +
        link +
        " 🎉";
      // 在新窗口中打开推特分享链接
      openUrl(twitterUrl);
    },
    changeBuyVotes(event) {
      const { nftInfo, maxBuyNum } = this;
      if (!(dateDiff(nftInfo?.endTime) > 0 && maxBuyNum > 0)) return;
      this.buyVotes = event;
    },
    // 打开分享
    shareOpen() {
      if (!this.userInfo?.id || !this.isLogin) {
        this.pageType = "login";
        return;
      }

      if (this.nftInfo?.sendTicketsStatus != 1) return;

      this.showShare = true;
      this.fetchShareTwitter();
      this.shareInviteFreeLink(this.nftInfo?.inviteCode);
    },
    // 获取推特验证
    async fetchShareTwitter() {
      // eslint-disable-next-line no-unused-vars
      const res = await getShareTwitter();
    },
    // 验证输入链接
    onVerify() {
      const { shareLink } = this;
      if (!shareLink) {
        this.errorTips = t("errorTips.tweets_link_error");
        this.verifys = false;
        return;
      }

      let link = shareLink;
      if (shareLink.indexOf("https://x.com/") > -1) {
        link = shareLink.replace("https://x.com", "https://twitter.com");
      }

      const reg = /^https?:\/\/twitter\.com\/\S+\/status\S+/;

      if (!reg.test(link)) {
        this.errorTips = t("errorTips.tweets_link_error");
        this.verifys = false;
        return;
      }

      this.errorTips = "";
      this.verifys = true;
    },
    // 验证推特链接
    async verifyLink() {
      this.onVerify();
      if (!this.verifys) return;

      let res = null;
      let isLoad = false;
      let isHandle = true;

      let link = this.shareLink;
      if (this.shareLink.indexOf("https://x.com/") > -1) {
        link = this.shareLink.replace("https://x.com", "https://twitter.com");
      }

      link = link.split("?")[0];

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        if (isLoad) {
          this.loading = false;
          this.handleRes(res);
        } else {
          isHandle = false;
        }
      }, 3000);

      this.loading = true;
      res = await tweetSendTikect({
        orderNumber: this.orderId,
        tweetUrl: link,
      });

      isLoad = true;
      if (!isHandle) {
        this.loading = false;
        this.handleRes(res);
      }
    },
    handleRes(res) {
      if (res && res.code == 200) {
        if (res.data) {
          this.shareClose();
          this.loadInterface();
          this.$message.success(t("ticketsInfo.verifySuccess"));
        }

        this.verifys = false;
        this.errorTips = null;
      } else {
        const { data } = res;
        this.errorTips = t("errorTips." + data.messageKey);
        this.verifys = true;
      }
    },
    // 关闭分享
    shareClose() {
      this.showShare = false;
      this.shareLink = null;
    },
    closeDialogFun() {
      this.pageType = "";
      this.buyVotes = 1;
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    statusFormat(event) {
      const status = this.statusDrop.find((e) => e.value == event);
      return status.label;
    },
    echartFormat(event) {
      const chart = this.chartData.find(
        (e) => this.timeFormat(e.endTime) == event
      );
      return chart;
    },
    setOptions({ xAxis, series } = {}) {
      let that = this;
      this.lineChartData = {
        color: ["#fad54d"],
        xAxis: {
          data: xAxis,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#D4E2F1",
            },
          },
          axisLabel: {
            color: "#c4bfbd",
          },
        },
        grid: {
          left: 30,
          right: 40,
          bottom: 10,
          top: 20,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            color: "#B9C3C3",
            fontSize: "12",
          },
          backgroundColor: "#2c115b",
          padding: [10, 10],
          formatter: function (datas) {
            var res =
              "<div style='text-align: center;font-size: 0.875rem;color:white;'>$ " +
              Number(datas[0].data).toLocaleString() +
              "</div>";
            res += "Date：";
            res += datas[0].name + "<br/>";
            for (var i = 0, length = datas.length; i < length; i++) {
              if (i != 0) {
                res += datas[i].seriesName + "：";
                res += datas[i].data;
                res += "<br/>";
              }
            }

            const chatrs = that.echartFormat(datas[0].name);
            res += t("ticketsInfo.participants") + "：";
            res += chatrs.numberOfTicketsSold;
            res += "<br/>";
            res += t("virtualCurrency.winner") + "：";
            res += chatrs.winner;
            res += "<br/>";
            return res;
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#D4E2F1",
            },
          },
          axisLabel: {
            color: "#c4bfbd",
          },
          splitLine: {
            lineStyle: { color: "rgba(255,255,255,0.1)" },
          }, //网格线配置
          splitArea: { show: false }, //去掉网格颜色
        },
        series: series,
      };
    },
    formatSeries(event) {
      if (!event) return false;
      const { name, tokenId } = event;
      if (!name || !tokenId) return false;
      const isShow = name.indexOf(tokenId) > -1;
      return !isShow;
    },
  },
  watch: {
    buyVotes: function (newVal) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      if (newVal == 0 || !newVal) return;

      this.timer = setTimeout(() => {
        if (newVal > this.maxBuyNum) {
          this.buyVotes = this.maxBuyNum;
        }

        this.$forceUpdate();
      }, 300);
    },
    isLogin() {
      this.loadInterface();
    },
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    });
    this.dataLayerFunc("game_one_loading");
  },
  created() {
    // 获取一元购 ID
    const { id } = this.$route.query;
    this.orderId = id;

    this.loadInterface();
    this.fetchCacheTicker();

    this.statusDrop = [
      {
        label: "Create",
        value: "IN_PROGRESS",
      },
      {
        label: "Sale",
        value: "DRAWN",
      },
      {
        label: "Cancel",
        value: "CANCELLED",
      },
      {
        label: "Abort",
        value: "CLOSED",
      },
    ];

    this.$nextTick(() => {
      document
        .querySelector(".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default")
        .addEventListener("scroll", (res) => {
          let scrollTop = res.target.scrollTop;
          let winHeight = res.target.clientHeight;
          let scrollHeight = res.target.scrollHeight;
          if (scrollTop + winHeight + 50 > scrollHeight && !this.busyScroll) {
            if (this.historyFinished) return;
            this.historyPage += 1;
            this.fetchNftActivity(false);
          }
        });
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./components/nftTicketsInfo.scss";
</style>
<style lang="scss">
.el-select__popper {
  border: none !important;
  background-color: #1d0f36 !important;

  .el-scrollbar__view {
    margin: 0.625rem 0 !important;
    padding: 0 !important;
  }

  .el-select-dropdown__item {
    color: #a9a4b4;
    font-size: 0.875rem;
    line-height: 1.6;
    padding: 0.625rem 1.25rem;
    height: auto;

    &.selected {
      color: white;
    }

    &:hover,
    &.hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .el-popper__arrow {
    display: none;
  }
}

.tips_box {
  max-width: 90%;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.3125rem;
  background-color: #2c115b !important;
  box-sizing: border-box;

  .tips_title {
    font-family: "Medium";
    font-size: 0.875rem;
    line-height: 1.3;
    text-align: left;
    color: #a9a4b4;
  }

  .tips_text {
    font-family: "Medium";
    font-size: 0.875rem;
    line-height: 1.3;
    text-align: left;
    color: white;
    word-break: break-all;
  }

  .el-popper__arrow::before {
    background-color: #2c115b !important;
  }
}
</style>