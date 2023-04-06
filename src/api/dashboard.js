import request from "./request.js";

const adminDashboardIndex = () => {
  return request({
    url: `/admin/dashboard/index`,
    method: 'get',
  })
}

const adminDashboardView = () => {
  return request({
    url: `/admin/dashboard/view`,
    method: 'get',
  })
}

const adminDashboardRole = () => {
  return request({
    url: `/admin/dashboard/role`,
    method: 'get',
  })
}

const adminDashboardCategory = () => {
  return request({
    url: `/admin/dashboard/category`,
    method: 'get',
  })
}

const adminDashboardTag = () => {
  return request({
    url: `/admin/dashboard/tag`,
    method: 'get',
  })
}

export {
  adminDashboardIndex,
  adminDashboardView,
  adminDashboardRole,
  adminDashboardCategory,
  adminDashboardTag,
}