# 🐤 Chapter 12: 타입스크립트 함수형 프로그래밍 실습

## 🦄 빅데이터 배치 프로그램 만들기
- 실습에 대한 내용이므로 자세한 내용은 책을 참고(P.340 ~ P.365)

### 📚 노드제이에스에서 프로그램 명령 줄 인수 읽기

```ts
export type FileNameAndNumber = [string, number];

export const getFileNameAndNumber = (
  defaultFilename: string,
  defaultNumberOfFakeData: number,
): FileNameAndNumber => {
  const [bin, node, filename, numberOfFakeData] = process.argv;

  return [
    filename || defaultFilename,
    numberOfFakeData ? parseInt(numberOfFakeData, 10) : defaultNumberOfFakeData,
  ];
};
```

### 📚 파일 처리 비동기 함수를 프로미스로 구현하가

#### 🎈 fs.access API로 디렉터리나 파일 확인하기
- 코드를 작성하다 보면 파일이나 디렉터리가 현재 있는지 없는지를 확인해야 할 떄가 생긴다.

```ts
import * as fs from 'fs';

export const fileExist = (
  filepath: string,
): Promise<boolean> => new Promise((resolve) => fs.access(filepath, (error) => resolve(!error)));
```

- `fileExists-test.ts`

```ts
import { fileExist } from '../fileApi/fileExists';

const exists = async (filepath) => {
  const result = await fileExist(filepath);
  console.log(`${filepath} ${result ? 'exists' : 'not exists'}`);
};

exists('./package.json');
exists('./package');
```

#### 🎈 mkdirp 패키지로 디렉터리 생성 함수 만들기

```ts
import mkdirp from 'mkdirp';

import { fileExist } from './fileExists';

export const mkdir = (dirname: string): Promise<string> => new Promise(async (resolve, reject) => {
  const alreadyExists = await fileExist(dirname);

  if (alreadyExists) {
    resolve(dirname);
    return;
  }

  mkdirp(dirname)
    .then(() => resolve(dirname))
    .catch((error) => reject(error));
});
```

#### 🎈 rimraf 패키지로 디렉터리 삭제 함수 만들기

```ts
import rimraf from 'rimraf';

import { fileExist } from './fileExists';

export const rmdir = (dirname: string): Promise<string> => new Promise(async (resolve, reject) => {
  const alreadyExists = await fileExist(dirname);

  if (!alreadyExists) {
    resolve(dirname);
    return;
  }

  rimraf(dirname, (error) => (error ? reject(error) : resolve(dirname)));
});
```

#### 🎈 fs.writeFile API로 파일 생성하기
- 노드제이에스 환경에서 파일의 데이터를 읽거나 쓸 때는 대부분 텍스트 데이터를 대상으로 한다.
- 이때 텍스트 데이터는 유니코드로 처리해야 한다.

```ts
import * as fs from 'fs';

export const writeFile = (
  filename: string, data: any,
): Promise<any> => new Promise((resolve, reject) => {
  fs.writeFile(filename, data, 'utf8', (error: Error) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
});
```

- `writeFile-test.ts`

```ts
import { writeFile } from '../fileApi/writeFile';
import { mkdir } from '../fileApi/mkdir';

const writeTest = async (filename: string, data: any) => {
  const result = await writeFile(filename, data);
  console.log(`write ${result} to ${filename}`);
};

mkdir('./data')
  .then(() => writeTest('./data/hello.txt', 'hello world'))
  .then(() => writeTest('./data/test.json', JSON.stringify({ name: 'Jack', age: 32 }, null, 2)))
  .catch((e: Error) => console.log(e.message))
```

#### 🎈 fs.readFile API로 파일 내용 읽기

```ts
import * as fs from 'fs';

export const readFile = (filename: string): Promise<any> => new Promise<any>((resolve, reject) => {
  fs.readFile(filename, 'utf8', (error: Error, data: any) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
});
```

- `readFile-test.ts`

