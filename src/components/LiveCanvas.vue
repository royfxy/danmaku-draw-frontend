<template>
    <canvas
        id="canvas-drawing"
        width="720"
        height="720"
        ref="drawCanvas"
    ></canvas>
    <canvas id="canvas-grid" width="720" height="720" ref="gridCanvas"></canvas>
</template>

<script>
export default {
    props: {
        cols: Number,
        rows: Number,
    },
    setup() {
        
    },
    methods:{
        initCanvas(){
            const drawCtx = this.$refs.drawCanvas.getContext("2d");
            drawCtx.fillStyle = "rgb(55,0,0)";
            drawCtx.fillRect(0, 0, 720, 720);
            console.log("fill")
        }
    },
    mounted(){
        this.initCanvas()
    }
};
</script>

<style lang="scss" scoped>
canvas{
    height: min(100vh, 100vw);
    width: min(100vh, 100vw);
    position: absolute;
}
#canvas-grid {
    position: absolute;
}
</style>