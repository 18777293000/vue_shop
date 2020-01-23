import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import Users from '../components/User/Users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'


Vue.use(VueRouter)

const router = new VueRouter({
	routes: [{
			path: '/login',
			component: Login
		},
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/home',
			component: Home,
			redirect:'/Welcome',
			children: [{
				path: '/Welcome',
				component: Welcome
			},{
				path:'/users',
				component:Users
			},{
				path:'/rights',
				component:Rights
			},{
				path:'/roles',
				component:Roles
			},{
				path:'/categories',
				component:Cate
			}]
		},
	]
});

router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next()
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) return next('/login')
	next()
});

export default router