```ts
import { readFile } from '../fileApi/readFile';

const readTest = async (filename: string) => {
  const result = await readFile(filename);
  console.log(`read ${result} from ${filename} file.`);
};

readTest('./data/hello.txt')
  .then(() => readTest('./data/test.json'))
  .catch((e: Error) => console.log(e.message));
```

#### 🎈 fs.appendFile API로 파일에 내용 추가하기

```ts
import * as fs from 'fs';

export const appendFile = (
  filename: string, data: any,
): Promise<any> => new Promise((resolve, reject) => {
  fs.appendFile(filename, data, 'utf8', (error: Error) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
});
```

- `appendFile-test.ts`

```ts
import { appendFile } from '../fileApi/appendFile';
import { mkdir } from '../fileApi/mkdir';

const appendTest = async (filename: string, data: any) => {
  const result = await appendFile(filename, data);
  console.log(`append ${result} to ${filename}`);
};

mkdir('./data')
  .then(() => appendTest('./data/hello.txt', 'Hi there!'))
  .catch((e: Error) => console.log(e.message));
```

#### 🎈 fs.unlink API로 파일 삭제하기

```ts
import * as fs from 'fs';

import { fileExists } from './fileExists';

export const deleteFile = (
  filename: string,
): Promise<string> => new Promise<any>(async (resolve, reject) => {
  const alreadyExists = await fileExists(filename);

  if (!alreadyExists) {
    resolve(filename);
    return;
  }

  fs.unlink(filename, (error) => (error ? reject(error) : resolve(filename)));
});
```

- `deleteFile-test.ts`

```ts
import { deleteFile } from '../fileApi/deleteFile';
import { rmdir } from '../fileApi/rmdir';

const deleteTest = async (filename: string) => {
  const result = await deleteFile(filename);
  console.log(`delete ${result} file.`);
};

Promise.all([deleteTest('./data/hello.txt'), deleteTest('./data/test.json')])
  .then(() => rmdir('./data'))
  .then((dirname) => console.log(`delete ${dirname} dir`))
  .catch((e: Error) => console.log(e.message));
```

#### 🎈 src/fileApi/index.ts 파일 만들기

```ts
import { fileExists } from './fileExists';
import { mkdir } from './mkdir';
import { rmdir } from './rmdir';
import { writeFile } from './writeFile';
import { readFile } from './readFile';
import { appendFile } from './appendFile';
import { deleteFile } from './deleteFile';

export {
  fileExists, mkdir, rmdir, writeFile, readFile, appendFile, deleteFile,
};
```

### 📚 그럴듯한 가짜 데이터 만들기

```ts
export interface IFake {
  name: string;
  email: string;
  sentence: string;
  profession: string;
  birthday: Date;
}
```

- `makeFakeData.ts`

```ts
import { Chance } from 'chance';

import { IFake } from './IFake';

const c = new Chance();

export const makeFakeData = (): IFake => ({
  name: c.name(),
  email: c.email(),
  profession: c.profession(),
  birthday: c.birthday(),
  sentence: c.sentence(),
});

export { IFake };
```

- `makeFakeData-test.ts`

```ts
import { makeFakeData, IFake } from '../fake/makeFakeData';

const fakeData: IFake = makeFakeData();

console.log(fakeData);
```

### 📚 Object.keys와 Object.values 함수 사용하기

```ts
import { IFake, makeFakeData } from '../fake/makeFakeData';

const data: IFake = makeFakeData();
const keys = Object.keys(data);

console.log('keys: ', keys);

const values = Object.values(data);

console.log('values: ', values);
```

### 📚 CSV 파일 만들기
- 가짜 데이터를 여러 개 생성

```ts
export function* range(max: number, min: number = 0) {
  while (min < max) {
    yield min++;
  }
}
```

- `makeFakeData`를 사용해 `numberOfItems`만큼 `IFake` 객체를 생성한다. 그리고 속성명과 속성값의 배열을 각각 추출해 `filename` 파일을 만든다.


