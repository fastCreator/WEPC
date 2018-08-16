<template>
  <div class="jw-upload">
    <el-upload name="local_file" :action="action" :file-list="list" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="success" :data="param">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogImageUrl">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'jw-upload',
  props: {
    value: {
      default () {
        return []
      }
    }
  },
  watch: {
    value: {
      handler (v) {
        this.setList(v)
      },
      immediate: true
    }
  },
  data () {
    return {
      list: [],
      param: {
        proj: window.projectName
      },
      dialogImageUrl: false,
      action: window.uploadUrl
    }
  },
  created () {},
  methods: {
    handleRemove (file, fileList) {
      let fid = file.url.slice(-24)
      let index = this.value.indexOf(fid)
      this.value.splice(index, 1)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    success (res, file, fileList) {
      if (res.fid) {
        this.value.push(res.fid)
      }
    },
    setList (v) {
      this.list = v.map(it => ({ url: window.download + it }))
    }
  }
}
</script>
<style lang="less">
.jw-upload {
}
</style>
