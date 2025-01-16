//https://github.com/theriault/vue-fretboard/blob/master/v-fretboard.js

import { ref } from 'vue'
import { defineStore } from 'pinia';
import { type TInstrument, INSTRUMENT } from '@/domain'
import { StrummingHand as SH, Orientation as O } from '@/enums';

type TFretRendering = {
    height: number,
    width: number,
    y: number,
    x: number,
    color: string,
}

type TFretmarkerRendering = {
    fretmarkerCount: number,  // how many dots should appear on a single fret, e.g. f12 = 2 dots
    showFretmarker: boolean,
    radius: number,
    fill: string,
    cx: number,
    cy: number,
}

export const useFretboardRenderingStore = defineStore('fretboardRenderingStore', () => {
       
    // neck w/h are calculated based on "spaceBetweenStrings". prefer default & input specific to variables?
    const neckWidth = ref(20);
    const neckHeight = ref(5);
    
    const strummingHand = ref(SH.right);
    const isLefty = ref(strummingHand.value === SH.left);
    
    const orientation = ref(O.horizontal);
    const isHorizontal = ref(orientation.value === O.horizontal);
    
    const instrument = ref(INSTRUMENT.GUITAR); 
    const stringCount = ref(instrument.value.strings);
    //const tuning = ref(instrument.value.strings); fretboardOptions store?

    // frets
    const startingFret = ref(0);
    const fretCount = ref(22);
    const endingFret = ref(fretCount.value - startingFret.value);
    const useFretmarkers = ref(true);
    const useNut = ref(true);
    const fretSize = ref(2);
    // new fretmarkers { 12: 2 }[] (12 = fretNumber: 2 = fretMarkerCount)
    const fretmarkers = ref([3, 5, 7, 9, 12, 15, 17, 19, 21]) // TODO: replace with new fretmarkers
    const fretmarkerRadius = ref(7);
    const fretmarkerColor = ref("000000");
    const fretColor = ref("000000");
    const fretSpacing = ref(60); // sliding scale
    const nutSize = ref(10); // not user facing

    // strings
    const stringSize = ref([1, 1, 1, 1]);
    const stringSpacing = ref(25); // sliding scale

    // notes
    const noteRadius = ref(12);

    // colors!
    const noteColor = ref("000000"); // blue
    const rootColor = ref("000000"); // red
    const noteTextColor = ref("000000"); // inverse noteColor
    const rootTextColor = ref("000000"); // inverse rootColor
    const stringColor = ref("000000");
    

    // getters
    function getStringRenderings() {
        let stringRenderings = []; // TODO: string rendering type

        let ox = noteRadius.value * 1;
        let oy = startingFret.value === 0 ? noteRadius.value * 2 : 0;
        let height = (isHorizontal.value ? neckWidth.value : neckHeight.value) - (startingFret.value === 0 ? noteRadius.value * 2 : 0);


        for (let stringNum = 0; stringNum < stringCount.value; stringNum++) {
            let stringRendering = {
                x: (isHorizontal.value ? oy : ox), // these seem backwards to me
                y: (isHorizontal.value ? ox : oy),
                height: height,
                width: stringSize.value[stringNum],
                color: stringColor.value,
            };
            if (strummingHand.value === SH.right && isHorizontal.value) { // TODO: check this against github
                stringRendering.x = neckWidth.value - stringRendering.x - stringRendering.width;
            }
            stringRenderings.push(stringRendering);
            ox += stringSize.value[stringNum] + stringSpacing.value * 1;
        }

        return stringRenderings;
    }

    function getFretRenderings() {
        let fretRenderings: TFretRendering[] = [];
        let hasNut = true;

        let oy = startingFret.value == 0 ? noteRadius.value * 2 : 0;
        for (let fretNum = 0, length = fretCount.value + 1; fretNum <= length; fretNum++) {
            let fretRendering = {
                height: fretNum == 0 && useNut.value ? nutSize.value * 1 : fretSize.value * 1,
                width: (isHorizontal.value ? neckHeight.value : neckWidth.value) - noteRadius.value * 2,
                y: oy,
                x: noteRadius.value * 1,
                color: fretColor.value,
            };
            if (isHorizontal.value) { // TODO: create a function for orientation swapping on set & elimnate this if
                fretRendering = {
                    height: fretRendering.width,
                    width: fretRendering.height,
                    y: fretRendering.x,
                    x: fretRendering.y,
                    color: fretRendering.color,
                };
                if (isLefty.value) {
                    fretRendering.x = neckWidth.value - fretRendering.x - fretRendering.width;
                }
            }
            fretRenderings.push(fretRendering);
            oy += (fretNum == 0 && hasNut ? nutSize.value * 1 : fretSize.value * 1); // TODO: replace hasNut
            oy += fretSpacing.value * 1;
        }

        return fretRenderings;
    }

    function getFretmarkerRenderings() {
        // no fretmarkers
        if (!fretmarkers.value.length) {
            return [];
        }
        
        let fretmarkerRenderings: TFretmarkerRendering[] = [];
        
        let neck = {} as { [key: number]: TFretmarkerRendering } // TODO: name??
        let fret = {} as TFretmarkerRendering;

        // add one (1) fretmarker for each fret in fretmarkers array
        // TODO: this needs to change with NEW fretmarkers var
        fretmarkers.value.forEach(function (fretmarker: number) { // fretmarker: [3, 3, 5, 7, ...] (f3 will get fretmarkerCount = 2)
            neck[fretmarker].fretmarkerCount++;
            console.log(neck);
        });

        let ox = 0;
        let oy = 0;

        // XX nested for loop
        Object.entries(neck).forEach((fretmarker, index) => { // Object.entries ==> [ ['3', {} as TFretmarkerRendering], ['12', {} as TFretmarkerRendering], ... ]
            const iFret = parseInt(fretmarker[0], 10); // TODO: handle NaN
            const iFretCount = fretmarker[1].fretmarkerCount;

            // if this fretmarker is out of fret range, skip
            if (iFret < startingFret.value || iFret > endingFret.value) return;

            //this for loop checks for duplicate fretNum in  the neck. 
            // if fretmarker = [3, 5, 5, 7, 9, ...], then put 1 dot on f3, 2 dots on f5
            for (let dot = 0; dot < iFretCount; ++dot) {
                let fretmarkerRendering = {} as TFretmarkerRendering;
                fretmarkerRendering.radius = fretmarkerRadius.value * 1;
                fretmarkerRendering.fill = fretmarkerColor.value;
                let mid = Math.floor(stringCount.value / 2);
                fretmarkerRendering.cx = 1
                        + (mid > 0 ? stringSize.value.slice(0, mid ).reduce((r, n) => r + n) : 0) // ??
                        + stringSpacing.value * (mid - 0.5)
                        + noteRadius.value / 2
                        + fretmarkerRadius.value / 2
                        + ox;


// CONTINUE FIXUP vvvvv

                if (iFretCount > 1) {
                    fretmarkerRendering.cx += (this.stringSizeNormalized[mid + (dot === 0 ? -1 : 0)] + this.stringSpace * 1) * (dot === 0 ? -1 : 1);
                }
                let cy = 0;
                if (this.startNormalized === 0) cy += this.noteRadius * 2;
                let offset = fretmarker[0] - (this.startNormalized || 1);
                cy += this.hasNut ? this.nutSize * 1 : this.fretSize * 1;
                cy += this.fretSize * offset;
                cy += this.fretSpace * offset;
                cy += this.fretSpace / 2;
                fretmarkerRendering.cy = cy;
                fretmarkerRenderings.push(fretmarkerRendering);
                if (isHorizontal.value) {
                    let temp = fretmarkerRendering.cx;
                    fretmarkerRendering.cx = fretmarkerRendering.cy;
                    fretmarkerRendering.cy = temp;
                    if (isLefty.value) {
                        fretmarkerRendering.cx = neckWidth.value - fretmarkerRendering.cx;
                    }
                }
            }
        });
        return fretmarkerRenderings;
    }
    


    // setters
    function selectInstrument(selectedInstrument: TInstrument) {
        instrument.value = selectedInstrument;
    }

    function toggleFretmarkers() {
        useFretmarkers.value = !useFretmarkers.value;
    }

    function resetToInstrumentDefaults() {
        stringCount.value = instrument.value.strings;
    }

    

    return { 
        // state
        instrument,
        stringCount,
        //tuning,
        fretCount,
        //fretmarkerPattern,

        // getters
        getStringRenderings,
        getFretRenderings,

        // mutators
        selectInstrument,
        toggleFretmarkers,
        resetToInstrumentDefaults,
    }
})
