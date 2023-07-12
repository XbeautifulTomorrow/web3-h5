<template>
  <div class="result-link">
    <img class="result-link-img" src="@/assets/img/lottery/fair.png" alt="" />
    <img
      class="result-link-line"
      src="@/assets/img/lottery/Line14.png"
      alt=""
    />
    <p class="result-link-text">
      The lottery process is running on the <br />
      blockchain, please be patient.
    </p>
  </div>
</template>
<style lang="scss" scoped>
.result-link {
  width: 20rem;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-around;
  flex-grow: 0;
  padding: 10px 20px;
  border-radius: 0.625rem;
  margin: 0 auto;
  background-color: #2761f5;
}
.result-link-img {
  width: 2.5rem;
  height: 2.5rem;
}
.result-link-line {
  padding: 0 0.625rem;
}
.result-link-text {
  color: #a9a4b4;
  text-align: left;
}
</style>
