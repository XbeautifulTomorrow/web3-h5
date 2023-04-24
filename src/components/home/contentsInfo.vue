<template>
  <div class="contents-info public-width">
    <div class="home-public-title">
      <img src="@/assets/img/home/contents.png" alt="" />
    </div>
    <table class="contents-info-table">
      <thead>
        <tr>
          <th style="width: 212px">
            <div class="boxes-button">
              <span class="boxes-button-text">
                Otherdeed for Otherside Box
              </span>
              <img
                class="contents-info-down"
                src="@/assets/img/home/icon-arrowdown.png"
                alt=""
              />
              <div class="otherside-box">
                <div class="otherside-box-main">
                  <ul class="otherside-box-content">
                    <li
                      class="otherside-box-list"
                      v-for="(item, index) in othersideBox"
                      :key="`box-${index}`"
                      @click="othersideBoxFun(item)"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
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
      othersideBox: [
        'All',
        'Top Blue-chip Box',
        'Bored Ape Yacht Club Box',
        'Mutant Ape Yacht Club Box',
        'Otherdeed for Otherside Box',
        'Free Mytery Box',
      ],
    };
  },
  methods: {
    othersideBoxFun(item) {
      console.log(item);
    },
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
  tbody {
    tr {
      &:first-child {
        td {
          padding-top: 24px;
        }
      }
      &:last-child {
        td {
          padding-bottom: 24px;
        }
      }
    }
  }
  td {
    height: 64px;
  }
}
.boxes-button {
  cursor: pointer;
  position: relative;
  overflow: visible;
  &:hover {
    .otherside-box {
      transform: scaleY(1);
      opacity: 1;
    }
  }
}
.otherside-box {
  transform: scaleY(0);
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 16px;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  transition: transform 0.2s ease;
  transform-origin: top;
}
.otherside-box-main {
  padding: 0;
  border-radius: 12px;
  border-style: solid;
  border-width: 2px;
  border-image-source: linear-gradient(
    to bottom,
    #6ce1f9,
    #00669b 48%,
    #b770f4
  );
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #2d1942, #2d1942),
    linear-gradient(to bottom, #6ce1f9, #00669b 48%, #b770f4);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.otherside-box-content {
  padding: 8px;
}
.otherside-box-list {
  font-size: 18px;
  color: #a896b5;
  border-radius: 8px;
  padding: 0 8px;
  height: 40px;
  line-height: 40px;
  text-align: left;
  &:hover {
    color: #f5e1d6;
    background-color: rgba(168, 150, 181, 0.1);
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
