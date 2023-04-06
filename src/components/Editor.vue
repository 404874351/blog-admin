<template>
  <div>
    <mavon-editor
      ref="md"
      style="max-width: 100vw; height: calc(100vh - 165px); "
      v-loading="loading"
      v-model="value"
      :tabSize="4"
      :autofocus="false"
      @change="change"
      @save="save"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
    />
  </div>
</template>

<script>
import { getToken, uploadImg } from "@/api/qiniu.js";
import { qiniu_domain } from "@/config/index.js";

export default {
  name: "Editor",
  props: {
    content: String,

  },
  data() {
    return {
      value: this.content || "",
      loading: false,
      pos: 0,
      imgObserver: {
        next: (res) => {
          
        },
        error: (err) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: "图片上传错误",
            type: 'error'
          });
        },
        complete: (res) => {
          this.loading = false
          this.$refs["md"].$img2Url(this.pos, qiniu_domain + "/" + res.key);
        }
      },
    }
  },
  created() {},
  watch: {
    content(newVal, oldVal) {
      this.value = newVal
    }
  },
  methods: {
    /**
     * 图片添加回调
     */
    imgAdd(pos, file) {
      console.log(pos, file);
      this.pos = pos
      this.imgUpload(file)
      // this.$emit("imgAdd", { pos, file, component: this })
    },

    /**
     * 图片删除回调
     */
    imgDel(fileInfo) {
      // console.log(fileInfo);
      // this.$emit("imgDel", { pos: fileInfo[0], file: fileInfo[1] })
    },

    /**
     * 编辑区变化回调
     */
    change(value, render) {
      // console.log(value, render);
      this.$emit("change", { value, render })
    },

    /**
     * 编辑区保存回调
     */
    save(value, render) {
      // console.log(value, render);
      // this.$emit("save", { value, render })
    },

    async imgUpload(file) {
      this.loading = true
      try {
        // 获取上传token
        let tokenRes = await getToken({})
        // 开始上传，后续操作参见observer
        uploadImg({
          file: file,
          token: tokenRes.data,
          observer: this.imgObserver
        })
      } catch (err) {
        console.log(err);
        this.loading = false
      }  
    },
  },
}
</script>

<style scoped>

</style>