<template>

  <div class="border-bottom-solid padding-xs">
    <el-tag
      v-for="(item, index) in tabList"
      :key="index"
      style="border-radius: 0; "
      class="margin-lr-xs cursor-pointer"
      size="small"
      :effect="$route.path == item.path ? 'dark' : 'plain'"
      :closable="item.closable"
      :disable-transitions="true"
      :type="$route.path == item.path ? '' : 'info'"
      @click="handleTagClick(index)"
      @close="handleTagClose(index)">
      {{ $route.path == item.path ? '● ' : '' }}{{ item.name }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "TagBar",
  props: {
    tabList: Array
  },
  data() {
    return {

    };
  },
  created() {},
  methods: {
    /**
     * 标签关闭
     */
    handleTagClose(index) {
      this.$emit("tabClose", index)
      return false;
    },
    /**
     * 标签点击
     */
    handleTagClick(index) {
      this.$emit("tabClick", index)
    },
  }
}
</script>

<style>

</style>