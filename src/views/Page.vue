<template>
  <el-container class="page">
    <el-aside width="200px">
      <nav-left></nav-left>
    </el-aside>
    <el-container>
      <el-header height="50px">
        <nav-top></nav-top>
      </el-header>
      <el-main>
        <jw-keep-alive :read="read" name="main_root">
          <full-screen v-if="$route.meta.fullScreen">
            <router-view />
          </full-screen>
          <router-view v-else ref="ctx" />
        </jw-keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'main_root',
  data () {
    return {
      read: false,
      history: []
    }
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      // let key = history.state && history.state.key
      // if (key === this.history[this.history.length - 1]) {
      //   this.history.pop()
      // } else {
      //   this.history.push(key)
      // }
      if (to.meta.fullScreen) {
        this._setCache()
      }
      if (!from.meta.fullScreen && !to.meta.fullScreen) {
        this._destroyCache()
      }
      if (from.meta.fullScreen) {
        this.read = true
      } else {
        this.read = false
      }
      next()
    })
  },
  methods: {}
}
</script>

<style lang="less">
* {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
html,
body {
  width: 100;
  height: 100%;
  // overflow: hidden;
  margin: 0;
  padding: 0;
}
.page {
  height: 100%;
  .el-header {
    height: 30px;
    background: #fff;
  }
  > .el-container {
    background: #e5e9f2;
    height: 100%;
    box-sizing: border-box;
    > .el-main {
      padding: 10px;
      margin: 10px;
      background: #fff;
      border: 1px solid #d1dbe5;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
      height: calc(~"100% - 20px");
      box-sizing: border-box;
      min-width: 1000px;
      overflow: auto;
      > .el-container {
        > .el-header {
          padding: 0;
        }
        > .el-main {
          border-top: 6px solid #e5e9f2;
        }
      }
    }
  }
}
.main-filter {
  margin-bottom: 20px;
  & > span {
    margin-right: 10px;
  }
  .el-cascader {
    width: 200px;
    .el-input {
      width: 200px;
    }
  }
}
</style>
