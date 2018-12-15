import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Page from './views/Page.vue'
import { homePage } from './config'

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
      children: pages,
      redirect: homePage
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    if (window.isLogin) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
