export default {
  install (Vue) {
    const components = require.context('../frame', true, /\/*\.vue$/)
    components.keys().forEach((item, i) => {
      let c = components(item).default
      Vue.component(c.name, c)
    })
  }
}
