<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>
    <div class="flex justify-center align-center">
      <el-result 
        icon="success" 
        title="成功登录" 
        subTitle="点击左侧菜单可体验所有功能">
      </el-result>
      <div class="margin-left-xl">
        <div class="margin-bottom-lg text-xl">
          您所具有的身份： 
          <el-tag 
            v-for="(item, index) in $store.state.userInfo.roleList" 
            :key="item.id"
            class="margin-right-sm"
            size="small">
            {{ item.name }}
          </el-tag>
        </div>
        <div class="margin-tb text-gray text-content text-df">
          <div>不同身份将开启不同权限。</div>
          <div>如需体验更多功能，请联系站长或管理员。</div>
        </div>
      </div>
    
    </div>

  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {

    }
  },
  created() {},
  methods: {},
}
</script>

<style scoped>

</style>