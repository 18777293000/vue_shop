<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../assets/logo.png" />
			</div>
			<el-form ref="loginFormRef" class="login_form" label-width="0px" :model="login_Form" :rules="loginFormRules">
				<el-form-item prop="username">
					<el-input 
					prefix-icon="el-icon-headset" 
					v-model="login_Form.username" 
					placeholder="用户名">
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input prefix-icon="el-icon-loading" v-model="login_Form.password" placeholder="密码" type="password">
					</el-input>
				</el-form-item>
				<el-form-item class="btn_s">
					<el-button type="primary" @click="login">login</el-button>
					<el-button type="info" @click="resetLoginForm">cannel</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				login_Form: {
					username: 'admin',
					password: '123456'
				},
				loginFormRules: {
					username: [{
						required: true,
						message: 'reuqireloginname',
						trigger: 'blur'
					}, {
						min: 3,
						max: 10,
						message: '长度在 3 到 10 个字符',
						trigger: 'blur'
					}],
					password:[{
						required: true,
						message: 'reuqireloginpassword',
						trigger: 'blur'
					}, {
						min: 6,
						max: 15,
						message: '长度在 6 到 15 个字符',
						trigger: 'blur'
					}],
				}
			};
		},
		methods:{
			resetLoginForm(){
				this.$refs.loginFormRef.resetFields();
				console.log(1,this);
			},
			login(){
				this.$refs.loginFormRef.validate(async valid=>{
					if(!valid) return;
					const {data:res} = await this.$http.post('login',this.login_Form);
					console.log(2,res);
					if(res.meta.status !== 200)return this.$message.error('faliue');
					this.$message.success('success');	
					console.log(res);
					window.sessionStorage.setItem('token',res.data.token);
					this.$router.push('/home');
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.login_container {
		background-color: #2b4b6b;
		height: 100%;
	}

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 3px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.avatar_box {
			height: 130px;
			width: 130px;
			border: 1px solid #e2e;
			border-radius: 50%;
			padding: 10px;
			box-shadow: 0 0 10px #ddd;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #fff;

			img {
				height: 100%;
				width: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}
	}

	.btn_s {
		display: flex;
		justify-content: flex-end;
	}

	.login_form {
		position: absolute;
		bottom: 0px;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}
</style>
