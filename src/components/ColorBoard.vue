<template>
    <div>
        <div v-for="(color, id) in colors" v-bind:key="color">
            
            <span class="color-index">{{ id }}</span>
        <span class="color-" :style="{backgroundColor: color}">123</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        colors: undefined
    },
    setup(props) {
        console.log(props)
        return {props}
    }
};
</script>

<style lang="scss" scoped>
body {
    color:black;
}
</style>