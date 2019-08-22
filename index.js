'use strict';

const pino = require('pino')

const defaultOptions = {
  level: process.env.LOG_LEVEL || 'info',
  timestamp: !process.env.LOG_NODATE,
  base: null
}

const createLogger = (options = {}) => {
  const pinoOptions = {...defaultOptions, ...options}
  const mainLogr = pino(pinoOptions)
  mainLogr.createLogger = createLogger

  return mainLogr
}

module.exports = createLogger();
