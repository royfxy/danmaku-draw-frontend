<template>
    <div class="music-panel">
        <div class="player">
            <audio id="music" src="" />
            <div class="music-content">
                <img class="music-cover" src="@/assets/default-cover.jpg" />

                <div class="music-info">
                    <div>
                        <div id="music-title">{{ musicInfo.title }}</div>
                        <div class="secondary" id="music-artists">
                            {{ musicInfo.artist }}
                        </div>
                        <div class="secondary" id="music-orderer">
                            由 {{ musicInfo.orderer }} 点歌
                        </div>
                    </div>
                </div>
            </div>
            <div class="secondary music-source-info">
                曲库来自<span class="netease-logo"
                    ><img
                        class="netease-icon"
                        src="@/assets/netease-logo.svg"
                    />网易云音乐</span
                >
            </div>
        </div>
        <div class="secondary music-playlist-container">
            <ol class="music-playlist" id="playlist">
                <li v-for="music in playlist" v-bind:key="music">
                    {{ music }}
                </li>
            </ol>
        </div>
    </div>
</template>



<script>
import { ref } from "vue";

export default {
    setup() {
        let defaultData = {
            musicInfo: {
                title: "未播放",
                artist: "- -",
                orderer: "- -",
            },
        };
        let musicInfo = ref(defaultData.musicInfo);
        let playlist = ref([]);
        return { musicInfo, playlist };
    },
    methods: {
        play() {},
    },
};
</script>


<style lang="scss" scoped>
// @import url("~@/assets/scss/imports.scss");

.music-panel {
    white-space: nowrap;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: #121212;
    // background-color: $primary-color;
    border-radius: 12px;
    padding: 10px;
}

.player {
    min-width: 0;
}

.music-content {
    display: flex;
}

.music-cover {
    box-shadow: black 0 5px 20px 0;
    display: block;
    background-color: #111111;
    height: 100px;
    width: 100px;
    border-radius: 5px;
}

.music-info {
    display: flex;
    align-items: center;
    /* float: left; */
    padding-left: 10px;
    height: 100px;
    /* border: 1px solid white; */
}

.music-source-info {
    margin-top: 10px;
}

.netease-icon {
    height: 18px;
    vertical-align: middle;
}

.netease-logo {
    font-size: 0.9em;
    /* color: #aaaaaa; */
    color: #aa2433;
    background-color: #cc0f2530;
    /* background-color: #aaaaaa22; */
    font-weight: bold;
    padding: 2px 5px 2px 2px;
    margin: 0 2px;
    border-radius: 5px;
}

#music-title {
    letter-spacing: 0.04em;
    font-weight: bold;
}

.music-playlist-container {
    height: 110px;
    background-color: #0c0c0c;
    border-radius: 5px;
    padding: 10px;
    overflow: hidden;
}

.music-playlist {
    padding: 0 1.5em;
    margin: 0;
}
</style>