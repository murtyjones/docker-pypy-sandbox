const expect = require('chai').expect
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const generateMocks = require('../../helpers/ContainerMocks')

describe('Container', () => {
  let mocks
  let Container
  let container
  let sandbox
  let id
  let instance

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    mocks = generateMocks(sandbox)
    id = '123'
    instance = sandbox.stub().resolves('hi')
    Container = proxyquire('../../../lib/Container', mocks)
    container = new Container(id, instance)
  })


  afterEach(() => {
    sandbox.restore()
    mocks = null
    Container = null
    container = null
  })


  it('should pass expected items to constructor', () => {
    const expected = {
      id: id
      , instance: instance
      , ip: ""
      , macIp: "localhost"
      , cleanedUp: false
    }

    expect(container).to.deep.equal(expected)
  })

  describe('setIp', () => {
    let ip

    beforeEach(() => {
      ip = 'fakeIp'
    })

    afterEach(() => {
      ip = null
    })

    it('should change ip from blank to provided', () => {
      expect(container.ip).to.deep.equal('')
      const r = container.setIp(ip)
      expect(container.ip).to.deep.equal(ip)
    })

  })

  describe('executeJob', () => {
    let job, cb

    beforeEach(() => {
      job = {
        code: 'fakecode'
        , timeoutMs: 1111
        , v3: false
      }
      cb = sandbox.stub()
    })

    afterEach(() => {
      job = null
      cb = null
    })

    it('should call request.post using this.ip by default', () => {
      const r = container.executeJob(job, cb)
      expect(mocks['request'].post.args[0][0].url).to.deep.equal('http://:3000/')
    })

    it('should call request.post using this.macIp if the user says they are on a Mac', () => {
      mocks['yargs'].argv.mac = "true" // this is correct, it's not a bool when provided thru argv.
      const r = container.executeJob(job, cb)
      expect(mocks['request'].post.args[0][0].url).to.deep.equal('http://localhost:3000/')
    })

    it('should call request.post once with expected args', () => {
      const expected = {
        url: 'http://:3000/',
        json: true,
        body: job,
        timeout: job.timeoutMs + 500
      }
      const r = container.executeJob(job, cb)
      expect(mocks['request'].post.callCount).to.equal(1)
      expect(mocks['request'].post.args[0][0]).to.deep.equal(expected)
    })

    it('should call cb once with expected params if an err with the code ETIMEDOUT is returned to the request.post callback', () => {
      mocks['request'].post.callsArgWith(1, { code: "ETIMEDOUT" }, null)
      const expected = {
        timedOut: true,
        isError: true,
        stderr: '',
        stdout: '',
        combined: ''
      }
      const r = container.executeJob(job, cb)
      expect(cb.callCount).to.equal(1)
      expect(cb.args[0][0]).to.equal(null)
      expect(cb.args[0][1]).to.deep.equal(expected)
    })

    it('should call cb once with expected params if an err with any other code is returned to the request.post callback', () => {
      mocks['request'].post.callsArgWith(1, { code: "SOMETHINGELSE" }, null)
      const expected = {
        timedOut: true,
        isError: true,
        stderr: '',
        stdout: '',
        combined: ''
      }
      const r = container.executeJob(job, cb)
      expect(cb.callCount).to.equal(1)
      expect(cb.args[0][0].toString()).to.equal('Error: unable to contact container: [object Object]')
    })

  })

})