/*

    grid.ts
    Author: Roko
    Description: This file is meant to hold
    functions for generating grid of 5 letters 
    dynamicly allowing player to have their wanted amount
    of guess
    Date: 02/2026

*/

export function createGrid(grid: HTMLDivElement, attempts: number = 5, cols: number = 5) : void {
    const COLS = 5;
    const totalBoxes = attempts * COLS;


    grid.innerHTML = '';
    grid.className = 'grid-wordle';

  grid.style.gridTemplateColumns = `repeat(${cols}, 62px)`;

    for(let i = 0; i < totalBoxes; i++){
        const box = document.createElement('div');
        box.className = 'letter-box no-letter'
        box.dataset.letter = i.toString();
        grid.appendChild(box);
    }
}