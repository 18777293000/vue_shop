<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">homePage</el-breadcrumb-item>
			<el-breadcrumb-item>userManager</el-breadcrumb-item>
			<el-breadcrumb-item>activeList</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row :gutter="20">
				<el-col :span="9">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button @click="addDialogVisible = true" type="primary">add user</el-button>
				</el-col>
			</el-row>
		</el-card>

		<el-dialog title="Add User" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
				<el-form-item label="UserName" prop="userName">
					<el-input v-model="addForm.userName"></el-input>
				</el-form-item>
				<el-form-item label="Password" prop="passWord">
					<el-input v-model="addForm.passWord" type="password"></el-input>
				</el-form-item>
				<el-form-item label="Mail" prop="Mail">
					<el-input v-model="addForm.Mail"></el-input>
				</el-form-item>
				<el-form-item label="mobile" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">Cancel</el-button>
				<el-button type="primary" @click="addUser">Sure</el-button>
			</span>
		</el-dialog>

		<el-table :data="userList" border stripe>
			<el-table-column type="index"></el-table-column>
			<el-table-column label="name" prop="username"></el-table-column>
			<el-table-column label="mail" prop="email"></el-table-column>
			<el-table-column label="phone" prop="mobile"></el-table-column>
			<el-table-column label="role" prop="role_name"></el-table-column>
			<el-table-column label="status">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column label="operate"></el-table-column>
		</el-table>

		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
		 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 2
				},
				userList: [],
				total: 0,
				addDialogVisible: false,
				addForm:{
					userName:'',
					passWord:'',
					Mail:'',
					mobile:''
				},
				addFormRules:{
					userName:[
						 { required: true, message: '请输入name', trigger: 'blur' },
						 {min:3,max:10,message:'3~10',trigger:'blur'}
					],
					passWord:[
						{ required: true, message: '请输入passwprd', trigger: 'blur' },
						{min:6,max:15,message:'6~15',trigger:'blur'}
					],
					Mail:[
						{ required: true, message: '请输入mail', trigger: 'blur' }
					],
					mobile:[
						{ required: true, message: '请输入mobile', trigger: 'blur' }
					]
				}
			}
		},
		created() {
			this.getUserList()
		},
		methods: {
			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.userList = res.data.users
				this.totla = res.data.total
				console.log(5, res)
			},
			handleSizeChange(newSize) {
				console.log(6, newSize)
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getUserList()
			},
			async userStateChange(userInfo) {
				console.log(7, userInfo)
				const {
					data: res
				} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
				if (res.meta.status !== 200) {
					userInfo.mg_state = !this.userInfo.mg_state
					return this.$message.error(res.meta.msg)
				}
				this.$message.success('update success')
				console.log(7, userInfo)
			},
			addDialogClosed(){
				this.$refs.addFormRef.resetFields()
			},
			addUser(){
			        this.$refs.addFormRef.validate(async valid=>{
					if(!valid) return this.$message.error('false')
					const {data:res} = await this.$http.post('users',this.addForm)
					if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
					this.$message.success('add user success')
					this.addDialogVisible = false
					this.getUserList()
					console.log(10)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-card {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	}
</style>
