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
  makeItShort: !!process.env.LOG_SHORT,
  useLevelLabels: true,
  base: null
}
console.log({defaultOptions})
// Default is this
// ',"pid":2365,"hostname":"daniel-XPS-15-7590"'
function setRequestId (RequestId, substrStart = -12, substrEnd) {
  if (this.madeShort) {
    this[pino.symbols.chindingsSym] = flatstr(`,"Id":"${('' + RequestId).substr(substrStart, substrEnd)}"`)
  } else {
    this[pino.symbols.chindingsSym] = flatstr(`,"RequestId":${JSON.stringify(RequestId)}`)
  }
}

function makeItShort () {
  this.madeShort = true
  Object.keys(this[pino.symbols.lsCacheSym]).forEach((k) => {
    this[pino.symbols.lsCacheSym][k] = (`{"l":"${JSON.parse(`${this[pino.symbols.lsCacheSym][k]}}`).level[0]}"`)
  })
}

const createLogger = (options = {}) => {
  const pinoOptions = { ...defaultOptions, ...options }
  const mainLogr = pino(pinoOptions)

  mainLogr.createLogger = createLogger
  mainLogr.setRequestId = setRequestId
  mainLogr.makeItShort = makeItShort
  mainLogr.madeShort = false

  if (pinoOptions.makeItShort) {
    mainLogr.makeItShort()
  }

  mainLogr[pino.symbols.endSym] = '}\n'

  return mainLogr
}

module.exports = createLogger()
