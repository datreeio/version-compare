const program = require('commander')

const utils = require('./utils')

program
  .usage('Temp message')
  .option('-a, --api-key <api_key>', 'datree api key')
  .option(
    '-f, --file-path <file_path>',
    'path to JSON formatted payload of expected and actual code component versions'
  )
  .option('-p, --payload <payload>', 'JSON formatted payload of expected and actual code component versions')
  .option(
    '-f, --file-path <file_path>',
    'path to JSON formatted payload of expected and actual code component versions'
  )
  .option('-u, --pr-url <pull_request_url>', 'pull request url')
  .parse(process.argv)

async function main() {
  const urlParams = utils.parseUrl(program.prUrl)
  const versionsPayload = utils.getVersionsPayload(program.filePath, program.payload)
  await utils.dispatchVersionComparePolicy(program.apiKey, urlParams, versionsPayload)
}

if (require.main === module) {
  main()
    .then(res => {
      console.log('datree policy is running, check github for more information - ', program.prUrl)
      process.exitCode = 0
    })
    .catch(err => {
      console.log('Failed to run datree policy - ', err.message)
      process.exitCode = 1
    })
}
