var minimatch = require("minimatch");

function Traverser(object, delimeter){
  var self = this
  self._currentObject = object
  self._homeObject = object
  self._delimeter = delimeter || Traverser.DELIMETER
  this.cd(Traverser.HOME, object)

}

Traverser.prototype = {

  //Move up and down
  //through an object
  cd: function(path){

    var traverser = this
    traverser._currentDirectory = path

    var newDir = this._searchObject(path)
    traverser._currentObject = newDir.dirs.pop()

    traverser._superdirectories = newDir.dirs

    traverser._pwd = newDir
        .searched
        .splice(0,newDir.searched.length-1)
        .reduce(function(p,c){
          return p + '/' + c
        }, newDir.searched.pop())

    return traverser

  },

  //Gives you the contents
  //of path
  cat: function(path){
    var traverser = this
    return this._searchObject(path).dirs.pop()
  },

  _super: function(){
    return this._superdirectories[this._superdirectories.length-2]
  },

  _pwd: function(){
    return this._superdirectories[this._superdirectories.length-1]
  },

  _searchObject: function(path, object, delimeter){

    var object = this._currentObject
    var delimeter = this._delimeter

    if (!object) throw new Error(
      "Cannot search " +
       typeof object      +
       " for path "    +
       path.toString()
     )

    /*
     * This is what "cd" really does in bash.
     * Null input becomes '.'
     */

    if (path === null || path === undefined) path = '.'

    if (isRoot(path)) return {
      searched: ['~'],
      dirs: [object]
    }

    var pathified = splitPathToArray(path, delimeter)

    var searched = []
    var dirs = []

    var currObj = object

    while(directory = pathified.shift()){

      if (!(currObj instanceof Object) && (!currObj instanceof Array)){
        throw new Error("Invalid path given" +
                        "Can only search for path in" +
                         " arrays or objects")
      }

      /*
       * This is a clever little thing
       * allowing paths to go through
       * arrays as well as strings
       *
       * When directory is NaN, the assignment
       * will not be mad
       */

      if(x=parseInt(directory))
        directory = x

      var target = currObj[directory]

      if (!target){
        throw new Error(
          "Given path " +
          path +
          " does not exist in object " +
          JSON.stringify(object))
      }

      currObj = target

      searched.push(directory.toString())
      dirs.push(target)
    }

    return {
      searched: searched,
      dirs: dirs
    }
  }
}

Traverser.DELIMETER = '/'
Traverser.HOME = '~'
Traverser.SUPER_DIR = '..'
Traverser.CURRENT_DIR = '.'

function isRoot(string){

  if (string === null || string === undefined)
    throw new Error("Cannot check null string for being ROOT")

  return (string === Traverser.HOME) || (string.length === 0)

}

function splitPathToArray(string, delimeter){
  return string.split(delimeter || Traverser.DELIMETER)
}

/*
 * For those idiots who waste
 * precious memory by doing
 * "././././././"
 * REDUDANTLY!
 */
function removePathRedundancy(path){
  path = path
          .replace(/(\.\/)+/, './')  //  "./"
          .replace(/(\.\.\/)+/,'../')// "../"

  return path
}


function traverse(object){
  if(object === null)
    throw new Error("Cannot use null object "+
                    "with Objective-Fs")

  return new Traverser(object)
}

module.exports = traverse
