/*
    onscreen-keyboard.ts
    Author: Roko
    Description: Renders and manages the on-screen Croatian keyboard
*/

import type { GameInput } from './keyboard';

type KeyState = 'found' | 'exists' | 'not-found' | 'default';

const ROWS = [
  ['E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Š', 'Đ', 'DŽ'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Č', 'Ć'],
  ['ENTER', 'C', 'V', 'B', 'N', 'NJ', 'M', 'Ž', 'LJ', '⌫'],
];

export class OnscreenKeyboard {
  private container: HTMLElement;
  private input: GameInput;
  private keyStates: Map<string, KeyState> = new Map();
  private keyElements: Map<string, HTMLButtonElement> = new Map();

  constructor(container: HTMLElement, input: GameInput) {
    this.container = container;
    this.input = input;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'flex flex-col items-center gap-1.5 pb-4';

    for (const row of ROWS) {
      const rowEl = document.createElement('div');
      rowEl.className = 'flex gap-1.5 justify-center';

      for (const key of row) {
        const btn = document.createElement('button');
        btn.textContent = key;
        btn.className = this.getKeyClass(key, 'default');
        btn.addEventListener('click', () => this.handleKey(key));
        this.keyElements.set(key, btn);
        rowEl.appendChild(btn);
      }

      this.container.appendChild(rowEl);
    }
  }

  private getKeyClass(key: string, state: KeyState): string {
    const isWide = key === 'ENTER' || key === '⌫';
    const isDigraph = key === 'NJ' || key === 'LJ' || key === 'DŽ';
    const base = `h-[58px] rounded font-bold text-sm uppercase tracking-wide transition-colors duration-200 select-none`;
    const width = isWide ? 'px-3 min-w-[56px]' : isDigraph ? 'min-w-[42px] px-1' : 'w-[36px]';

    const colors: Record<KeyState, string> = {
      default: 'bg-[#818384] text-white',
      found: 'bg-[#538d4e] text-white',
      exists: 'bg-[#b59f3b] text-white',
      'not-found': 'bg-[#3a3a3c] text-white',
    };

    return `${base} ${width} ${colors[state]}`;
  }

  private handleKey(key: string): void {
    if (key === 'ENTER') {
      this.input.submit();
    } else if (key === '⌫') {
      this.input.removeLetter();
    } else {
      this.input.addLetter(key);
    }
  }

  public updateKeys(tokens: string[], states: ('found' | 'exists' | 'not-found')[]): void {
    const priority: Record<KeyState, number> = { found: 3, exists: 2, 'not-found': 1, default: 0 };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const newState = states[i];
      const current = this.keyStates.get(token) ?? 'default';

      if (priority[newState] > priority[current]) {
        this.keyStates.set(token, newState);
        const btn = this.keyElements.get(token);
        if (btn) btn.className = this.getKeyClass(token, newState);
      }
    }
  }

  public disable(): void {
    this.keyElements.forEach(btn => {
      btn.classList.add('key-disabled');
    });
  }
 
  public destroy(): void {
    this.container.innerHTML = '';
    this.keyStates.clear();
    this.keyElements.clear();
  }
}