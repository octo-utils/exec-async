import tty from "tty"
import chai from "chai"
import sh from "shelljs"
import { spawn, exec } from "../index.js"

// const { expect } = chai;

const scriptEchoWithColor = `
import tty from "tty"
import * as readline from "readline"

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

process.stdout.write(\`isatty \${tty.isatty(1)} 1 for stdout \\n\`)

;(async function() {
  for (const i of [1, 2, 3]) {
    await delay(100);
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(\`\x1b[33mline \${i}\`)
  }
  process.stdout.write("\\n");
})();
`

describe('dial test cases, CHECK the output manually in terminal', function () {
  console.log(tty.isatty(1));

  it('sh.exec', async function() {
    sh.exec(`node --input-type=module -e '${scriptEchoWithColor}'`)
  })

  it('index:spawn', async function () {
    await spawn(`node`, ['--input-type=module','-e', scriptEchoWithColor], { stdoutInherit: true })
  })

  it('index:exec', async function() {
    await exec(`node --input-type=module -e '${scriptEchoWithColor}'`)
  })
});
