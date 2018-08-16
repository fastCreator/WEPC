<template>
  <div class="navLeft">
    <div class="company">
      <img src="../assets/logo.png">
      <div class="name">智营销平台</div>
    </div>
    <div class="collapse">
      <i class="iconfont icon-zhankai"></i>
    </div>
    <el-menu :default-active="active" @select="select" class="el-menu-vertical-demo" :collapse="false">
      <template v-for="(c,i) in nav">
        <el-submenu v-if="c.children && c.children.length" :index="c.name" :key="i">
          <template slot="title">
            <i :class="c.icon||'el-icon-menu'"></i>
            <span>{{c.title}}</span>
          </template>
          <el-menu-item v-for="(it,i) in c.children" :index="it.name" :key="i">
            <i :class="c.icon||'el-icon-tickets'"></i>
            {{it.title}}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="c.name" :key="i">
          <i :class="c.icon||'el-icon-tickets'"></i>
          <span slot="title">{{c.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import nav from '../nav.js'
export default {
  name: 'navLeft',
  props: {
    msg: String
  },
  data () {
    return {
      nav: [],
      active: this.$route.path
    }
  },
  created () {
    this.nav = nav
  },
  methods: {
    select (index) {
      this.$router.push({ path: index })
    }
  }
}
</script>
<style lang="less">
.navLeft {
  height: 100%;
  background: rgb(50, 64, 87);
  .company {
    display: inline-block;
    height: 50px;
    width: 100%;
    background: #1f2d3d;
    img {
      padding: 5px;
      display: inline-block;
      width: 35px;
      height: 35px;
      padding: 8px;
      border-right: 1px solid #364251;
    }
    .name {
      display: inline-block;
      color: #fff;
      font-size: 18px;
      line-height: 50px;
      width: calc(100% - 52px);
      vertical-align: top;
      text-align: center;
    }
  }
  & > ul > li,
  .collapse {
    border-bottom: 1px solid #475368;
  }
  .el-menu {
    border-right: solid 0px #e6e6e6;
    .el-menu-item,
    .el-submenu__title {
      background: rgb(50, 64, 87);
      color: #fff;
      height: 40px;
      line-height: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        background: #475669;
      }
      &:hover.is-active {
        background: #409eff;
        color: #fff;
      }
    }
    li li.el-menu-item {
      background: #1f2d3d;
      &.is-active,
      &:hover.is-active {
        background: #409eff;
        color: #fff;
      }
    }
    .is-active {
      background: #20a0ff;
    }
  }
  .collapse {
    color: #8492a6;
    text-align: center;
    cursor: pointer;
    line-height: 40px;
    &:hover {
      color: #fff;
    }
  }
}
</style>
