import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    menu: null,
    tabList: [{ name: "首页", path: "/" }],
    activeMenuIndex: ''
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    DEL_USER_INFO(state) {
      state.userInfo = null
    },

    SET_MENU(state, menu) {
      state.menu = menu
    },
    DEL_MENU(state) {
      state.menu = null
    },

    SET_TAB_LIST(state, tabList) {
      state.tabList = tabList
    },
    DEL_TAB_LIST(state) {
      state.tabList = [{ name: "首页", path: "/" }]
    },
    ADD_TAB(state, tab) {
      if (state.tabList.findIndex(item => item.path == tab.path) != -1) {
        return
      }
      state.tabList.push(tab)
    },
    REMOVE_TAB(state, tab) {
      let index = state.tabList.findIndex(item => item.path == tab.path)
      if (index == -1) {
        return
      }
      state.tabList.splice(index, 1)
    },
    SET_ACTIVE_MENU_INDEX(state, index) {
      state.activeMenuIndex = index
    },
    DEL_ACTIVE_MENU_INDEX(state) {
      state.activeMenuIndex = ''
    },

  },
  actions: {},
  modules: {},
});
