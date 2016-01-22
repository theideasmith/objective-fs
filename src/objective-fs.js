var minimatch = require("minimatch")
var ppath = require("pretty-path")

function Traverser(object) {
  this._reset(object)
}

Traverser.prototype = {
  //Move up and down
  //through an object
  cd: function(path) {
    var traverser = this

    var _search = traverser._get(path)
    traverser._currentObject = _search.dirs[_search.dirs.length - 1]

    traverser._stack = _search.dirs


    if(traverser.env('pwd') === null)
      traverser.env('pwd', _search.path)
    else
      traverser.env('pwd',
        ppath.resolve(
            traverser.env('pwd'),
            _search.path
        )
      )

    if(traverser._currentObject === undefined) {
      throw new Error("cd: No such file or directory", traverser.path)
    }

    return traverser

  },

  //Gives you the contents
  //of path
  cat: function(path) {
    return this._get(path).dirs.pop()
  },

  ls: function() {
    return this._currentObject
  },

  touch: function(pathOfNewObject, object){
    var iterable = ppath.break(ppath(pathOfNewObject))

    if((iterable.length===1) &&
        ppath.isRoot(iterable[0])){
          this._reset(object)
    }

    var objName = iterable.pop()
    var baseDirName = ppath.join(iterable)
    var baseDir = this.cat(baseDirName)
    var obj = baseDir[objName]

    if(!obj)
      baseDir[objName] = object

    return this
  },

  env: function(variable, setTo) {
    if (this._env === null ||
        this._env === undefined)
      this._env = {}

    if (variable === null ||
        variable === undefined)
        //So the actual env can't be modified
      return Object.create(this._env)

    if (setTo !== null &&
        setTo !== undefined)
      this._env[variable] = setTo

    return this._env[variable]

  },

  _reset: function(object){
    var self = this
    self._rootObject = object
    self._currentObject = object
    self.cd('~')
  },

  _startingStackFor: function(baseDir) {

    //If it is root, return root object
    if (baseDir === '') {
      return [this._rootObject]
    } else {
      //A new array -
      //to prevent modifying the original
      var n = [].concat(this._stack)
      return n
    }
  },

  _get: function(path){
    /*
     * Using a handy module I wrote
     */

    //Prettifying
    path = ppath(path || '~')
      //Iterable path can be iterated through
      //for navigation
    var iterable_path = ppath.break(path)
      //Stack represents the stack of directories
      //Allowing superdirectories to be used
    var stack = this._startingStackFor(iterable_path.shift())
    var searchedStack = Traverser.searchObject(iterable_path, stack)
    return {
      dirs: searchedStack,
      path: path
    }
  }
}

Traverser.searchObject = function(iterable_path, stack) {

  if(!stack){

    throw new Error("Cannot search for object with null path")

  }

  iterable_path = iterable_path || []
  //The starting object
  var currObj = stack[stack.length - 1]
  var directory

  while (iterable_path.length > 0) {
    directory = iterable_path.shift()

    if (directory !== '') {

      //Making sure you are searching through objects
      //and arrays only: No string, numbers, etc.
      if (!(currObj instanceof Object) &&
        !(currObj instanceof Array)    &&
          iterable_path.length > 0) {
        throw new Error("Invalid path given. " +
          "Can only search for path in" +
          " arrays or objects, not: " +
          typeof currObj)
      }

      /*
       * This is a clever little thing
       * allowing paths to go through
       * arrays as well as strings
       *
       * When directory is NaN, the assignment
       * will not be made

       * Of course, only use indices if the object
       * is an array, right?

       * This might change, but for now, only arrays
       * supports indices
       */
      if (x = parseInt(directory) &&
        currObj instanceof Array)
        directory = x

      var target
      if (directory === '..') {
        stack.pop()
        target = stack[stack.length - 1]
      } else if (directory === '.') {
        target = currObj
        stack.push(target)
      } else {
        target = currObj[directory]
        stack.push(target)
      }

      //If one of the parent directories are null,
      //then the object certainly doesn't exist
      if ((!target) && (iterable_path.length > 0)) {
        throw new Error(
          "Given path " +
          // path +
          " does not exist in object " +
          JSON.stringify(currObj))
      } else {
      //Otherwise, even if the searched for object
      //is null, it will be returned
        currObj = target
      }
    }
  }

  return stack
}

var traverse = function(object) {
  object = object || {}
  if (object === null)
    throw new Error("Cannot use null object " +
      "with Objective-Fs")

  return new Traverser(object)
}

traverse.clean = ppath
module.exports = traverse
