let navs = []
const components = require.context('./views/pages', true, /\/config\.js$/)

components.keys().sort((a, b) => {
  return a.replace('/config.js', '') > b.replace('/config.js', '') ? 1 : -1
}).forEach((item, i) => {
  let path = item.split('/')
  let pos = navs
  if (pos.length - 1 > 0) {
    for (let i = 0, len = path.length - 3; i < len; i++) {
      pos = pos[pos.length - 1].children
    }
  }
  let nav = components(item).nav
  pos.push(Object.assign({ children: [], name: item.replace('/config.js', '').replace('./', '/') }, nav))
})

export default navs
