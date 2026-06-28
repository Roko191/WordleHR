/*
    keyboard.ts
    Author: Roko
    Description: Contains class GameInput responsible for handling input
    from keyboard
*/

export class GameInput {
  private grid: HTMLDivElement;
  private currentRow: number = 0;
  private currentCol: number = 0;
  private COLS: number;
  private ROW: number;
  private onSubmit: (word: string) => void;
  private onError: (message: string) => void;
  private onGameOver: () => void;
  private keyboardHandler!: (e: KeyboardEvent) => void;
  private lastKey: string = '';

  constructor(
    grid: HTMLDivElement,
    onSubmit: (word: string) => void,
    onError: (message: string) => void,
    cols: number,
    rows: number,
    onGameOver: () => void
  ) {
    this.grid = grid;
    this.onSubmit = onSubmit;
    this.onError = onError;
    this.COLS = cols;
    this.ROW = rows;
    this.onGameOver = onGameOver;
    this.initKeyboard();
  }

  private initKeyboard(): void {
    this.keyboardHandler = (e: KeyboardEvent) => {
      const key = e.key;

      if (/^[a-zA-ZčćžšđČĆŽŠĐ]$/.test(key)) {
        const upper = key.toUpperCase();

        // Check for digraph with previous letter
        if (upper === 'J' && (this.lastKey === 'L' || this.lastKey === 'N') && this.currentCol > 0 && this.currentCol <= this.COLS) {
          this.mergeDigraph(this.lastKey + 'J');
          this.lastKey = '';
          return;
        }

        this.lastKey = upper;
        this.addLetter(upper);
      } else if (key === 'Backspace') {
        this.lastKey = '';
        this.removeLetter();
      } else if (key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        this.lastKey = '';
        this.submit();
      }
    };

    document.addEventListener('keydown', this.keyboardHandler);
  }

  private mergeDigraph(digraph: string): void {
    // Replace the last placed letter with the digraph
    const index = this.currentRow * this.COLS + (this.currentCol - 1);
    const box = this.grid.querySelector(`[data-letter="${index}"]`) as HTMLElement;
    if (box) {
      box.textContent = digraph;
    }
  }

  public addLetter(letter: string): void {
    if (this.currentCol >= this.COLS) return;

    const index = this.currentRow * this.COLS + this.currentCol;
    const box = this.grid.querySelector(`[data-letter="${index}"]`) as HTMLElement;

    if (box) {
      box.textContent = letter;
      box.classList.remove('no-letter');
      box.classList.add('no-eval');
      this.currentCol++;
    }
  }

  public removeLetter(): void {
    if (this.currentCol === 0) return;

    this.currentCol--;
    const index = this.currentRow * this.COLS + this.currentCol;
    const box = this.grid.querySelector(`[data-letter="${index}"]`) as HTMLElement;

    if (box) {
      box.textContent = '';
      box.classList.remove('no-eval');
      box.classList.add('no-letter');
    }
  }

  public submit(): void {
    if (this.currentCol !== this.COLS) {
      this.onError('Nedovoljno slova');
      return;
    }

    const word = this.getCurrentWord();
    this.onSubmit(word);
  }

  private getCurrentWord(): string {
    const startIndex = this.currentRow * this.COLS;
    let word = '';
    for (let i = 0; i < this.COLS; i++) {
      const box = this.grid.querySelector(`[data-letter="${startIndex + i}"]`) as HTMLElement;
      word += box?.textContent || '';
    }
    return word;
  }

  public getCurrentRowTokens(): string[] {
    const startIndex = this.currentRow * this.COLS;
    const tokens: string[] = [];
    for (let i = 0; i < this.COLS; i++) {
      const box = this.grid.querySelector(`[data-letter="${startIndex + i}"]`) as HTMLElement;
      const text = box?.textContent || '';
      if (text) tokens.push(text);
    }
    return tokens;
  }

  public moveToNextRow(): void {
    this.currentRow++;
    this.currentCol = 0;
    if (this.currentRow >= this.ROW) {
      this.onGameOver();
    }
  }

  public getCurrentRow(): number {
    return this.currentRow;
  }

  public reset(): void {
    this.currentCol = 0;
    this.currentRow = 0;
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.keyboardHandler);
  }
}