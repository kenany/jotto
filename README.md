# jotto

Jotto solver.

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
$ cat guesses.json | jotto

    Imported : 12,478 words
       Using :  8,013 words
    Possible :    935 words
  Best guess : plats
```

## Installation

``` bash
$ npm install -g jotto
```

## API

``` javascript
var jotto = require('jotto');
```

### jotto(words, possibleWords)

Given an _Array_ `words` of every possible Jotto word and an _Array_
`possibleWords` of every word word that could be the solution to the current
Jotto puzzle, returns the word that would narrow down the possible words the
most (the "best guess").