```ts
import * as path from 'path';

import { mkdir } from '../fileApi/mkdir';
import { range } from '../utils/range';
import { IFake } from './IFake';
import { makeFakeData } from './makeFakeData';
import { writeFile } from '../fileApi/writeFile';
import { appendFile } from '../fileApi/appendFile';

export const writeCsvFormatFakeData = async (
  filename: string, numberOfItems: number,
) : Promise<string> => {
  const dirname = path.dirname(filename);
  await mkdir(dirname);

  const comma = ',';
  const newLine = '\n';

  for (const n of range(numberOfItems)) {
    const fake: IFake = makeFakeData();

    if (n === 0) {
      const keys = Object.keys(fake).join(comma);
      await writeFile(filename, keys);
    }

    const values = Object.values(fake).join(comma);
    await appendFile(filename, newLine + values);
  }

  return `write ${numberOfItems} items to ${filename} file`;
};
```


### 📚 데이터를 CSV 파일에 쓰기
- CSV 파일 포맷으로 `IFake` 타입 객체를 저장하는 파일을 만들고 다음과 같이 코드를 작성한다.

```ts
import { getFileNameAndNumber } from './utils/getFileNameAndNumber';
import { writeCsvFormatFakeData } from './fake/writeCsvFormatFakeData';

const [filename, numberOfFakeData] = getFileNameAndNumber('./data/fake', 1);
const csvFilename = `${filename}-${numberOfFakeData}.csv`;

writeCsvFormatFakeData(csvFilename, numberOfFakeData)
  .then((result) => console.log(result))
  .catch((e: Error) => console.log(e.message));
```

### 📚 zip 함수 만들기
- CSV 포맷 파일을 읽는 코드를 작성
- 객체의 속성명 배열과 속성값 배열을 결합해 객체를 만드는 함수가 필요한데 이러한 기능을 하는 함수는 보통 `zip`라는 이름으로 구현한다.

```ts
export const zip = (keys: string[], values: any[]) => {
  const makeObject = (key: string, value: any) => ({ [key]: value });
  const mergeObject = (a: any[]) => a.reduce((sum, val) => ({ ...sum, ...val }), {});

  const tmp = keys
    .map((key, index) => [key, values[index]])
    .filter((a) => a[0] && a[1])
    .map((a) => makeObject(a[0], a[1]));

  return mergeObject(tmp);
};
```

- `zip-test.ts`

```ts
import { zip } from '../utils';
import { makeFakeData, IFake } from '../fake';

const data = makeFakeData();
const keys = Object.keys(data);
const values = Object.values(data);

const fake: IFake = zip(keys, values) as IFake;

console.log(fake);
```

### 📚 CSV 파일 데이터 읽기
- 다음 코드는 1,024Byte의 Buffer 타입 객체를 생성해 파일을 1,024Byte씩 읽으면서 한 줄씩 찾은 뒤, 찾은 줄(즉, `\n`으로 끝난 줄)의 데이터를 `yield`문으로 발생시키는 예이다.

```ts
import * as fs from 'fs';

function readLine(fd: any, buffer: Buffer, bufferSize: number, position: number): [string, number] {
  let line = '';
  let readSize;
  const crSize = '\n'.length;

  while (true) {
    readSize = fs.readSync(fd, buffer, 0, bufferSize, position);

    if (readSize > 0) {
      const temp = buffer.toString('utf8', 0, readSize);
      const index = temp.indexOf('\n');

      if (index > -1) {
        line += temp.substr(0, index);
        position += index + crSize;
        break;
      } else {
        line += temp;
        position += temp.length;
      }
    } else {
      position = -1; // end of file
      break;
    }
  }

  return [line.trim(), position];
}

export function* readFileGenerator(filename: string): any {
  let fd: any;

  try {
    fd = fs.openSync(filename, 'rs');

    const stats = fs.fstatSync(fd);
    const bufferSize = Math.min(stats.size, 1024);
    const buffer = Buffer.alloc(bufferSize + 4);
    let filepos = 0;
    let line;

    while (filepos > -1) {
      [line, filepos] = readLine(fd, buffer, bufferSize, filepos);

      if (filepos > -1) {
        yield line;
      }
    }

    yield buffer.toString(); // 마지막 줄
  } catch (error) {
    console.log('readLine: ', error.message);
  } finally {
    fd && fs.closeSync(fd);
  }
}
```

