<template>
    <div class="spinner-box" v-if="show">
        <div class="animation-box">
            <div class="configure-border-1">
                <div class="configure-core"></div>
            </div>
            <div class="configure-border-2">
                <div class="configure-core"></div>
            </div>
            <div class="loading-text">{{ baseInfo.loadingText }}</div>
        </div>

    </div>
</template>
<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
const props = defineProps({
    show: { type: Boolean, required: true, default: false },
});
const baseInfo = reactive({ loadingText: '正在加载请稍后···' });
let intervalId = 'loadingIntervalid';
onMounted(() => {
    intervalId = setInterval(() => {
        if (baseInfo.loadingText.length < 13) {
            baseInfo.loadingText += '·';
        } else {
            baseInfo.loadingText = '正在加载请稍后···';
        }
    }, 400)
})

onUnmounted(() => clearInterval(intervalId))
</script>
  
<style lang="scss" scoped>
/* 动画 */



@keyframes configure-clockwise {
    0% {
        transform: rotate(0);
    }

    25% {
        transform: rotate(90deg);
    }

    50% {
        transform: rotate(180deg);
    }

    75% {
        transform: rotate(270deg);
    }

    100% {
        transform: rotate(359deg);
    }
}

@keyframes configure-xclockwise {
    0% {
        transform: rotate(45deg);
    }

    25% {
        transform: rotate(-45deg);
    }

    50% {
        transform: rotate(-135deg);
    }

    75% {
        transform: rotate(-215deg);
    }

    100% {
        transform: rotate(-305deg);
    }
}



* {
    box-sizing: border-box;
}

.spinner-box {
    width: 100%;
    height: 100%;
    position: absolute;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    background-color: #cdddff;

    .animation-box {
        margin-top: 200px;
        position: relative;

        .loading-text {
            position: absolute;
            left: 0;
            right: 0;
            top: 400px;
            bottom: 0;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
    }

}

$W: 300px;

.configure-border-1 {
    width: $W;
    height: $W;
    padding: 3px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    background: #ffab91;
    animation: configure-clockwise 3s ease-in-out 0s infinite alternate;
}

.configure-border-2 {

    width: $W;
    height: $W;
    padding: 3px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    background: rgb(63, 249, 220);
    transform: rotate(45deg);
    animation: configure-xclockwise 3s ease-in-out 0s infinite alternate;
}

.configure-core {
    width: 100%;
    height: 100%;
    background-color: #37474f;
}
</style>