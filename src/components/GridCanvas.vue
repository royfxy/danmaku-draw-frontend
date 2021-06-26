<template>
    <div class="canvas-container" v-resize="computeRatio">
        <canvas
            id="canvas-drawing"
            :width="width"
            :height="height"
            :style="canvasStyle"
            ref="drawCanvas"
        ></canvas>
        <canvas
            id="canvas-grid"
            :width="width"
            :height="height"
            :style="canvasStyle"
            ref="gridCanvas"
            v-show="gridShow"
        ></canvas>
        <div
            class="coordinate-container"
            v-for="item in coordinateStyle"
            :key="item"
            :style="[item.containerStyles, canvasStyle]"
            v-show="gridShow"
        >
            <div
                class="coordinate-num-container"
                :style="[item.numContainerStyle, item.headStyle]"
            >
                <div
                    v-for="index in Math.ceil(item.num / 5)"
                    :key="index"
                    :style="[
                        item.numStyle,
                        index % 2 == 0
                            ? { color: '#ffffffaa' }
                            : { fontWeight: 'bold' },
                    ]"
                >
                    {{ index * 5 - 4 }}
                </div>
            </div>
            <div
                class="coordinate-num-container"
                :style="[item.numContainerStyle, item.tailStyle]"
                v-show="zoom"
            >
                <div
                    v-for="index in Math.ceil(item.num / 5)"
                    :key="index"
                    :style="[
                        item.numStyle,
                        index % 2 == 0
                            ? { color: '#ffffffaa' }
                            : { fontWeight: 'bold' },
                    ]"
                >
                    {{ index * 5 - 4 }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from "vue";
import ResizeObserver from "@vue-toys/resize-observer";
export default {
    directives: {
        resize: ResizeObserver.directive,
    },
    props: {
        height: Number,
        width: Number,
        cols: Number,
        rows: Number,
        colors: Object,
        minMarginSize: {
            type: Number,
            default: 50,
        },
        zoom: {
            type: Number,
            default: 1,
        },
        gridShow: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
        let scaleRatio = ref(0);

        const pixelSizeRow = computed(() =>
            Math.floor((props.height - 2 * props.minMarginSize) / props.rows)
        );
        const pixelSizeCol = computed(() =>
            Math.floor((props.width - 2 * props.minMarginSize) / props.cols)
        );
        const marginSizeRow = computed(() =>
            (props.width - pixelSizeRow.value * props.rows) / 2
        );
        const marginSizeCol = computed(() =>
            (props.height - pixelSizeCol.value * props.cols) / 2
        );
        return {
            scaleRatio,
            pixelSizeRow,
            pixelSizeCol,
            marginSizeRow,
            marginSizeCol,
        };
    },
    methods: {
        initCanvas() {
            function drawLine(
                ctx,
                starts,
                ends,
                lineWidth,
                color,
                offsets = [0, 0]
            ) {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(starts[0] + offsets[0], starts[1] + offsets[1]);
                ctx.lineTo(ends[0] + offsets[0], ends[1] + offsets[1]);
                ctx.stroke();
            }
            const drawCtx = this.$refs.drawCanvas.getContext("2d");
            const gridCtx = this.$refs.gridCanvas.getContext("2d");
            drawCtx.fillStyle = "rgb(22,22,22)";
            drawCtx.fillRect(
                this.marginSizeCol,
                this.marginSizeRow,
                this.height - 2 * this.marginSizeCol,
                this.width - 2 * this.marginSizeRow
            );
            for (
                var i = this.marginSizeRow;
                i <= this.width - this.marginSizeRow;
                i += this.pixelSizeRow
            ) {
                
                let index = (i - this.marginSizeRow) / this.pixelSizeRow;
                let w = index % 10 == 0 ? 2 : 1;
                let c = index % 5 == 0 ? "#ffffff" : "#ffffff48";
                let o = index % 10 == 0 ? [0, 0] : [0, 0.5];
                drawLine(
                    gridCtx,
                    [this.marginSizeCol, i],
                    [this.height - this.marginSizeCol, i],
                    w,
                    c,
                    o
                );
            }
            for (
                i = this.marginSizeCol;
                i <= this.height - this.marginSizeCol;
                i += this.pixelSizeCol
            ) {
                let index = (i - this.marginSizeCol) / this.pixelSizeCol;
                let w = index % 10 == 0 ? 2 : 1;
                let c = index % 5 == 0 ? "#ffffff" : "#ffffff48";
                let o = index % 10 == 0 ? [0, 0] : [0, 0.5];
                drawLine(
                    gridCtx,
                    [i, this.marginSizeRow],
                    [i, this.height - this.marginSizeRow],
                    w,
                    c,
                    o
                );
            }
            this.computeRatio({ width: this.$refs.drawCanvas.clientWidth });
        },
        drawPixel(x, y, colorId) {
            if (x >= this.cols || x < 0 || y >= this.rows || y < 0) return
            const drawCtx = this.$refs.drawCanvas.getContext("2d");
            drawCtx.fillStyle = this.colors[colorId];
            drawCtx.fillRect(
                this.marginSizeCol + this.pixelSizeCol * x,
                this.marginSizeRow + this.pixelSizeRow * y,
                this.pixelSizeCol,
                this.pixelSizeRow
            );
        },
        computeRatio({ width }) {
            this.scaleRatio = width / this.width;
        },
    },
    computed: {
        canvasStyle() {
            return {
                height: this.zoom * 100 + "vmin",
                width: this.zoom * 100 + "vmin",
            };
        },
        coordinateStyle() {
            return [
                {
                    flexDirection: "column",
                    contentDirection: "row",
                    num: this.cols,
                    containerStyles: {
                        flexDirection: "column",
                    },
                    numContainerStyle: {
                        flexDirection: "row",
                        margin:
                            "0 " +
                            this.scaleRatio * this.marginSizeCol * this.zoom +
                            "px",
                        height:
                            this.scaleRatio * this.marginSizeRow * this.zoom +
                            "px",
                        alignItems: "center",
                        fontSize: 1 + (this.zoom - 1) / 2 + "em",
                    },
                    headStyle: { top: 0 },
                    tailStyle: { bottom: 0, marginTop: "auto" },
                    numStyle: {
                        flex:
                            "0 0 " +
                            this.scaleRatio *
                                this.pixelSizeCol *
                                5 *
                                this.zoom +
                            "px",
                    },
                },
                {
                    flexDirection: "row",
                    contentDirection: "column",
                    containerStyles: {
                        flexDirection: "row",
                    },
                    num: this.rows,
                    numContainerStyle: {
                        flexDirection: "column",
                        margin:
                            this.scaleRatio * this.marginSizeRow * this.zoom +
                            "px 0",
                        width:
                            this.scaleRatio * this.marginSizeCol * this.zoom +
                            "px",
                        alignItems: "center",
                        fontSize: 1 + (this.zoom - 1) / 2 + "em",
                    },
                    headStyle: { left: 0 },
                    tailStyle: { right: 0, marginLeft: "auto" },
                    numStyle: {
                        flex:
                            "0 0 " +
                            this.scaleRatio *
                                this.pixelSizeRow *
                                5 *
                                this.zoom +
                            "px",
                    },
                },
            ];
        },
    },
};
</script>

<style lang="scss" scoped>
.canvas-container {
    font-family: Courier, monospace;
    position: relative;
    height: 100vmin;
    width: 100vmin;
    background-color: $darker-dark-background-color;
    overflow: overlay;
}
bold {
    font-weight: bold;
}
canvas {
    height: 100vmin;
    width: 100vmin;
    position: absolute;
    top: 0;
    left: 0;
}
.coordinate-container {
    position: absolute;
    display: flex;
}

.coordinate-num-container {
    display: flex;
    position: sticky;
}
@media (max-height: 600px), (max-width: 600px) {
    .coordinate-container {
        font-size: 0.5em;
    }
}
</style>