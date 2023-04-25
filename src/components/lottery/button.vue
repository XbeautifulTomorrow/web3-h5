<template>
  <div class="button" @click="handeleClick" :style="style">
    {{ text }}
  </div>
</template>
<script>
export default {
  name: 'ButtonCom',
  props: {
    text: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 35,
    },
    background: {
      type: String,
      default: 'linear-gradient(#1d7751, #0e382c)',
    },
    color: {
      type: String,
      default: '#fff',
    },
  },
  data() {
    return {
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`,
        background: this.background,
        color: this.color,
      },
    };
  },
  methods: {
    handeleClick() {
      this.$emit('click');
    },
  },
};
</script>
<style scoped>
.button {
  font-size: 12px;
  font-family: 'Rajdhani', sans-serif;
  text-align: center;
  /* border: 3px #25793b solid; */
  border-radius: 5px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  transition: 0.1s;
  transform: scale(1);
  cursor: pointer;
  /* box-shadow: 0 0 50px rgba(0, 117, 9, 0.5); */
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
}

.button:hover {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.button:active {
  background: linear-gradient(#1f8258, #114435);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  transform: scale(1);
  box-shadow: 0 0 75px rgba(43, 137, 68, 0.5);
}

.button:after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  display: block;
  width: 20%;
  height: 300%;
  background: rgba(255, 255, 255, 0.5);
  transform: rotate(35deg);
  -webkit-filter: blur(20px);
  transition: none;
}

.button:hover:after {
  left: 200%;
  transition: 0.4s ease-in-out;
}
</style>
