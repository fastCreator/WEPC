<template>
  <el-dialog
    :title="title"
    :visible="true"
    v-if="visible"
    @close="hideDialog"
  >
    <jw-form v-bind="form" ref="form"></jw-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'jw-dialog-form',
  props: {
    title: {
      default: '',
      type: String
    },
    form: {},
    visible: {}
  },
  watch: {},
  data () {
    return {}
  },
  created () {},
  methods: {
    $setValue (v) {
      this.$refs.form.$setValue(v)
    },
    hideDialog () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less">
.jw-upload {
}
</style>
