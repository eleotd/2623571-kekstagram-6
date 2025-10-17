const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

function getUniqueRandomSequence(min, max) {
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }
}

export {getRandomInteger};
export {getUniqueRandomSequence};
