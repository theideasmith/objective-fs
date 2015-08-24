var minimatch = require("minimatch")
var ppath = require("pretty-path")


function Traverser(object, options){
  var self = this
  self._homeObject = object
  self._currentObject = object
  self._options = options || Traverser.PPATH_OPTIONS
  self.cd(self._options.home)
}

Traverser.PPATH_OPTIONS  = {
  home: '/',
  current_dir: '.',
  super_dir: '..',
  delimeter: '/',
  root: '',
  aliases: {
    '~': ''
  }
}

Traverser.prototype = {

  //Move up and down
  //through an object
  cd: function(path){
    var traverser = this

    var newDir = traverser._searchObject(path)

    traverser._currentObject = newDir.dirs.pop()
    traverser._pwd = newDir.path


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

  isRoot: function(path){
    return isRoot(path, this.aliases)
  },

  _baseObject: function(path){
    /*
     * ~/path/to/object
     */
    var baseDir = this._baseDir(path)
    if(baseDir[0] === '~'){
      return this._homeObject
    } else if (baseDir[0] === Traverser.ROOT){
      return this._homeObject
    } else {
      return this._currentObject
    }

  },

  _baseDir: function(path){
    var pathified = ppath.break(path)
    return pathified[0]
  },

  _searchObject: function(path){
    /*
     * Using a handy module I wrote
     */
    path = ppath(path)

    var iterable_path = ppath.break( path )

    var object = this._baseObject(iterable_path.shift())
    if (!object) throw new Error(
      "Cannot search " +
       typeof object   +
       " for path "    +
       path.toString()
    )


    var currObj = object

    var stack = [object]
    var directory

    do {
      directory = iterable_path.shift()

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
       * will not be made
       */

      if(x=parseInt(directory))
        directory = x

      var target
      if (directory === Traverser.PPATH_OPTIONS.super_dir){
        // console.log("STACK: ", stack)
        stack.pop()
        var temp = stack.pop()
        stack.push(temp)
        target = temp
      } else if (directory === '') {
        // for '/' or other cases where .split returns ['', '', ...]
        // save computation for computing and removing duplicates
       target = currObj
      } else {
        // console.log("directory: ", directory)
        target = currObj[directory]
        stack.push(target)
      }

      if (!target){
        throw new Error(
          "Given path " +
          path +
          " does not exist in object " +
          JSON.stringify(object))
      }

      currObj = target

    } while(iterable_path.length > 0)

    // console.log(stack)
    return {
      path: path,
      dirs: stack
    }
  },


}

var traverse = function(object){
  if(object === null)
    throw new Error("Cannot use null object "+
                    "with Objective-Fs")

  return new Traverser(object)
}
traverse.clean = ppath
module.exports = traverse
