/*
    word.ts
    Author: Roko
    Date: 02/2026
    Description: This file is meant to
    provide a way for validating one wordle word
*/
export type LetterState = 'found' | 'exists' | 'not-found';

export interface ValidationResult {
  states: LetterState[];
  isCorrect: boolean;
}

const DIGRAPHS = ['LJ', 'NJ', 'DŽ'];

export function tokenize(word: string): string[] {
  const tokens: string[] = [];
  const upper = word.toUpperCase();
  let i = 0;
  while (i < upper.length) {
    if (i + 1 < upper.length && DIGRAPHS.includes(upper[i] + upper[i + 1])) {
      tokens.push(upper[i] + upper[i + 1]);
      i += 2;
    } else {
      tokens.push(upper[i]);
      i++;
    }
  }
  return tokens;
}

export function validateWord(guess: string, word: string): ValidationResult {
  const guessTokens = tokenize(guess);
  const wordTokens = tokenize(word);

  // Check if completely correct
  if (guessTokens.join('') === wordTokens.join('')) {
    return {
      states: Array(guessTokens.length).fill('found') as LetterState[],
      isCorrect: true
    };
  }

  const states: LetterState[] = [];

  for (let i = 0; i < guessTokens.length; i++) {
    const token = guessTokens[i];
    if (wordTokens[i] === token) {
      states.push('found');
    } else if (wordTokens.includes(token)) {
      states.push('exists');
    } else {
      states.push('not-found');
    }
  }

  return { states, isCorrect: false };
}