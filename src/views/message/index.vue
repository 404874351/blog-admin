<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        <el-form-item label="留言人昵称" prop="nickname">
          <el-input size="medium" v-model="queryParams.nickname" placeholder="请输入" clearable @keyup.enter.native="messageQuery"></el-input>
        </el-form-item>
        <el-form-item label="留言内容" prop="content">
          <el-input size="medium" v-model="queryParams.content" placeholder="请输入" clearable @keyup.enter.native="messageQuery"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="messageQuery" >查询</el-button>
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
              :src="scope.row.user && scope.row.user.avatarUrl ? scope.row.user.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="留言人" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.user ? scope.row.user.nickname : "游客" }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="留言内容" min-width="170"></el-table-column>
        <el-table-column prop="deleted" label="隐藏" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="messageUpdateDeleted(scope.$index, scope.row)"></el-switch>
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
                @confirm="messageRemove(scope.$index, scope.row)">
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
  adminMessagePage,
  adminMessageRemove,
  adminMessageUpdateDeleted } from "@/api/message.js";
import { filterQueryParams } from "@/utils/util.js";

export default {
  name: "Message",
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
        let res = await adminMessagePage(params)
        this.setPage(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    messageQuery() {
      this.initPage()
      this.getData()
    },

    messageUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminMessageUpdateDeleted({
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

    messageRemove(index, item) {
      this.loading = true
      adminMessageRemove({
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

</style>