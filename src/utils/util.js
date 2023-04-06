import router from '@/router/index.js'

/**
 * 退出全屏
 */
const exitFullScreen = () => {
  // 针对不同浏览器进行不同操作
  if (document.exitFullscreen) {
    // W3C
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // FileFox
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    // Chrome
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    // IE11
    document.msExitFullscreen();
  }
};

/**
 * 进入全屏
 */
const enterFullScreen = () => {
  // 针对不同浏览器进行不同操作
  var docElm = document.documentElement;

  if (docElm.requestFullscreen) {
    // W3C
    docElm.requestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    // FireFox
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    // Chrome
    docElm.webkitRequestFullScreen();
  } else if (docElm.msRequestFullscreen) {
    // IE11
    docElm.msRequestFullscreen();
  }
};

/**
 * 获取主机地址
 */
const getHostPath = (page) => {
  // 获取当前页面地址
  let wPath = document.location.href;
  // 获取当前页面主机地址之后的目录，如：/admin/index
  let pos = wPath.lastIndexOf(page.$route.path);
  // 获取主机地址，如：http://localhost:8080
  let localhostPath = wPath.substring(0, pos);
  return localhostPath
}

/**
 * 过滤查询参数，将""和null删除
 * @param {Object} params 请求参数
 * @returns 过滤后参数
 */
const filterQueryParams = (params) => {
  let newParams = Object.assign({}, params)
  Object.keys(newParams).forEach(key => {
    if (newParams[key] === null || newParams[key] === "") {
      delete newParams[key]
    }
  })
  return newParams
}

/**
 * 判断路由是否与指定路径匹配
 * @param {Route} route 路由对象，如this.$route
 * @param {String} path 路径
 * @returns 
 */
const isRouteMatch = (route, path) => {
  if (!route || !path) {
    return false
  }
  if (path.includes(":")) {
    // 动态路由匹配
    return route.name == router.match(path).name
  } else {
    return route.path == path
  }
}

/**
 * 获取uuid
 * @returns uuid
 */
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}

/**
 * 构造文本文件对象
 * @param {String} content 文件内容
 * @param {String} name 文件名
 * @param {String} type 文件类型
 * @returns 文本文件对象
 */
const createFile = (content, name, type) => {
  return new File([content], name, { type })
}

/**
 * 构造md文件
 * @param {String} content 文件内容
 * @param {String} name 文件名，非必须
 * @returns md文件对象
 */
const createMarkdown = (content, name) => {
  if (name && name.endsWith(".md")) {
    return createFile(content, name, "text/markdown")
  } else {
    return createFile(content, "default.md", "text/markdown")
  }
}

export {
  exitFullScreen,
  enterFullScreen,
  getHostPath,
  filterQueryParams,
  isRouteMatch,
  uuid,
  createMarkdown,
};