- `readFileGenerator-test.ts`
- `readFileGenerator`는 단순히 한 줄 한 줄 읽는다.

```ts
import { readFileGenerator } from '../fileApi';

for (const value of readFileGenerator('data/fake-10000.csv')) {
  console.log('<line>', value, '</line>');
  break;
}

// <line> name,email,profession,birthday,sentence </line>
```

- CSV 파일을 해석하면서 읽는 코드이다.

```ts
import { readFileGenerator } from '../fileApi';
import { zip } from '../utils';

export function* csvFileReaderGenerator(filename: string, delim: string = ',') {
  let header = [];

  for (const line of readFileGenerator(filename)) {
    if (!header.length) {
      header = line.split(delim);
    } else {
      yield zip(header, line.split(delim));
    }
  }
}
```

- `readCsv.ts`

```ts
import { getFileNameAndNumber } from './utils';
import { csvFileReaderGenerator } from './csv/csvFileReaderGenerator';

const [filename] = getFileNameAndNumber('./data/fake-10000.csv', 1);

let line = 1;

for (const object of csvFileReaderGenerator(filename)) {
  console.log(`[${line++}] ${JSON.stringify(object)}`);
}

console.log('\n read complete.');
```

## 🦄 몽고DB에 데이터 저장하기

### 📚 몽고DB에 접속하기
- mongodb 패키지가 제공하는 MongoClient 객체의 `connect` 함수를 사용하여 몽고DB에 접속

```ts
import { MongoClient } from 'mongodb';

export const connect = (mongoUrl: string = 'mongodb://localhost:27017') => MongoClient.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

- 정상 연결

```ts
import { connect } from '../mongodb/connect';

const connectTest = async () => {
  let connection;

  try {
    connection = await connect();
    console.log('connection OK.', connection);
  } catch (error) {
    console.log(error.message);
  } finally {
    connection.close();
  }
};

connectTest();
```

### 📚 데이터베이스 연결

```ts
const db = await connection.db('ch12-2');
```

### 📚 컬렉션을 생성

```ts
const personsCollection = db.collection('persons');
const addressesCollection = db.collection('addresses');
```

### 📚 문서를 컬렉션에 저장하기

```ts
const personsCollection = db.collection('persons');
const person = { name: 'Jack', age: 32 };

let result = await personsCollection.insertOne(person);
```

### 📚 문서 찾기, 문서 삭제하기, 검색 결과 정렬
1. 문서 찾기

```ts
// name 속성값이 Jack인 문서 찾기
const cursor = personsCollection.find({ name: 'Jack' });
// 전체
const cursor = personsCollection.find({});
```

2. 조건에 맞는 문서 하나만 찾기

```ts
const result = await personsCollection.findOne({ _id });
```

3. 문서 삭제하기

```ts
let result = await personsCollection.deleteOne({ name: 'Tom' });
result = await personsCollection.deleteMany({});
```

4. 검색 결과 정렬하기

```ts
const cursor = personsCollection.find({ name: 'Jack' }).sort({ age: -1 });
```

- 컬렉션에 문서 개수가 많아지면 검색 시간이 느려지는데, 이를 방지하기 위해 컬렉션에 인덱스를 만들게 된다.

```ts
// 1: 오름차순, -1: 내림차순
await personsCollection.createIndex({ name: 1, age: -1 });
```

### 📚 CSV 파일 몽고DB에 저장하기

- 다음 코드는 CSV 파일을 읽어서 `users`라는 컬렉션에 데이터를 담고, `birthday`와 `name` 속성에 인덱스를 생성하는 내용을 구현한 예이다.

```ts
import { connect } from './mongodb/connect';
import { csvFileReaderGenerator } from './csv/csvFileReaderGenerator';
import { getFileNameAndNumber } from './utils';

