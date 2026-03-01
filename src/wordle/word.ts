/*
    word.ts
    Author: Roko
    Date: 02/2026
    Description: This file is meant to
    provide a way for validating one wordle word
*/
type LetterState = 'found' | 'exists' | 'not-found';

export interface ValidationResult {
  states: LetterState[];
  isCorrect: boolean;
}

export function validateWord(guess: string, word: string): ValidationResult {
  const states: LetterState[] = [];
  
  // Normalize to uppercase for comparison
  const normalizedGuess = guess.toUpperCase();
  const normalizedWord = word.toUpperCase();
  
  // Check if completely correct
  if (normalizedGuess === normalizedWord) {
    return {
      states: Array(normalizedGuess.length).fill('found') as LetterState[],
      isCorrect: true 
    };
  }
  
  // Validate each letter
  for (let i = 0; i < normalizedGuess.length; i++) {
    const letter = normalizedGuess[i];
    
    if (normalizedWord[i] === letter) {
      states.push('found');
    } else if (normalizedWord.includes(letter)) {
      states.push('exists');
    } else {
      states.push('not-found');
    }
  }
  
  return {
    states: states,
    isCorrect: false
  };
}