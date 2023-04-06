import request from "./request.js";

const adminMessagePage = ({ current, size, content, nickname }) => {
  return request({
    url: `/admin/message/page`,
    method: 'get',
    params: { current, size, content, nickname }
  })
}

const adminMessageRemove = ({ id }) => {
  return request({
    url: `/admin/message/remove/${id}`,
    method: 'post',
  })
}

const adminMessageUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/message/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

export {
  adminMessagePage,
  adminMessageRemove,
  adminMessageUpdateDeleted,
}