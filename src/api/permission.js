import request from "./request.js";

const adminPermissionList = ({ url, name }) => {
  return request({
    url: `/admin/permission/list`,
    method: 'get',
    params: { url, name }
  })
}

const adminPermissionOptionList = () => {
  return request({
    url: `/admin/permission/option`,
    method: 'get',
  })
}

const adminPermissionSave = ({ url, name, type, level, parentId, anonymous }) => {
  return request({
    url: `/admin/permission/save`,
    method: 'post',
    data: { url, name, type, level, parentId, anonymous }
  })
}

const adminPermissionRemove = ({ id }) => {
  return request({
    url: `/admin/permission/remove/${id}`,
    method: 'post',
  })
}

const adminPermissionUpdate = ({ id, url, name, type, anonymous }) => {
  return request({
    url: `/admin/permission/update/${id}`,
    method: 'post',
    data: { id, url, name, type, anonymous }
  })
}

const adminPermissionUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/permission/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

export {
  adminPermissionList,
  adminPermissionOptionList,
  adminPermissionSave,
  adminPermissionRemove,
  adminPermissionUpdate,
  adminPermissionUpdateDeleted,
}