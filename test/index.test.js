const sinon = require('sinon')
const chai = require('chai')
const index = require('../index')
chai.should()
chai.use(require('sinon-chai'))

describe('version comppare', function() {
  mockApiKey = 'mockApiKey'
  mockPayload = {}
  mockPrUrl = 'https://github.com/datreeio/version-compare/pulls/1'

  describe('request', function() {
    const mockRequestClient = sinon.stub()
    afterEach(function() {
      mockRequestClient.reset()
    })
    it('should pass', async function() {
      const temp = true
      temp.should.eql(true)
    })
  })
})
