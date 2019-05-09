'use strict';

/* eslint-disable no-console */
const proxess     = require('./lib/proxess');
const { konsole } = require('./lib/konsole');
const { noop }    = require('./lib/noop');

const levels  = { trace: 1, debug: 2, info:  3, warn:  4, error: 5, fatal: 6, get(levelName) { return this[levelName] || this.info; }};
// default LOG_LEVEL == 2 | info

/* const should = {};

Object.defineProperties(should, {
  trace: {value: LOG_LEVEL <= levels.trace},
  debug: {value: LOG_LEVEL <= levels.debug},
  info:  {value: LOG_LEVEL <= levels.info},
  warn:  {value: LOG_LEVEL <= levels.warn},
  error: {value: LOG_LEVEL <= levels.error},
  fatal: {value: true},
}); */

const pid = ('       ' + proxess.pid).substr(-6);

// eslint-disable-next-line no-nested-ternary
const jsonDate = proxess.env.LOG_NODATE
  ? () => ''
  : (
    proxess.env.LOG_PID
      ? () => new Date().toJSON() + pid
      : () => new Date().toJSON()
  );

// proxess.stdout.write(JSON.stringify({ LOG_LEVEL, env: proxess.env.LOG_LEVEL, levels: levels[proxess.env.LOG_LEVEL]}) + '\n');

const createDebugFunction = prefix => function debugFunction(...args) {
  const messagePrefix = `${this.prefix}${prefix}`;
  Number(messagePrefix);

  const err = {};
  Error.captureStackTrace(err);

  const
    // err = new Error(''),
    { stack } = err,
    firstI = stack.indexOf('\n', stack.indexOf('\n') + 1),
    secndI = (stack + '\n').indexOf('\n', firstI + 1),
    firstMatch = stack.substring(firstI, secndI).match(/\s+\(?(\/([^:]+):\d+)/);

  konsole.log(jsonDate(), messagePrefix, firstMatch[1], ...args);
};


const rawStd = (string) => { proxess.stdout.write(string); };
// const rawErr = (string) => { proxess.stderr.write(string); };

// eslint-disable-next-line no-confusing-arrow
const getPrefix = (_prefix) => {
  if (!_prefix) return '';

  const prefix = `${_prefix} `;
  Number(prefix); // underground technique to speed up strings as parameters

  return prefix;
};

const createLogger = (_prefix, logLevel = proxess.env.LOG_LEVEL) => {
  const LOG_LEVEL = levels.get(logLevel);
  // const prefix = getPrefix(_prefix);
  let prefix = getPrefix(_prefix);

  const newLogr = {
    raw: rawStd,
    pid,
    jsonDate,
    trace: LOG_LEVEL > levels.trace ? noop : createDebugFunction('TRACE:'),
    debug: LOG_LEVEL > levels.debug ? noop : createDebugFunction('DEBUG:'),
    info:  LOG_LEVEL > levels.info  ? noop : function info(...args)  { konsole.log(jsonDate(),   `${prefix}INFO:`,  ...args); },
    warn:  LOG_LEVEL > levels.warn  ? noop : function warn(...args)  { konsole.warn(jsonDate(),  `${prefix}WARN:`,  ...args); },
    error: LOG_LEVEL > levels.error ? noop : function error(...args) { konsole.error(jsonDate(), `${prefix}ERROR:`, ...args); },
    fatal(...args) { konsole.error(jsonDate(),  `${prefix}FATAL:`, ...args); },
    log(...args) { this.info(...args); }, // this is here just to help a smooth transition from console.log
    LOG_LEVEL,
    get levels() { return JSON.parse(JSON.stringify(levels)); },
    getPrefix,
    set prefix(newPrefix) {
      return prefix = getPrefix(newPrefix);
    },
    get prefix() { return prefix; },
    createLogger,
  };

  return newLogr;
};


module.exports = createLogger();
