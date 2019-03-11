'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions, no-console */

const { expect } = require('chai');
const cleanrequire = require('@everymundo/cleanrequire');

describe('lib/konsole', () => {
  describe('konsole', () => {
    const { konsole } = cleanrequire('../../lib/konsole');

    it('should be console', () => {
      expect(konsole).to.equal(console);
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
