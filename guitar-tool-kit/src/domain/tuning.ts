import { MusicalNote } from '.';

const NOTE = MusicalNote.NOTE;

export const TUNING = {
    GUITAR: {
        STANDARD: [NOTE._E, NOTE._A, NOTE._D, NOTE._G, NOTE._B, NOTE._E],
        DROP_D: [NOTE._D, NOTE._A, NOTE._D, NOTE._G, NOTE._B, NOTE._E]
    },
    BASS: {
        STANDARD: [NOTE._E, NOTE._A, NOTE._D, NOTE._G],
    }
}