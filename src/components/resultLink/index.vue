<template>
  <div class="result-link">
    <img class="result-link-img" src="@/assets/img/lottery/fair2.png" alt="" />
    <img class="result-link-line" src="@/assets/img/lottery/Line14.svg" alt="" />
    <p class="result-link-text">
      The unboxing results are being calculated on<br />
      the blockchain, so please be patient.
    </p>
  </div>
</template>
<style lang="scss" scoped>
.result-link {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-around;
  flex-grow: 0;
  padding: 10px 20px;
  border-radius: 0.625rem;
  margin: 0 auto;
  border: solid 1px #11cde9;
}
.result-link-img {
  width: 2.5rem;
  height: 2.5rem;
}
.result-link-line {
  padding: 0 0.625rem;
}
.result-link-text {
  color: #11cde9;
  text-align: left;
}
@media screen and (max-width: 950px) {
  .result-link-box {
    min-width: 12.6875rem;
    margin: 0 0.625rem;
    margin-top: 1.25rem;
    .result-link {
      padding: 0.625rem;
      border-radius: 0.5rem;
    }
    .result-link-img {
      width: 1.5rem;
      height: 1.5rem;
    }
    .result-link-line {
      padding: 0.625rem;
      height: 1.5rem;
    }
    .result-link-text {
      font-size: 0.5rem;
    }
  }
}
</style>
