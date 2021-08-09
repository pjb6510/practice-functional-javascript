const _ = {};

const curry =
  (func) =>
  (firstArg, ...restArgs) =>
    restArgs.length
      ? func(firstArg, ...restArgs)
      : (...restArgs) => func(firstArg, ...restArgs);

_.map = curry((callback, iter) => {
  const result = [];

  for (const value of iter) {
    result.push(callback(value));
  }

  return result;
});

_.filter = curry((callback, iter) => {
  const result = [];

  for (const value of iter) {
    if (callback(value)) {
      result.push(value);
    }
  }

  return result;
});

_.reduce = curry((callback, acc, iter) => {
  if (iter === undefined) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const value of iter) {
    acc = callback(acc, value);
  }

  return acc;
});

_.go = (...args) => _.reduce((value, func) => func(value), args);

_.pipe =
  (firstFunc, ...funcs) =>
  (...value) =>
    _.go(firstFunc(...value), ...funcs);
