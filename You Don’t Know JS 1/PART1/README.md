## 🌈 Part 1 타입과 문법

### ✌️ [Chapter 1: 타입](https://github.com/saseungmin/reading_books_record_repository/tree/master/You%20Don%E2%80%99t%20Know%20JS%201/PART1/Chapter%201)
1. 타입, 그 실체를 이해하자
2. 내장 타입
3. 값은 타입을 가진다
    - 값이 없는 vs 선언되지 않은
    - 선언되지 않은 변수
4. 정리하기

### ✌️ [Chapter 2: 값](https://github.com/saseungmin/reading_books_record_repository/tree/master/You%20Don%E2%80%99t%20Know%20JS%201/PART1/Chapter%202)
1. 배열
    - 유사 배열
2. 문자열
3. 숫자
    - 숫자 구문
    - 작은 소수 값
    - 안전한 정수 범위
    - 정수인지 확인
    - 32비트 (부호 있는) 정수
4. 특수 값
    - 값 아닌 값
    - `Undefined` (`void` 연산자)
    - 특수 숫자 (무한대, 0)
    - 특이한 동등 비교
5. 값 vs 레퍼런스
6. 정리하기

### ✌ [Chapter 3: 네이티브](https://github.com/saseungmin/reading_books_record_repository/tree/master/You%20Don%E2%80%99t%20Know%20JS%201/PART1/Chapter%203)
1. 내부 `[[Class]]`
2. 래퍼 박싱하기
    - 객체 래퍼의 함정
3. 언박싱
4. 네이티브, 나는 생성자다
    - `Array()`
    - `Object()`, `Function()`, and `RegExp()`
    - `Date()` and `Error()`
    - `Symbol()`
    - 네이티브 프로토타입
5. 정리하기

#### ✌ [Chapter 4: 강제변환](https://github.com/saseungmin/reading_books_record_repository/tree/master/You%20Don%E2%80%99t%20Know%20JS%201/PART1/Chapter%204)

1. 값 변환
2. 추상 연산
    - `ToString`, `JSON` 문자열화
    - `ToNumber`
    - `ToBoolean` (`Falsy` 값, `Falsy` 객체, `truthy` 값)
3. 명시적 강제변환
    - 문자열 ↔ 숫자 (날짜 ➡ 숫자, 이상한 나라의 틸드(`~`), 비트 잘라내기)
    - 숫자 형태의 문자열 파싱 (비 문자열 파싱)
    - * ➡ 불리언
4. 암시적 변환
    - 암시적이란?
    - 문자열 ↔ 숫자