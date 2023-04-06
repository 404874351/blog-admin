<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        <el-form-item label="角色代码" prop="code">
          <el-input size="medium" v-model="queryParams.code" placeholder="请输入" clearable @keyup.enter.native="roleQuery"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input size="medium" v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter.native="roleQuery"></el-input>
        </el-form-item>
        <el-form-item label="角色详情" prop="description">
          <el-input size="medium" v-model="queryParams.description" placeholder="请输入" clearable @keyup.enter.native="roleQuery"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="roleQuery" >查询</el-button>
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
        <el-table-column prop="code" label="代码" min-width="100"></el-table-column>
        <el-table-column prop="name" label="角色名" min-width="120"></el-table-column>
        <el-table-column prop="description" label="详情" min-width="200"></el-table-column>
        <!-- <el-table-column prop="deleted" label="隐藏" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="roleUpdateDeleted(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" min-width="170">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="330">
          <template slot-scope="scope">
            <div v-if="scope.row.permanentDeleted">
              <el-button size="mini" type="info" icon="el-icon-error" disabled>该记录已删除</el-button>
            </div>
            <div v-else>
              <el-button  size="mini" type="primary" @click="handleUpdateOpen(scope.$index, scope.row)">编辑</el-button>
              <el-button  size="mini" type="success" @click="handleUpdateMenuOpen(scope.$index, scope.row)">菜单配置</el-button>
              <el-button  size="mini" type="warning" @click="handleUpdatePermissionOpen(scope.$index, scope.row)">权限配置</el-button>
              <el-popconfirm
                class="margin-left-sm"
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="永久删除该条数据？"
                @confirm="roleRemove(scope.$index, scope.row)">
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
      title="角色添加"
      :visible.sync="addVisible"
      :destroy-on-close="true"
      @closed="handleAddClose" >
      
      <el-form  v-if="addItem" ref="addForm" :model="addItem" :rules="formRules" label-width="80px">
        <el-form-item label="代码" prop="code">
          <el-input size="medium" v-model="addItem.code" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input size="medium" v-model="addItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="description">
          <el-input size="medium" v-model="addItem.description" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="roleSave(addItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="addVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      width="30%"
      title="角色编辑"
      :visible.sync="updateVisible"
      :destroy-on-close="true"
      @closed="handleUpdateClose" >
      
      <el-form v-if="updateItem" ref="updateForm" :model="updateItem" :rules="formRules"  label-width="80px">
        <el-form-item label="代码" prop="code">
          <el-input size="medium" v-model="updateItem.code" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input size="medium" v-model="updateItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="description">
          <el-input size="medium" v-model="updateItem.description" placeholder="请输入" clearable></el-input>
        </el-form-item>
        
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="roleUpdate(updateIndex, updateItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="updateVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 菜单配置对话框 -->
    <el-dialog
      width="30%"
      title="菜单配置"
      :visible.sync="menuVisible"
      :destroy-on-close="true"
      @closed="handleUpdateMenuClose" >
      
      <el-form v-if="menuItem" ref="menuForm" :model="menuItem" label-width="80px">
        <el-form-item label="代码" prop="code">
          <el-input size="medium" v-model="menuItem.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input size="medium" v-model="menuItem.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单配置" prop="menuIdList">
          <el-tree
            class="margin-top-sm"
            :data="menuOptionList"
            :props="treeProps"
            :default-checked-keys="menuItem.menuIdList"
            show-checkbox
            check-strictly
            node-key="id"
            ref="menuTree"
          />
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="roleUpdateMenu(menuIndex, menuItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="menuVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      width="30%"
      title="权限配置"
      :visible.sync="permissionVisible"
      :destroy-on-close="true"
      @closed="handleUpdatePermissionClose" >
      
      <el-form v-if="permissionItem" ref="permissionForm" :model="permissionItem" label-width="80px">
        <el-form-item label="代码" prop="code">
          <el-input size="medium" v-model="permissionItem.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input size="medium" v-model="permissionItem.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限配置" >
          <el-tree
            class="margin-top-sm"
            :data="permissionOptionList"
            :props="treeProps"
            :default-checked-keys="permissionItem.permissionIdList"
            show-checkbox
            node-key="id"
            ref="permissionTree"
          />
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="roleUpdatePermission(permissionIndex, permissionItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="permissionVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin';
import BaseTable from '@/components/BaseTable';
import { 
  adminRolePage,
  adminRoleSave,
  adminRoleRemove,
  adminRoleUpdate,
  adminRoleUpdateDeleted,
  adminRoleUpdateMenu,
  adminRoleUpdatePermission } from "@/api/role.js";
