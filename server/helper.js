function generateRandomNumber(min, max) {
  const numbers = [];
  while (numbers.length < 5) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    if (numbers.indexOf(r) === -1) numbers.push(r);
  }
  return numbers;
}

export function generateBingoCard() {
  const card = {};
  const ranges = {
    B: { min: 1, max: 15 },
    I: { min: 16, max: 30 },
    N: { min: 31, max: 45 },
    G: { min: 46, max: 60 },
    O: { min: 61, max: 75 },
  };

  for (const col in ranges) {
    card[col] = generateRandomNumber(ranges[col].min, ranges[col].max);
  }

  // Substituir o elemento central por um espaço livre (podemos usar null para representar o espaço livre)
  card["N"][2] = 0;

  return card;
}

