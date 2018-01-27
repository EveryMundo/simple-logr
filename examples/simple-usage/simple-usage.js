const logr = require('@everymundo/simple-logr');

logr.trace('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz TRACE: filename:lineNumber message
logr.debug('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz DEBUG: filename:lineNumber message
logr.info('message');  // outputs: YYYY-MM-DDTHH:mm:ss.zzz INFO: message
logr.warn('message');  // outputs: YYYY-MM-DDTHH:mm:ss.zzz WARN: message
logr.error('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz ERROR: message
logr.fatal('message'); // outputs: YYYY-MM-DDTHH:mm:ss.zzz FATAL: message
