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

function randomInt(n) {
    return Math.floor(Math.random() * n);
}

function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = randomInt(i+1);
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }

    return a;
}

function minIndex(a, visited) {
    let minVal = Infinity;
    let minI = 0;
    for (let i = 0; i < a.length; i++) {
        if(!visited.has(i) && a[i] < minVal) {
            minI = i;
            minVal = a[i];
        }
    }
    return minI;
}

const maxWeight = 10

module.exports = {
    randomGraph: function (nNodes, nEdges) {
        let graph = new Array(nNodes);
        for (let i = 0; i < nNodes; i++) {
            graph[i] = new Array(nNodes).fill(false);
        }

        let edges = random(pairs([...Array(nNodes).keys()]), nEdges);
        edges.forEach(function (a) {
            graph[a[0]][a[1]] = true;
            graph[a[1]][a[0]] = true;
        });

        for (let i = 0; i < nNodes; i++) {
            let connected = false;
            for (let j = 0; j < nNodes; j++) {
                connected = connected || graph[i][j];
            }
            if (!connected) {
                let newNeighbor = i;
                while (newNeighbor == i) {
                    newNeighbor = Math.floor(Math.random() * graph.length);
                }
                graph[i][newNeighbor] = true;
            }
        }

        return graph;
    },
    randomConnectedGraph: function (nNodes, nEdges) {
        let graph = new Array(nNodes);
        for (let i = 0; i < nNodes; i++) {
            graph[i] = new Array(nNodes).fill(0);
        }

        let unused = shuffle([...Array(nNodes).keys()]);
        let used = []
        let edges = 0;

        used.push(unused.pop());
        for(let i = 0; i < unused.length; i++) {
            let source = unused[i];
            let target = used[randomInt(used.length)];
            let weight = randomInt(maxWeight) + 1
            graph[source][target] = weight;
            graph[target][source] = weight;

            used.push(source);
            edges++;
        }
        while (edges < nEdges) {
            let source = randomInt(nNodes);
            let target = (source + randomInt(nNodes - 2) + 1) % nNodes;
            if (graph[source][target] == 0) {
                let weight = randomInt(maxWeight) + 1
                graph[source][target] = weight;
                graph[target][source] = weight;
                edges++;
            }
        }

        return graph;
    },
    binaryTree: function(nLevels) {
        let nNodes = 2*(nLevels+1) - 1;
        let graph = new Array(nNodes);
        for (let i = 0; i < nNodes; i++) {
            graph[i] = new Array(nNodes).fill(0);
        }
        for(let i = 0; i < nLevels; i++) {
            let weight = randomInt(maxWeight) + 1
            graph[i][2*i+1] = weight;
            graph[2*i+1][i] = weight;
            weight = randomInt(maxWeight) + 1
            graph[i][2*i+2] = weight;
            graph[2*i+2][i] = weight;
        }
        return graph;
    },
    line: function(nNodes) {
        let graph = new Array(nNodes);
        for (let i = 0; i < nNodes; i++) {
            graph[i] = new Array(nNodes).fill(0);
        }
        for(let i = 0; i < nNodes - 1; i++) {
            let weight = randomInt(maxWeight) + 1
            graph[i][i+1] = weight;
            graph[i+1][i] = weight;
        }
        return graph;
    },
    star: function(nNodes) {
        let graph = new Array(nNodes);
        for (let i = 0; i < nNodes; i++) {
            graph[i] = new Array(nNodes).fill(0);
        }
        for(let i = 1; i < nNodes; i++) {
            let weight = randomInt(maxWeight) + 1
            graph[0][i] = weight;
        }
        return graph;
    },
    complete: function(nNodes) {
        let graph = new Array(nNodes);
        for (let i = 0; i < nNodes; i++) {
            graph[i] = new Array(nNodes).fill(0);
        }
        for(let i = 0; i < nNodes; i++) {
            for(let j = i+1; j < nNodes; j++) {
                let weight = randomInt(maxWeight) + 1
                graph[i][j] = weight;
                graph[j][i] = weight;
            }
        }

        return graph;
    },
    edgeList: function (graph) {
        let edges = {};
        for (let i = 0; i < graph.length; i++) {
            edges[i] = [];
            for (let j = i + 1; j < graph.length; j++) {
                if (graph[i][j] > 0) {
                    edges[i].push({
                        node: j,
                        weight: graph[i][j]
                    });
                }
            }
        }
        return edges;
    },
    dfs: function (graph) {
        let visited = new Set();
        let order = [];
        dfsUtil(graph, 0, visited, order);

        console.log(order);
        return order;

        function dfsUtil(graph, i, visited, order) {
            visited.add(i);
            order.push(i);
            for (let j = 0; j < graph.length; j++) {
                if (graph[i][j] > 0 && !visited.has(j)) {
                    dfsUtil(graph, j, visited, order);
                    order.push(i);
                }
            }
        }
    },
    bfs: function (graph) {
        let visited = new Set();
        let queue = [];
        let i = 0;

        visited.add(i);
        queue.push(i);
        while (queue.length > 0) {
            let cur = queue.shift();
            for (let j = 0; j < graph.length; j++) {
                if (graph[cur][j] > 0 && !visited.has(j)) {
                    visited.add(j);
                    queue.push(j);
                }
            }
        }

        return Array.from(visited);
    },
    djikstras: function(graph) {
        let visited = new Set();
        let distances = (new Array(graph.length)).fill(Infinity);
        let states = [];

        distances[0] = 0;
        
        while(visited.size < graph.length) {
            var index = minIndex(distances, visited);
            visited.add(index);
            let currentState = {
                currentNode: index,
                updatedNodes: []
            }
            graph[index].forEach((weight,j)=>{
                if(weight > 0 && weight + distances[index] < distances[j]) {
                    distances[j] = weight + distances[index];
                    currentState.updatedNodes.push({
                        node: j,
                        distance: distances[j]
                    })
                }
            });
            states.push(currentState);
        }

        return states;
    },
    prims: function(graph) {
        let visited = new Set();
        let distances = (new Array(graph.length)).fill(Infinity);
        let edges = {
            "0": null
        };
        distances[0] = 0;
        
        let lastNode = null;
        while(visited.size < graph.length) {
            var index = minIndex(distances, visited);
            visited.add(index);
            graph[index].forEach((weight,j)=>{
                if(weight > 0 && weight < distances[j] && !visited.has(j)) {
                    distances[j] = weight;
                    edges[j] = index;
                }
            });
            lastNode = index;
        }

        let order = [];
        visited.forEach((node)=>{
            order.push({
                source: edges[node],
                target: node
            })
        })
        return order;
    }
}