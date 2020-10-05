---
title: C++ 사용자 정의 타입
categories: dev
tags: c++
date: '2020-09-01 12:30:00 +0900'
published: true
image: >-
  https://raw.githubusercontent.com/cpp-tour/cpp-tour/master/docs/images/logo.png
---
C++에는 const, 연산자와 다양한 기본 제공 타입들이 존재하지만, low-level이고  프로그래머에게 필요한
high-level의 편리한 기능들을 제공하지 않는다. <br>
**대신 C++은 정교한 `추상 메커니즘`을 제공한다.**

<!--more-->

* toc line
{:toc .large-only}

C++의 추상 메커니즘은 주로 프로그래머가 자신의 타입을 구현하는데 고안되엇다.
이러한 추상 메커니즘을 `사용자 정의타입(User-Defined Type)`이라 한다.

>사용자 정의 타입의 장점
* 사용하기 더 쉽다
* 에러가 적다
* 기본 제공타입을 직접 사용하는것보다 더 효율적이다.

## 구조체
```c++
struct Vector {
    int sz;
    double* elem;
}
```
구조체의 정의
{:.figcaption}

위의 구조체 `Vector`는 `int` 와 `double*`으로 구성되어있다.
Vector는 다음과 같이 정의하여 사용할 수 있다.
```c++
Vector v;
``` 
```c++
void f(Vector v, Vector& rv, Vector* pv)
{
    int i1 = v.sz;      // name
    int i2 = rv.sz;     // 참조
    int i3 = pv->sz;    //포인터
}
```
구조체의 사용
{:.figcaption}

## 클래스
클래스는 사용자 정의 타입에서 `데이터`, `연산자`, `함수`들의 연결이 필요할 때 사용한다.<br>
클래스는 멤버로 `data`, `function`, `type`을 갖는다.

* `public`: interface 정의
* `private`: interface를 통해서 접근가능
* `생성자(constructor)`: 클래스와 같은 이름의 멤버 함수, 클래스 객체(데이터)의 초기화를 보장한다. 
```c++
class Vector {
public:
    Vector(int s):elem{new double[s]}, sz{s} {}
    double& operator[] (int i_ {return elem[i]; }
    int size() { return sz;}
private:
    double* elem;
    int sz;
};
```

## 연합체(union)
union은 모든 멤버가 같은 주소에 할당된 구조체이다. 다음과 같은 경우 사용된다.
```c++
enum Type { ptr, num }; // a Type can hold values ptr and num (§2.5)

struct Entry {
    string name; // string is a standard-library type
    Type t;
    Node* p; // use p if t==ptr
    int i;   // use i if t==num
};
void f(Entry* pe)
{
    if (pe−>t == num)
        cout << pe−>i;
    // ...
}
```
위의 예제에서 p와 i는 절대 동시에 사용되지 않는다. 이때 p와 i를 union으로 정의해서 사용한다
```c++
union Value {
    Node* p;
    int i;
};
```
많은 상황에서 `std::variant`의 사용이 `union`보다 좋다.

## Enumerations
클래스에서는 C++는 간단한 사용자 정의 타입을 위한 `열거형`을 제공한다
```c++
enum class Color { red, blue, green};
enum class Traffic_light { green, yellow ,red};
Color col = Color::red;
Traffic_light light = Traffic_light::red;
```
여기서 `Color`와 `Traffic_light`의 `red`는 서로 다른 타입이다.
* 열거형은 상수의 잘못된 사용으로부터 보호한다.
```c++
Color x = red;                  // error
Color y = Traffic_light::red;   // error
Color z = Color::red;           // Success
```
* 열거형은 int로 암시적 변환할 수 없다.
```c++
int i = Color::red;     // error
Color c = 2;            // error
```
* 열거형을 명시적으로 변환할 수 있다.
```c++
Color x = Color{5};
Color y {6};
```
기본적으로 `enum class` 에는 할당, 초기화, 비교 연산자가 정의된다.<br> 
또한 열거형은 사용자 정의 타입이라 연산자를 정의 할수 있다.