const insertCsvToMongo = async (csvFilename, collectionName, index) => {
  let connection;

  try {
    connection = await connect();
    const db = await connection.db('ch12-2');
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    await collection.createIndex(index);

    let line = 1;

    for (const object of csvFileReaderGenerator(csvFilename)) {
      await collection.insertOne(object);
      console.log(`${line++} inserted.`);
    }

    console.log('\n insertion complete.');
  } catch (error) {
    console.log(error.message);
  } finally {
    connection.close();
  }
};

const [filename] = getFileNameAndNumber('./data/fake-1000.csv', 1);
insertCsvToMongo(filename, 'users', { birthday: -1, name: 1 });
```

### 📚 limit와 skip 메서드
- `users` 컬렉션의 데이터 중에서 다섯 건을 얻어와 `name`과 `birthday` 속성값만 화면에 출력하는 내용이다.

```ts
import { connect } from './mongodb/connect';
import { IFake } from './fake/IFake';

const findLimitSkip = async () => {
  let connection;

  try {
    connection = await connect();
    const db = await connection.db('ch12-2');
    const usersCollection = db.collection('users');

    const cursor = await usersCollection.find({})
      .sort({ birthday: -1, name: 1 })
      .skip(100)
      .limit(5);

    const result = await cursor.toArray();

    console.log(result.map((user: IFake) => ({
      name: user.name,
      birthday: user.birthday,
    })));
  } catch (error) {
    console.log(error.message);
  } finally {
    connection.close();
  }
};

findLimitSkip();
```

## 🦄 익스프레스로 API 서버 만들기

### 📚 익스프레스 프레임워크
- 익스페이스 프레임워크를 사용하면 다음 코드처럼 웹 서버를 쉽게 만들 수 있다.

```ts
import express from 'express';

const app = express();
const port = 4000;

app
  .get('/', (req, res) => res.json({ message: 'Hello world!' }))
  .listen(port, () => console.log(`http://localhost:${port} started...`));
```

### 📚 라우팅 기능 구현

```ts
import express from 'express';

const app = express();
const port = 4000;

app
  .get('/', (req, res) => res.json({ message: 'Hello world!' }))
  .get('/users/:skip/:limit', (req, res) => {
    const { skip, limit } = req.params;

    res.json({ skip, limit });
  })
  .listen(port, () => console.log(`http://localhost:${port} started...`));
```

### 📚 익스프레스 미들웨어 추가
- REST 방식의 API 서버들은 웹 페이지의 본문 내용을 분석하려고 할 때 `bodyParser`와 `cors`라는 패키지를 `use` 메서드를 사용해 다음처럼 작성해야 한다.

```ts
import bodyParser from 'body-parser';
import cors from 'cors';

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
```

### 📚 몽고DB 연결

- 몽고DB 서버에 접속하는 코드

```ts
import { runServer } from './runServer';
import { connect } from './mongodb/connect';

connect()
  .then(async (connection) => {
    const db = await connection.db('ch12-2');
    return db;
  })
  .then(runServer)
  .catch((e: Error) => console.log(e.message));
```

- `runServer.ts`

```ts
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

export const runServer = (mongodb) => {
  const app = express();
  const port = 4000;

  app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors())
    .get('/', (req, res) => res.json({ message: 'Hello world!' }))
    .get('/users/:skip/:limit', async (req, res) => {
      const { skip, limit } = req.params;

      const usersCollection = await mongodb.collection('users');
      const cursor = await usersCollection
        .find({})
        .sort({ name: 1 })
        .skip(parseInt(skip, 10))
        .limit(parseInt(limit, 10));

      const result = await cursor.toArray();

      res.json(result);
    })
    .listen(port, () => console.log(`http://localhost:${port} started...`));
};
```

## 🦄 리액트와 부트스트랩으로 프런트엔드 웹 만들기

- `./frontend` 폴더 참고

### 📚 App.tsx 파일 수정

```tsx
import React from 'react';

