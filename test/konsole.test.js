'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions, no-console */

const { expect } = require('chai');

describe('lib/konsole', () => {
  describe('#noop', () => {
    const konsole = require('../lib/konsole');
    const keys    = Object.keys(konsole);

    it('should export 3 keys', () => {
      expect(keys.length).to.equal(3);
    });

    it('should export keys error, log and warn', () => {
      const sortedKeys = keys.sort();
      const expectKeys = ['error', 'log', 'warn'];

      expect(sortedKeys).to.deep.equal(expectKeys);
    });

    describe('#error', () => {
      it('shoud equal console.error', () => {
        expect(konsole.error).to.equal(console.error);
      });
    });

    describe('#log', () => {
      it('shoud equal console.log', () => {
        expect(konsole.log).to.equal(console.log);
      });
    });

    describe('#warn', () => {
      it('shoud equal console.warn', () => {
        expect(konsole.warn).to.equal(console.warn);
      });
    });
  });
});
