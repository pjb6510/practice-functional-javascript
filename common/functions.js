const _ = {};
const L = {};

_.curry =
  (func) =>
  (firstArg, ...restArgs) =>
    restArgs.length
      ? func(firstArg, ...restArgs)
      : (...restArgs) => func(firstArg, ...restArgs);

/*
_.map = _.curry((func, iter) => {
  const result = [];

  for (const value of iter) {
    result.push(func(value));
  }

  return result;
});
*/

/*
_.filter = _.curry((func, iter) => {
  const result = [];

  for (const value of iter) {
    if (func(value)) {
      result.push(value);
    }
  }

  return result;
});
*/

_.reduce = _.curry((func, acc, iter) => {
  if (iter === undefined) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const value of iter) {
    acc = func(acc, value);
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

_.find = (func, iter) =>
  _.go(iter, L.filter(func), _.take(1), ([value]) => value);

L.range = function* (length) {
  let i = -1;
  while (++i < length) {
    yield i;
  }
};

L.map = _.curry(function* (func, iter) {
  for (const value of iter) {
    yield func(value);
  }
});

L.filter = _.curry(function* (func, iter) {
  for (const value of iter) {
    if (func(value)) {
      yield value;
    }
  }
});

L.entries = function* (obj) {
  for (const key in obj) {
    yield [key, obj[key]];
  }
};

_.takeAll = _.take(Infinity);

_.map = _.curry(_.pipe(L.map, _.takeAll));

_.filter = _.curry(_.pipe(L.filter, _.takeAll));
