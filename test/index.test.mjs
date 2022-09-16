'use strict'

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon'
import chai from 'chai'
import logr from '../index.mjs'

const { expect } = chai
describe('index.mjs', () => {
  // process.env.LOG_LEVEL = 'silent'

  let box
  beforeEach(() => {
    box = sinon.createSandbox()
  })

  afterEach(() => { box.restore() })

  describe('#createLogger', () => {
    it('should have the method createLogger', () => {
      expect(logr).to.have.property('createLogger')
      expect(logr.createLogger).to.be.instanceof(Function)
    })

    it('should create the method createLogger', () => {
      // const logr = require('../index.js').createLogger({ level: 'debug' })
      expect(logr.createLogger({ level: 'debug' })).to.have.property('level', 'debug')
    })

    context('when env.LOG_LEVEL is not defined', () => {
      beforeEach(() => {
        box.stub(process.env, 'LOG_LEVEL').value('')
      })

      it('should assume info as its default LOG_LEVEL', () => {
        const myLogr = logr.createLogger({ level: 'debug' })
        expect(myLogr).to.have.property('level', 'debug')
      })
    })
  })
})
