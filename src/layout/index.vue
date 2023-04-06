<template>
  <el-container>
    <!-- 左侧菜单栏 -->
    <el-aside width="auto">
      <SideMenu 
        :isCollapse="isCollapse" 
        :menu="menu" 
        :activeMenuIndex="$store.state.activeMenuIndex"
        @menuSelect="handleMenuSelect"></SideMenu>
    </el-aside>

    <el-container style="display: block;" :class="'main-container ' + isHide">
      <div class="header-sticky">
        <!-- 顶部导航栏 -->
        <Header 
          :isCollapse="isCollapse" 
          :routeList="routeList" 
          @menuCollapse="handleMenuCollapse"></Header>
        <!-- 动态页面标签 -->
        <TabBar 
          :tabList="tabList" 
          @tabClose="handleTabClose" 
          @tabClick="handleTabClick"></TabBar>
      </div>
      
      <!-- 嵌套页面 -->
      <el-main >
        <transition name="fade" mode="out-in">
          <router-view class="padding-lr" />
        </transition>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "@/components/SideMenu";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import { isRouteMatch } from "@/utils/util.js";

export default {
  name: "Layout",
  components: {
    SideMenu,
    Header,
    TabBar
  },
  data() {
    return {
      /**
       * 菜单是否坍塌
       */
      isCollapse: false,
      /**
       * 菜单
       */
      menu: null,
      /**
       * 层次路由列表
       */
      routeList: null,
      /**
       * 动态页面标签列表
       */
      tabList: null,
    };
  },
  computed: {
    isHide() {
      return this.isCollapse ? "hideSideMenu" : "";
    }
  },
  created() {
    this.menu = this.$store.state.menu
    this.tabList = this.$store.state.tabList
    this.initMenuSelect()
    this.initRouteList()
  },
  watch: {
    $route(newVal, oldVal) {
      // 监听路由变化，首次加载不执行，随时刷新menu, tab
      this.initMenuSelect()
      this.initRouteList()
    }
  },
  methods: {
    /**
     * 初始化菜单选中状态
     */
    initMenuSelect() {
      if(this.$store.state.activeMenuIndex !== '') {
        return
      }
      for (let i = 0; i < this.menu.length; i++) {
        const item = this.menu[i]
        if(isRouteMatch(this.$route, item.path) && !item.hidden) {
          this.handleMenuSelect({ index: i + '', selectedMenuItem: item })
          return
        }
        if(item.children && item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            const subItem = item.children[j]
            if(isRouteMatch(this.$route, subItem.path) && !subItem.hidden) {
              this.handleMenuSelect({ index: i + '-' + j, selectedMenuItem: subItem })
              return
            }
          }
        }
      }
    },

    /**
     * 初始化层次路由列表
     */
    initRouteList() {
      this.routeList = this.$route.matched
    },

    /**
     * 菜单栏选中
     */
    handleMenuSelect({ index, selectedMenuItem }) {
      // 更新激活菜单项
      this.$store.commit('SET_ACTIVE_MENU_INDEX', index)
      // 尝试添加标签
      let selectedTabItem = { name: selectedMenuItem.name, path: selectedMenuItem.path, closable: true }
      this.$store.commit('ADD_TAB', selectedTabItem)
      // 跳转指定页
      this.$router.push({ path: selectedMenuItem.path });
    },
    /**
     * 菜单栏塌陷
     */
    handleMenuCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    /**
     * 标签关闭
     */
    handleTabClose(index) {
      // 获取被删除标签
      let selctedTab = this.tabList[index]
      // 尝试删除标签
      this.$store.commit('REMOVE_TAB', selctedTab)
      // 如果删除的是当前页面标签，则自动跳转到最后一个标签
      if(isRouteMatch(this.$route, selctedTab.path)) {  
        this.$store.commit('DEL_ACTIVE_MENU_INDEX')
        this.$router.push({ path: this.tabList[this.tabList.length - 1].path });
      }
    },
    /**
     * 标签点击
     */
    handleTabClick(index) {
      let selctedPath = this.tabList[index].path
      // 如果点击非当前页，则跳转
      if(!isRouteMatch(this.$route, selctedPath)) {
        this.$store.commit('DEL_ACTIVE_MENU_INDEX')
        this.$router.push({ path: selctedPath });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  transition: margin-left 0.45s;
  margin-left: 220px;
  min-height: 100vh;
}

.hideSideMenu {
  margin-left: 64px;
}

.header-sticky {
  position: sticky;
  top: 0px;
  z-index: 999;
  background-color: #ffffff;
}
</style>