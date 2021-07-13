import { IPerson, makeRandomIPerson } from "./model/person";

const person: IPerson = makeRandomIPerson();

console.log(person);
// {
//   name: 'Eunice Schultz',
//   age: 19,
//   title: 'Logistics Manager',
//   location: {
//     country: 'YT',
//     city: 'Jotmemu',
//     address: '842 Pojobu Pike',
//     coordinates: { latitude: 14.22482, longitude: -43.92384 }
//   }
// }