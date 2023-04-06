import request from "./request.js";

const adminArticlePage = ({ current, size, title, nickname, categoryId, tagId }) => {
  return request({
    url: `/admin/article/page`,
    method: 'get',
    params: { current, size, title, nickname, categoryId, tagId }
  })
}

const adminArticleInfo = ({ id }) => {
  return request({
    url: `/admin/article/${id}`,
    method: 'get',
  })
}

const adminArticleSave = ({ title, description, coverUrl, contentUrl, userId, categoryId, tagIdList }) => {
  return request({
    url: `/admin/article/save`,
    method: 'post',
    data: { title, description, coverUrl, contentUrl, userId, categoryId, tagIdList }
  })
}

const adminArticleRemove = ({ id }) => {
  return request({
    url: `/admin/article/remove/${id}`,
    method: 'post',
  })
}

const adminArticleUpdate = ({ id, title, description, coverUrl, categoryId, tagIdList, top, closeComment }) => {
  return request({
    url: `/admin/article/update/${id}`,
    method: 'post',
    data: { title, description, coverUrl, categoryId, tagIdList, top, closeComment }
  })
}

const adminArticleUpdateDeleted = ({ id, deleted }) => {
  return request({
    url: `/admin/article/update/${id}/deleted`,
    method: 'post',
    data: { deleted }
  })
}

const adminArticleDraftSave = ({ title, description, content }) => {
  localStorage.setItem("draft", JSON.stringify({ title, description, content }))
}

const adminArticleDraftLoad = () => {
  // 暂存获取后即删除
  let draft = JSON.parse(localStorage.getItem("draft"))
  localStorage.removeItem("draft")
  return draft
}


export {
  adminArticlePage,
  adminArticleInfo,
  adminArticleSave,
  adminArticleRemove,
  adminArticleUpdate,
  adminArticleUpdateDeleted,

  adminArticleDraftSave,
  adminArticleDraftLoad,
}