<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">homePage</el-breadcrumb-item>
			<el-breadcrumb-item>goodmanage</el-breadcrumb-item>
			<el-breadcrumb-item>categories</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCateDialog">add category</el-button>
				</el-col>
			</el-row>

			<tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
			 show-index index-text="#" border :show-row-hover="false">
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
					<i class="el-icon-error" v-else></i>
				</template>
				<template slot="order" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level ===0" size="mini">first</el-tag>
					<el-tag v-else-if="scope.row.cat_level===1" type="success" size="mini">second</el-tag>
					<el-tag v-else type="warning" size="mini">three</el-tag>
				</template>
				<template slot="operate" slot-scope="scope">
					<el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
					<el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
				</template>
			</tree-table>

			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[3, 5, 9, 12]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

		<el-dialog @close="addCateDialogClosed" title="addCategory" :visible.sync="addCatedialogVisible" width="50%">
			<el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
				<el-form-item label="cateName:" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="fatherCate:">
					 <el-cascader
					    v-model="selectedKey"
					    :options="parentCateList"
					    expand-trigger="hover"
					    @change="parentCateChange"
						:props="cascaderProps"
						:clearable="true"
						change-on-select>
						</el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCatedialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				queryInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				cateList: [],
				total: 0,
				columns: [{
					label: 'cateName',
					prop: 'cat_name'
				}, {
					label: 'ture-or-false',
					type: 'template',
					template: 'isok'
				}, {
					label: 'order',
					type: 'template',
					template: 'order'
				}, {
					label: 'operate',
					type: 'template',
					template: 'operate'
				}],
				addCatedialogVisible: false,
				addCateForm:{
					cat_name:'',
					cat_pid:0,
					cat_level:0
				},
				addCateFormRules:{
					cat_name:[
						 { required: true, message: '请输入cate名称', trigger: 'blur' },
					],
				},
				parentCateList:[],
				cascaderProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				selectedKey:[],
			}
		},
		created() {
			this.getcateList()
		},
		methods: {
			async getcateList() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: this.queryInfo
				})
				if (res.meta.status != 200) {
					return this.$message.error('failue')
				}
				this.cateList = res.data.result,
					this.total = res.data.total
			},
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getcateList()
			},
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getcateList()
			},
			showAddCateDialog() {
				this.getParentCateList()
				this.addCatedialogVisible = true
			},
			async getParentCateList(){
				const {data:res} = await this.$http.get('categories',{
					params:{type:2}
					})
				if(res.meta.status !== 200){
					return this.$message.error('false')
				}
				// console.log(res.data)
				this.parentCateList = res.data
			},
			parentCateChange(){
				console.log(this.selectedKey)
				if(this.selectedKey.length > 0){
					this.addCateForm.cat_pid = this.selectedKey[this.selectedKey.length-1]
					this.addCateForm.cat_level = this.selectedKey.length
					return
				}else{
					this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0
				}
			},
			addForm(){
				 this.$refs.addCateFormRef.validate(async valid=>{
					if(!valid)return
					const {data:res} = await this.$http.post('categories',
					this.addCateForm)
					if(res.meta.status!==201){
						return this.$message.error('false')
					}
					this.$message.success('success')
					this.getcateList()
					this.addCatedialogVisible = false
				})
			},
			addCateDialogClosed(){
				this.$refs.addCateFormRef.resetFields()
				this.selectedKey = []
				this.addCateForm.cat_level = 0
				this.addCateForm.cat_pid = 0
			},
		}
	}
</script>

<style lang="less" scoped>
	.treeTable {
		margin: 15px;
	}
	.el-cascader{
		width: 100%;
	}
</style>