const App: React.FC = () => {
  const user = {
    name: 'Jack',
    age: 32,
  }

  return (
    <div className="App">{
      JSON.stringify(user)
    }</div>
  )
}

export default App;
```

### 📚 API 서버에서 실제 데이터 가져오기

```ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  sentence: string;
  profession: string;
  birthday: string;
}
```

- `getDataPromise.ts`

```ts
import { IUser } from './IUser';

type GetDataPromiseCallback = (a: IUser[]) => void;

export const getDataPromise =  (fn: GetDataPromiseCallback) => (
  skip: number,
  limit: number,
) => fetch(`http://localhost:4000/users/${skip}/${limit}`)
      .then((res) => res.json())
      .then(fn);
```

- `App.tsx`

```tsx
import React, { useState, useEffect } from 'react';

import { getDataPromise } from './getDataPromise';
import { IUser } from './IUser';

const App: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getDataPromise((receivedUsers: IUser[]) => {
      setUsers([...users, ...receivedUsers]);
    })(0, 1);
  }, []);

  return (
    <div className="App">{JSON.stringify(users)}</div>
  )
}

export default App;
```

### 📚 서버에서 데이터 계속 가져오기

```tsx
import React, { useState, useEffect } from 'react';

import { getDataPromise } from './getDataPromise';
import { IUser } from './IUser';

const App: React.FC = () => {
  const [skip, setSkip] = useState(0);
  const [users, setUsers] = useState<IUser[]>([]);

  const limit = 1;
  const onClick = () => {
    getDataPromise((receivedUsers: IUser[]) => {
      setSkip(skip + limit);
      setUsers([...users, ...receivedUsers]);
    })(skip, limit);
  }
  useEffect(onClick, []);

  return (
    <div className="App">
      <p>
        <button onClick={onClick}>more data...</button>
      </p>
      <p>{JSON.stringify(users)}</p>
    </div>
  )
}

export default App;
```

### 📚 부트스트랩 CSS 프레임워크 사용하기

- https://www.bootstrapcdn.com/
- CSS와 JavaScript Bundle public/index.html에 추가

### 📚 카드 컴포넌트 만들기
- `Card.tsx`

```tsx
import React from 'react';

import { IUser } from './IUser';

const random = (max: number) => Math.floor(Math.random() * max);

const Card: React.FC<{ user: IUser, click: () => void }> = ({user, click}) => {
  const { name, email, sentence, profession, birthday } = user;
  const b = new Date(birthday);
  const src = `https://source.unsplash.com/random/1000x${random(300) + 500}`;

  return (
    <div className="card">
      <img src={src} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{name}({email})</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {profession} birthday: {b.getFullYear()}
        </h6>
        <p className="card-text">{sentence}</p>
        <a href="#" className="btn btn-primary" onClick={click}>more data...</a>
      </div>
    </div>
  );
};

export default Card;
```

- App.tsx

```tsx
import React, { useState, useEffect } from 'react';

import { getDataPromise } from './getDataPromise';
import { IUser } from './IUser';

import Card from './Card';

const App: React.FC = () => {
  const [skip, setSkip] = useState(0);
  const [users, setUsers] = useState<IUser[]>([]);

  const limit = 1;
  const onClick = () => {
    getDataPromise((receivedUsers: IUser[]) => {
      setSkip(skip + limit);
      setUsers([...users, ...receivedUsers]);
    })(skip, limit);
  }
  useEffect(onClick, []);

  return (
    <div className="App">
      {users.map((user: IUser, key: number) => (
        <Card click={onClick} user={user} key={key.toString()} />
      ))}
    </div>
  )
}

export default App;
```