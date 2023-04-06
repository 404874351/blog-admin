<template>
  <router-view />
</template>

<script>
import { userInfo } from "@/api/user.js";
import { adminMenuUserList } from "@/api/menu.js";
import { addRoutes } from "@/router/index.js";
import { getToken, getLoginStatus, setLoginStatus } from '@/utils/auth.js';

export default {
  created() {
    // token不存在，路由守卫直接跳转登录页
    const token = getToken()
    if (!token) {
      return
    }
    // 登录态存在，也不再获取
    const loginStatus = getLoginStatus()
    if (loginStatus.userInfo && loginStatus.menu) {
      return
    }
    // token存在，且登录态不存在，则重新获取登录态，用于页面刷新
    console.log("正在恢复登录态");
    this.recoverLoginStatus()
    
  },
  methods: {
    async recoverLoginStatus() {
      const loading = this.$loading({
        lock: true,
        text: '正在恢复登录',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      });
      try {
        // 获取用户信息和用户菜单
        let resList = await Promise.all([userInfo(), adminMenuUserList()])
        setLoginStatus(resList[0].data, resList[1].data)
        // 配置路由
        addRoutes(resList[1].data)
      } catch (err) {
        // 获取失败，则跳转登录页
        this.$router.push({ name: 'Login' })
      } finally {
        loading.close();
      }
      
    }
  }
}
</script>

<style lang="scss">
// 引入scss常用样式库
@import "./assets/css/common.css";
@import "./assets/css/transition.css";
@import "./assets/css/color.scss";

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: $--black;
}

body {
  margin: 0;
  height: 100%;
  width: 100%;
  min-width: 1000px;
}
</style>

