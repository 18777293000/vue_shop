<template>
	<el-container class="home-container">
		<el-header>
			<div>
				<img src="../assets/logo.png" />
				<span>manager control</span>
			</div>
			<el-button type="info" @click="logout">layout</el-button>
		</el-header>
		<el-container>
			<el-aside :width="isCollapse ? '64px' : '200px'">
				<div class="taggla-button" @click="taggleCollapse">|||</div>
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#4089ef" :unique-opened="true" :collapse="isCollapse"
				 :collapse-transition="false" router :default-active="activePath">
					<el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
						<template slot="title">
							<i class="el-icon-location"></i>
							<span>{{item.authName}}</span>
						</template>
						<el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path + '')">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{subItem.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [],
				isCollapse: false,
				activePath:''
			}
		},
		created() {
			this.getMenuList(),
			this.activePath = window.sessionStorage.getItem('activePath')
		},
		methods: {
			logout() {
				window.sessionStorage.clear();
				this.$router.push('/login');
				//console.log(3, this);
			},
			async getMenuList() {
				const {
					data: res
				} = await this.$http.get('menus')
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.menuList = res.data
				//console.log(4, res)
			},
			taggleCollapse() {
				this.isCollapse = !this.isCollapse
			},
			saveNavState(activePath){
				window.sessionStorage.setItem('activePath',activePath)
				this.activePath = activePath
			}
		}
	}
</script>

<style lang="less" scoped>
	.home-container {
		height: 100%;
	}

	.el-header {
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #fff;
		font-size: 20px;

		>div {
			display: flex;
			align-items: center;

			span {
				margin-left: 15px;
			}
		}
	}

	.el-aside {
		background-color: #333744;

		.el-menu {
			border-right: 0px;
		}
	}

	.el-main {
		background-color: #eaedf1;
	}

	.taggla-button {
		background-color: #4a5064;
		font-size: 10px;
		line-height: 24px;
		color: #fff;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>
