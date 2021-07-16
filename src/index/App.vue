<template>
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
        <div class="content-container">
            <div class="container-title">操作</div>
            <div id="buttons-container">
            <button
                class="large-switch-button"
                :class="{ active: canvasParms.zoom !== 1 }"
                @click="zoomCanvas"
            >
                放大
            </button>
            <button
                class="large-switch-button"
                :class="{ active: !canvasParms.gridShow }"
                @click="canvasParms.gridShow = !canvasParms.gridShow"
            >
                隐藏网格
            </button>
            <button class="large-button" @click="saveCanvasAsImage">保存图像</button>
            </div>
            </div>
            <div class="content-container">
            <div class="container-title">颜色</div>
            <color-palette
                :colors="canvasParms.colors"
                :key="canvasParms.colors"
            />
        </div>

    </div>
</template>

<script>
import ColorPalette from "@/components/ColorPalette.vue";
import GridCanvas from "@/components/GridCanvas.vue";

import {
    setBaseURL,
    requestOperation,
    msgHandler,
    connectWebsocket,
} from "@/api/msgHandler.js";

import { nextTick, onMounted, reactive, ref } from "vue";

export default {
    name: "App",
    components: {
        ColorPalette,
        GridCanvas,
    },
    setup() {
        setBaseURL(window.location.origin);
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
            canvas.value.drawPixel(...coordinateOf(data.pos), data.colorid);
        }

        function drawMutiplePixels(data) {
            for (var index in data.pos) {
                canvas.value.drawPixel(
                    ...coordinateOf(data.pos[index]),
                    data.colorid
                );
            }
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
                    drawPixel({ pos: i, colorid: pixels[i] });
            }
        }

        const zoomCanvas = function() {
            canvasParms.zoom = canvasParms.zoom == 1 ? 2 : 1;
        }

        msgHandler.register(["INIT_CANVAS"], initCanvas);
        msgHandler.register("DRAW_PIXEL", drawPixel);
        msgHandler.register("DRAW_MULTIPLE_PIXELS", drawMutiplePixels);
        onMounted(() => {
            requestOperation("/api/canvas/canvas");
        });

        const saveCanvasAsImage = function(){
            let link = document.createElement("a")
            let imageURL = canvas.value.canvasToImage()
            document.body.appendChild(link)
            link.setAttribute("href", imageURL)
            link.setAttribute("download", "canvas" + String(Date.now()) + ".png")
            link.click()
            document.body.removeChild(link)

        }

        // Websockets
        connectWebsocket("/api/canvas");

        return {
            canvas,
            canvasParms,
            zoomCanvas,
            saveCanvasAsImage
        };
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
    color: $light-primary-text-color;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

#head-room {
    height: 100vmin;
    width: 100vmin;
    flex: 100vmin 0;
}

#tail-room {
    display: flex;
    flex-direction: column;
    padding: 0 $gap;
    flex: 540px 1;
    min-height: 100vmin;
    overflow-y: auto;
}

#buttons-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 5px;
}

.container-title{
    margin-bottom: $gap;
}

</style>