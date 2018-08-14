<template>
  <el-container class="page">
    <el-header height="30px">
      <nav-top></nav-top>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <nav-left></nav-left>
      </el-aside>
      <el-main>

        <jw-keep-alive ref="view" :read="read">
          <full-screen v-if="$route.meta.fullScreen">
            <router-view />
          </full-screen>
          <router-view v-else ref="ctx"/>
        </jw-keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      read: false
    }
  },
  created () {
    // 把所有路由打平，实现A->A/详情页  时把A页面缓存下来    A/详情页 ->A 读取缓存    A->B页面释放缓存  ,能够在框架中，解决全屏模态窗口，路由回退问题，以及详情等单独占用一个路由
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.fullScreen) {
        this.$refs.view.$setCache()
      }
      if (!from.meta.fullScreen && !to.meta.fullScreen) {
        this.$refs.view.$des()
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
