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
  private validWords: Set<string>;
  private wordData: WordData | null = null;
  private word: string | null = null;

  // Private constructor - can't be called directly
  private constructor(wordListUrl: string, wordLength: number, word: string | null = null) {
    this.wordListUrl = wordListUrl;
    this.wordLength = wordLength;
    this.validWords = new Set();
    if(word) {
        this.word = word
    }
  }

  // Static factory method - use this to create instances
  public static async create(wordListUrl: string, wordLength: number): Promise<WordleGame> {
    const game = new WordleGame(wordListUrl, wordLength);
    await game.initialize();    
    return game;
  }

  private async initialize(): Promise<void> {
    this.wordData = await this.fetchWordlist();
    this.word = this.getRandomWord();
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

  private getRandomWord() : string | null {
    const categoryName = `${this.wordLength}-letter`;
    if(this.wordData) {
        return this.wordData.categories[categoryName][Math.floor(Math.random() * this.wordData.categories[categoryName].length)];
    }
    return null
  }

  private createWordSet(wordData: WordData): void {
    const categoryName = `${this.wordLength}-letter`;
    
    // Check if category exists
    if (!wordData.categories[categoryName]) {
      throw new Error(`No words found for ${this.wordLength}-letter category`);
    }
    
    const words = wordData.categories[categoryName];
    
    // Populate set with uppercase words
    words.forEach(word => {
      this.validWords.add(word.toUpperCase());
    });
    
    console.log(`Loaded ${this.validWords.size} words for ${this.wordLength}-letter category`);
  }

  public isValidWord(word: string): boolean {
    return this.validWords.has(word.toUpperCase());
  }

  public getAnswer() : void {
    console.log(`Random selected word is: ${this.word}`);
  }

}