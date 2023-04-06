import Cookies from "js-cookie";
import store from '@/store/index.js'

/**
 * 清除token
 */
const clearToken = () => {
  Cookies.remove('token')
}

/**
 * 获取token
 * @returns token
 */
const getToken = () => {
  return Cookies.get('token')
}

/**
 * 设置token
 * @param {String} token 用户登录凭证
 */
const setToken = (token) => {
  Cookies.set('token', token)
}

/**
 * 清除登录态
 */
const clearLoginStatus = () => {
  store.commit('DEL_USER_INFO')
  store.commit('DEL_MENU')
  store.commit('DEL_TAB_LIST')
  Cookies.remove('token')
}

/**
 * 获取登录态
 * @returns {Object} { userInfo, menu, tabList }
 */
const getLoginStatus = () => {
  return {
    userInfo: store.state.userInfo,
    menu: store.state.menu,
    tabList: store.state.tabList,
  }
}

/**
 * 设置登录态
 * @param {Object} userInfo 用户信息
 * @param {Array} menu 用户菜单
 */
 const setLoginStatus = (userInfo, menu) => {
  store.commit('SET_USER_INFO', userInfo)
  store.commit('SET_MENU', menu)
}



export {
  clearToken,
  getToken,
  setToken,

  clearLoginStatus,
  getLoginStatus,
  setLoginStatus,
}