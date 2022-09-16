const logr = require('@everymundo/simple-logr')

logr.trace('trace message') // outputs: YYYY-MM-DDTHH:mm:ss.zzz TRACE: filename:lineNumber message
logr.debug('debug message') // outputs: YYYY-MM-DDTHH:mm:ss.zzz DEBUG: filename:lineNumber message
logr.info('info message') // outputs: YYYY-MM-DDTHH:mm:ss.zzz INFO: message
logr.warn('warn message') // outputs: YYYY-MM-DDTHH:mm:ss.zzz WARN: message
logr.error('error message') // outputs: YYYY-MM-DDTHH:mm:ss.zzz ERROR: message
logr.fatal('fatal message') // outputs: YYYY-MM-DDTHH:mm:ss.zzz FATAL: message
