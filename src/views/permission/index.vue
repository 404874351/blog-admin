<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        <el-form-item label="权限名" prop="name">
          <el-input size="medium" v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter.native="permissionQuery"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="url">
          <el-input size="medium" v-model="queryParams.url" placeholder="请输入" clearable @keyup.enter.native="permissionQuery"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="permissionQuery" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="handleAddOpen(null, null)" >添加</el-button>
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
      :hidePagination="true"
      rowKey="id"
      :multipleSelection="multipleSelection"
      :handleSelectionChange="handleSelectionChange"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange" >

      <template slot="columns">
        <!-- <el-table-column prop="id" label="id" min-width="60" sortable></el-table-column> -->
        <el-table-column prop="name" label="权限名" min-width="150"></el-table-column>
        <el-table-column prop="url" label="权限路径" min-width="170"></el-table-column>
        <el-table-column prop="anonymous" label="匿名访问" min-width="80">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.anonymous" 
              :active-value="1" 
              :inactive-value="0"
              @change="permissionUpdateAnonymous(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="隐藏" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="permissionUpdateDeleted(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="170">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="210">
          <template slot-scope="scope">
            <div v-if="scope.row.permanentDeleted">
              <el-button size="mini" type="info" icon="el-icon-error" disabled>该记录已删除</el-button>
            </div>
            <div v-else>
              <el-button size="mini" type="primary" @click="handleUpdateOpen(scope.$index, scope.row)">编辑</el-button>
              <el-button v-if="scope.row.type == 1" size="mini" type="success" @click="handleAddOpen(scope.$index, scope.row)">添加</el-button>
              <el-popconfirm
                class="margin-left-sm"
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="永久删除该条数据？"
                @confirm="permissionRemove(scope.$index, scope.row)">
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
      title="权限添加"
      :visible.sync="addVisible"
      :destroy-on-close="true"
      @closed="handleAddClose" >
      
      <el-form v-if="addItem" ref="addForm" :model="addItem" :rules="formRules" label-width="80px">
        <el-form-item label="权限名" prop="name">
          <el-input size="medium" v-model="addItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="addItem.type == 0" label="权限路径" prop="url">
          <el-input size="medium" v-model="addItem.url" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="addItem.level == 0" label="类型" prop="type">
          <el-radio-group v-model="addItem.type">
            <el-radio :label="0">权限项</el-radio>
            <el-radio :label="1">权限组</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="permissionSave(addItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="addVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      width="30%"
      title="权限编辑"
      :visible.sync="updateVisible"
      :destroy-on-close="true"
      @closed="handleUpdateClose" >
      
      <el-form v-if="updateItem" ref="updateForm" :model="updateItem" :rules="formRules" label-width="80px">
        <el-form-item label="权限名" prop="name">
          <el-input size="medium" v-model="updateItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="updateItem.type == 0" label="权限路径" prop="url">
          <el-input size="medium" v-model="updateItem.url" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="permissionUpdate(updateIndex, updateItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="updateVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin';
import BaseTable from '@/components/BaseTable';
import { 
  adminPermissionList,
  adminPermissionSave,
  adminPermissionRemove,
  adminPermissionUpdate,
  adminPermissionUpdateDeleted } from "@/api/permission.js";
import { filterQueryParams } from "@/utils/util.js";


export default {
  name: "Permission",
  components: {
    BaseTable
  },
  mixins: [TableMixin],
  data() {
    return { 
      loading: false,
      formLoading: false,
      
      queryParams: {
        url: '',
        name: '',
      },

      updateVisible: false,
      updateIndex: null,
      updateItem: null,

      addVisible: false,
      addItem: null,
      
      formRules: {
        url: [
          { 
            validator: (rule, value, callback) => {
              if (value === '') {
                if (this.updateItem && this.updateItem.type == 0 || this.addItem && this.addItem.type == 0) {
                  callback(new Error('权限项的路径不能为空'))
                }
              } else {
                if (this.updateItem && this.updateItem.type == 1 || this.addItem && this.addItem.type == 1) {
                  callback(new Error('权限组的路径必须为空'))
                }
              }
              callback()
            }, 
            trigger: 'blur' 
          }
        ],
        name: [
          {
            required: true,
            message: "权限名不能为空",
            trigger: "blur",
          },
        ],
        
      },
    };
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
      let params = filterQueryParams(this.queryParams)
      try {
        let res = await adminPermissionList(params)
        this.setPage({ records: res.data })
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },
  
    permissionQuery() {
      this.initPage()
      this.getData()
    },

    handleAddOpen(index, item) {
      this.addItem = {
        url: '', 
        name: '', 
        type: 0, 
        level: item ? 1 : 0, 
        parentId: item ? item.id : null,
      }
      this.addVisible = true
    },

    handleAddClose() {
      this.addItem = null
      this.addVisible = false
    },

    permissionSave(item) {
      this.$refs["addForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminPermissionSave(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.addVisible = false
          this.permissionQuery()
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
        url: item.url, 
        name: item.name, 
        type: item.type,
      }
      this.updateVisible = true
    },
    handleUpdateClose() {
      this.updateIndex = null
      this.updateItem = null
      this.updateVisible = false
    },

    permissionUpdate(index, item) {
      this.$refs["updateForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminPermissionUpdate(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.updateVisible = false
          this.permissionQuery()
        }).catch(err => {
          this.formLoading = false
          console.log(err);
        })
      })
    },

    permissionUpdateAnonymous(index, item) {
      this.loading = true
      let target = Math.abs(item.anonymous - 1)
      adminPermissionUpdate({
        id: item.id,
        type: item.type,
        anonymous: target
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false
        this.$set(item, "anonymous", target)
      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },

    permissionUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminPermissionUpdateDeleted({
        id: item.id,
        deleted: target
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false
        this.$set(item, "deleted", target)
      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },

    permissionRemove(index, item) {
      this.loading = true
      adminPermissionRemove({
        id: item.id
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false
        this.$set(item, "permanentDeleted", true)

      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },
  
  },
};
</script>

<style scoped>
</style>