import normalize, { parseRegion } from './address.js';

function getAddress(user) {
  return normalize(user.address);
}

export function getAddressByRegion(users) {
  return users.reduce((regions, user) => {
    const { address } = user;
    const region = parseRegion(address);
    const addresses = regions[region] || [];
    regions[region] = [...addresses, normalize(address)];
    return regions;
  }, {});
}

const bars = [
  {
    name: 'Saint Vitus',
    address: {
      street: '1120 manhattan ave',
      city: 'Brooklyn',
      state: 'NY',
    },
  },
];

console.log(getAddressByRegion(bars));