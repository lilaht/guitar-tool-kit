import { ref } from 'vue'
import { defineStore } from 'pinia'
import { INSTRUMENT, type IInstrument } from '@/domain'

export const useFretboardOptionsStore = defineStore('fretboardOptionsStore', () => {
  const instrument = ref(INSTRUMENT.GUITAR);
  //const stringCount = ref(6)
  //const tuning = ref(TUNING.STANDARD)
  
  //const 

  function changeInstrument(selectedInstrument: IInstrument) {
    instrument.value = selectedInstrument;
  }

  return { instrument, changeInstrument }
})
