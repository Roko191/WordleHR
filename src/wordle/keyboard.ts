/*
    keyboard.ts 
    Author: Roko
    Description: Containes class GameInput respbsible for handling input 
    from keyboard
*/

export class GameInput {
    private grid: HTMLDivElement;
    private currentRow: number = 0;
    private currentCol : number = 0;
    private COLS : number;
    private ROW : number;
    private onSubmit: (word: string) => void;
    private onError: (message: string) => void;
    private onGameOver: () => void
    private keyboardHandler!: (e: KeyboardEvent) => void;

    constructor(
    grid: HTMLDivElement, 
    onSubmit: (word: string) => void, 
    onError: (message: string) => void,
    cols : number,
    rows: number, 
    onGameOver: () => void){
        this.grid = grid;
        this.onSubmit = onSubmit;
        this.onError = onError;
        this.initKeyboard();
        this.COLS = cols;
        this.ROW = rows;
        this.onGameOver = onGameOver;
    }

      private initKeyboard(): void {
        // Store the handler so we can remove it later
        this.keyboardHandler = (e: KeyboardEvent) => {
          const key = e.key;
        
          if (/^[a-zA-ZčćžšđČĆŽŠĐ]$/.test(key)) {
            this.addLetter(key.toUpperCase());
          } else if(key === 'Backspace') {
            this.removeLetter();
          } else if(key === 'Enter'){
            e.preventDefault();
            e.stopPropagation();
            this.submit();
          }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
      }
      

    private addLetter(letter: string): void {
        if(this.currentCol >= this.COLS) return;

        const index = this.currentRow * this.COLS + this.currentCol;
        const box = this.grid.querySelector(`[data-letter="${index}"]`) as HTMLElement;

        if(box){
            box.textContent = letter;
            box.classList.remove('no-letter');
            box.classList.add('no-eval');
            this.currentCol++;
        }

    }

    private removeLetter(): void {
        if (this.currentCol === 0) return;

        this.currentCol--;
        const index = this.currentRow * this.COLS + this.currentCol;
        const box = this.grid.querySelector(`[data-letter="${index}"]`) as HTMLElement;

        if(box){
            box.textContent = '';
            box.classList.remove('no-eval');
            box.classList.add('no-letter');
        }

    }


    private submit():void {
        if(this.currentCol !== this.COLS){
            this.onError('Nedovoljno slova');
            return;
        }

        const word = this.getCurrentWord();
        this.onSubmit(word);
    }

    private getCurrentWord(): string {
        let word : string = '';
        const startIndex = this.currentRow * this.COLS;

        for(let i = 0; i < this.COLS; i++){
            const box = this.grid.querySelector(`[data-letter="${startIndex + i}"]`) as HTMLElement;
            word += box?.textContent || '';
        }

        return word;

    }

    public moveToNextRow() : void {
        this.currentRow++;
        this.currentCol = 0;

        if(this.currentRow >= this.ROW){
            this.onGameOver();
        }
    }

    public getCurrentRow(): number {
        return this.currentRow;
    }

    public reset() : void {
        this.currentCol = 0;
        this.currentRow = 0;
    }

        // Add this method
      public destroy(): void {
        document.removeEventListener('keydown', this.keyboardHandler);
      }
    
}