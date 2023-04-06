<template>
  <div >
    <div class="title">{{ this.$route.name }}</div>

    <!-- 基本信息编辑区 -->
    <div>
      <el-form ref="updateForm" :model="updateItem" :rules="formRules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input 
            style="width: calc(100% - 230px); margin-right: 20px;"
            size="medium" 
            v-model="updateItem.title" 
            placeholder="请输入" 
            clearable ></el-input>
          <el-button size="medium" plain @click="articleDraftSave">保存草稿</el-button>
          <el-button size="medium" type="primary" @click="articleUpdate" v-loading="updateLoading">更新文章</el-button>
        </el-form-item>

        <div class="flex">
          <el-form-item label="文章分类" prop="categoryId" style="width: 45%; margin-right: 5%; ">
            <el-tag v-if="selectedCategory" type="success" disable-transitions closable @close="removeCategory">{{ selectedCategory.name }}</el-tag>
            <el-popover v-else placement="bottom-start" trigger="click" width="320">
              <el-select
                style="width: 320px; "
                v-model="updateItem.categoryId"
                filterable
                remote
                reserve-keyword
                placeholder="请搜索分类，点击enter可添加自定义分类"
                :remote-method="queryCategory"
                :loading="queryLoading"
                @keyup.enter.native="saveCategory"
                @change="selectCategory">
                <el-option
                  v-for="item in categoryOptionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
              <div class="margin-top">
                <el-tag 
                  v-for="(item, index) in categoryOptionDefaultList" 
                  :key="'category-default-' + index"
                  type="success"
                  class="margin-xs cursor-pointer"
                  @click="selectCategory(item)">
                  {{ item.name }}
                </el-tag>
              </div>

              <el-button slot="reference" type="success" size="medium">添加分类</el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="文章标签" prop="tagIdList" style="width: 45%; margin-right: 5%; ">
            <el-tag 
              v-for="(tag, index) in selectedTagList"
              :key="'tag-' + index" 
              class="margin-right-sm"
              type="primary" 
              disable-transitions
              closable 
              @close="removeTag(index)">{{ tag.name }}</el-tag>
            <el-popover placement="bottom-start" trigger="click" width="320">
              <el-select
                style="width: 320px; "
                v-model="updateItem.tagIdList"
                filterable
                remote
                reserve-keyword
                placeholder="请搜索标签，点击enter可添加自定义标签"
                :remote-method="queryTag"
                :loading="queryLoading"
                @keyup.enter.native="saveTag"
                @change="selectTag">
                <el-option
                  v-for="item in tagOptionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
              <div class="margin-top">
                <el-tag 
                  v-for="(item, index) in tagOptionDefaultList" 
                  :key="'tag-default-' + index"
                  type="primary"
                  class="margin-xs cursor-pointer"
                  @click="selectTag(item)">
                  {{ item.name }}
                </el-tag>
              </div>

              <el-button slot="reference" type="primary" size="medium">添加标签</el-button>
            </el-popover>
          </el-form-item>
        </div>

        <!-- 可隐藏的详细表单 -->
        <div :class="detailHidden ? 'detail-hidden' : 'detail-show'" >
          <div class="flex justify-center" style="margin-top: -20px; ">
            <el-button type="text" @click="detailHidden = !detailHidden">{{ detailHidden ? '展示' : '隐藏' }}详细配置</el-button>
          </div>

          <div class="flex">
            <el-form-item label="置顶" prop="top" style="width: 45%; margin-right: 5%; ">
              <el-switch v-model="updateItem.top" :active-value="1" :inactive-value="0" active-color="#13ce66"></el-switch>
            </el-form-item>
            <el-form-item label="评论功能" prop="closeComment" style="width: 45%; margin-right: 5%; ">
              <el-radio-group v-model="updateItem.closeComment">
                <el-radio :label="0">打开</el-radio>
                <el-radio :label="1">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="flex">
            <el-form-item label="文章简介" prop="description" style="width: 45%; margin-right: 5%; ">
              <el-input type="textarea" :rows="8" size="medium" v-model="updateItem.description" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="封面图片" prop="coverUrl"  style="width: 45%; margin-right: 5%; ">
              <el-upload class="upload-demo" :show-file-list="false" drag action="" :on-error="coverUpload" > 
                <img v-if="updateItem.coverUrl" :src="updateItem.coverUrl" width="360" height="180" />
                <div v-else>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </div>
                <div v-if="uploadLoading" class="cover-loading">
                  <div>
                    <div style="position: relative; top:  10px; "><i class="el-icon-loading text-xl"></i></div>
                    <div style="position: relative;">{{ uploadPercent }} %</div>
                  </div>
                </div>
                
                <div class="el-upload__tip" slot="tip" style="margin-top: -20px; ">支持jpg, png格式，文件大小不超过5MB，推荐横向图片。</div>
              </el-upload>
            </el-form-item>
          </div>

        </div>

      </el-form>
    </div>
    <Editor @change="articleChange" :content="content" />
  </div>
</template>

