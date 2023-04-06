import request from "./request.js";

const adminCommentPage = ({ current, size, content, nickname, articleTitle, top }) => {
  return request({
    url: `/admin/comment/page`,
    method: 'get',
    params: { current, size, content, nickname, articleTitle, top }
  })
}

const adminCommentRemove = ({ id }) => {
  return request({
    url: `/admin/comment/remove/${id}`,
    method: 'post',
  })
}

const adminCommentUpdate = ({ id, articleId, top }) => {
  return request({
    url: `/admin/comment/update/${id}`,
    method: 'post',
    data: { id, articleId, top }
  })
}

const adminCommentUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/comment/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

export {
  adminCommentPage,
  adminCommentRemove,
  adminCommentUpdate,
  adminCommentUpdateDeleted,
}