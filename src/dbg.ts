/*
 *  dbg.ts
 *  This is just to get elemnts 
 *  and setup for testing of actual function
 *  Author: Roko
 *  Date: 02/2026
 * */

import {createGrid} from "./wordle/grid";
import { showModal } from "./modal";
import { GameInput } from "./wordle/keyboard";
import { WordleGame } from "./wordle/wordle";
import { CeaserChiper } from "./caesar";
import { showToast } from "./toast";

import { tokenize } from './wordle/word';
import { OnscreenKeyboard } from './wordle/onscreen-keyboard';

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
const activateBtn = document.getElementById('activate-wordle') as HTMLButtonElement;
let btnState : boolean = false;
if(!activateBtn){
    console.error("Failed to fetch button");
}

/* Get url params */
let paramWord: string | null = null;
const paramCaesarWord: string | null = new URLSearchParams(document.location.search).get("word");
console.log(paramCaesarWord);
if (paramCaesarWord) {
  paramWord = CeaserChiper.decode(paramCaesarWord, { alphabet: "abcčćdđefghijklmnoprstuvzžš" });
}
console.log('The word in url param is ', paramWord);

let game: WordleGame;

// Create game instance (must await!)
try {
  // WordleGame.create(wordListUrl, grid, word?, cols?, maxRows?, wordLength?)
  game = await WordleGame.create(
    '/hr_HR.json',           // wordListUrl
    wordValidationGrid,      // grid
    paramWord,               // word (null if no param)
    5,                       // cols (default 5)
    //5,                       // maxRows (default 5)
    5                        // wordLength (default 5)
  );
  
  game.getAnswer();
  
  // Test validation
  console.log(game.isValidWord('BOMBA')); // true or false
  
} catch (error) {
  console.error('Failed to create game:', error);
  alert('Could not load word list!');
}

createGrid(wordValidationGrid, 5, 5);

let input: GameInput | null = null;
let onscreenKb: OnscreenKeyboard | null = null;

activateBtn.addEventListener('click', () => {
  if (!btnState) {
    btnState = true;
    activateBtn.innerText = 'Dekativiraj';

    const kbContainer = document.getElementById('onscreen-keyboard') as HTMLElement;

    input = new GameInput(
      wordValidationGrid,
      
      
      async (word) => {

        console.log(game.isValidWord('NJUŠKA'))
        console.log(`Word: ${word}`);
        console.log(`game.isCorrectWord: ${game.isCorrectWord(word)}`);
        console.log(`game.isValidWord: ${game.isValidWord(word)}`);

        if (game.isCorrectWord(word) || game.isValidWord(word)) {
          const { isCorrect, states } = await game.checkGuess(word);
          onscreenKb?.updateKeys(tokenize(word), states);

          if (isCorrect) {
            await showModal({
              title: 'Čestitamo!',
              message: `Pogodili ste riječ za ${game.getCurrentRow()} pokušaja.`,
              type: 'success'
            });
            input?.destroy();
            onscreenKb?.destroy();
            input = null;
            onscreenKb = null;
          } else {
            input?.moveToNextRow();
          }
        } else {
          showToast('Nepoznata riječ');
        }
      },
      (err) => { showToast(err); },
      5,
      5,
      async () => {
        await showModal({
          title: 'Game over!',
          message: `Riječ je bila: ${game.getAnswer()}`,
          type: 'error'
        });
        input?.destroy();
        onscreenKb?.destroy();
        input = null;
        onscreenKb = null;
      }
    );

    onscreenKb = new OnscreenKeyboard(kbContainer, input);

  } else {
    btnState = false;
    activateBtn.innerText = 'Aktiviraj';

    input?.destroy();
    onscreenKb?.destroy();
    input = null;
    onscreenKb = null;
  }
});

document.getElementById("caesar-btn")?.addEventListener('click', (e) => {
  e.preventDefault();
  let inputBox = document.getElementById('caesar-input') as HTMLInputElement;
  let resultBox = document.getElementById('caesar-result') as HTMLElement;
  let encoded = CeaserChiper.encode(inputBox.value, {alphabet: "abcčćdđefghijklmnoprstuvzžš"}); 
  resultBox.innerText = `http://localhost:5173/dbg/index.html?word=${encoded}`
  resultBox.setAttribute('href', `/dbg/index.html?word=${encoded}`);
})
