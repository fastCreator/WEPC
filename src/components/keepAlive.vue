<script>
function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      return c
    }
  }
}
export default {
  name: 'jw-keep-alive',

  props: {
    read: {
      default: false
    }
  },
  data () {
    return {
      cache: null
    }
  },
  methods: {
    $setCache (ctx) {
      this.cache = this.$slots.default[0].componentInstance
    },
    $des () {
      this.cache && this.cache.$destroy()
      this.cache = null
    }
  },
  created () {
    // this.cache = this.$slots.default[0]
  },
  render () {
    console.log(this.cache)
    // console.log(this)
    let vnode = this.$slots.default[0]
    // if (this.read && this.cache) {
    //   console.log('读取缓存')
    //   vnode.componentInstance = this.cache
    //   vnode.data.keepAlive = true
    //   console.log(this.cache)
    //   console.log(vnode.componentInstance)
    //   console.log(this.cache === vnode.componentInstance)
    //   // this.cache = null
    // } else {
    //   vnode.data.keepAlive = false
    // }
    // return this.cache || this.$slots.default[0]

    if (this.read && this.cache) {
      // this.cache.data.keepAlive = true
      // // setTimeout(() => {
      console.log('读取缓存')
      vnode.componentInstance = this.cache
      vnode.data.keepAlive = true
      vnode.componentInstance._isDestroyed = false
      // // }, 0)
      // return this.cache
    }

    // vnode.data.keepAlive = true
    return vnode
  }
}
</script>
