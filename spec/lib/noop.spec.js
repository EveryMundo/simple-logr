'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const cleanrequire = require('@everymundo/cleanrequire');

describe('lib/noop', () => {
  describe('#noop', () => {
    it('should be a function', () => {
      const { noop } = require('../../lib/noop');
      expect(noop).to.be.instanceof(Function);
    });

    it('should return undefined', () => {
      const { noop } = cleanrequire('../../lib/noop');
      console.log(noop.toString());
      const res = noop();

      expect(res).to.be.undefined;
    });
  });
});
