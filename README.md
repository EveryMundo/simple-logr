# @everymundo/simple-logr
A very simplistic logger that allows one to avoid using the console.log directly allowing stubbing and better linting.

It's just a simple wrapper around console./log|war|error/ with a few extra features.

## installation

```bash
npm install @everymundo/simple-logr
```

## usage

The environmental variable **LOG_LEVEL** can be used to change the log level for the logger. **LOG_LEVEL** default value is _info_. That means all your calls to logr.trace and logr.debug are not going to print anything out.

Assuming you run the (simple-usage.js)[ls examples/simple-usage/simple-usage.js] script with the environmental variable LOG_LEVEL=trace, you can see the expected result.

```node
const logr = require('@everymundo/simple-logr');

logr.trace('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz TRACE: filename:lineNumber message
logr.debug('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz DEBUG: filename:lineNumber message
logr.info('message');  // outputs: YYYY-MM-DDTHH:mm:ss.zzz INFO: message
logr.warn('message');  // outputs: YYYY-MM-DDTHH:mm:ss.zzz WARN: message
logr.error('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz ERROR: message
logr.fatal('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz FATAL: message

```

If you clone this repo you can run the above examples with the help of npm scripts. Here are the steps:

```bash
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
