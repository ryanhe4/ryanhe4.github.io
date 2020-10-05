---
layout: post
title: '[Node.js] 노드의 다양한 기능'
categories: dev
tags: node.js
date: '2020-09-14 14:30:00 +0900'
image: 'https://velopert.com/wp-content/uploads/2016/02/nodejs-2560x1440-950x534.png'
published: true
---
Node.js 실행, 모듈, 내장 객체 등 노드의 다양한 기능
<!--more-->

* toc
{:toc .large-only}

# 모듈 만들기
## 모듈
노드는 자바스크립트 코드를 모듈로 만들 수 있음
* 모듈: 특정한 기능을 하는 함수나 변수들의 집합
* 모듈로 만들면 여러 프로그램에서 재사용 가능

## 모듈 만들기
```js
const old = '홀수입니다.';
const even = '짝수입니다';

module.exports= {
    old,
    even,
};
```
{:.note title="var.js"}

```js
const value = require('./var.js')
console.log(value);
```
{:.note title="func.js"}

모듈을 내보낼 때 객체, 단일 값, 배열 등 다양한 형태 모두 사용가능하다.
`module.exports`는 파일에서 한번만 사용 해야한다.

```js
const { odd, even } = require('./var.js')
const checkNumber = require('./func.js')

function checkOddEven(str) {
    if (number % 2) {
        return odd;
    } else {
        return even;
    }
}

module.exports = checkOddEven;
```
{:.note title="index.js"}

구조 분해 할당을 할때는 객체의 이름과 로컬변수의 이름이 같아야하지만, 단순 변수로 사용할 때는 이름이 달라도 된다.

{:.note}

JS와 Node의 모듈에는 차이가 있다.
* JS => export default + import from 구문
* Node => module.exports + require 구문

# 노드의 내장객체
## global
**노드의 전역 객체**
* 브라우저의 window같은 역할
* 모든 파일에서 접근 가능
* window처럼 생략도 가능(console, require도 global의 속성)

## global 속성 공유
global 속성에 값을 대입하면 다른 파일에서도 사용 가능
```js
//fileA
module.exports = () => global.message;

//file B
const A = require('./fileA');

global.message = '안녕하세요';
console.log(A());
``` 
## console 객체
브라우저의 console 객체와 유사하다
* **console.dir**: 객체를 로깅할 때 유용
* **console.time** + **console.timeEnd**: 실행시간 측정
* **console.error**: 에러 로깅 

## 타이머 메서드
* setTimeOut(콜백함수, 밀리초): 밀리초 후 콜백 함수 실행
* setInterval(콜백 함수, 밀리초): 밀리초마다 콜백 함수 반복 실행 
* setImmediate(콜백 함수): 콜백 함수를 즉시 실행, setTimeout(콜백,0)보다 권장한다. Immediate는 일반실행 보다 실행순서에 유리함이 있음

* clearTimeout
* clearInterval
* clearImmediate

## __filename, __dirname
__filename: 현재 파일 경로<br>
__dirname: 현재 폴더(디렉토리) 경로

## module, exports
```js
const odd = '홀수';
const even = '짝수';

exports.odd = odd;
exports.even = even;
```
`exports` 와 `module.exports`는 함께 사용할 수 없다. (서로의 참조 관계가 끊김)

## this
노드에서 this를 사용할 때 주의점
* 최상위 스코프의 `this`는 module.exports를 가리킴
* 그 외에는 브라우저의 자바스크립트와 동일
* 함수 선언문 내부의 this는 global 객체를 가리킴

## 모듈심화, 순환참조 (require)
* 모듈에서 파일을 읽을 때 같은 모듈이 여러번 있어도 cache를 통해 캐싱을 해서 다시 읽지 않는다.
* require가 제일 위에 올 필요는 없음
* require.main은 노드 실행 시 첫 모듈을 가리킴

**순환참조**<br>
```js
//file1 
require('/.file2');

//file2
require('/.file1');
```
위와 같은 경우 서로가 require를 하고 있음. 이때 file1의 module.exports는 빈 객체로 바뀌게된다.
## process
현재 실행중인 노드 프로세스에 대한 정보를 담고있음
### process.env
시스템 환경 변수들이 들어있는 객체
* 비밀키(데이터베이스 비밀번호, 서드파티 앱 키등)를 보관하는 용도로 쓰임
* 환경변수는 process.env로 접근 가능
* 일부 환경 변수는 노드 실행 시 영향을 미침<br>
노드 실행 옵션, 스레드풀 개수 등

### process.nextTick
이벤트 루프가 다른 콜백 함수들보다 nextTick의 콜백 함수를 우선적으로 처리함
* 너무 많이 사용될 경우 다른 콜백 함수의 실행이 늦어짐
* 비슷한 경우로 promise가 있음

### process.exit
현재의 프로세스를 멈춤
* 코드가 없거나 0이면 정상 종료
* 이외의 코드는 비정상 종료를 의미함

## os
운영체제의 정보를 담고 있으며 `require`을 통해 사용

