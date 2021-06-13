<script>
import { ref } from "vue";
export default {
    props: {
        hold: {
            type: Number,
            default: 3000,
        },
    },
    setup(props, context) {
        let visible = ref(true);
        console.log("1111", context.slots.default())
        let animId = 0;
        const containerRef = ref([]);
        const contentLeftRef = ref()
        const contentRightRef = ref()

        const template = ()=>
        <div class="auto-scroll-container" ref={containerRef}>
            <span class= "auto-scroll-content" id="contentLeft" ref={contentLeftRef}>{context.slots.default()}</span>
            {
                visible.value ? <span class= "auto-scroll-content" id="contentRight" ref={contentRightRef}>{context.slots.default()}</span>: null
            }
            
        </div>

        return {
            template,
            containerRef,
            contentLeftRef,
            contentRightRef,
            visible,
            animId
        }
    },
    render() {
        return this.template()
    },

    methods: {
        printRef() {
            console.log(this.$refs)
        },
        updateDOM() {
            let container = this.containerRef;
            let contentLeft = this.contentLeftRef;

            if (contentLeft.clientWidth <= container.clientWidth) {
                this.visible = false;
                return;
            } else {
                this.visible = true;
            }
        },

        scroll() {
            cancelAnimationFrame(this.animId);
            if (!this.visible) return;
            let container = this.containerRef;
            let contentRight = this.contentRightRef;
            let that = this;
            container.scrollLeft = 0;
            function scrollLeft() {
                if (container.scrollLeft - contentRight.offsetWidth >= 0) {
                    container.scrollLeft = 0;
                    setTimeout(() => {
                        that.animId = requestAnimationFrame(scrollLeft);
                    }, that.hold);
                } else {
                    container.scrollLeft++;
                    that.animId = requestAnimationFrame(scrollLeft);
                }
            }
            setTimeout(() => {
                this.animId = requestAnimationFrame(scrollLeft);
            }, this.hold);
        },
    },
    mounted() {
        this.updateDOM();
        this.scroll();
    },
    beforeUpdate() {
        this.updateDOM();
    },
    updated() {
        this.scroll();
    },
};
</script>

<style lang="scss" scoped>
.auto-scroll-container {
    overflow: hidden;
    white-space: nowrap;
}
.auto-scroll-content {
    display: inline-block;
}
#contentRight {
    padding-right: 3rem;
    margin-left: 3rem;
}
</style>