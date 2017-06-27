/**
 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
 * Adapted from https://github.com/component/throttle/blob/master/index.js
 *
 * @param {Function} func Function to wrap.
 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
 * @return {Function} A new function that wraps the `func` function passed in.
 */
export function throttle(func, wait) {
  let ctx;
  let args;
  let rtn;
  let timeoutID; // caching
  let last = 0;

  return function throttled() {
    ctx = this;
    args = arguments;
    const delta = new Date() - last;
    if (!timeoutID) {
      if (delta >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    }
    return rtn;
  };

  function call() {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }
}
