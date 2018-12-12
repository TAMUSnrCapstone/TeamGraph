// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex';
import App from './App'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import './assets/blockStyle.css'

Vue.config.productionTip = false;
Vue.use(Vuetify);

store.dispatch("getUserInfo");
store.dispatch("getChapters");

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
