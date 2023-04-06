import request from "./request.js";

const adminRolePage = ({ current, size, code, name, description }) => {
  return request({
    url: `/admin/role/page`,
    method: 'get',
    params: { current, size, code, name, description }
  })
}

const adminRoleOptionList = () => {
  return request({
    url: `/admin/role/option`,
    method: 'get',
  })
}

const adminRoleSave = ({ code, name, description }) => {
  return request({
    url: `/admin/role/save`,
    method: 'post',
    data: { code, name, description }
  })
}

const adminRoleRemove = ({ id }) => {
  return request({
    url: `/admin/role/remove/${id}`,
    method: 'post',
  })
}

const adminRoleUpdate = ({ id, code, name, description }) => {
  return request({
    url: `/admin/role/update/${id}`,
    method: 'post',
    data: { code, name, description }
  })
}

const adminRoleUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/role/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

const adminRoleUpdateMenu = ({ id, menuIdList }) => {
  return request({
    url: `/admin/role/update/${id}/menu`,
    method: 'post',
    data: { id, menuIdList }
  })
}

const adminRoleUpdatePermission = ({ id, permissionIdList }) => {
  return request({
    url: `/admin/role/update/${id}/permission`,
    method: 'post',
    data: { id, permissionIdList }
  })
}

export {
  adminRolePage,
  adminRoleOptionList,
  adminRoleSave,
  adminRoleRemove,
  adminRoleUpdate,
  adminRoleUpdateDeleted,
  adminRoleUpdateMenu,
  adminRoleUpdatePermission,
}