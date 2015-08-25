#pretty-path
[![NPM](https://nodei.co/npm/<pretty-path>.png)](https://nodei.co/npm/<pretty-path>/)


## Usage

Quite simple as of now. Pass it a filepath
 and it will try to transform the path into its most syntactically correct form.

```javascript
var ppath = require('pretty-path')

ppath('x/y/z') // --> ./x/y/z
ppath('x/y/z') // --> /x/y/z
ppath('./////x/y/z') // --> ./x/y/z
ppath('././././x/y/z') // --> ./x/y/z
```

I realize it is limited in its functionality. Updates will come soon.

## Contributions

Any ideas you have - follow them and see them to fruition. Submit a pull request with unit tests and your commit should be merged in no time
