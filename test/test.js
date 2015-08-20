var mocha = require('mocha')
var should = require('should')

Array.prototype.equals = function(bs){
  var as = this
  var a, b
  while((a = as.shift()) && (b = bs.shift())) {
    if (a !==b )return false
  }
  return true
}

function testFailure(func){
  if (!func) throw new Error("No function supplied")
  try{
    func()
  } catch(err){
    return true
  }
  return false
}

describe('objective-fs', function(){
  var ofs = require('../src/objective-fs');

  var data = {
    x: {
      y:{
        z: "abc"
      }
    },

    DNA: ['ACT', 'GAT', 'CTT'],
    "20":15
  }

  var dataKeys = Object.keys(data)

  var datafs = ofs(data)

  describe('cat', function(){
    it ("should return the correct object given a deep path", function(){
      datafs.cat('x/y/z').should.equal(data.x.y.z)
      datafs.cat('DNA/0').should.equal(data.DNA[0])
    })

    it("should return the base object given an empty path and HOME ('~') path", function(){
      Object.keys(datafs.cat('~')).equals(dataKeys).should.equal(true)
      Object.keys(datafs.cat('')).equals(dataKeys).should.equal(true)

    })

    it("should fail when given an invalid path", function(){
      testFailure(function(){
        datafs.cat('./20/15')
      }).should.equal(true)

      testFailure(function(){
        datafs.cat('./x/3')
      }).should.equal(true)
    })
  })



})
