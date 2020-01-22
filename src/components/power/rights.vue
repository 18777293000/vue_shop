<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">homePage</el-breadcrumb-item>
			<el-breadcrumb-item>powerManage</el-breadcrumb-item>
			<el-breadcrumb-item>powerList</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card>
			<el-table :data="rightList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="power" prop="authName"></el-table-column>
				<el-table-column label="path" prop="path"></el-table-column>
				<el-table-column label="level" prop="level">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.level === '0'" type="success">level1</el-tag>
						<el-tag v-else-if="scope.row.level === '1'" type="warning">level2</el-tag>
						<el-tag v-else>level3</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				rightList:[]
			}
		},
		created(){
			this.getRightsList()
		},
		methods:{
			async getRightsList(){
				const {data:res} = await this.$http.get('rights/list')
				if(res.meta.status!== 200){
					return this.$message.error('false')
				}
				this.$message.success('success')
				this.rightList = res.data
			}, 
		}
	}
</script>

<style lang="less" scoped>
</style>
