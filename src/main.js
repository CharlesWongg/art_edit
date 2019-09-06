// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'

import Vuex from 'vuex'
import router from './router/index.js'
import { sync } from 'vuex-router-sync'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import { Group, Cell, DatetimePlugin, CloseDialogsPlugin, ConfigPlugin, BusPlugin, DevicePlugin, ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, AjaxPlugin, AppPlugin } from 'vux'
import axios from 'axios'
import qs from 'qs'

// Vue.http.options.emulateJSON = true;

// $axios
const _http = Vue.prototype.$axios = (function () {
  var axiosDeploy = axios.create({
    headers: {
      'Accept': 'application/json,text/plain,*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
  axiosDeploy.interceptors.request.use(function (config) {
    config.transformRequest = [
      function (data, header) {
        // 添加token
        data.token = window.localStorage.getItem('token') || ''
        // 本地调试
        if (/local=1/.test(window.location.search)) {
          data.local = 1
        }
        if (process.env.NODE_ENV === 'development') {
          data.local = 1
        }
        return qs.stringify(data)
      }
    ]
    return config
  })
  axiosDeploy.interceptors.response.use(function (response) {
    if (response.data.code === -100) { // 重新登录
      // window.localStorage.removeItem('token')
      // window.location.reload()
      // if (vm.$router.history.current.query.sign && vm.$router.history.current.query.code) {
      //   let sign = vm.$router.history.current.query.sign
      //   let code = vm.$router.history.current.query.code
      //   let url = '/api/mobile.php?s=/public/login'
      //   let data = {
      //     sign,
      //     code
      //   }
      //   Vue.$vux.toast.text('to post')
      //   Vue.http.Axios.post(url, data)
      //     .then(res => {
      //       let data = res.data
      //       if (data.token) {
      //         Vue.$vux.toast.text(data.token)
      //         // store.commit('updateToken', { token: data.token })
      //       }
      //     })
      //     .catch(err => {
      //       Vue.$vux.toast.text('登录失败')
      //       console.log(err)
      //     })
      // } else {
      //   let baseUrl = encodeURIComponent(window.location.href)
      //   let jumpUrl = encodeURIComponent('http://uzf.lanseemy.com')
      //   // Vue.$vux.toast.text(`http://zf.lanseemy.com/index.php?s=Access/agent&baseUrl=${baseUrl}&jumpUrl=${jumpUrl}`)
      //   // console.log(`http://zf.lanseemy.com/index.php?s=Access/agent&baseUrl=${baseUrl}&jumpUrl=${jumpUrl}`)
      //   // window.location.href = `http://zf.lanseemy.com/index.php?s=Access/agent&baseUrl=${baseUrl}&jumpUrl=${jumpUrl}`
      // }
     
      // window.location.href = '/Home'
    } else if (response.data.code === -101) { // 无权限
      Vue.$vux.confirm.show({
        title: '提示',
        content: response.data.msg,
        onCancel () {
          console.log('cancel')
        },
        onConfirm () {
          vm.$router.push('/Upgrade')
        }
      })
    }
    return response
  })
  return axiosDeploy
})()

FastClick.prototype.focus = function (targetElement) {
  targetElement.focus()
}
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.component('v-icon', Icon)
Vue.use(Vuex)

let store = new Vuex.Store()

// no transitoin in demo site
const shouldUseTransition = !/transition=none/.test(location.href)

Vue.component('group', Group)
Vue.component('cell', Cell)

// global VUX config
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})

// plugins
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(AjaxPlugin)
Vue.use(BusPlugin)
Vue.use(DatetimePlugin)

// test
if (process.env.platform === 'app') {
  Vue.use(AppPlugin, store)
}

store.registerModule('vux', {
  state: {
    domain: 'http://zf.lanseemy.com',
    demoScrollTop: 0,
    isLoading: false,
    direction: shouldUseTransition ? 'forward' : '',
    token: window.localStorage.getItem('token') || ''
  },
  mutations: {
    updateDemoPosition (state, payload) {
      state.demoScrollTop = payload.top
    },
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection (state, payload) {
      if (!shouldUseTransition) {
        return
      }
      state.direction = payload.direction
    },
    updateToken (state, payload) {
      state.token = payload.token
      window.localStorage.setItem('token', payload.token)
    },
    removeToken (state) {
      state.token = ''
      window.localStorage.removeItem('token')
    }
  },
  actions: {
    updateDemoPosition ({ commit }, top) {
      commit({ type: 'updateDemoPosition', top: top })
    },
    updateToken ({ commit }, token) {
      commit({ type: 'updateToken', token: token })
    },
    removeToken ({ commit }) {
      commit({ type: 'removeToken' })
    }
  }
})

Vue.use(CloseDialogsPlugin, router)

sync(store, router)

// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let isTouchStart = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  isTouchStart = false
  endTime = Date.now()
})
document.addEventListener('touchstart', () => {
  isTouchStart = true
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', { isLoading: true })

  // 微信授权
  if (!window.localStorage.getItem('token') || window.localStorage.getItem('token').length <= 0) {
    if (to.query.sign && to.query.code) {
      let sign = to.query.sign
      let code = to.query.code
      let url = '/api/mobile.php?s=/public/login'
      let data = {
        sign,
        code
      }
      _http.post(url, { code: code, sign: sign })
      .then(res => {
        let data = res.data
        if (data.code === 1) {
          store.commit('updateToken', { token: data.token })
          window.location.reload()
        }
      })      
    } else {
      let baseUrl = encodeURIComponent(window.location.href)
      let jumpUrl = encodeURIComponent('http://uzf.lanseemy.com')
      if (process.env.NODE_ENV !== 'development') {
        window.location.href = `http://zf.lanseemy.com/index.php?s=Access/agent&baseUrl=${baseUrl}&jumpUrl=${jumpUrl}`
      }
      // if (process.env.NODE_ENV !== 'development' || !to.query.local) window.location.href = `http://zf.lanseemy.com/index.php?s=Access/agent&baseUrl=${baseUrl}&jumpUrl=${jumpUrl}`
    }    
  }

  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  let direction

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      direction = 'forward'
    } else {
      direction = 'reverse'
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    direction = 'forward'
  }

    // 判断是否是ios左滑返回 或者 右滑前进
  if (toIndex && toIndex !== '0' && !isPush && (((Date.now() - endTime) < 377) || isTouchStart)) {
    store.commit('updateDirection', { direction: '' })
  } else {
    store.commit('updateDirection', { direction: direction })
  }
  isTouchStart = false

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
  isPush = false
  store.commit('updateLoadingStatus', { isLoading: false })
})

/* eslint-disable no-new */
const vm = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
