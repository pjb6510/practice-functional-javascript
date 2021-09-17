const _ = {};
const L = {};

const isIterable = (value) => !!(value && value[Symbol.iterator]);

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

_.go1 = (value, func) =>
  value instanceof Promise ? value.then(func) : func(value);

const getHead = (iter) => _.go1(_.take(1, iter), ([head]) => head);

const reduceF = (acc, cur, func) =>
  cur instanceof Promise
    ? cur.then(
        (cur) => func(acc, cur),
        (e) => (e === _.nop ? acc : Promise.reject(e))
      )
    : func(acc, cur);

_.reduce = _.curry((func, acc, iter) => {
  if (iter === undefined) {
    return _.reduce(func, getHead(iter = acc[Symbol.iterator]()), iter);
  }

  iter = iter[Symbol.iterator]();
  return _.go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, func);

      if (acc instanceof Promise) {
        return acc.then(recur);
      }
    }
    return acc;
  });
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

  return (function recur() {
    let current;
    while (!(current = iter.next()).done) {
      const value = current.value;
      if (value instanceof Promise) {
        return value
          .then((value) => {
            result.push(value);

            return result.length === limit ? result : recur();
          })
          .catch((e) => (e === _.nop ? recur() : Promise.reject(e)));
      }

      result.push(value);

      if (result.length === limit) {
        return result;
      }
    }

    return result;
  })();
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
    yield _.go1(value, func);
  }
});

_.nop = Symbol("nop");

L.filter = _.curry(function* (func, iter) {
  for (const value of iter) {
    const checkedValue = _.go1(value, func);
    if (checkedValue instanceof Promise) {
      yield checkedValue.then((b) => (b ? value : Promise.reject(_.nop)));
    } else if (checkedValue) {
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

L.flatten = function* (iter) {
  for (const value of iter) {
    if (isIterable(value)) {
      yield* value;
    } else {
      yield value;
    }
  }
};

_.flatten = _.pipe(L.flatten, _.takeAll);

L.deepFlat = function* (iter) {
  for (const value of iter) {
    if (isIterable(value)) {
      yield* L.deepFlat(value);
    } else {
      yield value;
    }
  }
};

L.flatMap = _.curry(_.pipe(L.map, L.flatten));

_.flatMap = _.curry(_.pipe(L.map, _.flatten));
