const expect = require('chai').expect
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const generateMocks = require('../../helpers/SandboxMocks')
const defaultOptions = require('../../../lib/Sandbox').defaultOptions

describe('Sandbox', () => {
  let mocks
  let Sandbox
  let poolManager
  let sandbox
  let options

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    mocks = generateMocks(sandbox)
    options = {
      "poolSize": 777,
      "memoryLimitMb": 777,
      "imageName": "fake/fake-repo",
      "timeoutMs": 777
    }
    Sandbox = proxyquire('../../../lib/Sandbox', mocks)
    poolManager = new Sandbox(options)
  })


  afterEach(() => {
    sandbox.restore()
    mocks = null
    Sandbox = null
    poolManager = null
  })


  describe('constructor', () => {
    it('should set options as expected if some are passed', () => {
      const expected = {
        poolSize: options.poolSize,
        memoryLimitMb: options.memoryLimitMb,
        imageName: options.imageName,
        timeoutMs: options.timeoutMs,
        containerLaunchOptions: {
          "Image": options.imageName,
          "NetworkDisabled": false,
          "AttachStdin": false,
          "AttachStdout": false,
          "AttachStderr": false,
          "OpenStdin": false,
          "Privileged": false,
          "User": "sandboxuser",
          "Tty": false,
          "HostConfig": {
            "Memory": options.memoryLimitMb * 1000000,
            "MemorySwap": -1,
            "Privileged": false,
            "CpusetCpus": "0" // only use one core
          },
          "Labels": {
            "__docker_sandbox": "1"
          },
          ExposedPorts: {
            "3000/tcp": {}
          }
        }
      }

      expect(poolManager.options).to.deep.equal(expected)
    })

    it('should set options as expected if none are passed', () => {
      options = {}
      poolManager = new Sandbox(options)
      const expected = {
        poolSize: defaultOptions.poolSize,
        memoryLimitMb: defaultOptions.memoryLimitMb,
        imageName: defaultOptions.imageName,
        timeoutMs: defaultOptions.timeoutMs,
        containerLaunchOptions: {
          "Image": options.imageName,
          "NetworkDisabled": false,
          "AttachStdin": false,
          "AttachStdout": false,
          "AttachStderr": false,
          "OpenStdin": false,
          "Privileged": false,
          "User": "sandboxuser",
          "Tty": false,
          "HostConfig": {
            "Memory": options.memoryLimitMb * 1000000,
            "MemorySwap": -1,
            "Privileged": false,
            "CpusetCpus": "0" // only use one core
          },
          "Labels": {
            "__docker_sandbox": "1"
          },
          ExposedPorts: {
            "3000/tcp": {}
          }
        }
      }

      expect(poolManager.options).to.deep.equal(expected)
    })

  })


})