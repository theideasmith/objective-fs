var minimatch = require("minimatch");

function Traverser(object, delimeter){
  var self = this
  self._currentObject = object
  self._homeObject = object
  self._delimeter = delimeter || Traverser.DELIMETER

  self.HOME = Traverser.ROOT
  self.aliases = {
    '~': self.HOME
  }
  self.cd(self.HOME, object)

}

Traverser.DELIMETER = '/'
Traverser.ROOT = ''
Traverser.SUPER_DIR = '..'
Traverser.CURRENT_DIR = '.'

Traverser.prototype = {

  //Move up and down
  //through an object
  cd: function(path){

    path = this.formatPath(path)
    var traverser = this
    traverser._currentDirectory = path

    var newDir = this._searchObject(path)
    traverser._currentObject = newDir.dirs.pop()

    traverser._superdirectories = newDir.dirs

    traverser._pwd = path
    return traverser

  },

  //Gives you the contents
  //of path
  cat: function(path){
    var traverser = this
    return this._searchObject(path).dirs.pop()
  },

  ls: function(){
    return this._currentObject
  },

  alias: function(path){

    return alias(path, this.aliases)

  },

  formatPath: function(path){
    var ret = formatPath(path, this.aliases)
    return ret
  },

  isRoot: function(path){
    return isRoot(path, this.aliases)
  },

  _super: function(){
    return this._superdirectories[this._superdirectories.length-2]
  },

  _pwd: function(){
    return this._superdirectories[this._superdirectories.length-1]
  },

  _resolvePath: function(path){

  },

  _baseDir: function(path){

    var pathified = pathToArray(this.formatPath(path))

    if(pathified[0] === '~')
      return this._homeObject
    else if (pathified[0] === Traverser.ROOT){
      return this._homeObject
    } else {
      return this._currentObject
    }

  },

  _searchObject: function(path){

    /*
     * This is what "cd" really does in bash.
     * Null input becomes '.'
     */
    path = this.formatPath(path || '.')


    var delimeter = this._delimeter

    /*
     * After baseDir is resolved
     */
    var pathified = pathToArray(path, delimeter)
    var searched = [pathified.shift()]
    var dirs = [object]

    var object = this._baseDir(path)

    if (!object) throw new Error(
      "Cannot search " +
       typeof object   +
       " for path "    +
       path.toString()
    )

    console.log('Pathified: ', pathified)

    var currObj = object


    while(directory = pathified.shift()){

      directory = this.alias(directory)

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

      var target
      if(directory === Traverser.CURRENT_DIR)
        target = currObj
      else if(directory === '')
        target = currObj
      else
        target = currObj[directory]

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
  },


}

function alias(path, aliases){
  if ((aliases[path] !== undefined) &&
      (aliases[path] !== null))
        return aliases[path]
  return path
}

function cleanPath(path){
  var s = path
  path = path
        .replace(/(\.\/)+/, '')  //  "./"
        .replace(/\/+/, '/') // "//////" => '/'
  return path
}

function formatPath(path, aliases){
  aliases = aliases || {}
  path = pathToArray(cleanPath(path))
        .map(function(dir){
          return alias(dir, aliases)
        })
        .join(Traverser.DELIMETER)
  return path
}

function isRoot(string, aliases){
  aliases = aliases || {}
  return string[0] === Traverser.ROOT

}

function pathToArray(string, delimeter){
  var arr = string
            .split(delimeter || Traverser.DELIMETER)
  return arr
}

var traverse = function(object){
  if(object === null)
    throw new Error("Cannot use null object "+
                    "with Objective-Fs")

  return new Traverser(object)
}

traverse.clean = cleanPath

module.exports = traverse
