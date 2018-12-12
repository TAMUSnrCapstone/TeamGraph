<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>

<template>
  <v-app id="keep">
    <sidebar></sidebar>
    <toolbar></toolbar>

    <v-content>
      <v-container align-start fill-height fluid class="grey lighten-4">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Sidebar from './components/Nav/Sidebar.vue';
  import Toolbar from './components/Nav/Toolbar.vue';

  export default {
    name: 'App',
    components: {
      Sidebar,
      Toolbar
    }
  }
</script>

<style>
  #keep .v-navigation-drawer__border {
    display: none;
  }

.container {
  padding-left: 10em;
  padding-right: 10em;
}

.v-content {
  max-width: 1800px;
  margin: 0 auto;
}

.application--wrap {
  background-color: #f5f5f5;
}

</style>