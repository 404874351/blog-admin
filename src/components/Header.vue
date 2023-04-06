<template>

  <el-header
    style="padding: 0; height: 50px"
    class="border-bottom-solid text-black flex justify-between">
    <div class="flex">
      <div class="flex justify-center align-center bg-hover"  @click="handleMenuCollapse">
        <i class="text-xxl padding-lr cursor-pointer transition"
          :class="isCollapse ? 'el-icon-s-unfold text-blue' : 'el-icon-s-fold text-gray'"></i>
      </div>
      <div class="flex align-center margin-left">
        <el-breadcrumb >
          <el-breadcrumb-item v-for="(item, index) in routeList" :key="index">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>

      </div>
    </div>
    <div class="flex">
      <!-- 快捷功能栏 -->
      <div
        class="flex justify-center align-center bg-hover"
        @click="handleFullScreen"
      >
        <i class="el-icon-full-screen text-xxl padding-lr cursor-pointer"></i>
      </div>
      <!-- 头像区 -->
      <div class="flex justify-center align-center padding-lr">
        <el-dropdown class="block" @command="handleDropdownClick">
          <div class="flex justify-center align-center">
            <div v-if="$store.state.userInfo" class="text-gray margin-right">
              {{ $store.state.userInfo.nickname }}
            </div>
            <el-avatar
              shape="square"
              size="medium"
              :src="$store.state.userInfo.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            ></el-avatar>
            <i class="el-icon-caret-bottom margin-left-xs"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user-solid" command="navIndividual">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-remove" divided command="userLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-header>

</template>

<script>
import { logout } from "@/api/user.js";
import { exitFullScreen, enterFullScreen } from "@/utils/util.js";

export default {
  name: "Header",
  props: {
    isCollapse: Boolean,
    routeList: Array
  },
  data() {
    return {
      /**
       * 是否全屏
       */
      isFullScreen: false,
    };
  },
  created() {},
  methods: {
    /**
     * 菜单栏塌陷
     */
    handleMenuCollapse() {
      this.$emit("menuCollapse", null);
    },

    /**
     * 全屏切换
     */
    handleFullScreen() {
      if (this.isFullScreen) {
        exitFullScreen();
      } else {
        enterFullScreen();
      }
      this.isFullScreen = !this.isFullScreen;
    },

    /**
     * 下拉菜单点击
     */
    handleDropdownClick(command) {
      this[command]()
    },

    /**
     * 退出登录
     */
    userLogout() {
      logout({}).then(res => {
        // 跳转登录页
        this.$router.replace({ name: 'Login' })
      }).catch(err => {
        console.log(err);
      })
    },

    /**
     * 跳转个人页
     */
    navIndividual() {
      this.$store.commit('DEL_ACTIVE_MENU_INDEX')
      this.$router.push({ path: '/individual' })
    }
    
  },
};
</script>

<style lang="scss" scoped>
.bg-hover:hover {
  background-color: #f5f5f5;
}
</style>