<template>
   <Bg />
   <CardHome />
 </template>
 
 <script>
 import CardHome from './cardHome.vue';
 import Bg from './bg/index.vue';
 
 export default {
   name: 'WelcomePage',
   components: {
     CardHome,
     Bg,
   },
 };
 </script>
 
 <style>
 .bg {
   position: fixed;
   top: 0;
   left: 0;
   z-index: -1;
 }
 </style>
 