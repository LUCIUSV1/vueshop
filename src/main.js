import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

//引入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL= 'http://119.23.53.78:8888/api/private/v1'
// axios.defaults.baseURL= 'http://81.70.29.4:8888/api/private/v1'
// axios.defaults.baseURL= 'http://192.168.1.99:8888/api/private/v1'
axios.interceptors.request.use(config=>{
  // console.log(config)

  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
