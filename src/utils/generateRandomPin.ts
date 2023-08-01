export const generateRandomPin = () => {
  let numbers: number[] = [];

  for (let i = 0; i < 6; i++) {
    numbers.push(Math.round(Math.random() * 9));
  }

  const number = numbers.join("");

  return number;
};
