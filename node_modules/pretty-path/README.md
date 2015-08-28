#pretty-path
[![NPM](https://nodei.co/npm/<pretty-path>.png)](https://nodei.co/npm/<pretty-path>/)


## Usage

Pretty-Path is a filepath prettifier
```javascript
var ppath = require('pretty-path')

ppath('x/y/z') // --> ./x/y/z
ppath('x/y/z') // --> ./x/y/z
ppath('./////x/y/z') // --> ./x/y/z
ppath('././././x/y/z') // --> ./x/y/z
```


## Contributions

Any ideas you have - follow them and see them to fruition. Submit a pull request with unit tests and your commit should be merged in no time
