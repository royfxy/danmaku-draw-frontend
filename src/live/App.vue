<template>
    <div id="head-room">
        <grid-canvas
            :width="canvasParms.width"
            :height="canvasParms.height"
            :cols="canvasParms.cols"
            :rows="canvasParms.rows"
            :gridShow="canvasParms.gridShow"
            :colors="canvasParms.colors"
            ref="canvas"
        />
    </div>
    <div id="tail-room">
        <div class="content-container">
            <color-palette
                :colors="canvasParms.colors"
                :key="canvasParms.colors"
            />
        </div>

        <div class="content-container" id="rules">
            <div class="large-primary-text">
                像素涂色：行－列－颜色编号
            </div>
            <div class="secondary-text">
                将第 11 行 45 列的像素涂为 14 号色，发送弹幕：
                <span class="bordered-secondary-text"> 11－45－14 </span>
            </div>
            <div class="large-primary-text">
                批量涂色：将行或列替换为 起始编号:结束编号
            </div>
            <div class="secondary-text">
                将第 11 到第 45 行的第 1 列的像素都涂为 4 号色，发送弹幕：
                <span class="bordered-secondary-text"> 11:45－1－4 </span>
            </div>
            <div class="large-primary-text">点歌：点歌－关键词或歌曲 ID</div>
            <div class="secondary-text">
                <span class="bordered-secondary-text">
                    点歌－Hotel California
                </span>
                <span class="bordered-secondary-text">
                    点歌－Kygo Firestone
                </span>
                <span class="bordered-secondary-text"> 点歌－16435049 </span>
                <span class="bordered-secondary-text"> 切歌 </span>
            </div>
        </div>

        <div class="content-container">
            <music
                :playlist="playlist"
                @requestMusic="playHandler"
                @playEnded="skip"
                ref="musicPlayer"
            ></music>
        </div>

        <div class="content-container">
            <live-message :hints="messages.hints" :fixedMessage="'欢迎加入 QQ 讨论群：931320727'" ref="liveMessageDisplay" />
        </div>
    </div>
</template>

<script>
import Music from "@/components/Music.vue";
import ColorPalette from "@/components/ColorPalette.vue";
import GridCanvas from "@/components/GridCanvas.vue";
import LiveMessage from "@/components/LiveMessage.vue";

import {
    setBaseURL,
    setToken,
    requestOperation,
    msgHandler,
    connectWebsocket,
} from "@/api/msgHandler.js";

import Swal from "sweetalert2";

import { nextTick, onMounted, reactive, ref } from "vue";

export default {
    name: "App",
    components: {
        Music,
        ColorPalette,
        GridCanvas,
        LiveMessage,
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
        });

        const canvas = ref(null);

        function coordinateOf(pos) {
            return [Math.floor(pos / canvasParms.cols), pos % canvasParms.cols];
        }

        function drawPixel(data) {
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

        msgHandler.register(["INIT_CANVAS"], initCanvas);
        msgHandler.register("DRAW_PIXEL", drawPixel);
        msgHandler.register("DRAW_MULTIPLE_PIXELS", drawMutiplePixels);
        onMounted(() => {
            requestOperation("/api/canvas/canvas");
        });

        // Music
        const musicPlayer = ref(null);
        const playlist = ref([]);
        const updatePlaylist = function (data) {
            playlist.value = data;
        };
        const playMusic = function (data) {
            musicPlayer.value.play(
                data.info.id,
                data.play_url,
                data.info.name,
                data.info.artists,
                data.info.cover_url,
                data.user_name
            );
        };

        msgHandler.register("PLAY_SONG", playMusic);
        msgHandler.register("UPDATE_PLAYLIST", updatePlaylist);
        const playHandler = function () {
            requestOperation("/api/music/play");
        };
        const skip = function () {
            requestOperation("/api/music/skip");
        };
        onMounted(async () => {
            const { value: token } = await Swal.fire({
                title: "Token",
                input: "text",
                allowOutsideClick: false,
            });
            console.log("token", token);
            setToken(token);
            requestOperation("/api/music/playlist");
        });

        // Message
        const messages = reactive({ hints: [] });
        const liveMessageDisplay = ref(null);
        const initMessages = function (data) {
            messages.hints = data.hints;
        };
        msgHandler.register("INIT_MESSAGE", initMessages);
        onMounted(() => {
            requestOperation("/api/message/hints");
        });

        const newMessage = function (data) {
            liveMessageDisplay.value.newMessage(data.text, data.viplevel);
        };
        msgHandler.register("TEXT_MESSAGE", newMessage);

        // Websockets
        connectWebsocket("/api/canvas");
        connectWebsocket("/api/message");

        return {
            canvas,
            canvasParms,
            musicPlayer,
            updatePlaylist,
            playMusic,
            playHandler,
            playlist,
            skip,
            messages,
            liveMessageDisplay,
            initMessages,
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
    flex: 1;
    min-height: 100vmin;
    overflow-y: auto;
}

#tail-room > * {
    flex: 0;
}

#tail-room > :last-child {
    margin-bottom: $gap;
    flex: 1;
}
#buttons-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 5px;
}

#rules {
    * {
        margin-bottom: 5px;
    }

    .large-primary-text {
        margin: 10px 0;
    }

    :first-child {
        margin-top: 0;
    }

    :last-child {
        margin-bottom: 0;
    }
}
</style>
