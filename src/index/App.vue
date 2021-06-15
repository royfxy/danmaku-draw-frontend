<template>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <div id="head-room">
        <live-canvas :width="1440" :height="1440" :cols="30" :rows="60" :zoom="zoom" />
    </div>
    <div id="tail-room">
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <button @click="zoomCanvas">zoom</button>
        <color-palette :colors="color" :key="color.id" />
        <Music />
        <auto-scroll-horizontal>
            <div>
                <h1>512123 234234 345 456 768 456 43634 2345 23452</h1>
                <p>{{ str }}</p>
            </div>
        </auto-scroll-horizontal>

        <auto-scroll-horizontal>
            <div>
                <h1>12123 234234 345 456 768 456 43634 2345</h1>
            </div>
        </auto-scroll-horizontal>
        
    </div>
</template>

<script>
import Music from "@/components/Music.vue";
import ColorPalette from "@/components/ColorPalette.vue";
import AutoScrollHorizontal from "@/components/AutoScrollHorizontal.vue";
import LiveCanvas from "@/components/LiveCanvas.vue";

import { ref } from "vue";

export default {
    name: "App",
    setup() {
        let color = {
            1: "#ffffff",
            2: "#d6d6d6",
            3: "#888888",
            4: "#212121",
            5: "#a16b3f",
            6: "#e60000",
            7: "#e59502",
            8: "#e5db00",
            9: "#96e046",
            10: "#03bd02",
            11: "#00d3de",
            12: "#0184c8",
            13: "#0000ec",
            14: "#81007e",
            15: "#d06de4",
            16: "#ffa7d1",
        };
        const zoom = ref(1);
        let str = ref(123);
        setInterval(() => {
            str.value += 1;
        }, 5000);
        return { color, str, zoom };
    },
    components: {
        Music,
        ColorPalette,
        AutoScrollHorizontal,
        LiveCanvas,
    },
    methods: {
        zoomCanvas() {
            this.zoom = this.zoom == 1 ? 2 : 1;
            console.log(this.zoom);
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