<script>
import { getToken, uploadCover, uploadArticle, getArticle } from "@/api/qiniu.js";
import { adminArticleInfo, adminArticleUpdate, adminArticleDraftSave, adminArticleDraftLoad } from "@/api/article.js";
import { adminCategoryQuery, adminCategoryOptionList, adminCategorySave } from "@/api/category.js";
import { adminTagQuery, adminTagOptionList, adminTagSave } from "@/api/tag.js";
import { qiniu_domain } from "@/config/index.js";
import { createMarkdown } from "@/utils/util.js"
import Editor from '@/components/Editor.vue'

export default {
  name: "ArticleUpdate",
  components: {
    Editor,
  },
  data() {
    return {
      updateLoading: false,
      
      queryLoading: false,

      uploadLoading: false,
      uploadPercent: 0,
      
      content: '',
      
      article: '',

      updateItem: {
        id: '',
        title: '', 
        description: '', 
        coverUrl: '', 
        categoryId: null, 
        tagIdList: null,
        top: 0,
        closeComment: 0,
      },
      articleItem: null,
      
      updateFinished: false,
      draftSaveFinished: false,

      detailHidden: false,

      formRules: {
        title: [
          {
            required: true,
            message: "文章标题不能为空",
            trigger: "blur",
          },
        ],
        categoryId: [
          {
            type: "number",
            required: true,
            message: "分类id不能为空",
            trigger: "blur",
          },
        ],
      },

      categoryOptionDefaultList: null,
      categoryOptionList: null,
      selectedCategory: null,

      tagOptionDefaultList: null,
      tagOptionList: null,
      selectedTagList: [],

      coverObserver: {
        next: (res) => {
          this.uploadPercent = Math.floor(res.total.percent)
        },
        error: (err) => {
          this.uploadLoading = false
          this.$message({
            showClose: true,
            message: "封面图片上传错误",
            type: 'error'
          });
        },
        complete: (res) => {
          this.uploadLoading = false
          this.updateItem.coverUrl = qiniu_domain + "/" + res.key
        }
      },
      articleObserver: {
        next: (res) => { },
        error: (err) => {
          this.updateLoading = false
          this.$message({
            showClose: true,
            message: "文章上传错误",
            type: 'error'
          });
        },
        complete: (res) => {
          let params = this.getUpdateParams()
          // 对于基本数据未修改的情况，则不再提交更新
          if (Object.keys(params).length == 1) {
            this.$message({
              message: "请求成功",
              type: 'success'
            });
            this.updateLoading = false
            this.updateFinished = true
            // 后退列表页
            this.$store.commit('DEL_ACTIVE_MENU_INDEX')
            this.$router.push({ path: "/article" })
            return
          }
          // 新增记录，只更新修改过的内容
          adminArticleUpdate(params).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.updateLoading = false
            this.updateFinished = true
            // 后退列表页
            this.$router.push({ path: "/article" })
          }).catch(err => {
            console.log(err);
            this.updateLoading = false
          })
        }
      }
    }
  },
  created() {
    // 获取现有文章分类与文章标签
    this.getCategoryDefaultList()
    this.getTagDefaultList()

    this.getData()
  },
  beforeRouteLeave(to, from, next) {
    if (this.updateFinished || this.draftSaveFinished || this.article.trim() == "") {
      next()
      return
    }
    // 进行暂存询问
    this.$confirm('是否保留文章草稿？', '提示', {
      type: 'warning',
    }).then(() => {
      this.articleDraftSave()
      next()
    }).catch(() => {
      next()
    })
  },
  methods: {
    articleChange(data) {
      this.article = data.value
    },

    async getData() {
      const loading = this.$loading({
        lock: true,
        text: '正在获取文章信息',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      });
      try {
        // 获取文章信息
        let articleInfo = await adminArticleInfo({ id: this.$route.params.id })
        // 将待编辑信息进行展示
        this.articleItem = articleInfo.data
        this.selectedCategory = Object.assign({}, this.articleItem.category)
        this.selectedTagList = this.articleItem.tagList.map(item => Object.assign({}, item))
        Object.keys(this.updateItem).forEach(key => {
          this.updateItem[key] = this.articleItem[key]
        })
        // 获取文章内容
        let contentInfo = await getArticle(this.articleItem.contentUrl)
        this.content = contentInfo.data
        // 载入暂存
        this.articleDraftLoad()
      } catch (err) {
        console.log(err);
      } finally {
        loading.close();
      }
      
    },

    async articleUpload() {
      if (this.article.trim() == "") {
        this.$message({
          showClose: true,
          message: "文档内容不能为空",
          type: 'error'
        });
        return
      }
      // 获取覆盖上传的key
      let key = this.articleItem.contentUrl.slice(qiniu_domain.length + 1)
      // 构造md文件
      let article = createMarkdown(this.article, key)
      try {
        // 获取覆盖上传的token
        let tokenRes = await getToken({ key })
        // 开始上传，后续操作参见observer
        uploadArticle({
          file: article,
          token: tokenRes.data,
          observer: this.articleObserver,
          key
        })
      } catch (err) {
        console.log(err);
        this.updateLoading = false
      }  
    },

    async coverUpload(err, file, fileList) {
      this.uploadPercent = 0
      this.uploadLoading = true
      try {
        // 获取上传token
        let tokenRes = await getToken({})
        // 开始上传，后续操作参见observer
        uploadCover({
          file: file.raw,
          token: tokenRes.data,
          observer: this.coverObserver
        })
      } catch (err) {
        console.log(err);
        this.uploadLoading = false
      }  
    },

    articleUpdate() {
      this.updateItem.categoryId = this.selectedCategory ? this.selectedCategory.id : null
      this.updateItem.tagIdList = this.selectedTagList.length ? this.selectedTagList.map(item => item.id) : []

      this.$refs["updateForm"].validate((isValid) => {
        if (!isValid) {
          this.detailHidden = false
          return false
        }

        this.updateLoading = true
        // 上传文章
        this.articleUpload()
        
      }) 
    },

    getUpdateParams() {
      let updateParams = {}
      // 对于相同的属性，则不计入更新范围
      Object.keys(this.updateItem).forEach(key => {
        updateParams[key] = this.updateItem[key] === this.articleItem[key] ? null : this.updateItem[key]
      })
      // 特殊字段单独处理
      updateParams.id = this.updateItem.id
      updateParams.categoryId = this.updateItem.categoryId === this.articleItem.category.id ? null : this.updateItem.categoryId
      this.updateItem.tagIdList.sort((a, b) => a - b)
      let articleTagIdList = this.articleItem.tagList.map(item => item.id).sort((a, b) => a - b)
      if (this.updateItem.tagIdList.toString() === articleTagIdList.toString()) {
        updateParams.tagIdList = null
      }
      // 删除值为null的属性
      Object.keys(updateParams).forEach(key => {
        if (updateParams[key] === null) {
          delete updateParams[key]
        }
      })
      return updateParams
    },

    articleDraftLoad() {
      let draft = adminArticleDraftLoad()
      if (draft == null) {
        return
      }
      this.$confirm('是否载入暂存草稿？', '提示', {
        type: 'warning',
      }).then(() => {
        this.updateItem.title = draft.title
        this.updateItem.description = draft.description
        this.content = draft.content

        this.$message({
          showClose: true,
          message: "已载入暂存草稿",
          type: 'success'
        });
        
      }).catch(() => { })
    },

    articleDraftSave() {
      if (this.article.trim() == "") {
        this.$message({
          showClose: true,
          message: "文档内容为空",
          type: 'warning'
        });
        return
      }
      adminArticleDraftSave({
        title: this.updateItem.title, 
        description: this.updateItem.description, 
        content: this.article
      })
      this.draftSaveFinished = true
      this.$message({
        showClose: true,
        message: "暂存成功",
        type: 'success'
      });
    },

    getCategoryDefaultList() {
      adminCategoryOptionList().then(res => {
        this.categoryOptionDefaultList = res.data
      }).catch(err => {
        console.log(err);
      })
    },

    async queryCategory(key) {
      if (key.trim() == "") {
        return
      }
      this.queryLoading = true
      try {
        let res = await adminCategoryQuery({ name: key })
        this.categoryOptionList = res.data
      } catch (err) {
        console.log(err);
      } finally {
        this.queryLoading = false
      }
    },

    async saveCategory(e) {
      if (e.target.value.trim() == "") {
        return
      }
      this.queryLoading = true
      adminCategorySave({ name: e.target.value }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.queryLoading = false
        this.selectCategory(res.data)
      }).catch(err => {
        this.queryLoading = false
        console.log(err);
      })
    },

    getTagDefaultList() {
      adminTagOptionList().then(res => {
        this.tagOptionDefaultList = res.data
      }).catch(err => {
        console.log(err);
      })
    },

    async queryTag(key) {
      if (key.trim() == "") {
        return
      }
      this.queryLoading = true
      try {
        let res = await adminTagQuery({ name: key })
        this.tagOptionList = res.data
      } catch (err) {
        console.log(err);
      } finally {
        this.queryLoading = false
      }
    },

    async saveTag(e) {
      if (e.target.value.trim() == "") {
        return
      }
      this.queryLoading = true
      adminTagSave({ name: e.target.value }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.queryLoading = false
        this.selectTag(res.data)
      }).catch(err => {
        this.queryLoading = false
        console.log(err);
      })
    
    },

    selectCategory(item) {
      this.selectedCategory = item
      this.updateItem.categoryId = null
    },

    removeCategory() {
      this.selectedCategory = null
    },

    selectTag(item) {
      if (this.selectedTagList.findIndex(each => each.id == item.id) != -1) {
        return
      }
      this.selectedTagList.push(item)
      this.$set(this, 'selectedTagList', this.selectedTagList)
      this.updateItem.tagIdList = null
    },

    removeTag(index) {
      this.selectedTagList.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.detail-show {
  max-height: 340px;
  transition: max-height .5s ease-in-out;
}

.detail-hidden {
  max-height: 40px;
  transition: max-height .5s ease-in-out;
}

.cover-loading {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffffb0;

}
</style>