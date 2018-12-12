<template>
    <v-layout class="content" row wrap justify-left align-start>
        <v-flex xs12 shrink>
            <h1>{{chapter.title}} <v-icon color="green" v-if="complete">check</v-icon> </h1>
        </v-flex>
        <v-flex v-for="(section, index) in chapter.sections" xs12 shrink :key="index">
            <h2>{{section.header}}</h2>
            <template v-for="(item, j) in section.content">
              <p v-if="item.type == 'paragraph'" :key="item.type + j" >{{item.text}}</p>
              <p v-else-if="item.type == 'list'" :key="item.type + j" v-html="item.text">
              </p>
            </template>
            
        </v-flex>
        <v-flex lg6 grow id="graphParent">
            <graph :controls-enabled="false" ref="graph"></graph>
        </v-flex>
        <v-flex lg6 grow id="blocks">
          <block-container ref="blockContainer" @correct="$refs.graph.playAnimation()"></block-container>
        </v-flex>
    </v-layout>
</template>
<script>
import BlockContainer from "../../DragDropBLocks/BlockContainer.vue";
import Graph from "../../Graph/Graph.vue";
import Axios from "axios";

export default {
  beforeRouteEnter(to, from, next) {
    Axios.get("/api/chapters/" + to.params.name)
      .then(response => {
        next(vm => {
          vm.$store.dispatch("setCurrentChapter", to.params.name);
          vm.$refs.graph.retrieveGraph(to.params.name);
          vm.$refs.blockContainer.setCurrentChapter(to.params.name);
          vm.setChapter(response.data);
        });
      })
      .catch(() => console.log("Failed to Load Chapter"));
  },
  beforeRouteUpdate(to, from, next) {
    Axios.get("/api/chapters/" + to.params.name)
      .then(response => {
        this.chapter = response.data;
        this.$store.dispatch("setCurrentChapter", to.params.name);
        this.$refs.blockContainer.setCurrentChapter(to.params.name);
        this.$refs.graph.retrieveGraph(to.params.name);
        next();
      })
      .catch(() => console.log("Failed to Load Chapter"));
  },
  data: () => ({
    chapter: {},
    currentChapter: ""
  }),
  computed: {
    complete() {
      let chap = (this.$store.state.chapters.find(obj => obj.title == this.chapter.title))
      return chap ? chap.completed : null;
    }
  },
  components: {
    Graph,
    BlockContainer
  },
  methods: {
    setChapter(chapter) {
      this.chapter = chapter;
    },
    setCurrentChapter(name) {
      this.currentChapter = name;
    }
  }
};
</script>
<style scoped>
h1,
h2 {
  margin-bottom: 0.5em;
}

p {
  text-align: justify;
  margin: .75em 0; 
}

#graphParent {
  flex-basis: 500px;
}

#blocks {
  flex: 500px;
}

.innerList {
  list-style-type: lower-alpha !important;
}

h1 i {
  font-size: 1em;
  vertical-align: middle;
}

</style>

