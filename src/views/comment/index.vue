<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        
        <el-form-item prop="content">
          <el-input 
            v-model="queryParams.content"
            size="medium" 
            placeholder="请输入评论内容" 
            prefix-icon="el-icon-search" 
            clearable 
            @keyup.enter.native="commentQuery"></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input 
            v-model="queryParams.nickname" 
            size="medium" 
            placeholder="请输入用户昵称" 
            prefix-icon="el-icon-user" 
            clearable 
            @keyup.enter.native="commentQuery"></el-input>
        </el-form-item>
        <el-form-item prop="articleTitle">
          <el-input 
            v-model="queryParams.articleTitle" 
            size="medium" 
            placeholder="请输入文章标题" 
            prefix-icon="el-icon-document" 
            clearable 
            @keyup.enter.native="commentQuery"></el-input>
        </el-form-item>
        <el-form-item prop="top" style="width: 150px;">
          <el-select v-model="queryParams.top" clearable placeholder="置顶状态">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="commentQuery" >查询</el-button>
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
        <el-table-column label="头像" min-width="50">
          <template slot-scope="scope">
            <el-avatar
              shape="square"
              size="medium"
              :src="scope.row.user.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="user.nickname" label="评论人" min-width="100">
        </el-table-column>
        <el-table-column prop="content" label="评论内容" min-width="170"></el-table-column>
        <el-table-column prop="articleTitle" label="评论文章" min-width="120"></el-table-column>
        <!-- <el-table-column prop="replyUser.nickname" label="回复人" min-width="100"></el-table-column> -->
        <el-table-column prop="top" label="置顶" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.top" 
              :active-value="1" 
              :inactive-value="0"
              @change="commentUpdateTop(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="隐藏" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="commentUpdateDeleted(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="170">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="170">
          <template slot-scope="scope">
            <div v-if="scope.row.permanentDeleted">
              <el-button size="mini" type="info" icon="el-icon-error" disabled>该记录已删除</el-button>
            </div>
            <div v-else>
              <el-popconfirm
                class="margin-left-sm"
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="永久删除该条数据？"
                @confirm="commentRemove(scope.$index, scope.row)">
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
  adminCommentPage,
  adminCommentRemove,
  adminCommentUpdate,
  adminCommentUpdateDeleted } from "@/api/comment.js";
import { filterQueryParams } from "@/utils/util.js";

export default {
  name: "Comment",
  components: {
    BaseTable
  },
  mixins: [TableMixin],
  data() {
    return {
      loading: false,
      formLoading: false,
      
      queryParams: {
        content: '',
        nickname: '',
        articleTitle: '',
        top: null,
      },
  
      formRules: {
        
      },
    }
  },
  created() {
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
        let res = await adminCommentPage(params)
        this.setPage(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    commentQuery() {
      this.initPage()
      this.getData()
    },

    commentUpdateTop(index, item) {
      console.log(item);
      this.loading = true
      let target = Math.abs(item.top - 1)
      adminCommentUpdate({
        id: item.id,
        articleId: item.articleId,
        top: target
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false
        this.$set(item, "top", target)
      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },

    commentUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminCommentUpdateDeleted({
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

    commentRemove(index, item) {
      this.loading = true
      adminCommentRemove({
        id: item.id
      }).then(res => {
        this.$message({
          comment: res.msg,
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

</style>