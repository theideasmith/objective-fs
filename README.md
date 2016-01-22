# Objective-Fs

Turns objects into filesystems so navigating through them is a breeze. This is useful for navigating through complex hierarchies.

But the module was mainly made as a joke. I'm not even sure why it exists. 

```javascript
var ofs = require('objective-fs')

var data = {
  x: {
    y: {
      z: "abc"
    }
 },

 DNA: ['ACT', 'GAT', 'CTT']

}

var filesystem = ofs(data)


/*
 * Give it a path
 */
filesystem.cat('/x/y/z') //--> 'abc'

/*
 * It works with array indices too!
 */
filesystem.cat('/DNA/0') //--> 'ACT'
```
### var filesystem = ofs(object)
Wraps an object in an `objective-fs` instance.

### filesystem.env([variable[,newValue]])
A miniature env for your objective filesystem. You can use this to cache key-value data.
Calling `env()` with no arguments returns an object containing all environment variables. Calling `env()` with `variable` or both `variable` and `newValue` returns the environment variable for that key.
`variable`: (String) the name of the environment variable you are requesting
`newValue`: optionally set the variable for that key to a new value.

### filesystem.cat(path)
Takes a string as an argument and returns the object(if it exists) for that path in the filesystem. The path follows Unix path conventions, with forward slashes to delimit directories, '.' to represent the current directory, '..' to represent the superdirectory and '/' to represent root.

### filesystem.cd(path)

Virtually changes the current directory to `path`

### filesystem.ls()

Returns the current object, as in the current directory, which can be changed with `filesystem.cd`

### filesystem.touch()

Creates an object at the given path. Will replace the root object if specified, so be careful.

### filesystem.cat(path)
Takes a path as an argument and returns the object located at that path.
