<template>
  <div>BBBBBBBBBBBBBBB
    <el-input v-model="bdata" />
    <router-link :to="{ name: '/a/b/g', params: {title:'设置'}}">GGGGGGGGGGGGGGGGGGGGGGGG</router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {
      bdata: '11'
    }
  },
  created () {
    console.log('b', this)
  },
  activated () {
    console.log('activated')
  },
  deactivated () {
    console.log('deactivated')
  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