## path
폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈
* 운영체제별로 경로 구분자가 다름(Windows: '\', POSIX: '/')
* join, resolve, isAbsolute 등 메서드 존재

join과 reslove의 차이: resolve는 /를 절대경로로 처리, join은 상대경로로 처리<br> 
윈도우에서 POSIX path를 쓰고 싶을경우 `path.posix`객체 사용

## url 모듈
인터넷 주소를 쉽게 조작하도록 도와주는 모듈<br>
[node url 문서 참고](https://nodejs.org/dist/latest-v12.x/docs/api/url.html)
### whatwg 방식
### node 기존 모듈
* url.parse(주소): 주소를 분해합니다. WHATWG 방식과 비교하면 username과 password대신 auth 속성이 있고, searchParams 대신 query가 있습니다
* url.format(객체): WHATWG 방식의 url과 기존 노드의 url 모두 사용할 수 있습니다. 분해되었던 url 객체를 다시 원래 상태로 조립합니다.

### searchParams
WHATWG 방식에서 쿼리스트링(search) 부분 처리를 도와주는 객체
* ?page=&limit=10&category=nodejs&category=javascript 부분

### querystring
기존 노드 방식에서는 url querystring을 querystring 모듈로 처리
* querystring.parse(쿼리): url의 query 부분을 자바스크립트 객체로 분해해줍니다.
* querystring.stringify(객체): 분해된 query 객체를 문자열로 다시 조립해줍니다.

## 단방향 암호화(crypto)
* 암호화는 가능하지만 복호화는 불가능
* 단방향 암호화의 예는 `해쉬` (sha256, 512등)

### hash 사용
* createHash(알고리즘): 사용할 해시 알고리즘을 넣어줍니다
* update(문자열): 변환할 문자열을 넣어줍니다.
* digest(인코딩): 인코딩할 알고리즘을 넣어줍니다.

### pbkdf2
현재는 pbkdf2나 bcrypt,scrypt 알고리즘으로 비밀번호를 암호화

## 양방향 암호화
### 대칭형 암호화
* key가 사용됨
* 암호화할 때와 복호화 할 때 같은 Key를 사용해야 함

## util
각종 편의 기능을 모아둔 모듈
* deprecated와 promisify가 자주 쓰임

```js
const utill = require('util');
const crypto = require('crypto');

const dontUserMe = util.deprecate((x,y) => {
    console.log(x+y);
}, 'deprecate: message');
dontUserMe(1,2);

const randomBytePromise = util.promisify(crypto.randomBytes);
randomBytePromise(64)
.then((buf) => {
    console.log(buf,toString('base64'));
})
.catch((error) => {
    console.error(error);
})
```

## worker_threads
노드에서 멀티 스레드 방식으로 작업할 수 있음
* `i$MainThread`: 현재 코드가 메인 스레드에서 실행되는지, 워커 스레드에서 실행되는지 구분
* 멀티 스레드에서는 `new Worker`를 통해 현재 파일(__filename)을 워커 스레드에서 실행시킴
* `worker.postMessage`로 부모에서 워커로 데이터를 보냄
* `parenProt.on('message')`로 부모로부터 데이터를 받고, postMessage로 데이터를 보냄

## child_process
```js
const exec = require('child_process').exec;

var process = spawn('python', ['test.py']);

process.stdout.on('data', function (data) {
    console.log(data.toString());
});

process.stderr.on('data', function (data) {
    console.error(data.toString());
})
```

## fs
파일 시스템에 접근하는 모듈
* 파일/폴더 생성, 삭제, 읽기, 쓰기 가능
* 웹 브라우저에서는 제한적이었으나 노드는 권한을 가지고 있음

```js
const fs = require('fs').promises;

fs.readFile('./readme.txt')
    .then((data) => {
        console.log(data);
        console.log(data.toString());
    })
    .catch((err) => {
        throw err;
    });
```

### 버퍼와 스트림
* 버퍼: 일정한 크기로 모아두는 데이터
    - 일정한 크기가 되면 한 번에 처리
    - 버퍼링: 버퍼에 데이터가 찰 때 까지 모으는 작업

```js
const buffer = Buffer.from('버퍼');
console.log(buffer);
console.log(buffer.length);
console.log(buffer.toString());

const array = [Buffer.from('띔'), Buffer.from('띔'), Buffer.from('띄어쓰기')];
console.log(Buffer.concat(array).toString());

console.log(Buffer.alloc(5));
```    
    
* 스트림: 데이터의 흐름
    - 일정한 크기로 나눠서 여러 번에 걸쳐서 처리
    - 버퍼(또는 청크)의 크기를 작게 만들어서 주기적으로 데이터를 전달
    - 스트리밍: 일정한 크기의 데이터를 지속적으로 전달하는 작업    

```js
const fs = require('fs');
const readStream = fs.createReadStream('/readme3.txt', {highWaterMark: 16});

const data = [];
readStream.on('data', (chunk) => {
    data.push(chunk);
    console.log('data', chunk, chunk.length);
});
readStream.on('end', () => {
    console.log('end', Buffer.concat(data).toString());
});
readStream.on('error', (err) => {
    console.log('error:', err);
});
```

### pipe와 스트림 메모리 효율
#### 파이프
```js
const fs = require('fs');
const zlib = require('zlib');

const readString = fs.createReadStream('./readme3.txt', {highWaterMark: 16});
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./writeme3.txt');
readStream.pipe(zlibStream).pipe(writeStream);
```

### 스레드풀
fs, crypto, zlib 모듈의 메서드를 실행할 떄는 백그라운드에서 동시에 실행됩니다. 
`UV_THREAD_POOL`

## 예외 처리
예외: 처리하지 못한 에러
#### try-catch
```js
setInterval(()=> {
    console.log('시작');
    try{
        throw new Error('에러');
    } catch (e) {
      console.error(err)
    }
},1000)
```

#### 콜백에서 에러 제공
```js
const fs = require('fs');

setInterval(()=> {
    fs.unlink('./abcdefg.js', (err) => {
    if(err) {
        console.error(err);
    }
   });
})
```

#### 프로미스의 에러는 따로 처리하지 않아도됨
