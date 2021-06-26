<template>
    <div class="message-container">
        <div class="container-title">提示</div>
        <transition name="mode-fade" mode="out-in">
            <div class="hint-text" v-if="transationFlag">{{ curHint }}</div>
            <div class="hint-text" v-else>{{ curHint }}</div>
        </transition>

        <div class="container-title">消息</div>
        <div class="live-message-container">
            <transition-group
                class="live-messages"
                name="live-messages"
                tag="div"
            >
                <div
                    class="live-messages-item bordered-secondary-text"
                    v-for="(message, index) in messages"
                    :key="index"
                    :class="{
                        vip: message.viplevel === 1,
                        svip: message.viplevel === 2,
                    }"
                >
                    {{ message.message }}
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
    props: {
        hints: {
            type: Array,
            required: true,
        },
        hintInterval: {
            type: Number,
            default: 10000,
        },
        messageMaxCount: {
            type: Number,
            default: 50,
        },
    },
    setup(props) {
        const curHint = ref("欢迎");
        let curHintIndex = 0;
        const transationFlag = ref(false);
        const switchHints = function () {
            transationFlag.value = !transationFlag.value;
            curHint.value = props.hints[curHintIndex];
            curHintIndex += 1;
            if (curHintIndex >= props.hints.length) {
                curHintIndex = 0;
            }
        };
        const messages = ref([]);
        const newMessage = function (message, viplevel) {
            if (messages.value.length > props.messageMaxCount) {
                messages.value.splice(0, Math.floor(props.messageMaxCount / 2));
            }
            messages.value.push({ message: message, viplevel: viplevel });
        };
        setInterval(switchHints, props.hintInterval);
        return {
            curHint,
            transationFlag,
            messages,
            newMessage,
        };
    },
};
</script>

<style lang="scss" scoped>
.message-container {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.sub-container {
    transition: all 0.15s ease-out;
}

.mode-fade-enter-active,
.mode-fade-leave-active {
    transition: opacity 0.5s ease;
}
.mode-fade-enter-from,
.mode-fade-leave-to {
    opacity: 0;
}

.hint-text {
    @include primary;
    padding: 5px 0 10px 0;
}

.live-message-container {
    flex: 1;

    min-height: 100px;
    overflow: hidden;
    position: relative;
    * {
        margin: 10px 10px 0 0;
    }
}

.live-messages {
    position: absolute;
    bottom: 0;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
}

.live-messages-item {
    transition: all 0.3s ease;
}

.live-messages-enter-from,
.live-messages-leave-to {
    opacity: 0;
}

.live-messages-leave-active {
    position: absolute;
}
</style>