/*
    main.ts
    This file is meant for everything to init
    a wordle game
*/

import { createGrid } from './wordle/grid';
import { showModal } from './modal';
import { GameInput } from './wordle/keyboard';
import { WordleGame } from './wordle/wordle';
import { CeaserChiper } from './caesar';
import { showToast } from './toast';
import { tokenize } from './wordle/word';
import { OnscreenKeyboard } from './wordle/onscreen-keyboard';

/* URL param word */
let paramWord: string | null = null;
const paramCaesarWord: string | null = new URLSearchParams(document.location.search).get('word');
if (paramCaesarWord) {
  paramWord = CeaserChiper.decode(paramCaesarWord, { alphabet: 'abcčćdđefghijklmnoprstuvzžš' });
}

/* Game init */
const wordleGrid = document.getElementById('grid-wordle') as HTMLDivElement;
createGrid(wordleGrid, 5, 5);

let game: WordleGame;
try {
  game = await WordleGame.create(
    `${import.meta.env.BASE_URL}hr_HR.json`,
    wordleGrid,
    paramWord,
    5,
    //5,
    5
  );
} catch (error) {
  console.error('Failed to create game:', error);
  alert('Could not load word list!');
}

/* Input */
let input: GameInput | null = null;
let onscreenKb: OnscreenKeyboard | null = null;

const kbContainer = document.getElementById('onscreen-keyboard') as HTMLElement;

input = new GameInput(
  wordleGrid,
  async (word) => {
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
        onscreenKb?.disable();
        input = null;
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
      message: `Riječ je bila: ${game.getAnswerString()}`,
      type: 'error'
    });
    input?.destroy();
    onscreenKb?.disable();
    input = null;
  }
);

onscreenKb = new OnscreenKeyboard(kbContainer, input);

/* Help overlay */
const gamePage = document.getElementById('game-page') as HTMLElement;
const gamePageContent = gamePage?.querySelector('.bg-\\[\\#121213\\]') as HTMLElement;
const gamePageClose = document.getElementById('game-page-close') as HTMLButtonElement;
const showHelpBtn = document.getElementById('show-help') as HTMLButtonElement;

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

showHelpBtn.addEventListener('click', () => {
  gamePage.classList.remove('hidden');
  gamePage.classList.add('modal-overlay-enter');
  gamePageContent.classList.add('modal-enter');
  document.body.style.overflow = 'hidden';
});

gamePageClose.addEventListener('click', closeGamePage);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !gamePage.classList.contains('hidden')) {
    closeGamePage();
  }
});

/* Custom word modal */
const customWordOverlay = document.getElementById('custom-word-overlay') as HTMLElement;
const customWordCloseX = document.getElementById('custom-word-close-x') as HTMLButtonElement;
const customWordInput = document.getElementById('custom-word-input') as HTMLInputElement;
const customWordGenerate = document.getElementById('custom-word-generate') as HTMLButtonElement;
const customWordError = document.getElementById('custom-word-error') as HTMLElement;
const customWordResult = document.getElementById('custom-word-result') as HTMLElement;
const customWordUrl = document.getElementById('custom-word-url') as HTMLInputElement;
const customWordCopy = document.getElementById('custom-word-copy') as HTMLButtonElement;
const showCustomWordBtn = document.getElementById('show-custom-word') as HTMLButtonElement;

const closeCustomWord = () => {
  customWordOverlay.classList.add('hidden');
  customWordInput.value = '';
  customWordError.classList.add('hidden');
  customWordResult.classList.add('hidden');
  document.body.style.overflow = '';
};

showCustomWordBtn.addEventListener('click', () => {
  customWordOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

customWordCloseX.addEventListener('click', closeCustomWord);

customWordOverlay.addEventListener('click', (e) => {
  if (e.target === customWordOverlay) closeCustomWord();
});

customWordGenerate.addEventListener('click', () => {
  const word = customWordInput.value.trim();
  const tokens = tokenize(word);

  if (tokens.length !== 5) {
    customWordError.textContent = `Riječ mora imati točno 5 slova (uneseno: ${tokens.length}).`;
    customWordError.classList.remove('hidden');
    customWordResult.classList.add('hidden');
    return;
  }

  customWordError.classList.add('hidden');
  const encoded = CeaserChiper.encode(word, { alphabet: 'abcčćdđefghijklmnoprstuvzžš' });
  const url = `${window.location.origin}/?word=${encoded}`;
  customWordUrl.value = url;
  customWordResult.classList.remove('hidden');
});

customWordCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(customWordUrl.value).then(() => {
    showToast('Link kopiran!');
  });
});