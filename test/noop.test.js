'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai');

describe('lib/noop', () => {
  describe('#noop', () => {
    const { noop } = require('../lib/noop');

    it('should be a function', () => {
      expect(noop).to.be.instanceof(Function);
    });

    it('should return undefined', () => {
      expect(noop()).to.be.undefined;
    });

    it('should be a blank function', () => {
      const noopString = noop.toString().replace(/\s+/g, '');
      expect(noopString).to.equal('()=>{}');
    });
  });
});
