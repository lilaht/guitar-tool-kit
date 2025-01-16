
export type TInstrument = {
    text: string,
    strings: number,
}

export const INSTRUMENT: { [key: string]: TInstrument } = {
    GUITAR: {
        text: 'Guitar',
        strings: 6,
    },
    BASS: {
        text: "Bass",
        strings: 4,
    },
}