<template>
    <div class="music-panel">
        <div class="player">
            <audio
                id="music"
                muted="muted"
                :src="musicData.src"
                ref="music"
                @ended="musicEnded"
                @error="musicEnded"
            />
            <div class="music-content">
                <img class="music-cover" :src="musicData.cover" />

                <div class="music-info">
                    <auto-scroll id="music-title">{{
                        musicData.title
                    }}</auto-scroll>
                    <auto-scroll class="secondary" id="music-artists">
                        {{ musicData.artists }}
                    </auto-scroll>
                    <auto-scroll class="secondary" id="music-orderer">
                        由 {{ musicData.orderer }} 点歌
                    </auto-scroll>
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

        <auto-scroll :horizontal="false" class="playlist-container">
            <div class="playlist-item playlist-nextplay">
                <span v-show="playlistDisplay.length <= 1"> 播放列表为空 </span>
                <span v-show="playlistDisplay.length > 1">
                    下一首：{{ playlistDisplay[1] }}
                </span>
            </div>
            <ol class="playlist" id="playlist" start="2">
                <li
                    class="playlist-item"
                    v-for="(music, index) in playlistDisplay.slice(2)"
                    v-bind:key="index"
                >
                    {{ music }}
                </li>
            </ol>
        </auto-scroll>
    </div>
</template>



<script>
import { computed, nextTick, reactive, ref, watch } from "vue";
import AutoScroll from "@/components/AutoScroll.vue";

export default {
    components: {
        AutoScroll,
    },
    props: {
        playlist: Array,
    },
    setup(props, context) {
        const music = ref(null);
        const defaultData = {
            id: null,
            src: "",
            title: "未播放",
            artists: "- -",
            orderer: "- -",
            cover: require("@/assets/default-cover.jpg"),
        };
        const musicData = reactive({ ...defaultData });

        const play = async function (
            musicId,
            playURL,
            title,
            artists,
            coverURL,
            orderer
        ) {
            musicData.id = musicId;
            musicData.src = playURL;
            musicData.title = title;
            musicData.artists = artists.join(", ");
            musicData.orderer = orderer;
            musicData.cover = coverURL;
            await nextTick();
            music.value.play();
            music.value.muted = false;
        };

        const requestMusic = function () {
            context.emit("requestMusic");
        };

        const playlistDisplay = computed(() => {
            return props.playlist.map(
                (song) => `${song.user_name} - ${song.song_name} -
                    ${song.artists}`
            );
        });

        watch(
            () => props.playlist,
            (newValue) => {
                if (newValue.length === 0) {
                    Object.assign(musicData, defaultData);
                    return;
                }
                if (newValue[0].song_id != musicData.id || music.value.paused) {
                    requestMusic();
                }
                
            }
        );

        const musicEnded = function () {
            context.emit("playEnded")
        };

        return {
            props,
            playlistDisplay,
            music,
            musicData,
            play,
            requestMusic,
            musicEnded,
        };
    },
};
</script>


<style lang="scss" scoped>

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
    overflow: hidden;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    padding: 0 $gap;
    height: 100px;
    * {
        margin: 2px 0;
    }
}

.music-source-info {
    @include secondary;
    margin-top: $gap;
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
    @include large-primary-text;
}

.playlist-container {
    height: 130px;
    background-color: $darker-dark-background-color;
    border-radius: 5px;
    overflow: hidden;
}

.playlist {
    @include secondary;
    overflow: hidden;
    padding: 0 3em;
    margin: 0;
}

.playlist-nextplay {
    @include secondary;
    position: sticky;
    padding: 3px 1em;
    line-height: 1em;
    border: 3px $darker-dark-background-color solid;
    background-color: $dark-background-color;
    top: 0px;
    border-radius: 5px;
}

.playlist-item {
    line-height: 1.5em;
}

@media (max-width: 600px) {
    .music-panel {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr;
        row-gap: $gap;
    }
}
</style>