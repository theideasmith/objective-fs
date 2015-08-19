var plasmid = require('plasmidjs')
var searchObject = require('search-object')

module.exports = function Builder(cache){

  var cache = {}
  var builtBuilder = {}
  var currentPath = ""

  var buildBuilder = plasmid.assemble({
    currentObj: function(){
      return searchObject(currentPath, cache)
      return this
    },

    go: function(layerName){
      currentPath = layerName
      return this
    },

    rebase: function(){
      this.go("")
      return this
    },

    scaffold: function(command_name, builder_func){

      if (typeof builder_func !== 'function' ){
        throw new Error("Can only use functions as scaffolders, " +
                        "not " +
                        typeof builder_func)
      }

      return this
    }
  }, {context: buildBuilder})

  function wrapBuilderFunction(builder_func) {
    return function(){
      builder_func()
      return builtBuilder
    }
  }


}
