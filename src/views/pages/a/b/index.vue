<template>
  <div>BBBBBBBBBBBBBBB
    <el-input v-model="bdata"/>
    <router-link :to="{ name: '/a/b/g'}">GGGGGGGGGGGGGGGGGGGGGGGG</router-link>
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
  methods: {}
}
</script>
<style lang="less" scoped>

</style>
