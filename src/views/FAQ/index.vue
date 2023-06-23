<template>
  <div class="wrapper_bg">
    <div class="FAQ_wrapper">
      <div class="FAQ_title">
        <span>FREQUENTLY&nbsp;</span>
        <span>ASKED&nbsp;</span>
        <span>QUESTIONS</span>
      </div>
      <div class="FAQ_description">
        <p>If you have any questions for which you couldn't find an answer, you can ask our helpful community on Discord
          or submit a support ticket. We are here to assist you!</p>
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
      screenSize: null,
      FAQList: []
    }
  },
  methods: {
    getHeight(index) {
      let paddingV = new bigNumber(this.screenSize).multipliedBy(1.25);

      const textHeight = document.getElementById(`text-${index}`);
      if (this.screenWidth <= 950) {
        paddingV = 8;
      }

      const heightV = new bigNumber(textHeight && textHeight.clientHeight).plus(paddingV).plus(paddingV).div(this.screenSize);
      this.FAQList[index].minHeight = `${heightV}rem`;
    },
    getQueryRect(index) {
      let paddingV = new bigNumber(this.screenSize).multipliedBy(1.25);
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;

      const textHeight = document.getElementById(`text-${index}`).clientHeight;
      if (this.screenWidth <= 950) {
        paddingV = 8;
      }

      const heightV = new bigNumber(textHeight).plus(paddingV).plus(paddingV);

      const height = document.getElementById(`FAQ-${index}`).clientHeight;
      let totalHeight = new bigNumber(heightV).plus(height).div(this.screenSize).toString();
      this.FAQList[index].height = `${totalHeight}rem`;
      this.FAQList[index].isExpand = !this.FAQList[index].isExpand;
    },
    formatText(event) {
      return event.split(" ");
    },
    getSize(event) {
      const widths = +event;
      if (widths <= 950) {
        this.screenSize = 16;
      } else if (widths > 950 && widths < 1366) {
        this.screenSize = 10;
      } else if (widths > 1366 && widths < 1440) {
        this.screenSize = 12;
      } else if (widths > 1440 && widths < 1520) {
        this.screenSize = 14;
      } else if (widths > 1520) {
        this.screenSize = 16;
      }
    }
  },
  created() {
    this.FAQList = [
      {
        title: "What is BITZING?",
        description: `We are a Web3 mystery box lottery ecommerce platform that focuses on crypto assets. Here, you can 
        unbox incredible NFT prizes at an unbelievably low cost. Our aim is to stimulate more people from non-NFT circles 
        to enter the marketplace by providing a humanized and entertaining experience. This, in turn, expands the liquidity 
        of NFT and crypto asset trading as a whole.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What are NFTs?",
        description: `Non-Fungible Tokens (NFTs) are cryptocurrency tokens that represent scarce, digital collectibles which are also 
        indivisible and unique. The term ‘non-fungible’ just means that the tokens are distinguishable from each other and cannot be 
        interchanged..
        <br><br>
        BITZING is excited to offer various NFT features, including the NFT Mystery Box (the world's first NFT Mystery Box marketplace) 
        and Competitions. We also provide the ability to deposit and withdraw NFTs, along with a gas-less NFT marketplace.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What is Bitzing Mystery Box?",
        description: `Mystery Box is one of Bitzing's primary methods of selling NFTs. Each mystery box has a predetermined probability 
        of containing NFTs from exclusive brands, such as Mutant Ape Yacht Club. Every time you open a new mystery box, a random spinner 
        will determine which NFT you receive. After unboxing your NFT, it is added to your account inventory. These items are authentic, 
        and you can claim them to your wallet at any time.
        <br><br>
        If you are not satisfied with the NFT you receive, you can resell it at its current value for a small percentage fee, 
        and the proceeds from the sale will be credited to your account immediately.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How to purchase a Mystery box?",
        description: `To enhance your out-of-the-box experience, you need to transfer cryptocurrencies to your account balance first. 
        You can then use your balance to make purchases. Your account balance can be withdrawn to your wallet at any time.
        <br><br>
        Currently, we only support ETH and USDT, but we plan to support more cryptocurrencies in the future.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How do i view the NFT I have unboxed?",
        description: `Once you have opened the box, you have 60 seconds to decide whether to keep the NFT or sell it immediately. If no 
        decision is made within 60 seconds, we will automatically sell the NFT on your behalf. If you choose to sell it, we will deduct 
        a percentage for royalties and service charges, and transfer the remaining amount to your balance. If you decide to keep the NFT, 
        it will be automatically added to your account inventory, which you can access through the 'Wallet' tab on the website. From there, 
        you can view all the NFTs you currently own and withdraw them to your wallet at any time.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How to withdraw NFT to my wallet?",
        description: `Click on your profile picture and select "Wallet". Here, you can view all the NFTs in your account. To withdraw your 
        NFTs to your wallet, click on the "Withdraw" button located below each NFT and proceed with the payment of the applicable gas fee. 
        To optimize your gas fees, we recommend withdrawing multiple NFTs simultaneously instead of doing it one by one.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "Crypto deposit and withdrawal.",
        description: `If you are dissatisfied with your unboxed NFT, you have the option to sell it. After deducting a percentage for royalties 
        and service fees, the remaining amount will be transferred to your balance. To withdraw your cryptocurrency, navigate to your profile 
        picture and select ""Wallet"". From there, you can view your account balance and initiate a withdrawal by clicking on the corresponding button. 
        <br><br>
        Please note that crypto withdrawals are subject to a processing fee, which will be discounted after your request.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "Do I get rewarded for telling my friends about BITZING?",
        description: `Certainly! Bitzing offers a competitive Referral Program that allows you to earn money if you have influence within the 
        NFT community or simply want to share the website with a few friends. By sending your referral link to your friends, you can earn a 
        commission for each purchase they make. To learn more, click on your profile and navigate to the Referral section.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How do I open a mystery box?",
        description: `First, ensure that you have a sufficient balance in your account. Your account balance should be greater than or equal 
        to the cost of the box you wish to open. Once you have confirmed your balance, click on the desired box, and you will be directed to 
        the unboxing window. Finally, click the "Unbox" button to open the box.`,
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
        description: `BITZING constantly reviews the value of each NFT and ensures they are kept up to date. However, the value of certain 
        NFTs can be volatile, resulting in fluctuations in the contents of the box.
        <br><br>
        At BITZING, the value of the item you acquire from a box follows the ""value acquired"" rule. If you acquire an item worth 1 ETH and 
        its price increases by more than 1 ETH, you will not be able to obtain it. However, we will compensate you by refunding 100% of the 
        value of the item at the time of acquisition. It is important to note that holding NFTs as assets may carry risks, as their value can 
        decrease. Therefore, we recommend exchanging and selling them promptly to avoid potential losses.
        <br><br>
        If you wish to hold NFTs for future use, we advise reselling them as they maintain a fixed value.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How do we ensure fairness?",
        description: `To ensure transparency and openness, BITZING takes a snapshot of the Mystery Box contents whenever they change. On the 
        Mystery Box details page, you can find the snapshot information for a seven-day period. By reviewing the snapshot details, you can 
        discover the NFTs included in the Mystery Boxes and their corresponding reward IDs for each specific time period.
        <br><br>
        BITZING utilizes a lottery algorithm executed through a smart contract. This allows you to examine the precise logic of the smart 
        contract and verify the lottery results on the blockchain. You can compare the results with the reward IDs of the individual NFTs 
        in the snapshot, ensuring a transparent and accountable lottery process.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What is Competition?",
        description: `Competition is BITZING's innovative NFT sales model, which sets it apart from the traditional marketplace that relies 
        on fixed-price and auction sales. The competition model offers a unique approach that significantly lowers the purchase costs for 
        buyers, enabling them to acquire extraordinary NFTs at a fraction of their original value. Additionally, this model provides a 
        more accessible avenue for NFT holders to sell their NFT holdings.
        <br><br>
        Unlike the conventional methods, the competition model leverages a different mechanism:
        <br>
        - Users can participate in the competition by purchasing tickets using their account balance.
        <br>
        - Each ticket purchase assigns a unique lottery number
        <br>
        - Once the competition's predetermined draw conditions are met, ticket sales conclude, and a winner is automatically selected through the smart contract.
        <br>
        - BITZING's platform facilitates the seamless transfer of the prize to the winner.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How to create a Competition?",
        description: `As long as you have any of the BITZING certified NFT series, you can create a Competition.
        <br><br>
        To create a Competition, you need to transfer your NFT to your BITZING account. Once the transfer is complete, you can check 
        your transferred NFT on the Wallet page within your account. From there, click on the ""Create Competition"" button to start 
        the process.
        <br><br>
        BITZING supports two competition modes: limited time and limited quantity.
        <br><br>
        <span style="color:white">Limited Time Mode:</span>  In this mode, you can set the total price and sale time. The system will 
        generate entry tickets at a unit price of 0.0001 ETH. Participants can purchase these entry tickets to receive a free lottery 
        number. When the sale time concludes, a lottery will be conducted based on the number of entry tickets sold. The user possessing 
        the winning lottery ticket number will receive the NFT as a free reward.
        <br><br>
        <span style="color:white">Limited Quantity Mode:</span> In this mode, you can set the total price and maximum sale time. The 
        system will generate a corresponding number of tickets calculated as ""total price/0.0001 ETH"". Once all tickets are sold, the 
        system will automatically conduct a lottery, and the NFT will be awarded based on the winning ticket ID. Please note that if the 
        maximum sale time is reached without all tickets being sold, BITZING will suspend the sale and refund all purchasers.
        <br><br>
        The proceeds from the sale of admission tickets will only incur a 5% deduction as the technical service fee, while the remaining 
        amount will serve as the proceeds for the Competition creator.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "How can I participate in Competition?",
        description: `First of all, please ensure that you have a sufficient balance in your account. Then, navigate to the details page 
        of any Competition. Enter the desired number of tickets you wish to purchase, click on ""Buy,"" and proceed to complete the ticket 
        purchase. On the right side of the details page, you can view the lottery number assigned to you.
        <br><br>To maintain fairness, we have implemented a limit on the number of tickets a single user can purchase in each Competition. The limit is calculated as 
        "<span style="color:white">Total Price/0.0001ETH/4<span>".`,
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
        The criteria can be based on timing or the maximum number of entries.`,
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: "What are the odds of winning the Competition NFT?",
        description: `You are purchasing an entry ticket for the free prize draw. The entry ticket is an NFT that is stored in your 
        personal account and can be transferred to your wallet.`,
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
    this.getSize(that.screenWidth);

    // 加载完成后调整高度
    for (let i = 0; i < this.FAQList.length; i++) {
      this.getHeight(i)
    }

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
      this.getSize(that.screenWidth);

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
