import { createRouter, createWebHistory } from "vue-router";
import { statisticsClick } from "@/services/api/user";
import { setSessionStore } from "@/utils";
import { authIp } from '@/services/api/index';

//1. 定义要使用到的路由组件  （一定要使用文件的全名，得包含文件后缀名）
import Header from "../views/header/index.vue";
import Footer from "../views/footer/index.vue";

// const welcome = () => import("../views/welcome/index.vue");
const Home = () => import("../views/home/index.vue");
const MysteryBox = () => import("../views/mysteryBox/index.vue");
const Login = () => import("../views/login/index.vue");
const Register = () => import("../views/register/index.vue");
const Forgot = () => import("../views/forgot/index.vue");
const Airdrop = () => import("../views/Airdrop/index.vue");
const FAQ = () => import("../views/FAQ/index.vue");
const toIntercept = () => import("../views/1020/index.vue");

//2. 路由配置
const routes = [
  //redirect 重定向也是通过 routes 配置来完成，下面就是从 / 重定向到 /home
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    components: {
      default: Home,
      Header,
      Footer,
    },
  },
  {
    path: "/mysteryBox",
    name: MysteryBox,
    components: {
      default: MysteryBox,
      Header,
      Footer,
    },
  },
  {
    path: "/login",
    name: "Login",
    components: {
      default: Login,
    },
  },
  {
    path: "/register",
    name: "Register",
    components: {
      default: Register,
    },
  },
  {
    path: "/forgot",
    name: "Forgot",
    components: {
      default: Forgot,
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
  const { path } = to;
  const res = await authIp();
  if (res && res.code == 200) {
    if (res.data && !(path && path.indexOf("/1020") > -1)) {
      next({ name: "1020" });
      next();
      return
    } else {
      if (path && path.indexOf("/Airdrop/") > -1) {
        const code = path.replace("/Airdrop/", "")
        // 保存邀请码到本地存储
        setSessionStore("invateCode", code);
        // 统计邀请链接打开数量
        statisticsClick({ code: code });

        next({ name: "Airdrop" });
      } else {
        next();
      }
    }

    return
  }

  if (path && path.indexOf("/Airdrop/") > -1) {
    const code = path.replace("/Airdrop/", "")
    // 保存邀请码到本地存储
    setSessionStore("invateCode", code);
    // 统计邀请链接打开数量
    statisticsClick({ code: code });

    next({ name: "Airdrop" });
  } else {
    next();
  }

});

// 4. 导出router
export default router;
