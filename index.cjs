'use strict'

const pino = require('pino')
const flatstr = require('flatstr')

const createDefaultOptions = (env) => ({
  createdAt: Date.now(),
  level: env.LOG_LEVEL || 'info',
  get timestamp () {
    console.log('timestamp')
    if (env.LOG_NODATE !== 'false') {
      Object.defineProperty(this, 'timestamp', { value: false })

      return false
    }

    if (env.LOG_DATE_FORMAT in pino.stdTimeFunctions) {
      Object.defineProperty(this, 'timestamp', { value: pino.stdTimeFunctions[env.LOG_DATE_FORMAT] })

      return pino.stdTimeFunctions[env.LOG_DATE_FORMAT]
    }

    Object.defineProperty(this, 'timestamp', { value: pino.stdTimeFunctions.epochTime })

    return pino.stdTimeFunctions.epochTime
  },
  get makeItShort () {
    return env.LOG_SHORT !== 'false'
  },
  formatters: {
    level: label => ({ level: label })
  },
  base: null
})

const defaultOptions = createDefaultOptions(process.env)

// Default is this
// ',"pid":2365,"hostname":"daniel-XPS-15-7590"'
function setRequestId (RequestId, substrStart = -12, substrEnd) {
  this.requestId = this.madeShort
    ? ('' + RequestId).substr(substrStart, substrEnd)
    : RequestId

  this[pino.symbols.chindingsSym] = flatstr(`,"Id":"${this.requestId}"`)
}

function makeItShort () {
  this.madeShort = true

  for (const k of Object.keys(this[pino.symbols.lsCacheSym])) {
    if (process.env.LOG_NUMERIC_LEVEL === 'true') {
      this[pino.symbols.lsCacheSym][k] = flatstr(`{"l":${k}`)
    } else {
      const { level } = JSON.parse(`${this[pino.symbols.lsCacheSym][k]}}`)

      this[pino.symbols.lsCacheSym][k] = (typeof level === 'number')
        ? flatstr(`{"l":"${this.levels.labels[level][0]}"`)
        : flatstr(`{"l":"${level[0]}"`)
    }
  }
}

const createLogger = (options = {}) => {
  const pinoOptions = { ...defaultOptions, ...options }
  const mainLogr = Object.create(
    pino(pinoOptions),
    {
      createLogger: { value: createLogger },
      setRequestId: { value: setRequestId },
      requestId: { value: null, writable: true },
      makeItShort: { value: makeItShort },
      //   madeShort: { value: false, writable: true },
      createdAt: { value: pinoOptions.createdAt, writable: true },
      createDefaultOptions: { value: createDefaultOptions }
    }
  )

  if (pinoOptions.makeItShort) {
    mainLogr.makeItShort()
  }

  mainLogr[pino.symbols.endSym] = '}\n'
  Object.defineProperty(mainLogr, 'default', { value: mainLogr })

  return mainLogr
}

module.exports = createLogger()
