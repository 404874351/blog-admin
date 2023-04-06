<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        <el-form-item label="分类名" prop="name">
          <el-input size="medium" v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter.native="categoryQuery"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="categoryQuery" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="handleAddOpen" >添加</el-button>
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
        <el-table-column prop="name" label="分类名" min-width="120"></el-table-column>
        <el-table-column prop="articleCount" label="关联文章数" min-width="120"></el-table-column>
        <!-- <el-table-column prop="deleted" label="隐藏" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="categoryUpdateDeleted(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column> -->
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
              <el-button  size="mini" type="primary" @click="handleUpdateOpen(scope.$index, scope.row)">编辑</el-button>
              <el-popconfirm
                class="margin-left-sm"
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="永久删除该条数据？"
                @confirm="categoryRemove(scope.$index, scope.row)">
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </template>

    </BaseTable>

    <!-- 添加对话框 -->
    <el-dialog
      width="30%"
      title="分类添加"
      :visible.sync="addVisible"
      :destroy-on-close="true"
      @closed="handleAddClose" >
      
      <el-form  v-if="addItem" ref="addForm" :model="addItem" :rules="formRules" label-width="80px">
        <el-form-item label="分类名" prop="name">
          <el-input size="medium" v-model="addItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="categorySave(addItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="addVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      width="30%"
      title="分类编辑"
      :visible.sync="updateVisible"
      :destroy-on-close="true"
      @closed="handleUpdateClose" >
      
      <el-form v-if="updateItem" ref="updateForm" :model="updateItem" :rules="formRules"  label-width="80px">
        <el-form-item label="分类名" prop="name">
          <el-input size="medium" v-model="updateItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="categoryUpdate(updateIndex, updateItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="updateVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin';
import BaseTable from '@/components/BaseTable';
import { 
  adminCategoryPage,
  adminCategorySave,
  adminCategoryRemove,
  adminCategoryUpdate,
  adminCategoryUpdateDeleted } from "@/api/category.js";

import { filterQueryParams } from "@/utils/util.js";

export default {
  name: "Category",
  components: {
    BaseTable
  },
  mixins: [TableMixin],
  data() {
    return {
      loading: false,
      formLoading: false,
      
      queryParams: {
        name: '',
      },

      updateVisible: false,
      updateIndex: null,
      updateItem: null,

      addVisible: false,
      addItem: null,
  
      formRules: {
        name: [
          {
            required: true,
            message: "分类名不能为空",
            trigger: "blur",
          },
        ],
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
        let res = await adminCategoryPage(params)
        this.setPage(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    categoryQuery() {
      this.initPage()
      this.getData()
    },

    handleAddOpen() {
      this.addItem = {
        name: '',
      }
      this.addVisible = true
    },

    handleAddClose() {
      this.addItem = null
      this.addVisible = false
    },

    categorySave(item) {
      this.$refs["addForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminCategorySave(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.addVisible = false
          this.categoryQuery()
        }).catch(err => {
          this.formLoading = false
          console.log(err);
        })
      }) 
    },

    handleUpdateOpen(index, item) {
      this.updateIndex = index
      this.updateItem = {
        id: item.id,
        name: item.name,
      }
      this.updateVisible = true
    },

    handleUpdateClose() {
      this.updateIndex = null
      this.updateItem = null
      this.updateVisible = false
    },

    categoryUpdate(index, item) {
      this.$refs["updateForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminCategoryUpdate(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.updateVisible = false
          this.categoryQuery()
        }).catch(err => {
          this.formLoading = false
          console.log(err);
        })
      })
    },

    categoryUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminCategoryUpdateDeleted({
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

    categoryRemove(index, item) {
      this.loading = true
      adminCategoryRemove({
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