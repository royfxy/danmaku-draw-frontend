<template>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <div id="head-room">
        <live-canvas :cols="10" :rows="10" />
    </div>
    <div id="tail-room">
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <h1>test</h1>
        <color-palette :colors="color" :key="color.id" />
        <Music />
        <auto-scroll-horizontal>
            <div>
                <h1>
                    12123 234234 345 456 768 456 43634 2345 2345234 234 547 678
                    345 3245 3456 4567 56788
                </h1>
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
        let str = ref(123);
        setInterval(() => {
            str.value += 1;
        }, 5000);
        return { color, str };
    },
    components: {
        Music,
        ColorPalette,
        AutoScrollHorizontal,
        LiveCanvas,
    },
};
</script>

<style lang="scss">
body {
    background-color: black;
    margin: 0;
}
#app {
    font-family: sans;
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
    flex: 560px 1;
    overflow: hidden;
}
</style>
