import { createRouter, createWebHistory } from 'vue-router';

//1. 定义要使用到的路由组件  （一定要使用文件的全名，得包含文件后缀名）
import Header from '../views/header/index.vue';
import Footer from '../views/footer/index.vue';

const welcome = () => import('../views/welcome/index.vue');
const Home = () => import('../views/home/index.vue');
const Login = () => import('../views/login/index.vue');
const Lottery = () => import('../views/lottery/index.vue');
const BlindBoxDetail = () => import('../views/blindBox/index.vue');

//2. 路由配置
const routes = [
  //redirect 重定向也是通过 routes 配置来完成，下面就是从 / 重定向到 /home
  {
    path: '/',
    redirect: '/welcome',
  },
  { path: '/welcome', component: welcome },
  {
    path: '/home',
    name: 'Home',
    components: {
      default: Home,
      Header,
      Footer,
    },
  },
  {
    path: '/login',
    name: 'Login',
    components: {
      default: Login,
    },
  },
  {
    path: '/lottery',
    name: 'Lottery',
    components: {
      default: Lottery,
    },
  },
  {
    path: '/blindBoxDetail',
    name: 'blindBoxDetail',
    components: {
      default: BlindBoxDetail,
      Header,
    },
  },
];

// 3. 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 4. 导出router
export default router;
