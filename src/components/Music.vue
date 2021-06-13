<template>
    <div class="content-container music-panel">
        <div class="player">
            <audio id="music" src="" />
            <div class="music-content">
                <img class="music-cover" src="@/assets/default-cover.jpg" />

                <div class="music-info">
                    <div id="music-title">{{ musicInfo.title }}</div>
                    <div class="secondary" id="music-artists">
                        {{ musicInfo.artist }}
                    </div>
                    <div class="secondary" id="music-orderer">
                        由 {{ musicInfo.orderer }} 点歌
                    </div>
                </div>
            </div>
            <div class="music-source-info">
                曲库来自<span class="netease-logo"
                    ><img
                        class="netease-icon"
                        src="@/assets/netease-logo.svg"
                    />网易云音乐</span
                >
            </div>
        </div>
        <div class="music-playlist-container">
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
// @import url("~@/assets/scss/_imports.scss");

.music-panel {
    white-space: nowrap;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.player {
    min-width: 0;
}

.music-content {
    display: grid;
    grid-template-columns: 0fr 1fr;
}

.music-cover {
    box-shadow: black 0 5px 20px 0;
    height: 100px;
    width: 100px;
    border-radius: 5px;
}

.music-info {
    @include secondary;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    padding-left: 10px;
    height: 100px;
}

.music-source-info {
    @include secondary;
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
    @include title;
}

.music-playlist-container {
    height: 110px;
    background-color: $darker-background-color;
    border-radius: 5px;
    padding: 10px;
    overflow: hidden;
}

.music-playlist {
    padding: 0 1.5rem;
    margin: 0;
}
</style>