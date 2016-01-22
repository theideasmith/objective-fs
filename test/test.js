var mocha = require('mocha')
var should = require('should')

Array.prototype.equals = function(bs) {
  var as = this
  var a, b
  while ((a = as.shift()) && (b = bs.shift())) {
    if (a !== b) return false
  }
  return true
}

function testFailure(func) {
  if (!func) throw new Error("No function supplied")
  try {
    func()
  } catch (err) {
    return true
  }
  return false
}

describe('objective-fs', function() {
  var ofs = require('../src/objective-fs');

  var data = {
    x: {
      y: {
        z: "abc"
      },
      a: {
        b: 'c',
        d: 'e',
        f: 'g'
      }
    },

    DNA: ['ACT', 'GAT', 'CTT'],
    "20": 15
  }

  var dataKeys = Object.keys(data)

  var datafs = ofs(data)
  describe("#_get", function() {

    function testStack(path, shouldStack) {
      var stack = datafs._get(path).dirs

      stack.forEach(function(obj, ind) {
        obj.should.deepEqual(shouldStack[ind])
      })
    }

    it("should create the correct stack for a regular path", function() {
      testStack("/x/a/b", [
        data,
        data.x,
        data.x.a,
        data.x.a.b
      ])

    })

    it("should create the correct stack for a superdirectory path", function() {
      testStack("/x/y/../../DNA/0", [
        data,
        data.DNA,
        data.DNA[0]
      ])
    })
  })

  describe('#cat', function() {

    it("should navigate to the base object given a null path", function() {
      datafs.cat().should.deepEqual(data)
    })

    it("should navigate to the base object given an empty path", function() {
      datafs.cat('').should.deepEqual(data)
    })

    it("should navigate to the base object given a base path", function() {
      datafs.cat('/').should.deepEqual(data)
    })

    it("should return the correct object given a regular path", function() {
      datafs.cat('x/y/z').should.equal(data.x.y.z)
    })

    it("should return the correct object for a root path", function() {
      datafs.cat('/x/y/z').should.equal(data.x.y.z)
    })

    it("should return the correct object given an array index", function() {
      datafs.cat('/DNA/0/').should.equal(data.DNA[0])
    })

    it("should return the base object given HOME ('~') path", function() {
      Object.keys(datafs.cat('~')).equals(dataKeys).should.equal(true)
    })

    it("should return the correct object with superdirectories", function() {
      datafs.cat('/x/y/../../DNA/0').should.equal('ACT')
    })

    describe("failures", function() {

      it("should fail upon hitting an invalid superdirectory", function() {
          should(datafs.cat('/x/y/../../../')).equal(undefined)
      })

      it("should return null when given an invalid path", function() {
          should(datafs.cat('./x/3')).equal(undefined)
      })

      it("should fail when asked to search through invalid object types", function() {
          should(datafs.cat('/20/15/')).equal(undefined)
      })
    })
  })

  describe('#cd', function() {
    it('should navigate to a passed directory', function() {
      var path = '/x/a'
      var shouldEqual = data.x.a
      datafs.cd(path)
      datafs.env('pwd').should.equal(ofs.clean(path))
      datafs.ls().should.deepEqual(shouldEqual)
    })
    it('should navigate to superdirectories', function(){
      var path = '../../DNA'
      datafs.cd(path).ls().should.deepEqual(data.DNA)
      datafs.env('pwd').should.equal('/DNA')
    })
    it("should fail when navigating to invalid superdirectory", function(){
      testFailure(function(){
        datafs.cd('../../')
      }).should.equal(true)
    })
  })

  describe('#touch', function(){

    var object = ofs()

    it("should create objects given a path", function(){
      object.touch('/hello/', 'world')
      object.cat('/hello/').should.equal('world')

    })

  })
})
