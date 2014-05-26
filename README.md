# jotto

[![Dependency Status](https://gemnasium.com/KenanY/jotto.svg)](https://gemnasium.com/KenanY/jotto)

[Jotto](https://en.wikipedia.org/wiki/Jotto) solver.

## Example

With a JSON file of previous guesses and their scores:

``` json
{
  "bread": 1,
  "anvil": 2
}
```

Pipe it into `jotto` to get the best possible next guess:

``` bash
$ jotto < guesses.json

    Imported : 12,478 words
       Using :  8,013 words
    Possible :    935 words
  Best guess : irone
```

## Installation

``` bash
$ npm install -g jotto
```

## API

``` javascript
var jotto = require('jotto');
```

### jotto.narrowDownPossibleWords(words, previousGuesses)

Narrows down the possible solutions to the current puzzle based on an _Array_
of `previousGuesses`.

### jotto.bestGuess(words, possibleWords)

Given an _Array_ `words` of every possible Jotto word and an _Array_
`possibleWords` of every word that could be the solution to the current
Jotto puzzle, returns the word that would narrow down the possible words the
most (the "best guess").