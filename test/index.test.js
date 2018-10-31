const sinon = require('sinon')
const chai = require('chai')
const utils = require('../utils')
chai.should()
chai.use(require('sinon-chai'))

describe('version compare', function() {
  const mockApiKey = 'mockApiKey'
  const mockPrUrl = 'https://github.com/datreeio/version-compare/pulls/1'
  const mockUrlParams = {
    orgName: 'datreeio',
    repositoryName: 'version-compare',
    pullRequestNumber: '1'
  }
  const mockVersions = {
    expected: [
      { name: 'webpack-node-externals', category: 'npm', version: '1.7.2' },
      { name: 'webpack-dev-server', category: 'npm', version: '2.11.1' }
    ],
    actual: [
      { name: 'webpack-node-externals', category: 'npm', version: '1.7.2' },
      { name: 'webpack-dev-server', category: 'npm', version: '4.11.3' }
    ]
  }

  describe('parseUrl', function() {
    it('should parse url', function() {
      const res = utils.parseUrl(mockPrUrl)
      res.should.eql(mockUrlParams)
    })
    it('should exit on bad url format', function() {
      let error, errorTester
      try {
        utils.parseUrl('mockPrUrl')
      } catch (err) {
        errorTester = true
        error = err
      }
      error.should.be.an('error')
      errorTester.should.be.true
    })
  })
  describe('getVersionsPayload', function() {
    it('should resolve a given payload', function() {
      const res = utils.getVersionsPayload('', JSON.stringify(mockVersions))
      res.should.eql(mockVersions)
    })
    it('should read json from file', function() {
      const fs = require('fs')
      sinon.stub(fs, 'readFileSync').returns(JSON.stringify(mockVersions))

      const mockPath = './versionsMock.json'
      const res = utils.getVersionsPayload(mockPath, '')
      res.should.eql(mockVersions)
      fs.readFileSync.should.have.been.calledOnceWith(mockPath)
      sinon.restore()
    })
    it('should exit on bad url format', function() {
      let error, errorTester
      try {
        utils.getVersionsPayload('', '')
      } catch (err) {
        errorTester = true
        error = err
      }
      error.should.be.an('error')
      errorTester.should.be.true
    })
  })
  describe('dispatchVersionComparePolicy', function() {
    const request = require('request-promise-native')
    before(function() {
      sinon.stub(request, 'post').resolves()
    })
    after(function() {
      sinon.restore()
    })
    it('should send a request with correct params', async function() {
      const mockBody = {
        repositoryOwner: mockUrlParams.orgName,
        repositoryName: mockUrlParams.repositoryName,
        pullRequestNumber: mockUrlParams.pullRequestNumber,
        codeComponents: mockVersions
      }

      const expectedOptions = {
        uri: 'http://gateway.datree.io/v1/policy/codecomponents/versions/validate',
        headers: {
          'x-datreeio-api-key': mockApiKey,
          'Content-Type': 'application/json'
        },
        body: mockBody,
        json: true
      }

      res = await utils.dispatchVersionComparePolicy(mockApiKey, mockUrlParams, mockVersions)

      request.post.should.have.been.calledOnceWith(expectedOptions)
    })
  })
})
