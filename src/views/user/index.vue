<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <!-- 功能区 -->
    <div>
      <el-form ref="queryForm" inline :model="queryParams">
        <el-form-item label="昵称" prop="nickname">
          <el-input size="medium" v-model="queryParams.nickname" placeholder="请输入" clearable @keyup.enter.native="userQuery"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input size="medium" v-model="queryParams.phone" placeholder="请输入" clearable @keyup.enter.native="userQuery"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-search" @click="userQuery" >查询</el-button>
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
        <el-table-column prop="avatarUrl" label="头像" min-width="50">
          <template slot-scope="scope">
            <el-avatar
              shape="square"
              size="medium"
              :src="scope.row.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="100"></el-table-column>
        <el-table-column prop="phone" label="用户名/手机号" min-width="100"></el-table-column>
        <el-table-column label="角色" min-width="140">
          <template slot-scope="scope">
            <el-tag 
              v-for="(item, index) in scope.row.roleList" 
              :key="'role-' + scope.$index + '-' + index"
              class="margin-right-sm"
              size="small">
              {{ item.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="禁用" min-width="70">
          <template slot-scope="scope">
            <el-switch 
              :value="scope.row.deleted" 
              active-color="#13ce66"
              :active-value="1" 
              :inactive-value="0"
              @change="userUpdateDeleted(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="170">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="150">
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
                @confirm="userRemove(scope.$index, scope.row)">
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </template>

    </BaseTable>

    

    <!-- 编辑对话框 -->
    <el-dialog
      width="30%"
      title="用户编辑"
      :visible.sync="updateVisible"
      :destroy-on-close="true"
      @closed="handleUpdateClose" >
      
      <el-form v-if="updateItem" ref="updateForm" :rules="formRules" :model="updateItem"  label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input size="medium" v-model="updateItem.nickname" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="updateItem.roleIdList">
            <el-checkbox 
              v-for="(item, index) in roleOptionList" 
              :key="'roleOption-' + index" 
              :label="item.id" >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="userUpdate(updateIndex, updateItem)" v-loading="updateLoading">确定</el-button>
        <el-button size="medium" @click="updateVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import TableMixin from '@/mixins/TableMixin';
import BaseTable from '@/components/BaseTable';
import { 
  adminUserPage, 
  adminUserRemove, 
  adminUserUpdate, 
  adminUserUpdateDeleted } from "@/api/user.js";
import { adminRoleOptionList } from '@/api/role.js';
import { filterQueryParams } from "@/utils/util.js";

export default {
  name: "User",
  components: {
    BaseTable
  },
  mixins: [TableMixin],
  data() {
    return {
      loading: false,
      
      roleOptionList: [],

      queryParams: {
        nickname: '',
        phone: '',
      },

      updateLoading: false,
      updateVisible: false,
      updateIndex: null,
      updateItem: null,
      
      formRules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRoleOptionList()
    this.getData()
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
        let res = await adminUserPage(params)
        this.setPage(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    getRoleOptionList() {
      adminRoleOptionList().then(res => {
        this.roleOptionList = res.data
      }).catch(err => {
        console.log(err);
      })
    },
  
    userQuery() {
      this.initPage()
      this.getData()
    },

    userUpdateDeleted(index, item) {
      this.loading = true
      let target = Math.abs(item.deleted - 1)
      adminUserUpdateDeleted({
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

    handleUpdateOpen(index, item) {
      this.updateIndex = index
      this.updateItem = {
        id: item.id,
        nickname: item.nickname, 
        roleIdList: item.roleList.map(item => item.id)
      }
      this.updateVisible = true
    },

    handleUpdateClose() {
      this.updateIndex = null
      this.updateItem = null
      this.updateVisible = false
    },

    userUpdate(index, item) {
      this.$refs["updateForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.updateLoading = true
        adminUserUpdate(item).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.updateLoading = false
          this.updateVisible = false
          // 刷新列表
          this.userQuery()
        }).catch(err => {
          this.updateLoading = false
          console.log(err);
        })
      })
    },

    userRemove(index, item) {
      this.loading = true
      adminUserRemove({
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
};
</script>

<style lang="scss" scoped>
</style>