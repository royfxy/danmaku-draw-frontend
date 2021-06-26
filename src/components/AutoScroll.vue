<template>
    <div :class="horizontal ? 'containerH' : 'containerV'" ref="container">
        <div
            :class="horizontal ? 'contentH' : 'contentV'"
            :id="horizontal ? 'contentHeadH' : 'contentHeadV'"
            ref="contentHead"
        >
            <slot> </slot>
        </div>

        <div
            :class="horizontal ? 'contentH' : 'contentV'"
            :id="horizontal ? 'contentTailH' : 'contentTailV'"
            v-show="visible"
            ref="contentTail"
        >
            <slot> </slot>
        </div>
    </div>
</template>

<script>
import { onMounted, onUpdated, ref } from "vue";
export default {
    props: {
        horizontal: {
            type: Boolean,
            default: true,
        },
        hold: {
            type: Number,
            default: 3000,
        },
    },
    setup(props) {
        let visible = ref(false);
        let animId = 0;
        let animStart = 0;
        const container = ref(null);
        const contentHead = ref(null);
        const contentTail = ref(null);

        function scrollStep(id) {
            if (id != animId || !visible.value) {
                return () => {};
            }
            return (timestamp) => {
                if (animStart === 0) {
                    animStart = timestamp;
                }
                let timeOffset = Math.max(
                    1,
                    Math.floor((timestamp - animStart)/16)
                );
                // console.log(timeOffset)
                if (props.horizontal) {
                    if (
                        container.value.scrollLeft -
                            contentTail.value.offsetWidth >=
                        0
                    ) {
                        container.value.scrollLeft = 0;
                        setTimeout(() => {
                            animStart = 0
                            window.requestAnimationFrame(scrollStep(id));
                        }, props.hold);
                    } else {
                        container.value.scrollLeft += timeOffset;
                        window.requestAnimationFrame(scrollStep(id));
                    }
                } else {
                    if (
                        container.value.scrollTop -
                            contentTail.value.offsetHeight >=
                        0
                    ) {
                        container.value.scrollTop = 0;
                        setTimeout(() => {
                            animStart = 0
                            window.requestAnimationFrame(scrollStep(id));
                        }, props.hold);
                    } else {
                        container.value.scrollTop += timeOffset;
                        window.requestAnimationFrame(scrollStep(id));
                    }
                }
                animStart = timestamp;
            };
        }

        function start() {
            animStart = 0
            if (props.horizontal) {
                container.value.scrollLeft = 0;
                visible.value =
                    contentHead.value.clientWidth > container.value.clientWidth;
            } else {
                container.value.scrollTop = 0;
                visible.value =
                    contentHead.value.clientHeight >
                    container.value.clientHeight;
            }

            if (visible.value) {
                window.requestAnimationFrame(scrollStep(animId));
            }
        }

        onUpdated(() => {
            animId += 1;
            start();
        });

        onMounted(() => {
            start();
        });

        return {
            container,
            contentHead,
            contentTail,
            visible,
        };
    },
};
</script>

<style lang="scss" scoped>
.containerH {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
}
.containerV {
    display: block;
}

.contentH {
    display: inline-block;
}
.contentV {
    display: block;
}
#contentTailH {
    padding-right: 3rem;
    margin-left: 3rem;
}
#contentTailV {
    padding-top: 2rem;
    margin-bottom: 2rem;
}
</style>