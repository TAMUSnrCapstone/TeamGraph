<template>
    <v-card class="pa-3" id="bank">
        <v-layout row wrap justify-left align-start>
                <draggable id="dragArea" :move="doSomething" v-model="blocks" :clone="copy" :options="dragOptions">
                    <block class="block" v-for="b in blocks" 
                        :model="b"
                        :allow-children="false"
                        :deleteable="false"
                        :key="b.id">
                    </block>
                </draggable>
            </v-flex>
        </v-layout>
    </v-card>    
</template>
<script>
import draggable from "vuedraggable";
import Block from "./Block.vue";
import Axios from "axios";

export default {
  data: () => ({
    blocks: [],
    dragOptions: {
      group: { name: "blocks", pull: "clone", put: "false", disabled: "true" }
    },
    targetBlock: "",
    targetDestination: "",
    colors: [
      "#F44336",
      "#2196F3",
      "#4CAF50",
      "#E91E63",
      "#673AB7",
      "#3F51B5",
      "#009688",
      "#FF5722",
      "#FFC107"
    ]
  }),
  components: {
    draggable,
    Block
  },
  props: {
    currentChapter: String
  },
  mounted() {
    this.loadBlocks("depthfirstsearch");
  },
  methods: {
    doSomething: function(event) {
      console.log("start");
    },
    copy: function(original) {
      return {
        type: original.type,
        text: original.text,
        children: [],
        color: original.color,
        id: new Date().getUTCMilliseconds() + ""
      };
    },
    shuffle: function() {
      var j, x, i;
      for (i = this.blocks.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this.blocks[i];
        this.blocks[i] = this.blocks[j];
        this.blocks[j] = x;
      }
    },
    loadBlocks: function(algorithm) {
      Axios.get("/api/algorithm/" + algorithm +"/blocks")
      .then(response => {
        this.blocks = [];
        response.data.forEach((block, i) => {
          if (block.type == "root") {
            this.$emit("rootBlock", {
              type: block.type,
              text: block.text,
              children: [],
              color: '#607D8B'
            });
          } else {
            this.blocks.push({
              id: i,
              type: block.type,
              text: block.text,
              color: this.colors[i % this.colors.length],
              children: []
            });
          }
        });
        this.shuffle();
      })
      .catch(response => {
        console.log(response);
      });
    }
  }
};
</script>
<style scoped>
.block {
  display: inline-block;
}
</style>
