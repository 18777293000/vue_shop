import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use((config)=>{
	console.log(4,config);
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: w => w(App)
}).$mount('#app')
