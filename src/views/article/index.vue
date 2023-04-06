<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        <el-form-item prop="title">
          <el-input 
            size="medium" 
            v-model="queryParams.title" 
            placeholder="请输入文章标题" 
            prefix-icon="el-icon-search"
            clearable 
            @keyup.enter.native="articleQuery"></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input 
            size="medium" 
            v-model="queryParams.nickname" 
            placeholder="请输入作者昵称" 
            prefix-icon="el-icon-user"
            clearable 
            @keyup.enter.native="articleQuery"></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" >
          <el-select 
            size="medium" 
            v-model="queryParams.categoryId" 
            placeholder="请选择分类"
            clearable>
            <el-option
              v-for="item in categoryOptionList"
              :key="'category-' + item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tagId">
          <el-select 
            size="medium" 
            v-model="queryParams.tagId" 
            placeholder="请选择标签" 
            clearable>
            <el-option
              v-for="item in tagOptionList"
              :key="'tag-' + item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="articleQuery" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="handleAdd" >添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <BaseTable 
      v-loading="loading"
      :sizeList="sizeList"
      :size="size"
      :total="total"
      :current="current"
      :pages="pages"
      :list="list"
      :multipleSelection="multipleSelection"
      :handleSelectionChange="handleSelectionChange"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange" >

      <template slot="columns">
        <!-- <el-table-column prop="id" label="id" min-width="60" sortable></el-table-column> -->
        <el-table-column label="封面" min-width="180">
          <template slot-scope="scope">
            <div style="position: relative; width: 160px; height: 90px; ">
              <i v-if="scope.row.top == 1" class="el-icon-s-flag article-top" title="置顶"></i>
              <i v-if="scope.row.closeComment == 1" class="el-icon-s-release article-close-comment" title="关闭评论"></i>
              <el-image class="article-cover" fit="cover" :src="scope.row.coverUrl || require('@/assets/image/default_article.jpg')" ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
        <el-table-column prop="user.nickname" label="作者" min-width="100"></el-table-column>
        <el-table-column label="分类" min-width="100">
          <template slot-scope="scope">
            <el-tag size="small" type="success">{{ scope.row.category.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="150">
          <template slot-scope="scope">
            <el-tag 
              v-for="(item, index) in scope.row.tagList" 
              :key="'tag-' + scope.$index + '-' + index"
              class="margin-right-xs margin-bottom-xs"
              size="small">
              {{ item.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览量" min-width="70"></el-table-column>
        <el-table-column prop="praiseCount" label="点赞量" min-width="70"></el-table-column>
        <el-table-column prop="commentCount" label="评论量" min-width="70"></el-table-column>
        <el-table-column prop="deleted" label="私密" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="articleUpdateDeleted(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="220">
          <template slot-scope="scope">
            <div v-if="scope.row.permanentDeleted">
              <el-button size="mini" type="info" icon="el-icon-error" disabled>该记录已删除</el-button>
            </div>
            <div v-else>
              <el-button  size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
              <el-button  size="mini" type="success" @click="handleExport(scope.$index, scope.row)">导出</el-button>
              <el-popconfirm
                class="margin-left-sm"
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="永久删除该条数据？"
                @confirm="articleRemove(scope.$index, scope.row)">
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </template>

    </BaseTable>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin';
import BaseTable from '@/components/BaseTable';
import { 
  adminArticlePage,
  adminArticleRemove,
  adminArticleUpdateDeleted } from "@/api/article.js";
import { adminCategoryOptionList } from "@/api/category.js";
import { adminTagOptionList } from "@/api/tag.js";
import { filterQueryParams } from "@/utils/util.js";

export default {
  name: "Article",
  components: {
    BaseTable
  },
  mixins: [TableMixin],
  data() {
    return {
      loading: false,
      
      queryParams: {
        title: '', 
        nickname: '', 
        categoryId: null, 
        tagId: null,
      },

      categoryOptionList: [],
      tagOptionList: [],
    }
  },
  created() {
    this.getCategoryOptionList()
    this.getTagOptionList()
    this.getData();
  },
  methods: {
    /**
     * 获取数据列表
     */
    async getData() {
      this.loading = true
      let params = Object.assign({
        current: this.current,
        size: this.size,
      }, filterQueryParams(this.queryParams))
      try {
        let res = await adminArticlePage(params)
        this.setPage(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    articleQuery() {
      this.initPage()
      this.getData()
    },

    getCategoryOptionList() {
      adminCategoryOptionList().then(res => {
        this.categoryOptionList = res.data
      }).catch(err => {
        console.log(err);
      })
    },

    getTagOptionList() {
      adminTagOptionList().then(res => {
        this.tagOptionList = res.data
      }).catch(err => {
        console.log(err);
      })
    },

    handleAdd() {
      this.$store.commit('DEL_ACTIVE_MENU_INDEX')
      this.$router.push({ path: "/article/add" })
    },

    handleUpdate(index, item) {
      this.$store.commit('DEL_ACTIVE_MENU_INDEX')
      this.$router.push({ path: `/article/update/${item.id}` })
    },

    handleExport(index, item) {
      
    },

    articleUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminArticleUpdateDeleted({
        id: item.id,
        deleted: target
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false
        this.$set(this.list[index], "deleted", target)
      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },

    articleRemove(index, item) {
      this.loading = true
      adminArticleRemove({
        id: item.id
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false
        this.$set(this.list[index], "permanentDeleted", true)

      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },

  },
}
</script>

<style scoped>
.article-cover {
  width: 160px;
  height: 90px;
  border-radius: 4px;
}

.article-top {
  position: absolute;
  right: 0;
  top: 1px;
  font-size: 26px;
  color: yellow;
  z-index: 9999;
}

.article-close-comment {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 26px;
  color: white;
  color: red;
  opacity: 0.6;
  z-index: 9999;
}
</style>