<template>
    <v-toolbar id="toolbar" color="blue-grey" dark app fixed clipped-left>
        <v-toolbar-side-icon @click.native="toggleDrawer"></v-toolbar-side-icon>
        <span class="title ml-3 mr-5">Immersive Graphs</span>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          
          <v-btn v-if="loggedIn" flat @click.native="logout"> Logged in as {{user.firstName + " " + user.lastName}} </v-btn>
          <v-btn v-else flat @click.native="login"> Sign In with Google </v-btn>

          <!-- <a href="/auth/google/">Sign In with Google</a> -->
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
// import Login from "../Login/Login.vue";

export default {
  computed : {
    user : function() {
      return this.$store.state.user;
    },
    loggedIn : function() {
      return this.$store.state.loggedIn;
    }
  },
  methods: {
    login: function() {
      window.location.href = '/auth/google/';
    },
    logout: function() {
      window.location.href = '/api/user/logout';
    },
    toggleDrawer: function() {
      if (this.$store.state.navDrawer) {
        this.$store.dispatch("toggleDrawerOff");
      } else {
        this.$store.dispatch("toggleDrawerOn");
      }
    },
    toggleLogin: function() {
      if (this.$store.state.loginDialog) {
        this.$store.dispatch("toggleLoginOff");
      } else {
        this.$store.dispatch("toggleLoginOn");
      }
    }
  },
  components: {
    // Login
  }
};
</script>
<style>
#toolbar {
  /* z-index: 9999; */
}
</style>
