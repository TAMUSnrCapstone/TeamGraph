<template>
    <v-card :color="model.color" :class="model.type == 'root' ? '': 'movable'" dark id="root">
        <v-card-title class="blockTitle">
            {{model.text}}
            <v-icon class="deleteButton" v-if="deleteable && model.type != 'root' && !disabled" @click="deleteSelf">
                delete
            </v-icon>
        </v-card-title>
        <v-list v-bind:style="{backgroundColor: model.color}" class="child-list" v-if="hasChildren && allowChildren">
            <draggable @add="dropBlock" class="child" v-model="model.children" :options="{group:'blocks',disabled: disabled}">
                <template v-if="model.children.length > 0">
                        <recursive-block v-for="(child,index) in model.children"
                                :disabled = "disabled"
                                :key = "model.id + child.id"
                                :model = "child"
                                @deleteBlock="deleteChild(index)">
                        </recursive-block>
                </template>
            </draggable>
        </v-list>
    </v-card>
</template>
<script>
import draggable from "vuedraggable";

export default {
    name: "recursive-block",
    data: ()=>({
        colors: {
            "root": "#607D8B",
            "for": "#3949AB",
            "while": "#009688",
            "statement": "#00897B",
            "conditional": "#EF6C00"
        }
    }),
    props: {
        model: Object,
        allowChildren: {
            type: Boolean,
            default: true,
        },
        deleteable: {
            type:Boolean,
            default: true
        },
        disabled: {
            type:Boolean,
            default: false
        },
        num: {
            type: Number,
            default: 0 
        }
    },
    computed: {
        hasChildren() {
            return this.model.type == "for" 
                || this.model.type == "root"
                || this.model.type == "while"
                || this.model.type == "conditional"
        },
        color() {
            return this.colors[this.model.type]
        }
    },
    components: {
        draggable
    },
    methods: {
        dropBlock: function(event){
            console.log(event);
        },
        deleteSelf: function() {
            this.$emit('deleteBlock');
        },
        deleteChild: function(index) {
            this.model.children.splice(index,1);
        }
    }
}
</script>
<style scoped>
    .child {
        min-height: 2em;
        background-color: #f3f3f3
    }

    .movable {
        cursor: move;
    }
    .movable:hover {
        opacity: 0.9;
    }
    .child-list {
        padding-left: 2em;
    }
    #root {
        border-radius: 0;
        font-weight: bold;
    }
    #root, #root>.child-list {
        height: 100%;
    }

    .blockTitle .deleteButton {
        display: none;
        margin-left: auto;
        height: 0.8em;
    }

    .blockTitle:hover .deleteButton {
        display: inline;
    }
</style>

