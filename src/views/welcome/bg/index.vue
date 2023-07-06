<template>
  <div class="scene">
    <!-- <div class="delorean">
      <div class="mirror-left"></div>
      <div class="mirror-right"></div>
      <div class="delorean-cases">
        <div class="wheel-case-left"></div>
        <div class="wheel-case-right"></div>
        <div class="wheel-left"></div>
        <div class="wheel-right"></div>
      </div>
      <div class="delorean-top">
        <div class="top-lines-on-top"></div>
        <div class="top-lines-on-top right"></div>
        <div class="rear-window"></div>
        <div class="lights">
          <div class="lights-frame"></div>
          <div class="red-light-left"></div>
          <div class="red-light-right"></div>
          <div class="id-container">
            <div class="id"></div>
          </div>
          <div class="red-reflection"></div>
        </div>
        <div class="bumper-light-reflection"></div>
        <div class="bumper-light-reflection right"></div>
      </div>
      <div class="bumper">
        <div class="bumper-reflection"></div>
        <div class="bumper-logo"></div>
        <div class="bumper-hole-1"></div>
        <div class="bumper-hole-2"></div>
        <div class="bumper-sticker"></div>
        <div class="dashes"></div>
      </div>
      <div class="shadow"></div>
    </div> -->
    <div class="top">
      <div class="startails">
        <div class="startail-r"></div>
        <div class="startail-l"></div>
        <div class="startail-m"></div>
      </div>
      <div class="top-lines"></div>
      <div class="brand">
        <div class="triangle"></div>
        <div class="kode-text"></div>
      </div>
      <!-- <div class="sun"></div> -->
      <div class="palm small">
        <div class="trunk"></div>
        <div class="trunk-bottom"></div>
        <div class="leaf-1"></div>
        <div class="leaf-1-s"></div>
        <div class="leaf-2"></div>
        <div class="leaf-2-s"></div>
        <div class="leaf-3"></div>
        <div class="leaf-3-s"></div>
      </div>
      <div class="palm">
        <div class="trunk"></div>
        <div class="trunk-bottom"></div>
        <div class="leaf-1"></div>
        <div class="leaf-1-s"></div>
        <div class="leaf-2"></div>
        <div class="leaf-2-s"></div>
        <div class="leaf-3"></div>
        <div class="leaf-3-s"></div>
      </div>
    </div>
    <div class="bottom">
      <div class="m0"></div>
      <div class="m1"></div>
      <div class="m2"></div>
      <div class="bottom-overlay"></div>
    </div>
    <div id="stars"></div>
  </div>
</template>
<script>
export default {
  name: 'BgCanvas',

  mounted() {
    // const volume = document.getElementById('volume');
    requestAnimationFrame(this.render);
    // volume.addEventListener('pointerdown', () => this.volumeToggle());
    // volume.addEventListener('keydown', (e) => {
    //   if (e.code === 'Space' || e.code === 'Enter') {
    //     this.volumeToggle();
    //   }
    // });
    window.addEventListener('resize', () => requestAnimationFrame(this.render));
  },
  methods: {
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    },
    render() {
      const stars = document.getElementById('stars');
      stars.innerHTML = '';
      const w = window.innerWidth;
      const h = window.innerHeight;
      const starCount = this.getRandomInt(42, 100);
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const x = this.getRandomInt(0, w);
        const y = this.getRandomInt(0, h);
        star.style.setProperty('--x', `${x}px`);
        star.style.setProperty('--y', `${y}px`);
        stars.appendChild(star);
      }
    },
    // volumeToggle() {
    //   const volume = document.getElementById('volume');
    //   const audio = document.getElementById('synthwave-track');
    //   if (volume.classList.contains('playing')) {
    //     volume.classList.remove('playing');
    //     audio.pause();
    //   } else {
    //     volume.classList.add('playing');
    //     audio.play();
    //   }
    // },
  },
};
</script>
<style scoped>
@import './css/index.css';
</style>
