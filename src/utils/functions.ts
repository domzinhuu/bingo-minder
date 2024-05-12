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

/* function printCard(card: Record<string, number[]>): void {
    console.log(" B   I   N   G   O");
    for (let i = 0; i < 5; i++) {
        for (const col of ['B', 'I', 'N', 'G', 'O']) {
            let value = card[col][i];
            let strValue = value === null ? "Free" : value.toString();
            process.stdout.write(`${strValue.padEnd(4, ' ')} `);
        }
        console.log(); // Nova linha após cada linha de números
    }
} */
