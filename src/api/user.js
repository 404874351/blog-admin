import request from "./request.js";

const login = ({ username, password }) => {
  return request({
    url: `/login`,
    method: 'post',
    data: { username, password }
  })
}

const logout = () => {
  return request({
    url: `/logout`,
    method: 'post',
  })
}

const userInfo = () => {
  return request({
    url: `/user/info`,
    method: 'get',
  })
}

const userUpdate = ({ nickname, avatarUrl }) => {
  return request({
    url: `/user/update`,
    method: 'post',
    data: { nickname, avatarUrl }
  })
}

const updatePassword = ({ password, newPassword }) => {
  return request({
    url: `/user/password`,
    method: 'post',
    data: { password, newPassword }
  })
}

const adminUserPage = ({ current, size, nickname, phone }) => {
  return request({
    url: `/admin/user/page`,
    method: 'get',
    params: { current, size, nickname, phone }
  })
}

const adminUserRemove = ({ id }) => {
  return request({
    url: `/admin/user/remove/${id}`,
    method: 'post',
  })
}

const adminUserUpdate = ({ id, nickname, roleIdList }) => {
  return request({
    url: `/admin/user/update/${id}`,
    method: 'post',
    data: { id, nickname, roleIdList }
  })
}

const adminUserUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/user/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}
export {
  login,
  logout,
  userInfo,
  userUpdate,
  updatePassword,

  adminUserPage,
  adminUserRemove,
  adminUserUpdate,
  adminUserUpdateDeleted,
  
}