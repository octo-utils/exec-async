import cp from "child_process"
import sh from "shelljs"
import _pwd from "shelljs/src/pwd.js"
import through2 from "through2"
import streamToString from "stream-to-string"

const redColor = "\u001b[31m";
const resetColor = "\u001b[0m";

export async function exec(command, options = {}) {
  const child = sh.exec(command, { async: true, silent: true });
  
  return new Promise((resolve, reject) => {
    const stringStdout = streamToString(child.stdout);
    child.on('close', async (code) => {
      if (code !== 0) {
       return reject(`exit code (${code})`);
      }
      resolve(await stringStdout);
    });
    if (options.silent) {
      return void 0;
    }
    child.stdout.pipe(process.stdout);
    child.stderr.pipe((() => {
      let isHead = true;
      return through2(function(buf, enc, next) {
        if (isHead) {
          isHead = false;
          return next(null, Buffer.concat([Buffer.from("\u001b[31m"), buf]));
        }
        return next(null, buf);
      }, function(flush) {
        this.push(resetColor)
        flush();
      })
    })()).pipe(process.stderr);
  });
}

export async function spawn(command, args, options = {}) {
  const child = cp.spawn(command, args, { 
    cwd: _pwd(),
    stdio: ['pipe', options.stdoutInherit ? 'inherit' : 'pipe', 'pipe']
  });
  
  return new Promise((resolve, reject) => {
    const stringStdout = child.stdout ? streamToString(child.stdout) : Promise.resolve(null);
    child.on('close', async (code) => {
      if (code !== 0) {
        return reject(`exit code (${code})`);
      }
      resolve(await stringStdout);
    });
    if (options.silent) {
      return void 0;
    }
    if (!options.stdoutInherit) {
      child.stdout.pipe(process.stdout);
    }
    child.stderr.pipe((() => {
      let isHead = true;
      return through2(function(buf, enc, next) {
        if (isHead) {
          isHead = false;
          return next(null, Buffer.concat([Buffer.from(redColor), buf]));
        }
        return next(null, buf);
      }, function(flush) {
        this.push(resetColor)
        flush();
      })
    })()).pipe(process.stderr);
  });
}
