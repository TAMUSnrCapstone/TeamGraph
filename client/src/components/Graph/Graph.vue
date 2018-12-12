<template>
  <div id="graphContainer">
    <div>
      <svg id="graph"></svg>
    </div>
    <div class="graphControls">
      <v-btn dark color="green" fab small @click="playAnimation">
        <v-icon>play_arrow</v-icon>
      </v-btn>
      <v-btn dark color="red" fab small @click="reset()">
        <v-icon>stop</v-icon>
      </v-btn>
      <v-menu offset-y>
        <v-btn slot="activator">Speed
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(speed, index) in speedList"
            :key="index"
            @click="changeSpeed(speed + '')"
          >
            <v-list-tile-title>{{ speed }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <v-btn slot="activator">Type
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(type, index) in typeList" :key="index" @click="currentType = type">
            <v-list-tile-title>{{ type }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn fab small @click="retrieveGraph($store.state.currentChapter)">
        <v-icon>shuffle</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
import Axios from "axios";

export default {
  data: () => ({
    width: 500,
    height: 500,
    animationSpeed: "1",
    timeouts: [],
    nodes: [],
    links: [],
    speeds: {
      "0.25": 2000,
      "0.5": 1000,
      "1": 500,
      "1.5": 333,
      "2": 250
    },
    currentType: "Random",
    types: {
      Random: "random",
      "Binary Tree": "binary",
      Complete: "complete",
      Line: "line",
      Star: "star"
    },
    colors: {
      visited: "grey",
      unvisited: "#03A9F4",
      current: "#F44336",
      updating: "#4CAF50"
    },
    order: []
  }),
  props: {
    controlsEnabled: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    speedList() {
      return Object.keys(this.speeds)
        .map(n => parseFloat(n))
        .sort();
    },
    typeList() {
      return Object.keys(this.types);
    }
  },
  mounted() {
    var svg = d3
      .select("#graph")
      .attr("width", this.width)
      .attr("height", this.height);
    // this.createRandom();
    this.retrieveGraph(this.$store.state.currentChapter);
    // this.draw();
  },
  methods: {
    reset: function() {
      this.clearTimeouts();

      d3.selectAll(".link line")
        .transition()
        .duration(200)
        .style("stroke", "grey");
      d3.selectAll("circle")
        .transition()
        .duration(200)
        .attr("r", 18)
        .style("fill", this.colors.unvisited);
    },
    resetColor: function() {
      let self = this;
      d3.selectAll("circle").each(function(d) {
        var currentHighlight = d3.select(this).style("fill"),
          currentRadius = d3.select(this).attr("r"),
          newHighlight = self.colors.unvisited,
          newRadius = 18;
        if (currentRadius == 15 || currentRadius == 16) {
          newHighlight =
            self.$store.state.currentChapter == "prims"
              ? self.colors.current
              : self.colors.visited;
          newRadius = 15;
        }
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", newRadius)
          .style("fill", newHighlight);
      });
    },
    retrieveGraph: function(alg) {
      Axios.get("/api/graph/" + alg + "?type=" + this.types[this.currentType])
        .then(response => {
          console.log(response);
          this.links = [];
          this.nodes = [];
          this.order = response.data.order;

          Object.entries(response.data.graph).forEach(([node, adj]) => {
            this.nodes.push(new Number(node));
            adj.forEach(adjNode => {
              this.links.push({
                source: parseInt(node),
                target: parseInt(adjNode.node),
                weight: parseInt(adjNode.weight)
              });
            });
          });
        })
        .catch(reponse => {
          console.log("retrieve failed");
        });
    },

    createRandom: function(event) {
      let width = this.width,
        height = this.height;

      var numNodes = Math.floor(Math.random() * 10 + 5);
      var numLinks = Math.floor(Math.random() * 10 + numNodes);

      var nodes = d3.range(numNodes).map(Object),
        list = random(pairs(d3.range(numNodes)), numLinks),
        links = list.map(function(a) {
          return { source: a[0], target: a[1] };
        });
      this.nodes = nodes;
      this.links = links;

      // refresh if some nodes have no links
      var n = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < links.length; j++) {
          if (links[j].source === i || links[j].target === i) {
            n++;
            break;
          }
        }
      }

      function random(s, k) {
        var a = [],
          i = -1,
          j;
        while (++i < k) {
          j = Math.floor(Math.random() * s.length);
          a.push(s.splice(j, 1)[0]);
        }
        return a;
      }

      function pairs(s) {
        var i = -1,
          a = [],
          j;
        while (++i < s.length) {
          j = i;
          while (++j < s.length) a.push([s[i], s[j]]);
        }
        return a;
      }
    },
    clearTimeouts: function() {
      this.timeouts.forEach(timeout => clearTimeout(timeout));
      this.timeouts = [];
    },
    playAnimation: function() {
      let self = this;
      this.reset();
      if (this.$store.state.currentChapter == "dijkstras") {
        this.reset();
        this.nodes.forEach((node, i) => {
          if (i != 0) {
            d3.select("#node" + node)
              .select("text")
              .text("\u221E");
          }
        });

        let i = 0;
        this.order.forEach(obj => {
          self.timeouts.push(
            setTimeout(() => {
              self.resetColor();
              d3.select("#node" + obj.currentNode)
                .select("circle")
                .transition()
                .duration(100)
                .attr("r", 16)
                .style("fill", self.colors.current);
            }, self.speeds[self.animationSpeed] * i)
          );
          i++;
          obj.updatedNodes.forEach(neighbor => {
            self.timeouts.push(
              setTimeout(() => {
                d3.select("#node" + neighbor.node)
                  .select("circle")
                  .transition()
                  .duration(100)
                  .attr("r", 16)
                  .style("fill", self.colors.updating);

                d3.select("#node" + neighbor.node)
                  .select("text")
                  .text(neighbor.distance);
              }, self.speeds[self.animationSpeed] * i)
            );
            i++;
          });
        });
      } else if (this.$store.state.currentChapter == "prims") {
        this.reset();
        let i = 0;
        this.order.forEach(edge => {
          if (edge.source != null) {
            self.timeouts.push(
              setTimeout(() => {
                let edgeName =
                  "#link" +
                  (edge.source < edge.target
                    ? "" + edge.source + edge.target
                    : "" + edge.target + edge.source);
                console.log(edgeName);
                d3.select(edgeName)
                  .select("line")
                  .transition()
                  .duration(100)
                  .style("stroke", self.colors.updating);
              }, self.speeds[self.animationSpeed] * i)
            );
          }
          i++;
          self.timeouts.push(
            setTimeout(() => {
              self.resetColor();
              d3.select("#node" + edge.target)
                .select("circle")
                .transition()
                .duration(100)
                .attr("r", 16)
                .style("fill", self.colors.current);
              if (edge.source != null) {
                let edgeName =
                  "#link" +
                  (edge.source < edge.target
                    ? "" + edge.source + edge.target
                    : "" + edge.target + edge.source);
                console.log(edgeName);
                d3.select(edgeName)
                  .select("line")
                  .transition()
                  .duration(100)
                  .style("stroke", self.colors.current);
              }
            }, self.speeds[self.animationSpeed] * i)
          );
          i++;
        });
      } else {
        this.reset();

        this.order.forEach((node, i) => {
          self.timeouts.push(
            setTimeout(() => {
              self.resetColor();
              d3.select("#node" + node)
                .select("circle")
                .transition()
                .duration(100)
                .attr("r", 16)
                .style("fill", self.colors.current);
            }, self.speeds[self.animationSpeed] * i)
          );
        });
      }
    },
    changeSpeed: function(speed) {
      this.animationSpeed = speed;
      this.reset();
    },
    draw: function() {
      this.clearTimeouts();
      var width = this.width,
        height = this.height;
      var svg = d3.select("#graph");

      svg.selectAll("*").remove();

      var force = d3.layout
        .force()
        .size([width, height])
        .nodes(d3.values(this.nodes))
        .links(this.links)
        .distance(this.currentType == "Complete" ? 300 : 75)
        .charge(this.currentType == "Complete" ? 200 : -800)
        .on("tick", tick)
        .start();

      var svgLinks = svg
        .selectAll(".link")
        .data(this.links)
        .enter()
        .append("g")
        .attr("class", "link")
        .attr("id", (d, i) => "link" + d.source + d.target);

      svgLinks
        .append("line")
        .style("stroke", "gray")
        .style("stroke-width", 5);

      if (
        this.$store.state.currentChapter != "breadthfirstsearch" &&
        this.$store.state.currentChapter != "depthfirstsearch"
      ) {
        svgLinks
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("stroke-width", 0.5)
          .attr("font-size", "1.5rem")
          .attr("dy", ".33em")
          .text(function(d, i) {
            return d.weight;
          });
      }

      var svgNodes = svg
        .selectAll(".node")
        .data(this.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("id", (d, i) => "node" + this.nodes[i])
        .call(force.drag);

      svgNodes.append("circle").attr("r", "18");

      svgNodes
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.5rem")
        .attr("fill", "white")
        .attr("dy", ".33em")
        .text(function(d, i) {
          return "" + i;
        });

      this.resetColor();

      function tick() {
        svgNodes.attr("transform", function(d) {
          return (
            "translate(" +
            Math.max(10, Math.min(width - 10, d.x)) +
            "," +
            Math.max(10, Math.min(height - 10, d.y)) +
            ")"
          );
        });
        svgLinks
          .selectAll("line")
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
        svgLinks.selectAll("text").attr("transform", function(d) {
          return (
            "translate(" +
            (d.source.x + d.target.x) / 2 +
            "," +
            (d.source.y + d.target.y) / 2 +
            ")"
          );
        });
      }
    }
  },

  watch: {
    nodes: function() {
      this.draw();
    },
    currentType: function() {
      this.retrieveGraph(this.$store.state.currentChapter);
    }
  }
};
</script>
<style>
#graphContainer {
  text-align: center;
  padding: 2em 0;
  max-width: 500px;
  margin: 0 auto;
}
#graph {
  border: 1px solid lightgray;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 3px 4px rgba(0, 0, 0, 0.24);
  background-color: #263238;
}
.graphContols {
  position: absolute;
  top: -200px !important;
}
</style>
