/*
 *  dbg.ts
 *  This is just to get elemnts 
 *  and setup for testing of actual function
 *  Author: Roko
 *  Date: 02/2026
 * */

import {createGrid} from "./wordle/grid";


const dynamicGrid = document.getElementById("dynamic-gen-grid") as HTMLDivElement;
const dynamicGridInput = document.getElementById("dynamic-grid-input") as HTMLInputElement;

dynamicGridInput.addEventListener('change', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    createGrid(dynamicGrid, value);
    return;
})