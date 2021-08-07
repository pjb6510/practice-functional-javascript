const _ = {};

_.map = (callback, iter) => {
  const result = [];

  for (const value of iter) {
    result.push(callback(value));
  }

  return result;
};
