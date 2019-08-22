'use strict'

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const sinon = require('sinon')
const { expect } = require('chai')

describe('index.js', () => {
  process.env.LOG_LEVEL = 'silent'

  let box
  beforeEach(() => {
    box = sinon.createSandbox()
  })

  afterEach(() => { box.restore() })

  describe('#createLogger', () => {
    it('should have the method createLogger', () => {
      const logr = require('../index.js')
      expect(logr).to.have.property('createLogger')
      expect(logr.createLogger).to.be.instanceof(Function)
    })

    it('should create the method createLogger', () => {
      const logr = require('../index.js').createLogger({ level: 'debug' })
      expect(logr).to.have.property('level', 'debug')
    })
  })
})
