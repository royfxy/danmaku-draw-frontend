<template>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <div id="head-room">
        <grid-canvas
            :width="canvasParms.width"
            :height="canvasParms.height"
            :cols="canvasParms.cols"
            :rows="canvasParms.rows"
            :zoom="canvasParms.zoom"
            :gridShow="canvasParms.gridShow"
            :colors="canvasParms.colors"
            ref="canvas"
        />
    </div>
    <div id="tail-room">
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <button @click="zoomCanvas">zoom</button>
        <button @click="canvasParms.gridShow = !canvasParms.gridShow">
            show grid
        </button>
        <button @click="drawCanvas">draw</button>
        <color-palette :colors="canvasParms.colors" :key="canvasParms.colors" />
        <Music />
        <auto-scroll-horizontal>
            <div>
                <h1>512123 234234 345 456 768 456 43634 2345 23452</h1>
                <p>{{ str }}</p>
            </div>
        </auto-scroll-horizontal>
    </div>
</template>

<script>
import Music from "@/components/Music.vue";
import ColorPalette from "@/components/ColorPalette.vue";
import AutoScrollHorizontal from "@/components/AutoScrollHorizontal.vue";
import GridCanvas from "@/components/GridCanvas.vue";

import { setBaseURL, getOperation, msgHandler, connectWebsocket } from "@/api/msgHandler.js";

import { nextTick, onMounted, reactive, ref } from "vue";

export default {
    name: "App",
    setup() {
        setBaseURL("https://192.168.31.119");

        // Canvas
        const canvasParms = reactive({
            colors: null,
            width: 1440,
            height: 1440,
            cols: null,
            rows: null,
            gridShow: true,
            zoom: 1,
        });
        const canvas = ref(null);
        function drawPixel(data) {
            function coordinateOf(pos) {
                return [
                    Math.floor(pos / canvasParms.cols),
                    pos % canvasParms.cols,
                ];
            }
            canvas.value.drawPixel(...coordinateOf(data.pos), data.color_id);
        }

        async function initCanvas(data) {
            canvasParms.colors = data.colors;
            canvasParms.cols = data.col_num;
            canvasParms.rows = data.row_num;
            await nextTick();
            canvas.value.initCanvas();
            let pixels = data.pixels;
            await nextTick();
            for (var i = 0; i < pixels.length; i++) {
                if (pixels[i] !== null)
                    drawPixel({ pos: i, color_id: pixels[i] });
            }
        }

        msgHandler.register("INIT_CANVAS", initCanvas);
        msgHandler.register("DRAW_PIXEL", drawPixel);
        onMounted(() => {
            getOperation("/api/canvas/canvas");
        });
        connectWebsocket("/api/canvas")

        // TODO: Music

        // TODO: Message

        let str = ref(0);
        setInterval(() => {
            str.value += 1;
        }, 5000);

        return { canvas, canvasParms, str };
    },
    components: {
        Music,
        ColorPalette,
        AutoScrollHorizontal,
        GridCanvas,
    },
    methods: {
        zoomCanvas() {
            this.canvasParms.zoom = this.canvasParms.zoom == 1 ? 2 : 1;
        },
        drawCanvas() {
            function random(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            }
            for (var i = 0; i < 50; i++) {
                let x = random(0, 50),
                    y = random(0, 50),
                    colorId = random(1, 16);
                this.$refs.canvas.drawPixel(y, x, colorId);
            }
        },
    },
};
</script>

<style lang="scss">
body {
    background-color: black;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: white;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

#head-room {
    height: min(100vh, 100vw);
    width: min(100vh, 100vw);
    flex: min(100vh, 100vw) 0;
}

#tail-room {
    padding: 0 10px;
    flex: 540px 1;
    overflow: hidden;
}
</style>