import { adminMenuOptionList } from '@/api/menu';
import { adminPermissionOptionList } from '@/api/permission';
import { filterQueryParams } from "@/utils/util.js";


export default {
  name: "Role",
  components: {
    BaseTable
  },
  mixins: [TableMixin],
  data() {
    return { 
      loading: false,
      formLoading: false,

      menuOptionList: [],
      permissionOptionList: [],
      
      queryParams: {
        code: '',
        name: '',
        description: '',
      },

      updateVisible: false,
      updateIndex: null,
      updateItem: null,

      addVisible: false,
      addItem: null,

      menuVisible: false,
      menuIndex: null,
      menuItem: null,

      permissionVisible: false,
      permissionIndex: null,
      permissionItem: null,

      treeProps: {
        children: 'children',
        label: 'name'
      },
      
      formRules: {
        code: [
          {
            required: true,
            message: "角色代码不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "角色名不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getMenuOptionList()
    this.getPermissionOptionList()
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
        let res = await adminRolePage(params)
        this.setPage(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    getMenuOptionList() {
      adminMenuOptionList().then(res => {
        this.menuOptionList = res.data
      }).catch(err => {
        console.log(err);
      })
    },

    getPermissionOptionList() {
      adminPermissionOptionList().then(res => {
        this.permissionOptionList = res.data
      }).catch(err => {
        console.log(err);
      })
    },
  
    roleQuery() {
      this.initPage()
      this.getData()
    },

    handleAddOpen() {
      this.addItem = {
        code: '',
        name: '',
        description: '',
      }
      this.addVisible = true
    },

    handleAddClose() {
      this.addItem = null
      this.addVisible = false
    },

    roleSave(item) {
      this.$refs["addForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminRoleSave(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.addVisible = false
          this.roleQuery()
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
        code: item.code, 
        name: item.name,
        description: item.description,
      }
      this.updateVisible = true
    },

    handleUpdateClose() {
      this.updateIndex = null
      this.updateItem = null
      this.updateVisible = false
    },

    roleUpdate(index, item) {
      this.$refs["updateForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminRoleUpdate(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.updateVisible = false
          this.roleQuery()
        }).catch(err => {
          this.formLoading = false
          console.log(err);
        })
      })
    },

    roleUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminRoleUpdateDeleted({
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

    roleRemove(index, item) {
      this.loading = true
      adminRoleRemove({
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

    handleUpdateMenuOpen(index, item) {
      this.menuIndex = index
      this.menuItem = {
        id: item.id,
        code: item.code, 
        name: item.name,
        menuIdList: item.menuIdList
      }
      this.menuVisible = true
    },

    handleUpdateMenuClose() {
      this.menuIndex = null
      this.menuItem = null
      this.menuVisible = false
    },

    roleUpdateMenu(index, item) {
      this.formLoading = true
      adminRoleUpdateMenu({
        id: item.id,
        menuIdList: this.$refs["menuTree"].getCheckedKeys()
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.formLoading = false
        this.menuVisible = false
        this.roleQuery()
      }).catch(err => {
        this.formLoading = false
        console.log(err);
      })
    },

    handleUpdatePermissionOpen(index, item) {
      this.permissionIndex = index
      this.permissionItem = {
        id: item.id,
        code: item.code, 
        name: item.name,
        permissionIdList: item.permissionIdList
      }
      this.permissionVisible = true
    },

    handleUpdatePermissionClose() {
      this.permissionIndex = null
      this.permissionItem = null
      this.permissionVisible = false
    },
    
    roleUpdatePermission(index, item) {
      this.formLoading = true
      adminRoleUpdatePermission({
        id: item.id,
        permissionIdList: this.$refs["permissionTree"].getCheckedKeys()
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.formLoading = false
        this.permissionVisible = false
        this.roleQuery()
      }).catch(err => {
        this.formLoading = false
        console.log(err);
      })
    },
  
  },
};
</script>

<style scoped>
</style>