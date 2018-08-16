<script>
export default {
  name: 'jw-keep-alive',
  props: {
    read: {
      default: false
    },
    name: {
      default: 'main'
    }
  },
  abstract: true,
  created () {
    let root = this
    while (root.$options.name !== this.name || !root) {
      root = root.$parent
    }
    root._setCache = () => {
      this.cache = this.$slots.default[0].componentInstance
    }
    root._destroyCache = () => {
      this.cache && this.cache.$destroy()
      this.cache = null
    }
  },
  render () {
    let vnode = this.$slots.default[0]
    if (this.read && this.cache) {
      vnode.componentInstance = this.cache
      vnode.data.keepAlive = true
      vnode.componentInstance._isDestroyed = false
    }
    return vnode
  }
}
</script>
