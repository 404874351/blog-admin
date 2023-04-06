<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        <el-form-item label="菜单代码" prop="code">
          <el-input size="medium" v-model="queryParams.code" placeholder="请输入" clearable @keyup.enter.native="menuQuery"></el-input>
        </el-form-item>
        <el-form-item label="菜单名" prop="name">
          <el-input size="medium" v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter.native="menuQuery"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input size="medium" v-model="queryParams.path" placeholder="请输入" clearable @keyup.enter.native="menuQuery"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="menuQuery" >查询</el-button>
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
        <!-- <el-table-column prop="id" label="id" width="60" sortable></el-table-column> -->
        <el-table-column prop="code" label="菜单代码" min-width="160"></el-table-column>
        <el-table-column prop="name" label="菜单名" min-width="120"></el-table-column>
        <el-table-column label="图标" min-width="60">
          <template slot-scope="scope">
            <i :class="scope.row.icon" class="text-xl"></i>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="菜单路径" min-width="150"></el-table-column>
        <el-table-column prop="component" label="页面组件" min-width="180"></el-table-column>
        <el-table-column prop="hidden" label="隐藏" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.hidden" 
              :active-value="1" 
              :inactive-value="0"
              @change="menuUpdateHidden(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="隐藏" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="menuUpdateDeleted(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.createTime.slice(0, 10) }}
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
                @confirm="menuRemove(scope.$index, scope.row)">
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
      title="菜单添加"
      :visible.sync="addVisible"
      :destroy-on-close="true"
      @closed="handleAddClose" >

      <el-form v-if="addItem" ref="addForm" :model="addItem" :rules="formRules" label-width="80px">
        <el-form-item label="菜单代码" prop="code">
          <el-input size="medium" v-model="addItem.code" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单名" prop="name">
          <el-input size="medium" v-model="addItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-popover v-model="iconVisible" placement="bottom-start" width="300" trigger="click">
            <div style="height: 200px; overflow: scroll;">
              <i 
                v-for="(item, index) in iconList" 
                :key="index" 
                :class="item" 
                class="menu-icon" 
                @click="selectIcon(item)"></i>
            </div>
            <el-input 
              slot="reference" 
              size="medium" 
              :prefix-icon="addItem.icon" 
              v-model="addItem.icon" 
              placeholder="请选择" 
              clearable></el-input>
          </el-popover>
          
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input size="medium" v-model="addItem.path" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="页面组件" prop="component">
          <el-input size="medium" v-model="addItem.component" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="addItem.level == 0" label="类型" prop="type">
          <el-radio-group v-model="addItem.type">
            <el-radio :label="0">菜单项</el-radio>
            <el-radio :label="1">菜单组</el-radio>
          </el-radio-group>
        </el-form-item>
        
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="menuSave(addItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="addVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      width="30%"
      title="菜单编辑"
      :visible.sync="updateVisible"
      :destroy-on-close="true"
      @closed="handleUpdateClose" >
      <el-form v-if="updateItem" ref="updateForm" :model="updateItem" :rules="formRules" label-width="80px">
        <el-form-item label="菜单代码" prop="code">
          <el-input size="medium" v-model="updateItem.code" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单名" prop="name">
          <el-input size="medium" v-model="updateItem.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-popover v-model="iconVisible" placement="bottom-start" width="300" trigger="click">
            <div style="height: 200px; overflow: scroll;">
              <i 
                v-for="(item, index) in iconList" 
                :key="index" 
                :class="item" 
                class="menu-icon" 
                @click="selectIcon(item)"></i>
            </div>
            <el-input 
              slot="reference" 
              size="medium" 
              :prefix-icon="updateItem.icon" 
              v-model="updateItem.icon" 
              placeholder="请选择" 
              clearable></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input size="medium" v-model="updateItem.path" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="页面组件" prop="component">
          <el-input size="medium" v-model="updateItem.component" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="menuUpdate(updateIndex, updateItem)" v-loading="formLoading">确定</el-button>
        <el-button size="medium" @click="updateVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin';
import BaseTable from '@/components/BaseTable';
import { list } from "@/assets/js/icon.js";
import {
  adminMenuList,
  adminMenuSave,
  adminMenuRemove,
  adminMenuUpdate,
  adminMenuUpdateDeleted } from "@/api/menu.js";
import { filterQueryParams } from "@/utils/util.js";

export default {
  name: "Menu",
  components: {
    BaseTable
  },
  mixins: [TableMixin],
  data() {
    return { 
      loading: false,
      formLoading: false,
      
      queryParams: {
        code: '',
        name: '',
        path: '',
      },

      updateVisible: false,
      updateIndex: null,
      updateItem: null,

      addVisible: false,
      addItem: null,

      iconVisible: false,
      iconList: list,
      
      formRules: {
        code: [
          {
            required: true,
            message: "菜单代码不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "菜单名不能为空",
            trigger: "blur",
          },
        ],
        component: [
          {
            required: true,
            message: "菜单组件不能为空，模块可设置Layout",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            message: "菜单路径不能为空，模块可设置xxx-module",
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
        let res = await adminMenuList(params)
        this.setPage({ records: res.data })
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },
  
    menuQuery() {
      this.initPage()
      this.getData()
    },

    handleAddOpen(index, item) {
      this.addItem = {
        code: '',
        name: '',
        path: '',
        component: '',
        icon: '',
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

    menuSave(item) {
      this.$refs["addForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminMenuSave(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.addVisible = false
          this.menuQuery()
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
        path: item.path, 
        component: item.component, 
        icon: item.icon, 
        type: item.type,
      }
      this.updateVisible = true
    },
    handleUpdateClose() {
      this.updateIndex = null
      this.updateItem = null
      this.updateVisible = false
    },
    
    menuUpdate(index, item) {
      this.$refs["updateForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.formLoading = true
        adminMenuUpdate(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.formLoading = false
          this.updateVisible = false
          this.menuQuery()

        }).catch(err => {
          this.formLoading = false
          console.log(err);
        })
      })
    },

    menuUpdateHidden(index, item) {
      console.log(item);
      this.loading = true
      let target = Math.abs(item.hidden - 1)
      adminMenuUpdate({
        id: item.id,
        type: item.type,
        hidden: target
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false
        this.$set(item, "hidden", target)
      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },

    menuUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminMenuUpdateDeleted({
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

    menuRemove(index, item) {
      adminMenuRemove({
        id: item.id
      }).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
      this.$set(item, "permanentDeleted", true)

      }).catch(err => {
        console.log(err);
      })
    },

    selectIcon(icon) {
      if (this.addItem) {
        this.addItem.icon = icon
        this.iconVisible = false
        return
      }
      if (this.updateItem) {
        this.updateItem.icon = icon
        this.iconVisible = false
        return
      }
    },
  
  },
};
</script>

<style scoped>
.menu-icon {
  transition: color linear;
  font-size: 22px;
  padding: 5px;
}
.menu-icon:hover {
  color: #409eff;
}
</style>