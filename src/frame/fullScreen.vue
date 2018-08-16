<template>
  <div class="fullScreen">
    <div class="title">
      <span @click="$router.back(-1)" class="modal-page-back">
        <i class="iconfont icon-fanhui"></i>
        <span>返回</span>
      </span>
      <span class="split">|</span>
      <span>{{$route.meta.title}}</span>
    </div>
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  & > .title {
    position: fixed;
    top: 0;
    z-index: 1800;
    background-color: #fff;
    width: 100%;
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid #d3dce6;
    padding-left: 20px;
    .modal-page-back {
      font-weight: bold;
      color: #1f2d3d;
      cursor: pointer;
      user-select: none;
      i{
        margin-right: 6px;
      }
    }
    .split{
      font-weight: bold;
      margin: 0 6px;
    }
  }
}
</style>
