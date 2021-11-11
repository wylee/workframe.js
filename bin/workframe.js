#!/usr/bin/env node
const path = require("path");
const proc = require("child_process");

const chalk = require("chalk");
const program = require("commander");
const httpServer = require("http-server");

program
  .version(`workframe ${require("../package").version}`)
  .usage("<command> [options]");

program
  .command("serve")
  .description("Run dev server")
  .option("-d, --dir [dir]", "Directory", "./public")
  .option("-H, --host [host]", "Host", "0.0.0.0")
  .option("-p, --port [port]", "Port", 8000)
  .action((options) => {
    const { dir, host, port } = options;
    const termWidth = process.stdout.columns || 80;
    const hr = new Array(termWidth).join("-");

    // Log to stdout or stderr
    const log = (stream, string) =>
      process[stream].write(`${formattedTimestamp()} ${string}`);

    // Top level info prefixed with an arrow
    const info = (...args) => console.info("→", ...args);

    console.log(chalk.green(hr));
    console.log(chalk.green("Running dev server"));

    info("Building and watching via `npm run watch`");
    const watchProc = proc.spawn("npm", ["run", "watch"]);
    setTimeout(() => {
      watchProc.stdout.on("data", (data) => log("stdout", data));
      watchProc.stderr.on("data", (data) => log("stderr", data));
    });

    info(`Starting HTTP server`);
    const server = httpServer.createServer({ root: dir });
    server.listen(port, host, () => {
      info(`Now serving ${server.root} at http://${host}:${port}/`);
      console.log(chalk.green(hr));
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
