export function printMe(me: { name: string, age: number, etc?: boolean }) {
  console.log(
    me.etc?
      `${me.name} ${me.age} ${me.etc}` :
      `${me.name} ${me.age}`
  );
}

// printMe(ai); // Jack 32