<template>
    <br />
    <!-- <svg role="img" :aria-labelledby="ariaIds" :viewBox="svgViewBox" :style="svgStyle">
    
        <title :id="ariaTitleId">{{ariaTitleText}}</title>
        <desc :id="ariaDescId">{{ariaDescText}}</desc>-->
    <svg role="img" :viewBox="svgViewBox" :style="svgStyle">
        <template v-for="fretmarker in fretmarkers">
            <circle role="presentation" :cx="fretmarker.cx" :cy="fretmarker.cy" :r="fretmarker.radius" :fill="fretmarker.fill" />
        </template>
        <template v-for="fret in frets">
            <rect role="presentation" :x="fret.x" :y="fret.y" :height="fret.height" :width="fret.width" :fill="fret.color" />
        </template>
        <template v-for="string in strings">
            <rect role="presentation" :x="string.x" :y="string.y" :height="string.height" :width="string.width" :fill="string.color" />
        </template>
        <!-- <template v-for="note in scaleRendering">
            <circle role="presentation" :cx="note.cx" :cy="note.cy" :r="note.radius" :stroke="note.stroke" :fill="note.fill" />
        </template>
        <template v-for="text in scaleText">
            <text text-anchor="middle" dominant-baseline="middle" :x="text.x" :y="text.y" :fill="text.fill">{{text.text}}</text>
        </template> -->
    </svg>
</template>

<script setup lang="ts">
//https://github.com/theriault/vue-fretboard/blob/master/v-fretboard.js
import { useFretboardRenderingStore } from '@/stores';

const fretboardRenderingStore = useFretboardRenderingStore();
const frets = fretboardRenderingStore.getFretRenderings();
const strings = fretboardRenderingStore.getStringRenderings();
const fretmarkers = fretboardRenderingStore.getFretmarkerRenderings();
const svgViewBox = fretboardRenderingStore.svgViewBox;
const svgStyle = fretboardRenderingStore.svgStyle;


console.log(fretmarkers);

</script>