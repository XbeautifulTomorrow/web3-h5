<template>
  <div class="contents-info public-width">
    <div class="home-public-title">
      <img src="@/assets/img/home/contents.png" alt="" />
    </div>
    <table class="contents-info-table">
      <thead>
        <tr>
          <th>
            <div class="boxes-button">
              <span class="boxes-button-text">
                Otherdeed for Otherside Box
              </span>
              <img
                class="contents-info-down"
                src="@/assets/img/home/icon-arrowdown.png"
                alt=""
              />
            </div>
          </th>
          <th>Collections</th>
          <th>Price</th>
          <th>USD Price</th>
          <th>Recommended</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="table-box">
              <img class="table-box-img" src="" alt="" />
              <span class="table-box-text"># 1916</span>
            </div>
          </td>
          <td>
            <div class="table-other">
              <span class="table-box-text">Beanz</span>
            </div>
          </td>
          <td>
            <div class="table-other">
              <span class="table-price-text">28.4 ETH</span>
            </div>
          </td>
          <td>
            <div class="table-other">
              <span class="table-box-text">$ 6446.7</span>
            </div>
          </td>
          <td>
            <div class="table-other">
              <span class="table-box-text">Free Mytery Box</span>
            </div>
          </td>
          <td>
            <div class="table-other">
              <img src="@/assets/img/home/icon-chickdefault.png" alt="" />
              <!-- <img src="@/assets/img/home/icon-chickhover.png" alt="" /> -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ContentsInfo',
  data() {
    return {
      tickets: [],
    };
  },
};
</script>
<style lang="scss" scoped>
.contents-info-table {
  width: 100%;
  border: none;
  thead {
    font-size: 18px;
    color: #a896b5;
    height: 96px;
    th {
      border-bottom: 2px solid #33334b;
    }
  }
  td {
    height: 64px;
  }
}
.contents-info-down {
  height: 24px;
  width: 24px;
  margin-left: 8px;
}
.table-box,
.table-other {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
}
.table-box {
  justify-content: start;
}
.table-box-img {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  margin-right: 24px;
}
.table-box-text {
  background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
  font-size: 18px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.table-price-text {
  background-image: linear-gradient(
    to bottom,
    #c7c3cc 15%,
    #e2e3cf 30%,
    #d94ba5 67%
  );
  font-size: 18px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
