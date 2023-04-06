<template>
  <div>
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      stripe
      style="width: 100%;"
      :data="list"
      :row-key="rowKey ? rowKey : ''"
      :tree-props="treeProps ? treeProps : { hasChildren: 'hasChildren', children: 'children' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="50"></el-table-column>
      <slot name="columns"></slot>
      
    </el-table>
    <div class="text-center margin-top">
      <el-pagination
        v-show="!hidePagination"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="sizeList"
        :page-size="size"
        :current-page="current"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseTable",
  props: {
    sizeList: Array,
    size: Number,
    total: Number,
    current: Number,
    pages: Number,
    list: Array,
    hidePagination: Boolean,
    rowKey: String,
    treeProps: Object,
    multipleSelection: Array,
    handleSelectionChange: Function,
    handleSizeChange: Function,
    handleCurrentChange: Function
  },
}
</script>

<style>

</style>