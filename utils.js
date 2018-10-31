const request = require('request-promise-native')
const fs = require('fs')

const BASE_URL = 'http://gateway.datree.io/v1/policy/codecomponents/versions/validate'

function parseUrl(url) {
  const prUrlArray = url.split('/')
  if (prUrlArray.length < 7) {
    throw new Error('Bad URL format')
  }
  const orgName = prUrlArray[3]
  const repositoryName = prUrlArray[4]
  const pullRequestNumber = prUrlArray[6]
  return {
    orgName,
    repositoryName,
    pullRequestNumber
  }
}

function getVersionsPayload(filePath, jsonPayload) {
  let versionsPayload
  if (filePath) {
    versionsPayload = fs.readFileSync(filePath, 'utf8')
  } else if (jsonPayload) {
    versionsPayload = jsonPayload
  } else {
    throw new Error('no payload received')
  }

  return JSON.parse(versionsPayload)
}

async function dispatchVersionComparePolicy(apiKey, urlParams, versionsPayload) {
  const body = {
    repositoryOwner: urlParams.orgName,
    repositoryName: urlParams.repositoryName,
    pullRequestNumber: urlParams.pullRequestNumber,
    codeComponents: versionsPayload
  }

  const options = {
    uri: BASE_URL,
    headers: {
      'x-datreeio-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: body,
    json: true
  }

  return await request.post(options)
}

module.exports = {
  parseUrl,
  getVersionsPayload,
  dispatchVersionComparePolicy
}
