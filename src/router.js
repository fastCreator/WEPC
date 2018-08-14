import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Page from './views/Page.vue'

Vue.use(Router)

let pages = []
const components = require.context('./views/pages', true, /\/index\.vue$/)
components.keys().forEach((item, i) => {
  let path = item.replace('/index.vue', '').replace('.', '')
  let module = require('./views/pages' + item.replace('/index.vue', '/config.js').replace('.', ''))
  pages.push(Object.assign({}, module.route, {
    path: path,
    name: path,
    component: components(item).default
  }))
})

let router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'page',
      component: Page,
      children: pages
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    next()
    // if (window.isLogin) {
    //   next()
    // } else if (window.localStorage.account) {
    //   setTimeout(() => {
    //     window.server.login(window.localStorage.account, window.localStorage.code, () => {
    //       next()
    //     })
    //   }, 1000)
    // } else {
    //   next('/')
    // }
  } else {
    next()
  }
})

export default router
