---
date: '2020-09-07 12:30:00 +0900'
title: '[Node.js] 이벤트루프 '
categories: dev
tags: node.js
layout: post
image: 'https://velopert.com/wp-content/uploads/2016/02/nodejs-2560x1440-950x534.png'
---
Node JS 호출스택, 이벤트 루프에 대한 정리
<!--more-->

* toc line
{:toc .large-only}

## 호출 스택, 이벤트루프
**호출 스택**<br>

![99988D425B8F74031F](https://user-images.githubusercontent.com/47705875/92343905-fa024180-f0ff-11ea-8622-8d816d14db50.png)
~~~js
function first() {
	second();
    console.log('첫 번째');
}
function second() {
	third;
    console.log('두 번째');
function thrid() {
	console.log('세 번째');
}
first();
~~~
다음 코드는 세번째 -> 두번째 -> 첫 번째 순으로 실행이된다. 이 코드에서 함수의 호출이 쌓이는 것을 `호출 스택`이라고 한다.  

**호출 스택(함수의 호출, 자료구조의 스택)**
* Anonymous는 가상의 전역 컨텍스트
* 함수 호출 순서대로 쌓이고 역순으로 실행됨
* 함수 실행이 완료되면 스택에서 빠짐
* `LIFO 구조`라서 스택이라고 불림

~~~js
function run() {
	console.log('3초 후 실행
}
console.log('시작');
setTimeout(run, 3000);
console.log('끝');
~~~
위 코드의 실행 순서
<detail> 
시작 -> 끝 -> 3초후 실행
</detail>
* 호출 스택만으로는 설명이 안됨
* 호출 스택 + 이벤트 루프로 설명 가능

**이벤트루프**
호출 스택, 백그라운드, 태스크 큐의 구조

<img width="857" alt="71538165-0b3c6100-296a-11ea-9c9c-a59a5efebbb7" src="https://user-images.githubusercontent.com/47705875/92343997-333ab180-f100-11ea-8cff-94e2598c9f92.png">

1. 함수가 실행되면 호출스택으로 이동
1. `setTimeout`, `promise` 등의 비동기 함수는 호출스택에서  백그라운드로 타이머를 보냄
1. 백그라운드는 타이머가 완료되면 `태스크 큐`로 이동
1. 태스크 큐에서 순서가 되면 `호출 스택`으로 함수를 이동
	* 태스크 큐에서 `Promise`가 일반 타이머 보다 우선순위가 높음

## ES2015 문법
ES2015 이전에는 `var`로 변수를 선언 <br>
`var`는 함수 스코프 `const`와 `let`은 블록 스코프를 사용

**const와 let**
~~~js
const a = 3;
a = '5'; // error

const b = {name: 'dog' };
b.name = 'cat'; // 가능
~~~
const는 한번 할당하면 변경 불가, let은 변경가능

**템플릿 문자열**
백릿(\`)을 활용  문자열 안에 변수를 사용할수 있다.
~~~js
var won = 1000;
const result = `이 과자는 ${won}원 입니다`;
~~~

**객체 리터럴**
~~~js
const object =  {
	sayJS() {
    	console.log('JS');
    },
    sayNode,
    [es + 6]: 'Fantastic',
};
object.sayNode();// Node
object.sayJS();// JS
console.log(object.ES6];	//fantastic
~~~

**화살표 함수(arrow function)**
~~~js
funtion add1(x,y) {
	return x + y;
}

const add2= (x,y) => {
	return x + y;
}
const add3 = (x, y) => x+y;
const add4 = (x,y) => (x + y);
~~~
>화살표 함수가 기존 function() {}을 대체하는 건 아님(this가 달라짐)

* `function`은 자신의 this를 가짐<br>
* `화살표 함수`는 자신의 this를 가지지 않음(부모의 this)

**비구조화 할당**<br>
객체 또는 배열에서 값을 꺼내 사용하는 방법 
~~~js
const example= { a: 123, b: { c:135, d: 146} }// 객체

const {a, b:{d}} = example;
const [x,,,y,z] = [1,2,3,4,5]	// 배열
~~~

**클래스**<br>
프로토타입 문법을 깔끔하게 작성할 수 있는 Class 문법 도입<br>
코드가 `그룹화`되어 가독성 향상됨
~~~js
class Dog extends Animal  {
	constructor(type, firstName, lastName) {
    	super(type);
        this.firstName = firstName;
        tihs.lastName = lastName;
    }
}
~~~

**Promise**
* 프로미스 : 내용이 실행은 되었지만 결과를 아직 반환하지 않은 객체
	- 프로미스 내부는 동기로 실행되고 then 이후는 비동기로 실행
* Then을 붙이면 결과를 반환
* 실행이 안료되지 않았으면 완료된 후에 Then 내부 함수가 실행

* Resolve(성공리턴값) -> `then`으로 연결
* Reject(실패리턴값) -> `catch`로 연결
* Finally 부분은 무조건 실행됨

**async/await**
* 프로미스 코드를 async/awiat을 사용으로 줄일 수 있음
* async 함수는 항상 promise를 반환
~~~js
async function findAndSaveUser(Users) {
	let user =await Users.findOne({});
    user.name = 'dog';
    user = await user.save();
    user = await User.findOne({ gender: 'm' });
}
~~~
