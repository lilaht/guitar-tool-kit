// move ACCIDENTAL to enums folder
export const enum ACCIDENTAL {
    NATURAL = 'natural',
    SHARP = 'sharp',
    FLAT = 'flat',
}

export type TNote =  {
    text: string,
    accidental: ACCIDENTAL,
}

export class MusicalNote {
    static readonly NOTE: { [key: string]: TNote } = {
        _AF: {
            text: 'Ab',
            accidental: ACCIDENTAL.FLAT
        },
        _A: {
            text: 'A',
            accidental: ACCIDENTAL.NATURAL,
        },
        _AS: {
            text: 'A#',
            accidental: ACCIDENTAL.SHARP
        },
        _BF: {
            text: 'Bb',
            accidental: ACCIDENTAL.FLAT
        },
        _B: {
            text: 'B',
            accidental: ACCIDENTAL.NATURAL
        },
        _C: {
            text: 'C',
            accidental: ACCIDENTAL.NATURAL
        },
        _CS: {
            text: 'C#',
            accidental: ACCIDENTAL.SHARP
        },
        _DF: {
            text: 'Db',
            accidental: ACCIDENTAL.FLAT
        },
        _D: {
            text: 'D',
            accidental: ACCIDENTAL.NATURAL
        },
        _DS: {
            text: 'D#',
            accidental: ACCIDENTAL.SHARP
        },
        _EF: {
            text: 'Eb',
            accidental: ACCIDENTAL.FLAT
        },
        _E: {
            text: 'E',
            accidental: ACCIDENTAL.NATURAL
        },
        _F: {
            text: 'F',
            accidental: ACCIDENTAL.NATURAL
        },
        _FS: {
            text: 'F#',
            accidental: ACCIDENTAL.SHARP
        },
        _GF: {
            text: 'Gb',
            accidental: ACCIDENTAL.FLAT
        },
        _G: {
            text: 'G',
            accidental: ACCIDENTAL.NATURAL
        },
        _GS: {
            text: 'G#',
            accidental: ACCIDENTAL.SHARP
        },
    } as const;

    static get NOTES() {
        return [this.NOTE._AF, this.NOTE._A, this.NOTE._AS, this.NOTE._BF, this.NOTE._B, this.NOTE._C, this.NOTE._DF, this.NOTE._D, this.NOTE._DS, this.NOTE._EF, this.NOTE._E, this.NOTE._F, this.NOTE._FS, this.NOTE._GF, this.NOTE._G, this.NOTE._GS];
    }

    static get NOTES_NATURAL() {
        return this.NOTES.map(note => note.accidental === ACCIDENTAL.NATURAL);
    }

    static get NOTES_FLAT() {
        return this.NOTES.map(note => note.accidental === ACCIDENTAL.FLAT);
    }

    static get NOTES_SHARP() {
        return this.NOTES.map(note => note.accidental === ACCIDENTAL.SHARP);
    }
}