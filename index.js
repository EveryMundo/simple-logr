'use strict'

const pino = require('pino')
const flatstr = require('flatstr')

const defaultOptions = {
  level: process.env.LOG_LEVEL || 'info',
  get timestamp () {
    if (process.env.LOG_NODATE) {
      return false
    }

    if (process.env.LOG_DATE_FORMAT in pino.stdTimeFunctions) {
      return pino.stdTimeFunctions[process.env.LOG_DATE_FORMAT]
    }

    return pino.stdTimeFunctions.epochTime
  },
  useLevelLabels: true,
  base: null
}

// Default is this
// ',"pid":2365,"hostname":"daniel-XPS-15-7590"'
function setRequestId (RequestId) {
  this[pino.symbols.chindingsSym] = flatstr(`,"RequestId":${JSON.stringify(RequestId)}`)
}

const createLogger = (options = {}) => {
  const pinoOptions = { ...defaultOptions, ...options }
  const mainLogr = pino(pinoOptions)

  mainLogr.createLogger = createLogger
  mainLogr.setRequestId = setRequestId

  mainLogr[pino.symbols.endSym] = '}\n'

  return mainLogr
}

module.exports = createLogger()
