<template>
    <v-navigation-drawer v-model="open" clipped fixed class="grey lighten-4" app>
      <v-list dense class="grey lighten-4">
        <template v-for="(chapter, i) in chapters">
          <v-list-tile :key="i" @click="redirect(chapter.path)">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ chapter.title }}
                <v-icon color="green" v-if="chapter.completed">check</v-icon>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
  computed: {
      open : {
          get() {return this.$store.state.navDrawer},
          set(value) {this.toggle(value)}
       },
       chapters : function() {
         return this.$store.state.chapters
       }
  },
  methods: {
      toggle: function(value) {
          if(value) {
              this.$store.dispatch('toggleDrawerOn');
          } else {
              this.$store.dispatch('toggleDrawerOff');
          }
      },
      redirect: function(path) {
        this.$router.push("/chapter/" + path);
      }
  }
};
</script>
<style>
</style>
