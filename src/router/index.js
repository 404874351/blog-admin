import Vue from "vue";
import Router from "vue-router";
import store from '../store/index.js'
import Layout from "../layout/index.vue"
import { getToken } from "../utils/auth.js";
import { Message } from "element-ui";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


// 解决 Redirected when going from ... to ... via a navigation guard 报错的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);


// 基础路由，匿名可访问
const baseRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
  },
  { 
    path: '/404', 
    name: "404",
    component: () => import("@/views/404/index.vue"),
  },
  
]
// 报错路由，需要放在最后，防止错误指向
const errorRoutes = [
  { 
    path: '*', 
    redirect: '/404', 
    hidden: true 
  }
]

/**
 * 初始化路由
 * @returns {Router} 新路由
 */
const initRouter = () => {
  return new Router({
    // 如不使用history模式，部署更方便，但不够美观
    mode: "history",
    base: process.env.BASE_URL,
    routes: baseRoutes,
  })
}

/**
 * 重置路由，用于登出操作
 */
const resetRouter = () => {
  let newRouter = initRouter()
  router.matcher = newRouter.matcher
}

/**
 * 配置路由懒加载
 * @param {String} component 组件路径
 * @returns {Function} 路由引入方法
 */
const loadView = (component) => {
  return () => import(`@/views${component}`)
}

/**
 * 动态添加路由，用于登录操作
 * @param {Array} menu 用户菜单列表
 */
const addRoutes = (menu) => {
  // 处理菜单为路由格式
  let newRoutes = menu.map(item => {
    let route = {}
    route.path = item.path
    route.name = item.name
    route.component = item.component == "Layout" ? Layout : loadView(item.component)
    if (item.children && item.children.length > 0) {
      // 顶层为菜单组，则添加子菜单
      route.children = item.children.map(child => {
        return {
          path: child.path,
          name: child.name,
          component: loadView(child.component)
        }
      })
    } else {
      // 顶层为菜单项，则需要额外处理，以保证使用布局
      route.path = item.path
      route.name = null
      route.component = Layout
      route.children = [{
        path: "",
        name: item.name,
        component: loadView(item.component)
      }]

    }
    return route
  })
  // 附上报错路由
  newRoutes.push(...errorRoutes)
  
  // 添加新路由
  router.addRoutes(newRoutes)
}

const router = initRouter()

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 启动进度条
  NProgress.start()
  
  // 访问匿名页，则直接放行
  if (baseRoutes.findIndex(item => item.path == to.path) != -1) {
    next()
    return
  }
  
  // 获取token
  const token = getToken()
  if (token) {
    // 实名访问系统页，则直接放行
    // 在系统布局中，还会检查登录态
    next()

  } else {
    // 匿名访问系统页，则跳转登录页
    Message({
      showClose: true,
      message: '请先登录！',
      duration: 3000,
      type: "error"
    })
    next({ name: 'Login' })
  }
})

// 后置路由守卫
router.afterEach((to, from) => {
  // 完结进度条
  NProgress.done();
})

export {
  resetRouter,
  addRoutes,
}

export default router