<template>
  <div class="navTop">
    <el-button @click="logout" class="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'navTop',
  props: {
    list: {}
  },
  data () {
    return {}
  },
  created () {},
  methods: {
    logout () {
      window.server.logout(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
<style lang="less">
.navTop {
  ul {
    list-style-type: none;
  }
  .logout{
    float: right;
    margin-top: 5px;
  }
}
</style>
