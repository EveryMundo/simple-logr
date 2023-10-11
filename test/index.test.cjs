'use strict'

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const sinon = require('sinon')
const pino = require('pino')
const { expect } = require('chai')

describe('index.cjs', () => {
  // process.env.LOG_LEVEL = 'silent'

  let box
  beforeEach(() => {
    box = sinon.createSandbox()
  })

  const logr = require('../index.cjs')

  afterEach(() => { box.restore() })

  describe('#createLogger', () => {
    it('should have the method createLogger', () => {
      // const logr = require('../index.cjs')
      expect(logr).to.have.property('createLogger')
      expect(logr.createLogger).to.be.instanceof(Function)
    })

    it('should create the method createLogger', () => {
      const myLogr = logr.createLogger({ level: 'debug' })
      expect(myLogr).to.have.property('level', 'debug')
    })

    describe('when env.LOG_LEVEL is not defined', () => {
      beforeEach(() => {
        box.stub(process.env, 'LOG_LEVEL').value('')
      })

      it('should assume info as its default LOG_LEVEL', () => {
        const myLogr = logr.createLogger({ level: 'debug' })
        expect(myLogr).to.have.property('level', 'debug')
      })
    })
  })

  describe('#setRequestId', () => {
    describe('when makeItShort is true (default)', () => {
      it('should only use the last 12 characters of the input', () => {
        const myLogr = logr.createLogger()
        myLogr.setRequestId('01234567890123456789')

        expect(myLogr).to.have.property('requestId', '890123456789')
      })
    })

    describe('when makeItShort is false (default)', () => {
      it('should only use the last 12 characters of the input', () => {
        const myLogr = logr.createLogger({ makeItShort: false })
        myLogr.setRequestId('01234567890123456789')

        expect(myLogr).to.have.property('requestId', '01234567890123456789')
      })
    })
  })

  describe('#makeItShort', () => {
    beforeEach(() => {
      if (process.env.LOG_NUMERIC_LEVEL == null) {
        process.env.LOG_NUMERIC_LEVEL = ''
      }

      box.stub(process.env, 'LOG_NUMERIC_LEVEL').value('true')
    })

    describe('when env.LOG_NUMERIC_LEVEL == true', () => {
      it('should print l as a number', () => {
        const myLogr = logr.createLogger()
        myLogr.makeItShort()
        for (const k of Object.keys(myLogr[pino.symbols.lsCacheSym])) {
          const o = JSON.parse(myLogr[pino.symbols.lsCacheSym][k] + '}')
          expect(o).to.have.property('l', parseInt(k))
        }
      })
    })
  })

  describe('#createDefaultOptions', () => {
    describe('when env.LOG_NODATE !== "false"', () => {
      it('should set timestamp to false', () => {
        const defaultOptions = logr.createDefaultOptions({ LOG_NODATE: null })

        expect(defaultOptions).to.have.property('timestamp', false)
      })
    })

    describe('when env.LOG_NODATE === "false"', () => {
      describe('and LOG_DATE_FORMAT === "unixTime"', () => {
        it('should set timestamp to false', () => {
          const defaultOptions = logr.createDefaultOptions({ LOG_NODATE: 'false', LOG_DATE_FORMAT: 'unixTime' })

          expect(defaultOptions).to.have.property('timestamp', pino.stdTimeFunctions.unixTime)
        })
      })
      describe('but no LOG_DATE_FORMAT', () => {
        it('should set timestamp to false', () => {
          const defaultOptions = logr.createDefaultOptions({ LOG_NODATE: 'false' })

          expect(defaultOptions).to.have.property('timestamp', pino.stdTimeFunctions.epochTime)
        })
      })
    })
  })
})
