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

// ?????needs to be fixed to handle mutple x/y coords. only handles 1 fretmarker
type TFretmarkerRendering = {
    showFretmarker: boolean, // redundant with fretmarker count? either this obj shouldn't exist in array or fretmarkerCount should = 0
    fretNum: number,
    fretmarkerCount: number,  // how many dots should appear on a single fret, e.g. f12 = 2 dots
    fretmarkerIndex: number // int; if 2 dots are on fret, is this dot 1 or 2
    radius: number,
    fill: string,
    cx: number,
    cy: number,
}

export const useFretboardRenderingStore = defineStore('fretboardRenderingStore', () => {
       
    // neck w/h are calculated based on "spaceBetweenStrings". prefer default & input specific to variables?
    const neckWidth = ref(700);
    const neckHeight = ref(200);
    
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
    const fretmarkerSelection = ref([{fretNum: 3, count:1}, {fretNum: 5, count:1}, {fretNum: 7, count:1}, {fretNum: 9, count:1}, {fretNum: 12, count:2}, {fretNum: 15, count:1}, {fretNum: 17, count:1}, {fretNum: 19, count:1}, {fretNum: 21, count:1}] )
    //const fretmarkers = ref([3, 5, 7, 9, 12, 15, 17, 19, 21]) // TODO: replace with new fretmarkers
    const fretmarkerRadius = ref(7);
    const fretmarkerColor = ref("#ffffff");
    const fretColor = ref("#ffffff");
    const fretSpacing = ref(25); // sliding scale // TODO: function of w/h
    const nutSize = ref(10); // not user facing

    // strings
    const stringSize = ref([3, 3, 3, 3, 3, 3]); // 6 strings
    const stringSpacing = ref(50); // sliding scale // TODO: function of w/h

    // notes
    const noteRadius = ref(12);

    // colors!
    const noteColor = ref("000000"); // blue
    const rootColor = ref("000000"); // red
    const noteTextColor = ref("000000"); // inverse noteColor
    const rootTextColor = ref("000000"); // inverse rootColor
    const stringColor = ref("#34ebde");

    const svgViewBox = ref(`0 0 ${neckWidth.value} ${neckHeight.value}`);
    const svgStyle = ref(`width:${neckWidth.value}px;height:${neckHeight.value}px;`)
    

    // getters
    function getStringRenderings() {
        let stringRenderings = []; // TODO: string rendering type

        let ox = noteRadius.value * 1;
        let oy = startingFret.value === 0 ? noteRadius.value * 2 : 0;
        let height = (isHorizontal.value ? neckWidth.value : neckHeight.value) - (startingFret.value === 0 ? noteRadius.value * 2 : 0);

        for (let stringNum = 0; stringNum < stringCount.value; stringNum++) {
            let stringRendering = {
                x: (ox), // these seem backwards to me
                y: (oy),
                height: height,
                width: stringSize.value[stringNum],
                color: stringColor.value,
            };
            if (isHorizontal.value) {
                stringRendering = {
                    x: stringRendering.y,
                    y: stringRendering.x,
                    width: stringRendering.height,
                    height: stringRendering.width,
                    color: stringRendering.color,
                };
                if (isLefty.value) {
                    stringRendering.x = neckWidth.value - stringRendering.x - stringRendering.width;
                }
            }
            
            // TODO: switch for orientation
            let stringSpacing = (neckHeight.value) / stringCount.value;

            stringRenderings.push(stringRendering);
            ox += stringSize.value[stringNum] + stringSpacing * 1;
        }

        return stringRenderings;
    }

    function getFretRenderings() {
        let fretRenderings: TFretRendering[] = [];

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
            oy += (fretNum == 0 && useNut.value ? nutSize.value * 1 : fretSize.value * 1); // TODO: replace hasNut
            oy += fretSpacing.value * 1;
        }

        return fretRenderings;
    }

    function getFretmarkerRenderings() {
        // no fretmarkers
        if (!fretmarkerSelection.value.length) {
            return [];
        }
        
        let fretmarkerRenderings: TFretmarkerRendering[] = [];
        

        //let neck: { [key: number]: TFretmarkerRendering } = {} // TODO: name??
        let neck: TFretmarkerRendering[] = []; 

        // add one (1) fretmarker for each fret in fretmarkers array
        // TODO: this needs to change with NEW fretmarkers var
        fretmarkerSelection.value.forEach(function (fretmarker: {fretNum: number, count: number}) { // fretmarker: [{fretNum: 3, count: 2}, ...]
            let fmr = {
                showFretmarker: true,
                fretNum: fretmarker.fretNum,
                fretmarkerCount: fretmarker.count,
                fretmarkerIndex: 0,
                radius: fretmarkerRadius.value,
                fill: fretmarkerColor.value,
                cx: 0,
                cy: 0,
            }
            neck.push(fmr);
            if (fretmarker.count === 2) {// max
                let newfmr = {...fmr};
                newfmr.fretmarkerIndex = 1
                neck.push(newfmr);
            }
        });

        let neckMidpoint = Math.floor(stringCount.value / 2);

        //let previousFretmarker = {} as TFretmarkerRendering;

        neck.forEach((fretmarker, i) => { 
            const iFretNum = fretmarker.fretNum; // TODO: handle NaN
            const iFretmarkerCount = fretmarker.fretmarkerCount;
            const iFretmarkerIndex = fretmarker.fretmarkerIndex; // 0 = first fretmarker, 1 = 2nd fretmarker

            // if this fretmarker is out of fret range or there are 0 fretmarkers on this fret, skip
            if (iFretNum < startingFret.value || iFretNum > endingFret.value || iFretmarkerCount === 0)
                return;

            let fretmarkerRendering = {} as TFretmarkerRendering;

            //this for loop checks for duplicate fretNum in  the neck. 
            // if fretmarker = [3, 5, 5, 7, 9, ...], then put 1 dot on f3, 2 dots on f5
            //for (let dot = 0; dot < iFretmarkerCount; ++dot) {
            fretmarkerRendering.radius = fretmarkerRadius.value * 1;
            fretmarkerRendering.fill = fretmarkerColor.value;
            fretmarkerRendering.cx = 1
                    + (neckMidpoint > 0 ? stringSize.value.slice(0, neckMidpoint ).reduce((r, n) => r + n) : 0) // ??
                    + stringSpacing.value * (neckMidpoint - 0.5)
                    + noteRadius.value / 2
                    + fretmarkerRadius.value / 2
                    //+ (previousFretmarker ? previousFretmarker.cx : 0);

            // if there is more than 1 fretmarker on this fret, shift cx
            if (iFretmarkerCount > 1) {
                console.log(iFretmarkerIndex);
                fretmarkerRendering.cx += (stringSize.value[neckMidpoint + (iFretmarkerIndex === 0 ? -1 : 0)] + stringSpacing.value * 1) * (iFretmarkerIndex === 0 ? -1 : 1);
            }

            let offset = iFretNum - (startingFret.value || 1);
            let cy = 0;

            if (startingFret.value === 0)
                cy += noteRadius.value * 2;
            cy += useNut.value ? nutSize.value * 1 : fretSize.value * 1;
            cy += fretSize.value * offset;
            cy += fretSpacing.value * offset;
            cy += fretSpacing.value / 2;

            fretmarkerRendering.cy = cy;

            // flip x & y if horizontal
            if (isHorizontal.value) {
                let temp = fretmarkerRendering.cx ? fretmarkerRendering.cx : 0;

                fretmarkerRendering.cx = fretmarkerRendering.cy;
                fretmarkerRendering.cy = temp;
                if (isLefty.value) { // ??
                    fretmarkerRendering.cx = neckWidth.value - fretmarkerRendering.cx;
                }
            }
            fretmarkerRenderings.push(fretmarkerRendering);
            //previousFretmarker = fretmarkerRendering;
            //}
        });
        console.log(fretmarkerRenderings);
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
        svgViewBox,
        svgStyle,

        // getters
        getStringRenderings,
        getFretRenderings,
        getFretmarkerRenderings,

        // mutators
        selectInstrument,
        toggleFretmarkers,
        resetToInstrumentDefaults,
    }
})

