<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">homePage</el-breadcrumb-item>
			<el-breadcrumb-item>rolesManage</el-breadcrumb-item>
			<el-breadcrumb-item>rolesList</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary">addRoles</el-button>
				</el-col>
			</el-row>
			<el-table :data="rolesList" border stripe>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbuttom',i1 === 0 ? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<el-row :class="[i2 ===0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
											{{item3.authName}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="name" prop="roleName"></el-table-column>
				<el-table-column label="namedesc" prop="roleDesc"></el-table-column>
				<el-table-column label="operate" width="300px">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit">edit</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete">delete</el-button>
						<el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog">assign</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				rolesList: []
			}
		},
		created() {
			this.getRolesList()
		},
		methods: {
			async getRolesList() {
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) {
					return this.$message.error('false')
				}
				this.$message.success('success')
				this.rolesList = res.data
				console.log(res)
			},
			async removeRightById(role,rightId) {
				const confirmResault = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err=>err)
				if(confirmResault!=='confirm'){
					return this.$message.info('cancel')
				}
				const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if(res.meta.status!==200){
					return this.$message.error('false to delete')
				}
				role.children = res.data
			},
			showSetRightDialog(){
				
			},
		}
	}
</script>

<style lang="less" scoped>
	.el-tag {
		margin-top: 7px;
	}

	.bdtop {
		border-top: 1px solid #eee;
	}

	.bdbuttom {
		border-bottom: 1px solid #eee;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
