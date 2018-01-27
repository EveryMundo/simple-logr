'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions,no-konsole */

const
  {sandbox}    = require('sinon'),
  {expect}     = require('chai'),
  cleanrequire = require('./cleanrequire');

describe('index.js', () => {
  const konsole = cleanrequire('../lib/konsole');

  let box;
  beforeEach(() => { box = sandbox.create(); });
  afterEach(() => { box.restore(); });
  after(() => {
    // Forces cleanup of possible forgotten stubbed libs in memory.
    cleanrequire('../lib/konsole');
    cleanrequire('../index.js');
  });

  const getCleanIndex = () => cleanrequire('../');

  describe('.levels', () => {
    it('should deep equal { trace: 1, debug: 2, info: 3, warn: 4, error: 5, fatal: 6 }', () => {
      const { levels } = getCleanIndex();
      expect(levels).to.deep.equal({ trace: 1, debug: 2, info: 3, warn: 4, error: 5, fatal: 6 });
    });
  });

  describe('#LOG_LEVEL', () => {
    const getLogLevel = () => getCleanIndex().LOG_LEVEL;

    context('trace', () => {
      beforeEach(() => box.stub(process.env, 'LOG_LEVEL').value('trace'));
      it('should equal 1', () => expect(getLogLevel()).to.equal(1));
    });

    context('debug', () => {
      beforeEach(() => box.stub(process.env, 'LOG_LEVEL').value('debug'));
      it('should equal 2', () => expect(getLogLevel()).to.equal(2));
    });

    context('info', () => {
      beforeEach(() => box.stub(process.env, 'LOG_LEVEL').value('info'));
      it('should equal 3', () => expect(getLogLevel()).to.equal(3));
    });

    context('warn', () => {
      beforeEach(() => box.stub(process.env, 'LOG_LEVEL').value('warn'));
      it('should equal 4', () => expect(getLogLevel()).to.equal(4));
    });

    context('error', () => {
      beforeEach(() => box.stub(process.env, 'LOG_LEVEL').value('error'));
      it('should equal 5', () => expect(getLogLevel()).to.equal(5));
    });

    context('fatal', () => {
      beforeEach(() => box.stub(process.env, 'LOG_LEVEL').value('fatal'));
      it('should equal 6', () => expect(getLogLevel()).to.equal(6));
    });

    context('EMPTY', () => {
      beforeEach(() => box.stub(process.env, 'LOG_LEVEL').value(''));
      it('should equal 3 (info)', () => expect(getLogLevel()).to.equal(3));
    });
  });

  describe('#TRACE', () => {
    context('When LOG_LEVEL=trace', () => {
      let noopLib;
      beforeEach(() => {
        noopLib = cleanrequire('../lib/noop');
        box.stub(noopLib, 'noop').callsFake(() => {
          throw new Error('noop should not be called');
        });

        // the trace method only works when process.env.LOG_LEVEL == 'trace'
        // so we have to fake it
        box.stub(process.env, 'LOG_LEVEL').value('trace');
      });

      it('should call konsole.log with first param as TRACE:', (done) => {

        box.stub(konsole, 'log').callsFake((...args) => {
          ['TRACE:', undefined, 'test trace', 1, 2, 3]
            .forEach((param, i) => {
              if (param) expect(args[i + 1]).to.equal(param);
            });
          expect(args[2]).to.match(new RegExp(`${__filename}:\\d+`));
          done();
        });

        // clean require removes previous requires from cache and required it again
        const logr = cleanrequire('../index.js');
        logr.trace('test trace', 1, 2, 3);
      });
    });

    context('When LOG_LEVEL IS NOT trace', () => {
      beforeEach(() => {
        // the trace method only works when process.env.LOG_LEVEL == 'trace'
        // so we have to fake it
        box.stub(process.env, 'LOG_LEVEL').value('');
      });

      it('should NOT CALL konsole.log when process.env.LOG_LEVEL != trace', (done) => {
        box.stub(konsole, 'log').callsFake(() => {
          done(new Error('IT SHOULD NOT HAVE CALLED konsole.log on logr.trace!!'));
        });

        // clean require removes previous requires from cache and required it again
        const logr = cleanrequire('../index.js');

        logr.trace('it should not call', 1, 2, 3);

        process.nextTick(done);
      });
    });
  });

  describe('#DEBUG', () => {
    context('When LOG_LEVEL=debug', () => {
      beforeEach(() => {
        // the debug method only works when process.env.LOG_LEVEL == 'debug'
        // so we have to fake it
        box.stub(process.env, 'LOG_LEVEL').value('debug');
      });

      it('should call konsole.log with first param as DEBUG:', (done) => {
        box.stub(konsole, 'log').callsFake((...args) => {
          ['DEBUG:', undefined, 'test debug', 1, 2, 3]
            .forEach((param, i) => {
              if (param) expect(args[i + 1]).to.equal(param);
            });
          expect(args[2]).to.match(new RegExp(`${__filename}:\\d+`));
          done();
        });

        // clean require removes previous requires from cache and required it again
        const logr = cleanrequire('../index.js');

        logr.debug('test debug', 1, 2, 3);
      });
    });

    context('When LOG_LEVEL IS NOT debug', () => {
      beforeEach(() => {
        // the debug method only works when process.env.LOG_LEVEL == 'debug'
        // so we have to fake it
        box.stub(process.env, 'LOG_LEVEL').value('');
      });

      it('should NOT CALL konsole.log when process.env.LOG_LEVEL != debug', (done) => {
        box.stub(konsole, 'log').callsFake(() => {
          console.log({ LOG_LEVEL: logr.LOG_LEVEL });
          done(new Error('IT SHOULD NOT HAVE CALLED konsole.log on logr.debug!!'));
          konsole.log.resotre();
        });

        // clean require removes previous requires from cache and required it again
        const logr = cleanrequire('../index.js');

        logr.debug('it should not call', 1, 2, 3);

        process.nextTick(done);
      });
    });
  });


  describe('#log', () => {
    it('should call konsole.log with first param as INFO:', (done) => {
      box.stub(konsole, 'log').callsFake((...args) => {
        expect(args).to.be.instanceof(Array);
        ['INFO:', 'test log', 1, 2, 3]
          .forEach((param, i) => expect(args[i + 1]).to.equal(param));
        done();
      });

      const logr = cleanrequire('../index.js');
      logr.log('test log', 1, 2, 3);
    });
  });

  describe('#info', () => {
    it('should call konsole.log with first param as INFO:', (done) => {
      box.stub(konsole, 'log').callsFake((...args) => {
        expect(args).to.be.instanceof(Array);
        ['INFO:', 'test info', 1, 2, 3]
          .forEach((param, i) => expect(args[i + 1]).to.equal(param));
        done();
      });

      const logr = cleanrequire('../index.js');
      logr.info('test info', 1, 2, 3);
    });
  });

  describe('#warn', () => {
    it('should call konsole.warn with first param as INFO:', (done) => {
      box.stub(konsole, 'warn').callsFake((...args) => {
        expect(args).to.be.instanceof(Array);
        ['WARN:', 'test warn', 1, 2, 3]
          .forEach((param, i) => expect(args[i + 1]).to.equal(param));
        done();
      });

      const logr = cleanrequire('../index.js');
      logr.warn('test warn', 1, 2, 3);
    });
  });

  describe('#error', () => {
    it('should call konsole.error with first param as ERROR:', (done) => {
      box.stub(konsole, 'error').callsFake((...args) => {
        expect(args).to.be.instanceof(Array);
        ['ERROR:', 'test error', 1, 2, 3].forEach((param, i) => {
          expect(args[i + 1]).to.equal(param);
        });
        done();
      });

      const logr = cleanrequire('../index.js');
      logr.error('test error', 1, 2, 3);
    });
  });

  describe('#fatal', () => {
    it('should call konsole.error with first param as ERROR:', (done) => {
      box.stub(konsole, 'error').callsFake((...args) => {
        expect(args).to.be.instanceof(Array);
        ['ERROR:', 'test fatal', 1, 2, 3].forEach((param, i) => {
          expect(args[i + 1]).to.equal(param);
        });
        done();
      });

      const logr = cleanrequire('../index.js');
      logr.fatal('test error', 1, 2, 3);
    });
  });
});
