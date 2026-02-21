/*
 *  dbg.ts
 *  This is just to get elemnts 
 *  and setup for testing of actual function
 *  Author: Roko
 *  Date: 02/2026
 * */

import {createGrid} from "./wordle/grid";
import { showModal } from "./modal";

/* Grid generation testing */
const dynamicGrid = document.getElementById("dynamic-gen-grid") as HTMLDivElement;
const dynamicGridInput = document.getElementById("dynamic-grid-input") as HTMLInputElement;

dynamicGridInput.addEventListener('change', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    createGrid(dynamicGrid, value);
    return;
})

/* Modal Testing */
const modalInput = document.getElementById("modal-input") as HTMLInputElement;
const modalBtn = document.getElementById("show-modal") as HTMLButtonElement;
modalBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(modalInput);
    await showModal(modalInput.value);
})


// Help page testing 
const showHelpBtn = document.getElementById('show-help') as HTMLButtonElement;
const gamePage = document.getElementById('game-page') as HTMLElement;
const gamePageContent = gamePage?.querySelector('.bg-\\[\\#121213\\]') as HTMLElement;
const gamePageClose = document.getElementById('game-page-close') as HTMLButtonElement;

showHelpBtn?.addEventListener('click', () => {
    gamePage.classList.remove('hidden');
    gamePage.classList.add('modal-overlay-enter');
    gamePageContent.classList.add('modal-enter');
    document.body.style.overflow = 'hidden';
});

const closeGamePage = () => {
    gamePage.classList.add('modal-overlay-exit');
    gamePageContent.classList.add('modal-exit');
    
    setTimeout(() => {
        gamePage.classList.add('hidden');
        gamePage.classList.remove('modal-overlay-enter', 'modal-overlay-exit');
        gamePageContent.classList.remove('modal-enter', 'modal-exit');
        document.body.style.overflow = '';
    }, 200);
};

gamePageClose?.addEventListener('click', closeGamePage);

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !gamePage.classList.contains('hidden')) {
        closeGamePage();
    }
});

/* Single line word validation test */
const wordValidationGrid = document.getElementById("grid-word-validation") as HTMLDivElement;

document.addEventListener("keydown", (e) => {

});