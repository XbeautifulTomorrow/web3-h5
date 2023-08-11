import { createRouter, createWebHistory } from "vue-router";
import { statisticsClick } from "@/services/api/user";
import { setSessionStore, getSessionStore } from "@/utils";
import { authIp } from '@/services/api/index';
import config from "@/services/env";

//1. 定义要使用到的路由组件  （一定要使用文件的全名，得包含文件后缀名）
import Header from "../views/header/index.vue";
import Footer from "../views/footer/index.vue";
import Currency from "../views/virtualCurrency/index.vue";

const welcome = () => import("../views/welcome/index.vue");
const Home = () => import("../views/home/index.vue");
const Lottery = () => import("@/components/lottery/index.vue");
const reffleBox = () => import("../views/mysteryBox/index.vue");
const reffleBoxesList = () => import("../views/home/mysteryBoxesList.vue");
const nftTicketsInfo = () => import("../views/home/nftTicketsInfo.vue");
const nftTicketsList = () => import("../views/home/nftTicketsList.vue");
const Snapshot = () => import("../views/snapshot/index.vue");
const Airdrop = () => import(/* webpackChunkName: "Airdrop" */ "../views/Airdrop/index.vue");
const FAQ = () => import(/* webpackChunkName: "FAQ" */ "../views/FAQ/index.vue");
const toIntercept = () => import(/* webpackChunkName: "1020" */ "../views/1020/index.vue");
const User = () => import(/* webpackChunkName: "user" */ "../views/user/index.vue");

//2. 路由配置
const routes = [
  //redirect 重定向也是通过 routes 配置来完成，下面就是从 / 重定向到 /home
  {
    path: "/",
    redirect: "/welcome",
  },
  { path: "/welcome", component: welcome },
  {
    path: "/home",
    name: "Home",
    components: {
      default: Home,
      Header,
      Footer,
      Currency,
    },
  },
  {
    path: "/reffleBox",
    name: "ReffleBox",
    components: {
      default: reffleBox,
      Header,
      Footer,
      Currency,
    },
  },
  {
    path: "/reffleBoxesList",
    name: "ReffleBoxesList",
    components: {
      default: reffleBoxesList,
      Header,
      Footer,
      Currency,
    },
  },
  {
    path: "/nftTicketsInfo",
    name: "NftTicketsInfo",
    components: {
      default: nftTicketsInfo,
      Header,
      Footer,
      Currency,
    },
  },
  {
    path: "/treasureDraws",
    name: "TreasureDraws",
    components: {
      default: nftTicketsList,
      Header,
      Footer,
      Currency,
    },
  },
  {
    path: "/lottery",
    name: "Lottery",
    components: {
      default: Lottery,
      Header,
      Footer,
      Currency,
    },
  },
  {
    path: "/snapshot",
    name: "Snapshot",
    components: {
      default: Snapshot,
      Header,
      Footer,
      Currency,
    },
  },
  {
    path: "/airdrop",
    name: "Airdrop",
    components: {
      default: Airdrop,
      Header,
      Footer
    },
  },
  {
    path: "/FAQ",
    name: "FAQ",
    components: {
      default: FAQ,
      Header,
      Footer
    },
  },
  {
    path: "/1020",
    name: "1020",
    components: {
      default: toIntercept
    },
  },
  {
    path: "/user/:id",
    name: "User",
    components: {
      default: User,
      Header,
      Footer,
      Currency,
    },
  },

];

// 3. 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 切换页面重置滚动位置
router.afterEach(() => {
  window.scrollTo(0, 0);
})

router.beforeEach(async (to, from, next) => {
  const { path, query } = to;
  let res = null;

  if (config.ENV == "dev" || config.ENV == "test") {
    res = {
      code: 200,
      data: false
    }
  } else {
    res = await authIp();
  }

  if (res && res.code == 200) {
    const isShield = res.data;
    if (isShield && !(path && path.indexOf("/1020") > -1)) {
      setSessionStore("referrer", path)
      next({ name: "1020" });
    } else if (!isShield && path && path.indexOf("/1020") > -1) {
      const referrer = getSessionStore("referrer");
      if (!referrer) {
        next({ name: "Home" });
      } else {
        sessionStorage.removeItem("referrer");
        next({ path: referrer });
      }
    }
  }

  if (path && path.indexOf("/Home/") > -1) {
    const code = path.replace("/Home/", "")
    // 保存邀请码到本地存储
    if (code) {
      setSessionStore("invateCode", code);
      // 统计邀请链接打开数量
      statisticsClick({ code: code });
    }

    next({ name: "Home" });
  }

  if (path && path.indexOf("/NftTicketsInfo/") > -1) {
    const code = path.replace("/NftTicketsInfo/", "");

    // 保存邀请码到本地存储
    if (code) {
      setSessionStore("invateCode", code);
      // 统计邀请链接打开数量
      statisticsClick({ code: code });
    }

    next({ name: "NftTicketsInfo", query: { id: query.id } });
  }
  // else if (path && path.indexOf("/Airdrop/") > -1) {
  //   const code = path.replace("/Airdrop/", "")
  //   // 保存邀请码到本地存储
  //   setSessionStore("invateCode", code);
  //   // 统计邀请链接打开数量
  //   statisticsClick({ code: code });

  //   next({ name: "Airdrop" });
  // }
  else {
    next();
  }
});

// 4. 导出router
export default router;
