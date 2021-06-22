Promise.race([Promise.resolve(true), Promise.resolve('hello')])
  .then(value => console.log(value)); // true

Promise.race([Promise.resolve(true), Promise.reject(new Error('hello'))])
  .then(value => console.log(value)) // true
  .catch(error => console.log(error.message)); // 호출되지 않는다

Promise.race([Promise.reject(new Error('error')), Promise.resolve(true)])
  .then(value => console.log(value)) // 호출되지 않는다
  .catch(error => console.log(error.message)); // error
