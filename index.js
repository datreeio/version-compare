const program = require('commander')
const request = require('request-promise-native')

const BASE_URL = 'http://gateway.datree.io/v1/policy/codecomponents/versions/validate'

program
  .usage('Temp message')
  .option('-a, --api-key <api_key>', 'datree api key')
  .option('-p, --payload <payload>', 'JSON formatted payload of expected and actual code component versions')
  .option('-u, --pr-url <pull_request_url>', 'pull request url')
  .parse(process.argv)

async function main() {
  console.log('Parameters:')
  console.log('api key', program.apiKey)
  console.log('pr', program.prUrl)
  console.log('payload', program.payload)
  const prUrlArray = program.prUrl.split('/')
  const orgName = prUrlArray[3]
  const repositoryName = prUrlArray[4]
  const pullRequestNumber = prUrlArray[6]

  const body = {
    repositoryOwner: orgName,
    repositoryName,
    pullRequestNumber,
    codeComponents: JSON.parse(program.payload)
  }

  const options = {
    uri: BASE_URL,
    headers: {
      'x-datreeio-api-key': program.apiKey,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: body,
    json: true
  }

  const res = await request(options)
  return res
}

if (require.main === module) {
  main()
    .then(res => {
      console.log('datree policy is running, check github for more information - ', program.prUrl)
    })
    .catch(err => {
      console.log('api failure - ', err.message)
    })
}
