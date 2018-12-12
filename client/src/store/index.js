import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navDrawer: false,
    loginDialog: false,
    user: {},
    loggedIn: false,
    chapters: [],
    currentChapter: "breadthfirstsearch"
  },
  mutations: {
    toggleDrawerOn(state) {
      state.navDrawer = true;
    },
    toggleDrawerOff(state) {
      state.navDrawer = false;
    },
    setUser(state, u) {
      state.user = u;
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn;
    },
    setChapters(state, chapters) {
      state.chapters = chapters;
    },
    setCurrentChapter(state, chapter) {
      state.currentChapter = chapter;
    },
    setChapterCorrect(state, chapter) {
      let i = state.chapters.findIndex(obj => obj.path == chapter);
      state.chapters[i] = {
        title: state.chapters[i].title,
        path: state.chapters[i].path,
        completed: true
      }
    }
  },
  actions: {
    toggleDrawerOn(context) {
      context.commit('toggleDrawerOn');
    },
    toggleDrawerOff(context) {
      context.commit('toggleDrawerOff')
    },
    getUserInfo(context) {
      Axios.get('/api/user')
        .then(function (response) {
          context.commit('setUser', response.data);
          context.commit('setLoggedIn', true);
        })
        .catch(function (err) {
          console.log('Not Logged In');
        })
    },
    getChapters(context) {
      Axios.get('/api/chapters')
        .then(function (response) {
          console.log(response.data)
          context.commit('setChapters', response.data);
        })
        .catch(function (err) {
          console.log('Could Not Retrieve Chapters');
        })
    },
    setCurrentChapter(context, chapter) {
      context.commit('setCurrentChapter', chapter);
    },
    setChapterCorrect(context, chapter) {
      context.commit('setChapterCorrect', chapter);
    }
  }
})
