<template>
    <div>
        <block-bank @rootBlock="$refs.area.createRoot($event)" class="ma-4" ref="bank"></block-bank>
        <block-area @correct="$emit('correct')" class="ma-4" ref="area"></block-area>
    </div>
</template>
<script>
    import BlockArea from './BlockArea.vue'
    import BlockBank from './BlockBank.vue'


    export default {
        data: ()=>({
            currentChapter: ""
        }),
        components: {
            BlockArea,
            BlockBank
        },
        methods: {
            setCurrentChapter: function(chapter) {
                this.$refs.bank.loadBlocks(chapter);
                this.$refs.area.setCurrentChapter(chapter);
            }
        }
    }

</script>
<style>
    .blockContainer {
        min-height: 500px;
        background-color: grey;
    }
</style>
