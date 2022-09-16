# @everymundo/simple-logr
Simple Logr is a wrap around [pino](https://github.com/pinojs/pino) with a default configuration and some specific extra functionality.

## Why do we need a wrapper around pino?
We created this library to help us standardize the pino settings across our applications so we achieve a consistent logging experience across them.

Another reason was that since most of these mentioned applications are running as AWS Lambda functions sending their logs to Amazon CloudWatch, we were able to make all the logs more concise and printing out a few less bytes per message, which saved us quite some money since Amazon CloudWatch Logs charges us by bytes intake.

## Installation

```bash
npm install @everymundo/simple-logr
```

## Usage

### LOG_LEVEL
The environmental variable **LOG_LEVEL** can be used to set the log level for the logger. **LOG_LEVEL** default value is _info_. That means all your calls to logr.trace and logr.debug are not going to print anything out.

Assuming you run the (simple-usage.js)[ls examples/simple-usage/simple-usage.js] script with the environmental variable LOG_LEVEL=trace, you can see the expected result.

```js
const logr = require('@everymundo/simple-logr')

logr.trace('trace message') // {"level":"trace","time":1590951886897,"msg":"trace message"}
logr.debug('debug message') // {"level":"debug","time":1590951886897,"msg":"debug message"}
logr.info('info message')   // {"level":"info","time":1590951886897,"msg":"info message"}
logr.warn('warn message')   // {"level":"warn","time":1590951886897,"msg":"warn message"}
logr.error('error message') // {"level":"error","time":1590951886897,"msg":"error message"}
logr.fatal('fatal message') // {"level":"fatal","time":1590951886897,"msg":"fatal message"}
```
### LOG_SHORT
The environmental variable **LOG_SHORT** when exists will set the logr to print what we call the short version.

Assuming you run the (simple-usage.js)[ls examples/simple-usage/simple-usage.js] script with the environmental variable LOG_LEVEL=trace, you can see the expected result.

```js
const logr = require('@everymundo/simple-logr')

logr.trace('trace message') // {"level":"trace","time":1590951886897,"msg":"trace message"}
logr.debug('debug message') // {"level":"debug","time":1590951886897,"msg":"debug message"}
logr.info('info message')   // {"level":"info","time":1590951886897,"msg":"info message"}
logr.warn('warn message')   // {"level":"warn","time":1590951886897,"msg":"warn message"}
logr.error('error message') // {"level":"error","time":1590951886897,"msg":"error message"}
logr.fatal('fatal message') // {"level":"fatal","time":1590951886897,"msg":"fatal message"}
```

If you clone this repo you can run the above examples with the help of npm scripts. Here are the steps:

```sh
git clone https://github.com/EveryMundo/simple-logr.git
cd simple-logr/examples/simple-usage
npm install

npm run trace
npm run debug
npm run info
npm run warn
npm run error
npm run fatal
```
