<template>
	<div>
       <el-button type="info" @click="logout">layout</el-button>
	</div>
</template>

<script>
	export default{
		methods:{
			logout(){
				window.sessionStorage.clear();
				this.$router.push('/login');
				console.log(3,this);
			}
		}
	}
</script>

<style lang="less" scoped>
</style>
