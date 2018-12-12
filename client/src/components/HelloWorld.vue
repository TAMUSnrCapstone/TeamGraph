<template>
  <v-app id="keep">
    <sidebar></sidebar>
    <toolbar></toolbar>

    <v-content>
      <v-container align-start fill-height fluid class="grey lighten-4">
        <chapter></chapter>
      </v-container>
    </v-content>
    <login></login>
  </v-app>
</template>

<script>
  import Sidebar from './Nav/Sidebar.vue';
  import Toolbar from './Nav/Toolbar.vue';
  import Chapter from './Page/Chapter/Chapter.vue'
  import Login from './Login/Login.vue'

  export default {
    components: {
      Sidebar,
      Toolbar,
      Chapter,
      Login
    }
  }
</script>

<style>
  #keep .v-navigation-drawer__border {
    display: none;
  }
</style>