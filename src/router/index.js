import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)


const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes : [
    {
      path: "/",
      redirect:'login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: 'welcome',
      children:[
        {
          path:'/welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:Users
        }
      ]
    }

  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 表示放行函数
      //    next()放行  next('/xx')强制跳转
  if(to.path === '/login') return next();
  //获取token
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})

//解决vue3.0在重复点击路由时报红的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
