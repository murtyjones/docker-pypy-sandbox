"use strict";
/* global expect */

let async   = require('async')
let Sandbox = require('./../../lib/Sandbox')
let _       = require('underscore')

describe("The Sandbox", () => {

  const poolSize = 2
  let sandbox = null

  beforeEach(done => {
    sandbox = new Sandbox({ poolSize })
    sandbox.createPool(err => {
      if (err) throw err;
      done()
    })
  })

  it("should correctly compile a correct python code", done => {
    sandbox.run({ code: 'print "Hello world"' }, (err, result) => {
      expect(err).toBe(null)
      expect(result.stdout).toBe("Hello world\n")
      expect(result.stderr).toBe("")
      expect(result.combined).toBe(result.stdout)
      expect(result.isError).toBe(false)
      expect(result.timedOut).toBeFalsy()
      done()
    })
  }, 15000);

  it("should correctly run jobs even if there is not enough containers in the pool", done => {
    // Create 2 times more jobs than there is containers
    let codes = _.range(0, 2 * poolSize).map(i => 'print "Hello, world '+i+'"')
    let jobs = codes.map(code => sandbox.run.bind(sandbox, code))
    async.parallel(jobs, (err, results) => {
      expect(err).toBe(null)
      expect(results.length).toBe(codes.length)
      for (let i = 0; i < results.length; ++i) {
        let result = results[i]
        expect(result.isError).toBe(false)
        expect(result.stderr).toBe("")
        expect(result.combined).toBe(result.stdout)
        expect(result.timedOut).toBeFalsy()
        expect(result.stdout).toBe(`Hello, world ${i}\n`)
      }
      done()
    })
  }, 10 * 1000)

  afterEach(done => {
    if (!sandbox) return done()
    sandbox.cleanup(done)
    done()
  }, 15000)
})
