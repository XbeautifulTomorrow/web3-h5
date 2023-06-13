<template>
  <div class="wrapper_bg">
    <div class="FAQ_wrapper">
      <div class="FAQ_title">
        <span>FREQUENTLY&nbsp;</span>
        <span>ASKED&nbsp;</span>
        <span>QUESTIONS</span>
      </div>
      <div class="FAQ_description">
        <p>If you have any questions to which you didn’t find the answer for, ask our</p>
        <p>helpful community on Discord or send us a support ticket. We’re here to help!</p>
      </div>
      <div class="FAQ_list">
        <div :class="['FAQ_item', item.isExpand && 'active']" v-for="(item, index) in FAQList"
          @click="getQueryRect(index)" :style="{ height: item.isExpand ? item.height : item.minHeight }" :key="index">
          <div class="FAQ_item_l">{{ index + 1 }}</div>
          <div class="FAQ_item_r">
            <div class="FAQ_content">
              <div class="FAQ_content_title">
                <div class="text" :id="`text-${index}`">
                  <span v-for="(sp, i) in formatText(item.title)" :key="i">{{ sp }}&nbsp;</span>
                </div>
                <div class="close">
                  <el-icon class="close_icon">
                    <Plus />
                  </el-icon>
                </div>
              </div>
              <div class="FAQ_content_description" :id="`FAQ-${index}`" v-html="item.description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleWindowResize } from "@/utils"
