import request from "./request.js";

const adminMenuList = ({ code, name, path }) => {
  return request({
    url: `/admin/menu/list`,
    method: 'get',
    params: { code, name, path }
  })
}

const adminMenuOptionList = () => {
  return request({
    url: `/admin/menu/option`,
    method: 'get',
  })
}

const adminMenuUserList = () => {
  return request({
    url: `/admin/menu/user`,
    method: 'get',
  })
}

const adminMenuSave = ({ code, name, path, component, icon, type, level, parentId, hidden }) => {
  return request({
    url: `/admin/menu/save`,
    method: 'post',
    data: { code, name, path, component, icon, type, level, parentId, hidden }
  })
}

const adminMenuRemove = ({ id }) => {
  return request({
    url: `/admin/menu/remove/${id}`,
    method: 'post',
  })
}

const adminMenuUpdate = ({ id, code, name, path, component, icon, type, hidden }) => {
  return request({
    url: `/admin/menu/update/${id}`,
    method: 'post',
    data: { id, code, name, path, component, icon, type, hidden }
  })
}

const adminMenuUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/menu/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

export {
  adminMenuList,
  adminMenuOptionList,
  adminMenuUserList,
  adminMenuSave,
  adminMenuRemove,
  adminMenuUpdate,
  adminMenuUpdateDeleted,
}