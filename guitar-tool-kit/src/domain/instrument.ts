
export interface IInstrument {
    text: string,
    strings: number,
}

export const INSTRUMENT: { [key: string]: IInstrument } = {
    GUITAR: {
        text: 'Guitar',
        strings: 6,
    },
    BASS: {
        text: "Bass",
        strings: 4,
    },
}