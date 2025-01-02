function next(i: number) {
  return function* () {
    yield i * 2;
  };
}

function generator(i: number) {
  return function* () {
    while (i < 10) {
      i++;
      const n = next(i);
      yield* n();
    }
  };
}

function main() {
  const gen = generator(4);
  for (let i of gen()) {
    console.log(i);
  }
}

main();
