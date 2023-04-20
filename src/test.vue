<template>
    <div id="app">
      <button @click="testFunction">testFunction</button>
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
  </template>
  
  <script>
  import HelloWorld from './components/HelloWorld.vue'
  import Web3 from 'web3';
  
  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    methods: {
      async testFunction() {
        const web3 = new Web3(window.ethereum);
        const gasLimit = 200000;
  
        const ABI = [{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address payable","name":"receiver","type":"address"},{"internalType":"string","name":"orderId","type":"string"}],"name":"transferETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"string","name":"orderId","type":"string"}],"name":"transferToken","outputs":[],"stateMutability":"nonpayable","type":"function"}];
        const contractAddress = "0x22BCd7cB7bDB713CeFB5080f51C8f0ef830678AA";
        // const contractAddress = "0x1c79Eb76F96B642F5712f1f43e9b988021C86488";
        const c = new web3.eth.Contract(ABI, contractAddress);
  
        const amount = web3.utils.toWei('0.001', 'ether')
        const receiver = '0x9452b471E3B9B4Afb4C32F2Ed977B89ee1084dd2'
        const orderId = '34567'
  
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
  
        console.log(amount, gasLimit)
  
      //  const gas = await contractInstance.methods.transferETH(
      //     amount, receiver, orderId
      //   ).estimateGas({
      //     from: accounts[0],
      //     to: contractAddress,
      //     gasLimit,
      //     value: amount
      //   })
  
      // console.log(accounts[0])
        
        await c.methods.transferETH(
          amount, receiver, orderId
        ).send({
          from: accounts[0],
          to: contractAddress,
          // gasLimit,
          // gas: gas,
          value: amount
        })
      }
    }
  }
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  </style>
  