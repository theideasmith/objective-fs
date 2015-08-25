function ensureArray(path){

  if(path === null || path === undefined)
    throw new TypeError("cannot ensure type of null path")
  if (path.constructor === String) {
    var res =  pathToArray(path)
    return res
  } else if(path.constructor === Array) {
    return path
  } else
    throw new TypeError("Can only switch between string and array, not object")
}

function ensureString(path){
  if(path === null || path === undefined)
    throw new TypeError("cannot ensure type of null path")

  if (path.constructor === String) return path
  else if(path.constructor === Array) return joinPaths(path)
}

function fsDefaults(options){
  options = options || {}
  return {

    current_dir: options.current_dir || '.',
    super_dir: options.super_dir || '..',
    delimeter: options.delimeter || '/',
    root: options.root || '',
    aliases: options.aliases || {
      '~': ''
    }
  }
}

function alias(path, aliases){
  if ((aliases[path] !== undefined) &&
      (aliases[path] !== null))
        return aliases[path]
  return path
}

function joinPaths(_paths, options){
  var paths = ensureArray(_paths)
  var joined = paths.join('/')
  return cleanPath(joined)
}

function unAlias(_path, aliases){
  var path = ensureArray(_path)
  path.unshift( alias(path.shift(), aliases) )
  return path
}

function cleanPath(path){
  path = ensureString(path)
        .replace(/^(\.\/){2,}/g, '')
        .replace(/\/(\.\/){2,}/, '/')  //  "./"
        .replace(/\/+/g, '/') // "//////" => '/'
  return path
}

function formatPath(path){
  path = path || '~'
  options = fsDefaults()

  path = unAlias(path, options.aliases)

  //If it is root, set up root again in the string
  if (path[0] === options.root)
    path.unshift('/')
  //If it is not root, and the path has already been aliased,
  //and the path does not contain a './' as in x/y/z
  //not ./x/y/z,
  //==> Then add the './'

  //Note: it doesn't interfere with a path beginning with /,
  //because the / is removed when path becomes
  //an array. Think about it and the reason will
  //become clear
  else if (path[0] !== options.current_dir )
    path.unshift(options.current_dir)



  //Figure out how to determine if the end of the path has a '/'
  //For now, leave that alone and let the user determine that themselves
  var dirty =  joinPaths( path )
  //
  // path = dirty
  return cleanPath(dirty)
}

function isRoot( string ){

  var arr = pathToArray(string)
  return arr[0] === options.root
}



function pathToArray(_string, options){

  var string = cleanPath(_string)
  var res =  string.split(fsDefaults(options).delimeter)

  return res
}

formatPath.break = pathToArray
formatPath.isRoot = isRoot
formatPath.join = joinPaths
formatPath.clean = cleanPath

module.exports = formatPath
