<template>
    <div class="blockArea">
            <block
                :disabled="answerStatus == 'correct'"
                :model="root"
                :key="root.id">
            </block>
            <v-btn v-if="answerStatus != 'correct'" dark color="green" 
              @click="check">Check</v-btn>
            <v-btn v-if="answerStatus != 'correct'" dark color="grey"
              @click="clear"> 
                Clear
            </v-btn>
            <v-chip label disabled 
              class="incorrect" 
              color="red"
              text-color="white"
              v-if="answerStatus == 'incorrect'">
              <v-icon>close</v-icon>
              Incorrect
            </v-chip>
            <v-chip label disabled 
              class="correct" 
              color="green"
              text-color="white"
              v-else-if="answerStatus == 'correct'">
              <v-icon>check</v-icon>
              Correct!
            </v-chip>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import Block from "./Block.vue";
import Axios from "axios";

export default {
  data: () => ({
    root: {},
    answerStatus: "",
    currentChapter: ""
  }),
  components: {
    draggable,
    Block
  },
  methods: {
    clear: function(event) {
      this.root.children = [];
    },
    deleteBlock: function(index) {
      this.blocks.splice(index, 1);
    },
    createRoot: function(root) {
      this.root = root;
    },
    setCurrentChapter: function(chapter) {
      this.currentChapter = chapter;
    },
    check: function() {
      console.log(this.root);
      Axios.post("/api/algorithm/" + this.currentChapter +"/check", this.root)
        .then(response => {
          this.answerStatus = response.data;
          if (this.answerStatus == 'correct') {
            this.$store.dispatch("setChapterCorrect", this.currentChapter);
            this.$emit("correct");
          }
        })
        .catch(response => console.log(response));
    }
  },
  watch: {
    root() {
      this.answerStatus = "";
    }
  }
};
</script>

<style>
.blockArea {
  margin-bottom: 4em;
}

.answer {
  display: inline-block;
  width: 10em;
  margin: 0;
  text-align: center;
  height: 1em;
}

.incorrect.v-chip--disabled {
  color: red;
}

.correct.v-chip--disabled {
  color: green;
}

</style>
