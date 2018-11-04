# jotto

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

For the `jotto` command-line executable:

``` bash
$ npm install -g jotto
```

For programmatic usage:

``` bash
$ npm install jotto
```

## API

``` javascript
var jotto = require('jotto');
```

### jotto.narrowDownPossibleWords(words, previousGuesses)

Given an _Array_ `words` of words and an _Object_ `previousGuesses` like this:

``` javascript
{
  'bread': 1,
  'anvil': 2
}
```

...wherein each key is a guess and each value is the score (in
[jots](https://github.com/KenanY/jots)) that the guess received, narrows down
the possible solutions to the current puzzle and returns the narrowed-down
_Array_ of words.

### jotto.bestGuess(words, possibleWords)

Given the _Array_ `words` that you used for `jotto.narrowDownPossibleWords` and
the _Array_ `possibleWords` that was returned, returns the word that would
narrow down the possible words the most (the "best guess").