import bigNumber from "bignumber.js";
export default {
  name: 'FAQ',
  components: {},
  data() {
    return {
      screenWidth: null,
      FAQList: []
    }
  },
  methods: {
    getHeight(index) {
      let paddingV = 20;
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;

      const textHeight = document.getElementById(`text-${index}`);
      if (this.screenWidth < 950) {
        paddingV = 8;
      }

      const heightV = new bigNumber(textHeight && textHeight.clientHeight).plus(paddingV).plus(paddingV).div(16);
      this.FAQList[index].minHeight = `${heightV}rem`;
    },
    getQueryRect(index) {
      let paddingV = 20;
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;

      const textHeight = document.getElementById(`text-${index}`).clientHeight;
      if (this.screenWidth < 950) {
        paddingV = 8;
      }

      const heightV = new bigNumber(textHeight).plus(paddingV).plus(paddingV);

      const height = document.getElementById(`FAQ-${index}`).clientHeight;
      let totalHeight = new bigNumber(heightV).plus(height).div(16).toString();
      this.FAQList[index].height = `${totalHeight}rem`;
      this.FAQList[index].isExpand = !this.FAQList[index].isExpand;
      console.log(this.FAQList[index].height)
    },
    formatText(event) {
      return event.split(" ");
    }
  },
  created() {
    this.FAQList = [
      {
        title: "What is BITZING?",
        description: `We are a  Web3 mystery box lottery ecommerce platform focusing on crypto assets where you 
          can unbox insane NFT prizes at an unbelievably low cost. Which aim to stimulate more people from non-NFT 
          circles to enter the marketplace by providing a more humanized and entertaining experience, to expanding 
          the liquidity of NFT and crypto assets trading as a whole.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What are NFTs?",
        description: `Non-Fungible Tokens (or NFTs) are cryptocurrency tokens that represent scarce, digital collectibles 
        which are also indivisible and unique. The term ‘non-fungible’ just means that the tokens are distinguishable from 
        each other and cannot be interchanged.
        <br><br>
        BITZING is excited to offer various NFT features including NFT Mystery Box (the World's first NFT Mystery Box marketplace)
         and Competition, ability to deposit and withdraw NFTs and a gas-less NFT marketplace.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What is Bitzing Mystery Box?",
        description: `Mystery Box is one of Bitzing's main ways of selling NFT，Each mystery box has a set probability of 
        containing NFTs from exclusive brands such as Mutant Ape Yacht Club.Every time you open a new mystery box, a random 
        spinner will determine which NFT you get. After you unbox your NFT , it’s added to your account inventory! These items 
        are real, and you can claim them to your wallet at any time.
        <br><br>
        If you are not satisfied with the NFT you receive, you can resell it at its current value for a small percentage fee and 
        the proceeds from the sale will be credited to your account immediately.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How to purchase a Mystery box?",
        description: `You will need to transfer cryptocurrencies to your account balance first, then use your balance to make purchases 
        for a better out-of-the-box experience, and your account balance can be withdrawn to your wallet at any time.
        <br><br>
        We currently only support ETH and USDT, but will support more cryptocurrencies in the future.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How do i view the NFT I have unboxed?",
        description: `Once you have opened the box, you have 60 seconds to decide whether to take the NFT or sell it 
        immediately(If you do not make a decision within 60s, we will sell the NFT for you by default). If you sell it, 
        we will transfer the remaining amount to your balance after deducting a percentage of the royalties and service 
        charges. If you choose to take the NFT, it will be automatically added to your account inventory (accessible via 
        the 'Wallet' tab on the website). Here you can view all the NFTs you currently have and you can withdraw them to 
        your wallet at any time.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How to withdraw NFT to my wallet?",
        description: `Click on your profile picture and click on "Wallet". Here you can see all the NFTs in your account. 
        You can withdraw your NFTs to your wallet by clicking on the Withdraw button below the NFT and paying a certain GAS 
        fee. To save on GAS fees, we recommend that you withdraw multiple NFTs at once rather than one by one.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "Crypto deposit and withdrawal.",
        description: `If you don't like your unboxed NFT, you can sell it after unboxing and after deducting a percentage of 
        the royalty and service fee, the remaining amount will be transferred to your balance. When you want to withdraw your 
        cryptocurrency, click on your profile picture and click on "Wallet". Here you can see your account balance, click on the 
        withdraw button to withdraw the balance to your wallet.
        <br><br>
        Note that the crypto withdrawals will incur a processing fee discounted after your request.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "Do I get rewarded for telling my friends about BITZING?",
        description: `Definitely. Bitzing has a competitive Referral Program which allows you to earn money if you’ve got a reach 
        in the NFT community, or even just a few friends you’d like to share the website with. Send your referral link to your friends, 
        and for each purchase they make, you get a commission. Click on your profile and navigate to the Referral section to learn more.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How do I open a mystery box?",
        description: `First, make sure you have a sufficient balance in your account.. Your account balance should be higher than the 
        cost of the box you’re looking to open. After that, click on the box, and you’ll be led to the unboxing window. Finally, click 
        the “Unbox” button to open the box.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How do I open a mystery box?",
        description: `First, make sure you have a sufficient balance in your account.. Your account balance should be higher than the 
        cost of the box you’re looking to open. After that, click on the box, and you’ll be led to the unboxing window. Finally, click 
        the “Unbox” button to open the box.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How many mystery boxes can I open at once?",
        description: `You can open up to 10 boxes at once. They will all open at the same time, so if you want to open multiple boxes 
        of the same kind, this can save you a lot of time.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "Why the contents of the mystery box changed?",
        description: `BITZING is always reviewing the value of each NFT and keeping them up to date. However, some NFTs are constantly 
        changing due to their volatility and this will affect the value of the products inside the box, so the contents of the box will 
        constantly change.
        <br><br>
        The product you open a box for at BITZING follows a "value acquired" rule. If you acquire an item worth 1 ETH, then if its price 
        goes up by more than 1 ETH, you will not succeed in getting it, but we will refund 100% of the value of the item at the time you 
        acquired it as compensation. However, if the price drops, you may suffer a loss, so we do not recommend keeping NFT as an asset, 
        and the best option is to exchange and remove it as soon as possible to avoid losing value!
        <br><br>
        If you want to hold NFTs for later play, we would recommend reselling them as they have a fixed value.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How do we ensure fairness?",
        description: `Since the contents of the Mystery Box change, we take a snapshot of the contents of the Mystery Box each time they 
        change. At the bottom of the Mystery Box details page, you can see all snapshot information for a seven-day period. By viewing the 
        snapshot details you can find out the NFTs contained in the Mystery Boxes and their reward IDs for each time period.
        <br><br>
        BITZING's lottery algorithm will be executed through a smart contract, so you can see the exact logic of the smart contract and the 
        lottery results on the chain, and compare the results with the reward IDs of the individual NFTs in the snapshot to ensure transparency 
        and openness of the lottery.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What is Competition?",
        description: `Competition is BITZING's first new NFT sales model, unlike the traditional NFT marketplace with its one-price and auction 
        sales model, the competition model can greatly reduce the purchase cost of buyers, making it possible for buyers to obtain epic NFTs for 
        a fraction of the cost, and easier for NFT holders to sell their NFT holdings.
        <br><br>
        Competition exists entirely on the blockchain and uses smart contract technology.
        <br>
        -Users can use their balance to purchase tickets
        <br>
        -Purchase of tickets will result in a lottery number
        <br>
        -Once the Competition's draw conditions are met, the Competition will stop selling tickets and the smart contract will automatically draw a winner.
        <br>
        -Once the winner has been selected, BITZING will automatically process the transfer of the prize to the winner.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How to create a Competition?",
        description: `As long as you have any one of the BITZING certified NFT series, you can create a Competition.
        <br><br>
        Because of the special mechanism of Competitions, first you need to transfer your NFT to your BITZING account, 
        then check your transferred NFT on the Wallet page under your account and click on the Create Competition button 
        to start creating a Competition.
        <br><br>
        BITZING supports two competition modes, limited time and limited quantity:
        <br><br>
        <span style="color:white">Limited Time Mode:</span> Set the total price and sale time, the system will generate 
        the entry ticket at a unit price of 0.0001ETH, purchase the entry ticket to get a free lottery number, when the 
        sale time is over, according to the sold entry ticket for the lottery, the user with the winning number lottery 
        ticket will get the NFT for free as a reward.
        <br><br>
        <span style="color:white">Limited ticket mode:</span> Set the total price and maximum sale time, the system will 
        generate the corresponding number of tickets according to the "total price/0.0001 ETH", when all tickets are sold, 
        the system will automatically conduct a lottery, and the NFT will be awarded according to the winning ID. It should 
        be noted that when the maximum sale time is reached, if the tickets are not sold out, BITZING will suspend the sale 
        and refund all purchasers.
        <br><br>
        The proceeds from the sale of admission tickets will be reduced by only 5% of the technical service fee, and the rest 
        will be the proceeds from the sale of the Competition creator.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How can I participate in Competition?",
        description: `First of all, you need to make sure you have sufficient balance under your account, then go to any 
        Competition details page, enter the number of tickets you want to buy, click on buy and finish the purchase of tickets, 
        you can also see the lottery number you have on the right side of the details page.
        <br><br>
        To ensure fairness, we limit the number of tickets a single user can purchase in each Competition to 
        "<span style="color:white">Total Price/0.0001ETH/4/span>".`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "Will someone definitely win the NFT in every competition?",
        description: `Yes. There will always be a guaranteed winner for the NFT draws.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "The Competition I entered isn’t full yet, when will it draw?",
        description: `All competitions will draw automatically when the required criteria are met.
        <br>
        Criteria can be timed or  max entries.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What are the odds of winning the Competition NFT?",
        description: `No, you are purchasing an entry ticket for the free prize draw. The entry ticket is an NFT that is 
        stored in your personal account and can be transferred out to your wallet.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
    ]
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    // 加载完成后调整高度
    for (let i = 0; i < this.FAQList.length; i++) {
      this.getHeight(i)
    }

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
      for (let i = 0; i < this.FAQList.length; i++) {
        this.getHeight(i)
      }
    })
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
