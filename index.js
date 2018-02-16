'use strict';

/* eslint-disable no-console */
const
  proxess  = require('./lib/proxess'),
  konsole  = require('./lib/konsole'),
  { noop } = require('./lib/noop'),
  _log     = konsole.log,
  _warn    = konsole.warn,
  _err     = konsole.error;

const levels  = { trace: 1, debug: 2, info:  3, warn:  4, error: 5, fatal: 6 };
// default LOG_LEVEL == 2 | info
const LOG_LEVEL = levels[proxess.env.LOG_LEVEL] || levels.info;

const should = {};

Object.defineProperties(should, {
  trace: {value: LOG_LEVEL <= levels.trace},
  debug: {value: LOG_LEVEL <= levels.debug},
  info:  {value: LOG_LEVEL <= levels.info},
  warn:  {value: LOG_LEVEL <= levels.warn},
  error: {value: LOG_LEVEL <= levels.error},
  fatal: {value: true},
});

const pid = ('       ' + proxess.pid).substr(-6);

const jsonDate = proxess.env.LOG_PID ?
  () => new Date().toJSON() + pid :
  () => new Date().toJSON();

// proxess.stdout.write(JSON.stringify({ LOG_LEVEL, env: proxess.env.LOG_LEVEL, levels: levels[proxess.env.LOG_LEVEL]}) + '\n');

const createDebugFunction = (prefix = 'DEBUG:') => (...args) => {
  const
    err = new Error(''),
    { stack } = err,
    firstI = stack.indexOf('\n', stack.indexOf('\n') + 1),
    secndI = (stack + '\n').indexOf('\n', firstI + 1),
    firstMatch = stack.substring(firstI, secndI).match(/\s+\(?(\/([^:]+):\d+)/);

  _log(jsonDate(), prefix, firstMatch[1], ...args);
};

const raw = (string) => { proxess.stdout.write(string); };

const trace = LOG_LEVEL > levels.trace ? noop : createDebugFunction('TRACE:');
const debug = LOG_LEVEL > levels.debug ? noop : createDebugFunction('DEBUG:');
const info  = LOG_LEVEL > levels.info  ? noop : (...args) => { _log(jsonDate(),  'INFO:',  ...args); };
const warn  = LOG_LEVEL > levels.warn  ? noop : (...args) => { _warn(jsonDate(), 'WARN:',  ...args); };
const error = LOG_LEVEL > levels.error ? noop : (...args) => { _err(jsonDate(),  'ERROR:', ...args); };
const fatal = (...args) => { _err(jsonDate(),  'FATAL:', ...args); };

module.exports = {
  raw,
  pid,
  jsonDate,
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
