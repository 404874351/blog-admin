<template>
  <div class="bg">
    <div class="login padding-tb-xl flex flex-direction justify-center">
      <div class="text-center text-blue text-bold text-sl margin-bottom-xl">后台管理系统</div>
      <div style="height: 60%" >
        <el-form ref="loginForm" :model="loginForm" :rules="formRules" >
          <el-form-item prop="username" class="form-item">
            <el-input prefix-icon="el-icon-user" placeholder="用户名" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" class="form-item">
            <el-input prefix-icon="el-icon-lock" placeholder="密码" v-model="loginForm.password" type="password" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
    
          <div class="text-center">
            <el-button type="primary" style="width: 80%;" :loading="loading" @click="submitForm('loginForm')">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login, userInfo } from "@/api/user.js";
import { adminMenuUserList } from "@/api/menu.js";
import { setToken, clearLoginStatus, setLoginStatus } from "@/utils/auth.js";
import { resetRouter, addRoutes } from "@/router/index.js";

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      loginForm: {
        username: "",
        password: "",
      },
      formRules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    // 进入登录页，则删除登录态，并初始化路由
    clearLoginStatus()
    resetRouter()

  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((isValid) => {
        if (!isValid) {
          return false
        }

        this.userLogin()
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async userLogin() {
      try {
        this.loading = true
        // 用户登录，并获取token
        let loginRes = await login({
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        setToken(loginRes.data.token)

        // 获取用户信息和用户菜单
        let resList = await Promise.all([userInfo(), adminMenuUserList()])
        setLoginStatus(resList[0].data, resList[1].data)
        
        // 配置路由
        addRoutes(resList[1].data)

        // 登录完毕，跳转首页
        this.$router.push({ path: "/" })
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }

    },
  },
};
</script>
<style scoped>
.bg {
  height: 100vh;
  width: 100vw;
  min-height: 500px;
  min-width: 1000px;
  background-image: url("../../assets/image/bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.form-item {
  margin: 0 auto;
  margin-bottom: 30px;
  width: 80%;
}

.bg >>> .el-input__icon {
  color: #409eff;
  transform: scale(1.2);
}

.login {
  position: fixed;
  background: linear-gradient(60deg, #ffffff40, #ffffffb0);
  top: 0;
  right: 0;
  width: 28%;
  min-width: 300px;
  height: 100%;
}
</style>