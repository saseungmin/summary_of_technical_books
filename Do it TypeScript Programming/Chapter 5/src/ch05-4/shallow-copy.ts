const originalArray = [5, 3, 9, 7];
const shallowCopiedArray = originalArray;
shallowCopiedArray[0] = 0;
console.log(originalArray, shallowCopiedArray);