/*
    word.ts
    Author: Roko
    Date: 02/2026
    Description: This file is meant to
    provide a way for validating one wordle word
*/

type LetterState = 'found' | 'exists' | 'not-found';

interface ValidationResult {
    states: LetterState[];
    isCorrect: boolean;
}

export function validateWord(guess: string, word: string) : ValidationResult {
    const states: LetterState[] = [];
    if(guess === word){
        return {
            states: Array(5).fill('found') as LetterState[],
            isCorrect: true 
        };
    }

    for(let i = 0; i < guess.length; i++){
        const letter = guess[i];

        if(word[i] === letter){
            states.push('found');
        } else if (word.includes(letter)){
            states.push('exists');
        } else {
            states.push('not-found');
        }
    }

    return {
        states: states,
        isCorrect: false
    }
}
