<template>
  <el-menu
    class="el-menu-vertical-demo text-cut side-nav-bar"
    :default-active="activeMenuIndex"
    :collapse="isCollapse"
    @select="handleMenuSelect"
  >
    <!-- logo -->
    <div style="height: 50px" class="flex align-center border-bottom-solid">
      <img src="@/assets/image/logo.png" width="45" class="padding-lr-sm" />
      <div class="text-xl text-blue text-bold">后台管理系统</div>
    </div>
    <!-- 菜单项 -->
    <div v-for="(item, index) in menu" :key="index">
      <!-- 一级菜单 -->
      <el-menu-item
        v-if="!item.children || !item.children.length"
        v-show="!item.hidden"
        :index="index + ''"
      >
        <i :class="item.icon"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
      <!-- 二级菜单 -->
      <el-submenu v-else v-show="!item.hidden" :index="index + ''">
        <template slot="title">
          <i :class="item.icon"></i>
          <span v-show="!isCollapse">{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="(subItem, subIndex) in item.children"
          :key="index + '-' + subIndex"
          v-show="!subItem.hidden"
          :index="index + '-' + subIndex"
        >
          <i :class="subItem.icon"></i>
          <span slot="title">{{ subItem.name }}</span>
        </el-menu-item>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
export default {
  name: "SideMenu",
  props: {
    isCollapse: Boolean,
    menu: Array,
    activeMenuIndex: String
  },
  data() {
    return {

    };
  },
  created() {

  },
  methods: {
    /**
     * 菜单栏选中
     */
    handleMenuSelect(index, indexPath) {
      // 获取选中的菜单项
      let indexList = index.split("-");
      let selectedMenuItem = this.menu[indexList[0]];
      if (indexList.length > 1) {
        selectedMenuItem = selectedMenuItem.children[indexList[1]];
      }

      // 选中当前页面，则不跳转
      if (this.$route.path == selectedMenuItem.path) {
        return
      }
      // 抛出选中菜单项
      this.$emit("menuSelect", { index, selectedMenuItem })
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
}

.side-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

*::-webkit-scrollbar {
  width: 0.5rem;
  height: 1px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}
</style>