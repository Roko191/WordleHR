import { validateWord, tokenize } from './word';
import type { ValidationResult, LetterState } from './word';

interface WordData {
  version: string;
  categories: { [key: string]: string[] };
  metadata: {
    totalWords: number;
    sourceFile: string;
    lastUpdated: string;
    [key: string]: any;
  };
}

export class WordleGame {
  private wordListUrl: string;
  private wordLength: number;
  private cols: number;
  //private maxRows: number;
  private currentRow: number = 0;
  private validWords: Set<string>;
  private wordData: WordData | null = null;
  private word: string | null = null;
  private grid: HTMLDivElement;

  // Private constructor - can't be called directly
  private constructor(
    wordListUrl: string, 
    wordLength: number,
    cols: number,
    //maxRows: number,
    grid: HTMLDivElement, 
    word: string | null = null
  ) {
    this.wordListUrl = wordListUrl;
    this.wordLength = wordLength;
    this.cols = cols;
    //this.maxRows = maxRows;
    this.validWords = new Set();
    this.grid = grid;
    if (word) {
      this.word = word;
    }
  }

  public static async create(
    wordListUrl: string,
    grid: HTMLDivElement,
    word: string | null = null,
    cols: number = 5,
    // maxRows: number = 5,
    wordLength: number = -5,
  ): Promise<WordleGame> {
    const game = new WordleGame(wordListUrl, wordLength, cols, grid, word);
    await game.initialize();
    return game;
  }

  private async initialize(): Promise<void> {
    this.wordData = await this.fetchWordlist();
    if (!this.word) this.word = this.getRandomWord();
    this.createWordSet(this.wordData);
  }

  private async fetchWordlist(): Promise<WordData> {
    try {
      const response = await fetch(this.wordListUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch wordlist: ${response.status} ${response.statusText}`);
      }
      
      const data: WordData = await response.json();
      
      // Validate basic structure
      if (!data.version || !data.categories || !data.metadata) {
        throw new Error('Invalid wordlist format: missing required fields');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching wordlist: ${error.message}`);
      }
      throw new Error('Unknown error fetching wordlist');
    }
  }


    private getRandomWord(): string | null {
      if (!this.wordData) return null;

      const words: string[] = [];
      Object.values(this.wordData.categories).forEach(categoryWords => {
        categoryWords.forEach(word => {
          if (tokenize(word).length === this.wordLength) {
            words.push(word);
          }
        });
      });

      if (words.length === 0) return null;
      return words[Math.floor(Math.random() * words.length)];
    }

    private createWordSet(wordData: WordData): void {
      Object.values(wordData.categories).forEach(words => {
        words.forEach(word => {
          if (tokenize(word).length === this.wordLength) {
            this.validWords.add(word.toUpperCase());
          }
        });
      });

      console.log(`Loaded ${this.validWords.size} words for ${this.wordLength}-letter category`);
    }

    public isValidWord(word: string): boolean {
      return this.validWords.has(word.toUpperCase());
    }

    private async updateDOM(result: ValidationResult): Promise<void> {
      // Animation timing configuration
      const FLIP_DURATION = 500;           // Total flip animation time (ms)
      const DELAY_BETWEEN_BOXES = 200;     // Delay between each box (ms)
      const COLOR_CHANGE_TIMING = 250;     // When to change color (ms) - should be FLIP_DURATION / 2
    
      const startIndex = this.currentRow * this.cols;
    
      // Apply flip animation to all boxes with staggered delay
      for (let i = 0; i < this.cols; i++) {
        const box = this.grid.querySelector(`[data-letter="${startIndex + i}"]`) as HTMLElement;
        
        if (box && result.states) {
          const state = result.states[i];
          const delay = i * DELAY_BETWEEN_BOXES;
        
          // Start flip animation after delay
          setTimeout(() => {
            // Remove transition to prevent conflict
            box.style.transition = 'none';
            
            box.classList.add('animate-flip');
            
            // Change color at halfway point
            setTimeout(() => {
              box.classList.remove('no-eval', 'no-letter', 'found', 'exists', 'not-found');
              box.classList.add(state);
            }, COLOR_CHANGE_TIMING);
            
            // Remove animation class and restore transition after it completes
            setTimeout(() => {
              box.classList.remove('animate-flip');
              box.style.transition = ''; // Restore original transition
            }, FLIP_DURATION);
            
          }, delay);
        }
      }
      
      // Wait for all animations to complete
      await new Promise(resolve => 
        setTimeout(resolve, this.cols * DELAY_BETWEEN_BOXES + FLIP_DURATION)
      );
    }

    public async checkGuess(guess: string): Promise<{ isCorrect: boolean, states: LetterState[] }> {
      if (this.word) {
        const wordValidation: ValidationResult = validateWord(guess, this.word);
        await this.updateDOM(wordValidation);
        this.currentRow++;
        return { isCorrect: wordValidation.isCorrect, states: wordValidation.states };
      }
      return { isCorrect: false, states: [] };
    }

  public getAnswerString(): string {
    return this.word ?? '';
  }

  public getAnswer(): void {
    console.log(`Random selected word is: ${this.getAnswerString()}`);
  }

  public getCurrentRow(): number {
    return this.currentRow;
  }

  public isCorrectWord(word: string): boolean {
    return this.word !== null && word.toUpperCase() === this.word.toUpperCase();
  }
}