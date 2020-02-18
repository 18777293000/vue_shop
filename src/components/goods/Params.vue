<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">homePage</el-breadcrumb-item>
			<el-breadcrumb-item>goodsManage</el-breadcrumb-item>
			<el-breadcrumb-item>paramenterList</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-alert show-icon :closable="false" title="注意:只允许第三季分类" type="warning"></el-alert>
			<el-row class="cate_opt">
				<el-col>
					<span style="margin-right: 10px;">choose Goods category:</span>
					<el-cascader
					    v-model="selectCateKeys"
					    :options="cateList"
					    :props="catProps"
					    @change="handleChange"
						expandTrigger="hover">
					</el-cascader>
				</el-col>
			</el-row>
			
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<el-tab-pane label="动态参数" name="first">
					<el-button type="primary" size="mini" :disabled="isBtnDisable">添加参数</el-button>
				</el-tab-pane>
				<el-tab-pane label="静态属性" name="second">
					<el-button type="primary" size="mini" :disabled="isBtnDisable">添加属性</el-button>
				</el-tab-pane>
			</el-tabs>
			
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				cateList:[],
				catProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				selectCateKeys:[],
				activeName:'first',
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			async getCateList(){
				const{data:res} = await this.$http.get('categories')
				if(res.meta.status !== 200){
					return this.$message.error('error')
				}
				this.cateList = res.data
			},
			handleChange(){
				if(this.selectCateKeys.length !== 3){
					return this.selectCateKeys = [] 
				}
			},
			handleTabClick(){
			},
		},
		computed:{
			isBtnDisable(){
				if(this.selectCateKeys.length !== 3){
					return true
				}
				return false
			}
		},
	}
</script>

<style lang="less" scoped>
	.cate_opt {
		margin: 15px 0;
	}
</style>
