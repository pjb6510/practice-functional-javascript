const _ = {};
const L = {};

_.curry =
  (func) =>
  (firstArg, ...restArgs) =>
    restArgs.length
      ? func(firstArg, ...restArgs)
      : (...restArgs) => func(firstArg, ...restArgs);

_.map = _.curry((callback, iter) => {
  const result = [];

  for (const value of iter) {
    result.push(callback(value));
  }

  return result;
});

_.filter = _.curry((callback, iter) => {
  const result = [];

  for (const value of iter) {
    if (callback(value)) {
      result.push(value);
    }
  }

  return result;
});

_.reduce = _.curry((callback, acc, iter) => {
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

_.range = (length) => {
  const result = [];

  let i = -1;
  while (++i < length) {
    result.push(i);
  }

  return result;
};

_.take = _.curry((limit, iter) => {
  const result = [];

  for (const value of iter) {
    result.push(value);

    if (result.length === limit) {
      return result;
    }
  }

  return result;
});

_.join = _.curry((seperator = ",", iter) =>
  _.reduce((a, b) => `${a}${seperator}${b}`, iter)
);

L.range = function* (length) {
  let i = -1;
  while (++i < length) {
    yield i;
  }
};

L.map = _.curry(function* (callback, iter) {
  for (const value of iter) {
    yield callback(value);
  }
});

L.filter = _.curry(function* (callback, iter) {
  for (const value of iter) {
    if (callback(value)) {
      yield value;
    }
  }
});

L.entries = function* (obj) {
  for (const key in obj) {
    yield [key, obj[key]];
  }
};
