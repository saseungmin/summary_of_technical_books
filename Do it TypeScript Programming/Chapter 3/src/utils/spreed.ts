let part1 = { name: 'jane' };
let part2 = { age: 22 }; 
let part3 = { city: 'Seoul', country: 'Kr'};

export let merged = { ...part1, ...part2, ...part3 };