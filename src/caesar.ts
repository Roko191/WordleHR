/*
    caesar.ts
    This file includes impentation of ceaser chiper
    with cutom number of shits and alphabet. If no
    args default shift 
*/

export class CeaserChiper {
    private static readonly default_shift = 7;
    private static readonly default_alphabet = "abcdefghijklmnopqrstuvwxyz"

    static encode(word: string, options?:{shift?: number, alphabet?: string;}): string {
        let shift = options?.shift ?? this.default_shift;
        let alphabet = options?.alphabet ?? this.default_alphabet;
        const result: string[] = [];

        for (let i = 0; i < word.length; i++) {

            let letter = word[i];
            let isUpper = letter === letter.toUpperCase();

            letter = letter.toLowerCase();

            let index = alphabet.indexOf(letter);

            if (index === -1) {
                result.push(word[i]);
                continue;
            }

            index = (index + shift) % alphabet.length;

            if (index < 0) {
                index += alphabet.length;
            }

            let encoded = alphabet[index];

            if (isUpper) {
                encoded = encoded.toUpperCase();
            }

            result.push(encoded);
        }

        return result.join("");
    }    

    static decode(encodedWord: string, options?:{shift?: number, alphabet?: string;}) : string {
        let shift = options?.shift ?? this.default_shift;
        let alphabet = options?.alphabet ?? this.default_alphabet;
        return this.encode(encodedWord, {shift: -shift, alphabet: alphabet});
    }

}


