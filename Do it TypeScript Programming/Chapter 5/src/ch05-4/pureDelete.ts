const pureDelete = <T>(array: readonly T[], cb: (val: T, index?: number) 
  => boolean): T[] => array.filter((val, index) => cb(val, index) == false);

const mixedArray: object[] = [
  [], { name: 'Jack' }, { name: 'Jane', age: 32 }, ['description']
]

const objectsOnly: object[] = pureDelete(mixedArray, (val) => Array.isArray(val));

console.log(mixedArray, objectsOnly);
// [ [], { name: 'Jack' }, { name: 'Jane', age: 32 }, [ 'description' ] ] 
// [ { name: 'Jack' }, { name: 'Jane', age: 32 } ]