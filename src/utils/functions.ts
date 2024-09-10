function generateRandomNumber(min: number, max: number): number[] {
  const numbers = [];
  while (numbers.length < 5) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    if (numbers.indexOf(r) === -1) numbers.push(r);
  }
  return numbers;
}

export function generateBingoCard(): Record<string, number[]> {
  const card: Record<string, number[]> = {};
  const ranges: Record<string, { min: number; max: number }> = {
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

export function getBingoCardShortId(id: string) {
  return id ? id.split("-")[0] : "";
}

export function getRandomNumber(excluded: number[]) {
  let random = null;

  while (!random) {
    const sorted = Math.floor(Math.random() * (75 - 1 + 1)) + 1;
    random = excluded.includes(sorted) ? null : sorted;
  }

  return random;
}

export function convertToMatrix(cardNumber: Record<string, number[]>) {
  return Object.keys(cardNumber).map((k) => cardNumber[k]);
}

export function transpose(matrix: number[][]) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
