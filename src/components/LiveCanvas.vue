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
        ></canvas>
        <div
            class="coordinate"
            id="top-coordinate"
            :style="hCoordinateContainerStyle"
        >
            <div
                v-for="index in cols / 5"
                :key="index"
                :style="hCoordinateStyle"
            >
                {{ index * 5 - 4 }}
            </div>
        </div>
        <div
            class="coordinate"
            id="left-coordinate"
            :style="vCoordinateContainerStyle"
        >
            <div
                v-for="index in rows / 5"
                :key="index"
                :style="vCoordinateStyle"
            >
                {{ index * 5 - 4 }}
            </div>
        </div>
        <div
            class="coordinate"
            id="bottom-coordinate"
            :style="hCoordinateContainerStyle"
            v-show="zoom == 1"
        >
            <div
                v-for="index in cols / 5"
                :key="index"
                :style="hCoordinateStyle"
            >
                {{ index * 5 - 4 }}
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
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
        minMarginSize: {
            type: Number,
            default: 50,
        },
        zoom: {
            type: Number,
            default: 1,
        },
    },
    setup(props) {
        let scaleRatio = ref(0);

        let pixelSizeRow = Math.floor(
            (props.height - 2 * props.minMarginSize) / props.rows
        );
        let pixelSizeCol = Math.floor(
            (props.width - 2 * props.minMarginSize) / props.cols
        );
        const marginSizeRow = (props.width - pixelSizeRow * props.rows) / 2;
        const marginSizeCol = (props.height - pixelSizeCol * props.cols) / 2;
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
            console.log(this.height - this.minMarginSize);
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
        },
        computeRatio({ width }) {
            this.scaleRatio = width / this.width;
            console.log("hCoordinateStyle:", this.hCoordinateStyle);
            console.log(this.zoom);
            console.log(this.pixelSizeRow * this.scaleRatio * 5 + "px");
        },
    },
    computed: {
        canvasStyle() {
            return {
                height:
                    "min(" + this.zoom * 100 + "vh, " + this.zoom * 100 + "vw)",
                width:
                    "min(" + this.zoom * 100 + "vh, " + this.zoom * 100 + "vw)",
            };
        },
        hCoordinateStyle() {
            return {
                flex:
                    this.scaleRatio * this.pixelSizeCol * 5 * this.zoom + "px",
            };
        },
        hCoordinateContainerStyle() {
            return {
                width:
                    this.scaleRatio *
                        (this.width - 2 * this.marginSizeRow) *
                        this.zoom +
                    "px",
                padding:
                    "0 " +
                    this.scaleRatio * this.marginSizeRow * this.zoom +
                    "px",
                lineHeight:
                    this.scaleRatio * this.marginSizeRow * this.zoom + "px",
                fontSize: 1 + (this.zoom - 1) / 3 + "em",
            };
        },
        vCoordinateStyle() {
            return {
                flex:
                    this.scaleRatio * this.pixelSizeRow * 5 * this.zoom + "px",
            };
        },
        vCoordinateContainerStyle() {
            return {
                width: this.scaleRatio * this.marginSizeCol * this.zoom + "px",
                paddingBottom:
                    this.scaleRatio * this.marginSizeCol * this.zoom + "px",
                lineHeight:
                    this.scaleRatio * this.pixelSizeRow * this.zoom + "px",
                fontSize: 1 + (this.zoom - 1) / 3 + "em",
            };
        },
    },
    mounted() {
        this.initCanvas();
        this.computeRatio({ width: this.$refs.drawCanvas.clientWidth });
    },
};
</script>

<style lang="scss" scoped>
.canvas-container {
    font-family: Courier, monospace;
    position: relative;
    height: min(100vh, 100vw);
    width: min(100vh, 100vw);
    background-color: $darker-background-color;
    overflow: overlay;
}
canvas {
    height: min(100vh, 100vw);
    width: min(100vh, 100vw);
    position: absolute;
    top: 0;
    left: 0;
}

.coordinate {
    // background-color: $darker-background-color;
    display: flex;
    line-height: 1em;
}

#top-coordinate {
    position: sticky;
    top: 0;
}

#left-coordinate {
    position: sticky;
    left: 0;
    align-items: center;
    flex-direction: column;
}

#bottom-coordinate {
    position: absolute;
    bottom: 0;
}
</style>