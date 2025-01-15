//https://github.com/theriault/vue-fretboard/blob/master/v-fretboard.js

import { ref } from 'vue'
import { defineStore } from 'pinia';
import { type IInstrument, INSTRUMENT } from '@/domain'

// fretmarkers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0];

export const useFretboardRenderingStore = defineStore('fretboardRenderingStore', () => {
    const instrument = ref(INSTRUMENT.GUITAR); 
    const stringCount = ref(instrument.value.strings);
    const tuning = ref(instrument.value.strings);

    const frets = ref(22)
    const useFretmarkers = ref(false);
    //const fretmarkerRadius = ref({ x: 0.5, y: 0.5});
    const fretmarkerPattern = ref([false, false, true, false, true, false, true, false, true, false, false, true, false, false, true, false, true, false, true, false, true, false]); // standard US, 22 frest


    function changeInstrument(selectedInstrument: IInstrument) {
        instrument.value = selectedInstrument;
    }

    function toggleFretmarkers() {
        useFretmarkers.value = !useFretmarkers.value;
    }

    function resetToInstrumentDefaults() {
        stringCount.value = instrument.value.strings;
        tuning.value = instrument.value.strings;
    }

    return { 
        // state
        instrument,
        stringCount,
        tuning,
        frets,
        fretmarkerPattern,

        // getters

        // mutators
        changeInstrument,
        toggleFretmarkers,
        resetToInstrumentDefaults
    }
})
