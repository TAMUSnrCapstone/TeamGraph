import Vue from 'vue'
import Router from 'vue-router'
import Chapter from '@/components/Page/Chapter/Chapter.vue'


Vue.use(Router)
export default new Router({
  mode: "history",
  routes: [
    {
      path:"/",
      redirect: "/chapter/depthfirstsearch"
    },
    {
      path: '/chapter/:name',
      name: 'Chapter',
      component: Chapter
    }
  ]
})
