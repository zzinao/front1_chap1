export function createHooks(callback) {
  const stateContext = {
    current: 0,
    states: [],
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
  }

  const useState = (initState) => {
    const { current, states } = stateContext;
    stateContext.current += 1;

    states[current] = states[current] ?? initState;

    let callbackTimeout = null;

    const setState = (newState) => {
      if (newState === states[current]) return;

      states[current] = newState;

      // 이전에 예약된 콜백이 있으면 취소
      if (callbackTimeout !== null) {
        clearTimeout(callbackTimeout);
        callbackTimeout = null;
      }

      // 새로운 콜백 예약
      callbackTimeout = setTimeout(() => {
        callback();
        callbackTimeout = null; // 콜백 실행 후 타임아웃 참조 해제
      }, 0);
    };

    return [states[current], setState];
  };

  const useMemo = (fn, refs) => {
    const { current, memos } = memoContext;
    memoContext.current += 1;

    const memo = memos[current];

    const resetAndReturn = () => {
      const value = fn();
      memos[current] = {
        value,
        refs,
      };
      return value;
    };

    if (!memo) {
      return resetAndReturn();
    }

    if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
      return resetAndReturn();
    }
    return memo.value;
  };

  return { useState, useMemo, resetContext };
}
