#!/usr/bin/env node
const path = require("path");
const proc = require("child_process");

const chalk = require("chalk");
const program = require("commander");
const express = require("express");

program
  .version(`workframe ${require("../package").version}`)
  .usage("<command> [options]");

program
  .command("serve")
  .description("Run dev server")
  .option("-p, --port [port]", "Port", 8000)
  .action((options) => {
    const cwd = process.cwd();
    const publicDir = path.join(cwd, "public");
    const { port } = options;

    // Log to stdout or stderr
    const log = (stream, string) =>
      process[stream].write(`${formattedTimestamp()} ${string}`);

    // Top level info prefixed with an arrow
    const info = (...args) => console.info("→", ...args);

    console.log(chalk.green.underline("Running dev server\n"));

    info(`Serving public directory on port ${port}:`);
    console.info(`  ${publicDir}\n`);

    info("Building and watching via `npm run watch`\n");
    const watchProc = proc.spawn("npm", ["run", "watch"]);
    watchProc.stdout.on("data", (data) => log("stdout", data));
    watchProc.stderr.on("data", (data) => log("stderr", data));

    info(`Starting server on port ${port}\n`);
    express()
      .use(express.static("public"))
      .listen(port, () => {
        info(`View app at http://localhost:${port}/\n`);
      });
  });

program.parse(process.argv);

function formattedTimestamp() {
  let timestamp = new Date();
  timestamp = new Date(timestamp - timestamp.getTimezoneOffset() * 60 * 1000);
  timestamp = timestamp.toISOString();
  timestamp = timestamp.replace("T", " ");
  timestamp = timestamp.slice(0, 19);
  return `[${timestamp}]`;
}
