// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router/index.js'
import 'vue-awesome/icons/flag'
import Icon from 'vue-awesome/components/Icon'

FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.component('v-icon', Icon)

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
