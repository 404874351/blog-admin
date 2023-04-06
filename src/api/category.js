import request from "./request.js";

const adminCategoryPage = ({ current, size, name }) => {
  return request({
    url: `/admin/category/page`,
    method: 'get',
    params: { current, size, name }
  })
}

const adminCategoryQuery = ({ name }) => {
  return request({
    url: `/admin/category/query`,
    method: 'get',
    params: { name }
  })
}

const adminCategoryOptionList = () => {
  return request({
    url: `/admin/category/option`,
    method: 'get',
  })
}

const adminCategorySave = ({ name }) => {
  return request({
    url: `/admin/category/save`,
    method: 'post',
    data: { name }
  })
}

const adminCategoryRemove = ({ id }) => {
  return request({
    url: `/admin/category/remove/${id}`,
    method: 'post',
  })
}

const adminCategoryUpdate = ({ id, name }) => {
  return request({
    url: `/admin/category/update/${id}`,
    method: 'post',
    data: { name }
  })
}

const adminCategoryUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/category/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

export {
  adminCategoryPage,
  adminCategoryQuery,
  adminCategoryOptionList,
  adminCategorySave,
  adminCategoryRemove,
  adminCategoryUpdate,
  adminCategoryUpdateDeleted,
}