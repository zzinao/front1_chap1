export function createHooks(callback) {
  const global = {};
  let index = 0;

  const useState = (initState) => {
    if (!global.states) {
      global.states = [];
    }
    const currentState = global.states[index] || initState;

    global.states[index] = currentState;

    const setState = (function () {
      let currnetIndex = index;
      return function (value) {
        if (value !== global.states[currnetIndex]) {
          resetContext(); // setState 호출 전에 resetContext 실행
          // 상태 값이 변경되었을 때만 setState 호출
          global.states[currnetIndex] = value;
          callback();
        }
      };
    })();

    index = index + 1;

    return [currentState, setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    global.states = [];
  };

  return { useState, useMemo, resetContext };
}
