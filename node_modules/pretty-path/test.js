//test-pretty-path.js

var should = require("should")
var mocha = require("mocha")
var ppath = require('./index')

function testFailure(func){
  if (!func) throw new Error("No function supplied")
  try{
    func()
  } catch(err){
    return true
  }
  return false
}
function shouldFail(func){
  testFailure(func).should.equal(true)
}
describe('Pretty-path', function() {

  var options = {

    currentdir: '.',
    superdir: '..',
    delimeter: '/',
    root: '',
    aliases: {
      '~': ''
    }
  }

  var paths = {
    //Irregular relative
    'x/y/z': './x/y/z',
    //Aliasing
    '~/x/y/z': '/x/y/z',
    //From Root
    '/x/y/z': '/x/y/z',
    //Mangled by ///
    '////x/y///z': '/x/y/z',
    //Mangled by ./././
    '././././x/y/z': './x/y/z',
    //Resolving ..
    '.././././././x/y/z': './../x/y/z',
    //Checking super directory
    //resolves correctly
    '.././x/y/z': './.././x/y/z',
    //Checking that current directory
    //resolve correctly
    '.': '.',
    //More super directory
    '..': './..',
    //What happens when ....
    //Results as expected
    '.....':'./.....',
    //More results as expexted for
    //other corner cases
    '..../': './....',
    //Checking root resolves to root
    '/': '/',
    //Just as cd does
    //an empty string resolves to $HOME
    //Note: $HOME = root
    '': '/'
  }

  describe("formatPath", function(){
    it("should correctly format paths", function() {

      for (var path in paths) {

        var shouldEql = paths[path]

        //This just tests that a passed options doesn't cause any failures
        var pped = ppath(path, options)

        console.log("     \'" + path + "\' --> \'" + pped)// + "\', should: \'" + shouldEql + '\'')

        pped.should.equal(shouldEql)

      }
    })

    it("should format null and undefined as root ", function(){
      var a = null, b = undefined
      var root = '/'

      ppath(a).should.equal(root)
      ppath(b).should.equal(root)

    })
  })

  describe("resolve", function(){
    it("should resolve paths correctly", function(){

      ppath.resolve('/x/y/z', '../../').should.equal('/x')
      ppath.resolve('/x/y/z', '/1/2/3').should.equal('/x/y/z/1/2/3')
      ppath.resolve('/x/y/z', '/1/2/3/../../../').should.equal('/x/y/z')

    })

    it("should fail upon receiving relative path as root", function(){
      shouldFail(ppath.resolve.bind(this, 'x/y/z'))
      shouldFail(ppath.resolve)
    })
  })

  describe("break and join", function(){
    var shouldBreaks = {
      '':[''],
      '/':[''],
      'x/y/z': ['x','y','z'],
      '/x/y/z':['','x','y','z']
    }

    var shouldJoins = {
      '/':[''],
      '/':['/'],
      '/':[],
      'x/y/z': ['x','y','z','/'],
      'x/y/z': ['x','y','z'],
      '/x/y/z':['','x','y','z']
    }

    it("should break paths correctly", function(){
      for (var path in shouldBreaks) {
        var shouldEql = shouldBreaks[path]

        //This just tests that a passed options doesn't cause any failures
        var broken = ppath.break(path)
        console.log("     ", path, " --> ", shouldEql)
        broken.should.deepEqual(shouldEql)
      }
    })

    it("should join paths correctly", function(){

      for (var path in shouldJoins) {
        var shouldEql = path

        //This just tests that a passed options doesn't cause any failures
        var joined = ppath.join(shouldJoins[path])
        console.log("     ", shouldJoins[path], " --> ", shouldEql )
        joined.should.equal(shouldEql)
      }

    })
  })
})
