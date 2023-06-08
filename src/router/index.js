import { createRouter, createWebHistory } from "vue-router";
import { statisticsClick } from "@/services/api/user";
import { setSessionStore } from "@/utils";

//1. 定义要使用到的路由组件  （一定要使用文件的全名，得包含文件后缀名）
import Header from "../views/header/index.vue";
import Footer from "../views/footer/index.vue";
import Currency from "../views/virtualCurrency/index.vue";

const welcome = () => import("../views/welcome/index.vue");
const Home = () => import("../views/home/index.vue");
const Login = () => import("../views/login/index.vue");
const Register = () => import("../views/register/index.vue");
const Forgot = () => import("../views/forgot/index.vue");
const Airdrop = () => import("../views/Airdrop/index.vue");

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
];

// 3. 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 切换页面重置滚动位置
router.afterEach((to) => {
  const { query } = to;
  if (query && query.code) {
    // 保存邀请码到本地存储
    setSessionStore("invateCode", query.code);
    // 统计邀请链接打开数量
    statisticsClick({ code: query.code });
  }
  window.scrollTo(0, 0);
})

// 4. 导出router
export default router;
