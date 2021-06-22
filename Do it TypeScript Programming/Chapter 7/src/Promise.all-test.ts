const getAllResolvedResult = <T>(promises: Promise<T>[]) => Promise.all(promises);

getAllResolvedResult<any>([Promise.resolve(true), Promise.resolve('hello')])
  .then(result => console.log(result)); // [true, 'hello']

getAllResolvedResult<any>([Promise.reject(new Error('error')), Promise.resolve(1)])
  .then(result => console.log(result)) // 호출되지 않는다.
  .catch(error => console.log('error: ', error.message)); // error: error
