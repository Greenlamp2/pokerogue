const MockConsoleLog = (_logDisabled=false) => {
  const logs = [];
  const logDisabled: boolean = _logDisabled;
  const originalLog = console.log;
  const originalError = console.error;
  const originalDebug = console.debug;
  const originalWarn = console.warn;
  const notified = [];
  return ({
    log(msg) {
      logs.push(msg);
      if (logDisabled) {
        return;
      }
      originalLog(msg);
    },
    error(msg) {
      logs.push(msg);
      originalError(msg); // Appelle le console.error originel
    },
    debug(msg) {
      logs.push(msg);
      originalDebug(msg);
    },
    warn(msg) {
      logs.push(msg);
      originalWarn(msg);
    },
    notify(msg) {
      originalLog(msg);
      notified.push(msg);
    }
  });
};

export default MockConsoleLog;