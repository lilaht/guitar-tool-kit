const fretmarkerPattern = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0];// this is a param to this function
const fretmarkerRadius = 5;
const fretmarkerColor = "000000" // what is this guys actual type supposed to be??

// TODO: change all interfaces to types
type TRendering = {
    radius: number,
    fill: string, // this is this guy's actual type??
}

export function getFretmarkerRenderings() {
    // check what is done by the inital if condition in Object.entries(neck).forEach((referenceDot) => { on github
    // TODO: update 0's and 1's to true/false

    let fretmarkerRenderings = [];

    let ox = 0; // what is ox, what does it represent?
    let oy = 0; // what is oy, what does it represent?
console.log(fretmarkerRenderings, ox, oy);
    fretmarkerPattern.forEach((fretBit) => {
        // if this fret doesn't have a marker, don't 
        if (fretBit === 0) return;

        let rendering = {} as TRendering;
        rendering.radius = fretmarkerRadius;
        rendering.fill = fretmarkerColor;
    });


    
    return [];
}


export function createFretmarkerPatternByFretNumber() {

}