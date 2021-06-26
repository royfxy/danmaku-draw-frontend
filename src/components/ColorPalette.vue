<template>
    <div class="color-palette">
        <div
            class="color-container"
            v-for="(color, id) in colors"
            v-bind:key="color"
        >
            <div class="color-index">{{ id }}</div>
            <div class="color-block" :style="{ backgroundColor: color }"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        colors: undefined,
    },
    setup(props) {
        return { props };
    },
};
</script>

<style lang="scss" scoped>
.color-palette {
    display: grid;
    grid-gap: 10px 5px;
    grid-template-columns: repeat(8, 1fr);
}
.color-container {
    display: flex;
    background-color: $light-dark-background-color;
    border-radius: 7px;
    padding: 2px;
}
.color-index,
.color-block {
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
    flex: 1;
    height: 25px;
    border-radius: 5px;
    line-height: 25px;
}
@media (max-width: 520px) {
    .color-palette {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>