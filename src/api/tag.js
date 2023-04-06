import request from "./request.js";

const adminTagPage = ({ current, size, name }) => {
  return request({
    url: `/admin/tag/page`,
    method: 'get',
    params: { current, size, name }
  })
}

const adminTagQuery = ({ name }) => {
  return request({
    url: `/admin/tag/query`,
    method: 'get',
    params: { name }
  })
}

const adminTagOptionList = () => {
  return request({
    url: `/admin/tag/option`,
    method: 'get',
  })
}

const adminTagSave = ({ name }) => {
  return request({
    url: `/admin/tag/save`,
    method: 'post',
    data: { name }
  })
}

const adminTagRemove = ({ id }) => {
  return request({
    url: `/admin/tag/remove/${id}`,
    method: 'post',
  })
}

const adminTagUpdate = ({ id, name }) => {
  return request({
    url: `/admin/tag/update/${id}`,
    method: 'post',
    data: { name }
  })
}

const adminTagUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/tag/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

export {
  adminTagPage,
  adminTagQuery,
  adminTagOptionList,
  adminTagSave,
  adminTagRemove,
  adminTagUpdate,
  adminTagUpdateDeleted,
}