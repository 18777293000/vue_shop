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
			<el-table-column label="operate">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog(scope.row.id)"></el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
					<el-button type="danger" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
		 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>

		<el-dialog title="Add User" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
				<el-form-item label="username" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="password" prop="password">
					<el-input v-model="addForm.password" type="password"></el-input>
				</el-form-item>
				<el-form-item label="email" prop="email">
					<el-input v-model="addForm.email"></el-input>
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

		<el-dialog title="edituser" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
				<el-form-item label="username">
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="email" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="mobile" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="assing role" :visible.sync="setRoleDialogVisible" 
		width="50%" @close="setRoleDialongClosed">
			<div>
				<p>nowuser:{{userInfo.username}}</p>
				<p>nowuser:{{userInfo.role_name}}</p>
				<p>assign new role:
					<el-select v-model="selectedRoleId" placeholder="请选择">
						<el-option v-for="item in rolesList" 
						:key="item.id" 
						:label="item.roleName" 
						:value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRoleDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveRoleInfo">确 定</el-button>
			</span>
		</el-dialog>
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
				editDialogVisible: false,
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				editForm: {},
				addFormRules: {
					username: [{
							required: true,
							message: '请输入name',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '3~10',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入passwprd',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '6~15',
							trigger: 'blur'
						}
					],
					email: [{
						required: true,
						message: '请输入mail',
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请输入mobile',
						trigger: 'blur'
					}]
				},
				editFormRules: {
					email: [{
						required: true,
						message: 'input email',
						trigger: 'blur'
					}, ],
					mobile: [{
						required: true,
						message: 'input mobile',
						trigger: 'blur'
					}, ]
				},
				setRoleDialogVisible: false,
				userInfo: {},
				rolesList: [],
				selectedRoleId:'',
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
				//console.log(5, res)
			},
			handleSizeChange(newSize) {
				//console.log(6, newSize)
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getUserList()
			},
			async userStateChange(userInfo) {
				//console.log(7, userInfo)
				const {
					data: res
				} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
				if (res.meta.status !== 200) {
					userInfo.mg_state = !this.userInfo.mg_state
					return this.$message.error(res.meta.msg)
				}
				this.$message.success('update success')
				//console.log(7, userInfo)
			},
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
			},
			addUser() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.post('users', this.addForm)
					if (res.meta.status !== 201) {
						return this.$message.error('false')
					}
					this.$message.success('success')
					this.addDialogVisible = false
					this.getUserList()
				})
			},
			async showDialog(id) {
				// console.log(id)
				const {
					data: res
				} = await this.$http.get('users/' + id)
				if (res.meta.status !== 200) {
					return this.$message.error('false')
				}
				this.editForm = res.data
				this.editDialogVisible = true
			},
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			editUserInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return this.$message.error('false')
					const {
						data: res
					} = await this.$http.put('users/' + this.editForm.id, {
						email: this.editForm.email,
						mobile: this.editForm.mobile
					})
					if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
					this.editDialogVisible = false
					this.getUserList()
					this.$message.success('success')
				})
			},
			async removeUserById(id) {
				const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('cancel delete')
				}
				const {
					data: res
				} = await this.$http.delete('users/' + id)
				if (res.meta.status !== 200) {
					this.$message.error('delete false')
				}
				this.$message.success('delete complete')
				this.getUserList()
			},
			async setRole(userInfo) {
				this.userInfo = userInfo
				const{
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
				this.rolesList = res.data
				this.setRoleDialogVisible = true
			},
			async saveRoleInfo(){
				if(!this.selectedRoleId){
					return this.$message.error('choose new role')
				}
				const{data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
				if(res.meta.status!==200){return this.$message.error('false')}
				this.$message.success('success')
				this.getUserList()
				this.setRoleDialogVisible = false
			},
			setRoleDialongClosed(){
				this.selectedRoleId = ''
				this.userInfo = ''
			},
		}
	}
</script>

<style lang="less" scoped>
	.el-card {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
	}
</style>
