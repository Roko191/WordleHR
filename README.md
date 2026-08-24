# WordleHR

WordleHR je hrvatska inačica popularne igre Wordle — pogodi petoslovnu hrvatsku riječ u šest pokušaja. Igra je izrađena kao lagana, statična web aplikacija bez frameworka (vanilla TypeScript).

Igra je dostupna na: https://roko191.github.io/wordle/

## Značajke

- **Igra pogađanja riječi** — klasična Wordle mehanika s bojanjem slova (točno/postoji/ne postoji) i animacijom okretanja pločica.
- **Podrška za hrvatska slova i digrafe** (`dž`, `lj`, `nj`) — validacija i tokenizacija riječi ispravno tretiraju digrafe kao jedno slovo.
- **Dijeljenje vlastite riječi** — u overlayu za prilagođenu riječ korisnik unosi riječ, aplikacija je enkodira Cezarovom šifrom i generira URL (`?word=...`) koji se može podijeliti; primatelj igra tu istu riječ bez da je vidi u čistom tekstu.
- **Zaslonska tipkovnica i tipkovnički unos** — igra se može igrati i fizičkom tipkovnicom i klikom na zaslonsku tipkovnicu, s vizualnim stanjem svakog slova.
- **Pomoć i modalni prozori** — modal "Kako igrati" i sustav toast obavijesti za povratne informacije korisniku.

## Tehnologije

- [Vite](https://vitejs.dev/)
- Vanilla TypeScript (bez frameworka poput Reacta ili Vuea)
- [Tailwind CSS](https://tailwindcss.com/)

## Struktura projekta

Projekt je organiziran u nekoliko logičkih cjelina:

- **`src/wordle/`** — jezgra igre: `wordle.ts` (klasa `WordleGame` — provjera pogodaka, stanje igre), `word.ts` (tokenizacija riječi, digrafi, validacija), `grid.ts` (mreža pločica), `keyboard.ts` i `onscreen-keyboard.ts` (unos i zaslonska tipkovnica).
- **`src/main.ts`** — glavna stranica: povezuje UI (mreža, tipkovnica, modal "Kako igrati", overlay za prilagođenu riječ) s logikom igre.
- **`src/modal.ts`, `src/toast.ts`** — dijeljene UI komponente za modalne prozore i obavijesti.
- **`src/caesar.ts`** — Cezarova šifra korištena za enkodiranje riječi u URL-u za dijeljenje.
- **`src/dbg.ts`** i **`dbg/index.html`** — razvojna/testna stranica s izoliranim primjerima (dinamička mreža, validacija riječi, primjeri pločica) — **izolirana je iz produkcijskog Vite builda** i ne deploya se na GitHub Pages.
- **`public/`** — statički resursi: font (`Wordle.woff2`), popis riječi (`hr_HR.json`), licenca (`LICENSE.txt`).

## Pokretanje projekta

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Aplikacija je statična i automatski se deploya na GitHub Pages putem GitHub Actions workflowa (`.github/workflows/deploy.yaml`): pri svakom pushu na `main` granu, projekt se builda i rezultat (`dist/`) pusha u repozitorij `roko191.github.io` pod putanjom `/wordle`.

## Licenca

Projekt je dostupan pod MIT licencom — vidi [LICENSE.txt](public/LICENSE.txt).
