'use strict'

const pino = require('pino')
const flatstr = require('flatstr')

const createDefaultOptions = (env, options = {}) => ({
  createdAt: Date.now(),
  level: env.LOG_LEVEL || 'info',
  get timestamp () {
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
  makeItShort: env.LOG_SHORT !== 'false',
  formatters: {
    level: label => ({ level: label })
  },
  base: null,
  ...options
})

const createLogger = (options) => {
  const pinoOptions = createDefaultOptions(process.env, options)

  const logr = Object.create(pino(pinoOptions), {
    createLogger: { value: createLogger },
    setRequestId: {
      value: function (RequestId, substrStart = -12, substrEnd) {
        this.requestId = this.madeShort
          ? ('' + RequestId).slice(substrStart, substrEnd)
          : RequestId

        this[pino.symbols.chindingsSym] = flatstr(`,"Id":"${this.requestId}"`)
      }
    },
    requestId: { value: null, writable: true },
    makeItShort: {
      value: function () {
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
    },
    madeShort: { value: false, writable: true },
    createdAt: { value: Date.now() },
    createDefaultOptions: { value: createDefaultOptions }
  })

  if (pinoOptions.makeItShort) {
    logr.makeItShort()
  }

  logr[pino.symbols.endSym] = '}\n'
  Object.defineProperty(logr, 'default', { value: logr })

  return logr
}

// module.exports = SimpleLogr.createLogger()
module.exports = createLogger()
