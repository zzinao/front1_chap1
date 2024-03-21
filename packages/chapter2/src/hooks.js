export function createHooks(callback) {
  const global = {};
  let index = 0;

  const useState = (initState) => {
    if (!global.states) {
      resetContext();
    }
    const currentState = global.states[index] || initState;

    global.states[index] = currentState;

    const setState = (function () {
      let currnetIndex = index;
      return function (value) {
        if (value !== global.states[currnetIndex]) {
          global.states[currnetIndex] = value;
          if (value !== currentState) {
            callback();
          }
        }
      };
    })();

    index = index + 1;

    return [currentState, setState];
  };

  const useMemo = (fn, deps) => {
    const prevDeps = useMemo.prevDeps || [];
    const prevResult = useMemo.prevResult;

    const dependenciesChanged =
      !prevResult ||
      !deps.every((dep, index) => Object.is(dep, prevDeps[index]));

    if (dependenciesChanged) {
      useMemo.prevDeps = deps;
      useMemo.prevResult = fn();
    }

    return useMemo.prevResult;
  };

  const resetContext = () => {
    global.states = [];
  };

  return { useState, useMemo, resetContext };
}
