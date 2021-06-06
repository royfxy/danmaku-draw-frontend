<template>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <div>
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <Music />
        <ColorBoard v-bind:colors="color" v-bind:key="color.id" />
    </div>
</template>

<script>
import Music from "@/components/Music.vue";
import ColorBoard from "@/components/ColorBoard.vue";

export default {
    name: "App",
    setup() {
      let color={"1": "#123123", "2":"#456456"}
        return{color};
    },
    components: {
        Music,
        ColorBoard,
    },
};
</script>

<style>
body {
    background-color: black;
}
#app {
    font-family: sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: white;
    margin-top: 60px;
}
</style>
