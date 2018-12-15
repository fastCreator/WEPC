<template>
  <div>
    <jw-upload v-model="fids"></jw-upload>
  </div>
</template>
<script>
export default {
  data () {
    return {
      fids: []
    }
  },
  watch: {
    fids (n) {
      // console.log(n)
    }
  },
  created () {
    this.fids = ['f15344094106606600284001']
  },
  methods: {}
}
</script>
<style lang="less">
.opList {
  ul {
    list-style-type: none;
  }
}
</style>
