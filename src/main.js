import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//引入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL= 'http://192.168.1.39:8888/api/private/v1'
axios.interceptors.request.use(config=>{
  // console.log(config)

  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
