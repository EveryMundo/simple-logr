'use strict';

/* eslint-disable no-console */
const
  konsole  = require('./lib/konsole'),
  { noop } = require('./lib/noop'),
  _log     = konsole.log,
  _warn    = konsole.warn,
  _err     = konsole.error;

const levels = { trace: 1, debug: 2, info:  3, warn:  4, error: 5, fatal: 6 };

// default LOG_LEVEL == 2 | info
const LOG_LEVEL = levels[process.env.LOG_LEVEL] || levels.info;

// process.stdout.write(JSON.stringify({ LOG_LEVEL, env: process.env.LOG_LEVEL, levels: levels[process.env.LOG_LEVEL]}) + '\n');

const createDebugFunction = (prefix = 'DEBUG:') => (...args) => {
  const
    err = new Error(''),
    { stack } = err,
    firstI = stack.indexOf('\n', stack.indexOf('\n') + 1),
    secndI = (stack + '\n').indexOf('\n', firstI + 1),
    firstMatch = stack.substring(firstI, secndI).match(/\s+\(?(\/([^:]+):\d+)/);

  _log(new Date().toJSON(), prefix, firstMatch[1], ...args);
};

const trace = LOG_LEVEL > levels.trace ? noop : createDebugFunction('TRACE:');
const debug = LOG_LEVEL > levels.debug ? noop : createDebugFunction('DEBUG:');
const info  = LOG_LEVEL > levels.info  ? noop : (...args) => { _log(new Date().toJSON(),  'INFO:',  ...args); };
const warn  = LOG_LEVEL > levels.warn  ? noop : (...args) => { _warn(new Date().toJSON(), 'WARN:',  ...args); };
const error = LOG_LEVEL > levels.error ? noop : (...args) => { _err(new Date().toJSON(),  'ERROR:', ...args); };
const fatal = (...args) => { _err(new Date().toJSON(),  'FATAL:', ...args); };

module.exports = {
  trace,
  debug,
  info,
  log: info, // this is here just to help a smooth transition from console.log
  warn,
  error,
  fatal,
  LOG_LEVEL,
  get levels() { return JSON.parse(JSON.stringify(levels)); },
};
