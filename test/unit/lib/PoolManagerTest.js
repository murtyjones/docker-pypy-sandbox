const expect = require('chai').expect
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const generateMocks = require('../../helpers/PoolManagerMocks')
const DEFAULT_OPTIONS = require('../../../lib/PoolManager').DEFAULT_OPTIONS

describe('PoolManager', () => {
  let mocks
  let PoolManager
  let poolManager
  let sandbox
  let docker
  let options

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    mocks = generateMocks(sandbox)
    docker = {
      createContainer: sandbox.stub()
    }
    options = {
      blah: sandbox.stub()
    }
    PoolManager = proxyquire('../../../lib/PoolManager', mocks)
    poolManager = new PoolManager(docker, options)
  })


  afterEach(() => {
    sandbox.restore()
    mocks = null
    PoolManager = null
    poolManager = null
  })


  describe('contstructor', () => {
    it('should pass expected items to constructor and call expected classes', () => {
      const expected = {
        waitingJobs: []
        , availableContainers: []
        , bootingContainers: []
        , emitter: {}
        , docker
        , options
        , initialDelayMs: 1000
      }

      expect(poolManager).to.deep.equal(expected)
      expect(mocks['events'].EventEmitter.callCount).to.be.equal(1)
    })

    it('should pass default options to constructor when no options provided', () => {
      poolManager = new PoolManager(docker/*, options*/)
      expect(poolManager.options).to.deep.equal(DEFAULT_OPTIONS)
    })
  })


  describe('initialize', () => {
    let size, cb
    beforeEach(() => {
      size = 7
      cb = sandbox.stub()
      poolManager._createContainer.bind = sandbox.stub()
    })

    afterEach(() => {

    })

    it('should throw an error if size is <= 0', () => {
      size = 0
      expect(() => { poolManager.initialize(size, cb) }).to.throw('invalid pool size')
      size = -10
      expect(() => { poolManager.initialize(size, cb) }).to.throw('invalid pool size')
    })

    it('should call async.parallel', () => {
      poolManager.initialize(size, cb)

      expect(mocks['async'].parallel.callCount).to.be.equal(1)
    })

    it('should call this._createContainer.bind(this) for each desired container and pass them to async.parallel', () => {
      poolManager.initialize(size, cb)

      expect(mocks['async'].parallel.args[0][0]).to.have.a.lengthOf(size)
      expect(poolManager._createContainer.bind.callCount).to.be.equal(size)
      expect(poolManager._createContainer.bind.args[0][0]).to.be.equal(poolManager)
    })

    it('should provide async.parallel with a function that calls the callback when called', () => {
      mocks['async'].parallel = sandbox.stub().callsArgWith(1, 'fakeErr', 'fakeDaya')
      poolManager.initialize(size, cb)

      expect(cb.callCount).to.be.equal(1)
      mocks['async'].parallel.args[0][1]()
      expect(cb.callCount).to.be.equal(2)
      expect(cb.args[0][0]).to.be.equal('fakeErr')
    })

  })


  describe('executeJob', () => {
    let job, cb
    beforeEach(() => {
      job = { fake: 'job' }
      cb = sandbox.stub()
      poolManager._executeJob = sandbox.stub()
    })

    afterEach(() => {

    })

    it('should push the job into the waiting container pool if none available', () => {
      poolManager.availableContainers = []
      expect(poolManager.waitingJobs).to.deep.equal([])
      poolManager.executeJob(job, cb)
      expect(poolManager.waitingJobs).to.deep.equal([job])
    })

    it('should call this._executeJob once with expected args otherwise', () => {
      poolManager.availableContainers = [{ not: 'empty' }]
      poolManager.executeJob(job, cb)
      expect(poolManager._executeJob.callCount).to.be.equal(1)
      expect(poolManager._executeJob.args[0][0]).to.be.equal(job)
      expect(poolManager._executeJob.args[0][1]).to.be.equal(cb)
    })

    it('should call this._executeJob once with expected args otherwise', () => {
      poolManager.availableContainers = [{ not: 'empty' }]
      poolManager.executeJob(job)
      expect(poolManager._executeJob.args[0][1]).to.be.equal(mocks['lodash'].noop)
    })

  })


})