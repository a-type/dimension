export const normalizeCoordinate = (
  coordinate: number | [number, number] | undefined,
): [number | undefined, number | undefined] => {
  const x =
    typeof coordinate === 'number' ? coordinate : coordinate && coordinate[0];
  const y = typeof coordinate === 'number' ? 0 : coordinate && coordinate[1];

  return [x, y];
};
