#pretty-path

##Usage
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
