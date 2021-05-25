export const carouselItemMover = ({
  arr,
  moveLastToFirst,
  moveFirstToLast,
  howManyTimes,
}) => {
  if (moveLastToFirst) {
    return [
      ...arr.slice(arr.length - howManyTimes),
      ...arr.slice(0, arr.length - howManyTimes),
    ];
  }

  return [...arr.slice(howManyTimes), ...arr.slice(0, howManyTimes)];
};

export const itemArrayCentralizer = (arr) => {
  const newArray = [...arr];
  const half = Math.ceil(newArray.length / 2);
  const secondHalf = newArray.splice(0, half);
  const firstHalf = newArray.splice(0);
  const concatedArray = [...firstHalf, ...secondHalf];

  return concatedArray;
};
