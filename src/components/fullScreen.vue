<template>
  <div class="fullScreen">
    <div class="title"><span @click="$router.back(-1)">返回</span>{{$route.meta.title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'fullScreen',
  props: {
    msg: String
  },
  data () {
    return {
      nav: [],
      active: this.$route.path
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="less">
.fullScreen {
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
</style>
