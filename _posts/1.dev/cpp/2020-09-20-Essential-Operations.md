---
title: "C++ 필수 연산자"
categories: dev
tags: c++
date: '2020-09-20 19:30:00 +0900'
image: >-
  https://raw.githubusercontent.com/cpp-tour/cpp-tour/master/docs/images/logo.png
---
초기화, 대입, 복사, 이동 같은 일부 연산자들은 문자에서 그것들의 의미를 파악할수 있습니다. 그러므로 이런 연산자들은 기본적입니다. `==` 이나 `<<` 같은 다른 연산자는 관례적인 의미를 갖습니다. 
<!--more-->

* toc line
{:toc}

# 필수 연산자
객체의 생성은 많은 설계에서 중요한 역할을 합니다. 이러한 다양한 용도는 초기화를 지원하는 언어의 범위와 유연성의 특성에 반영됩니다.
생성자, 소멸자와 copy, move 연산자는 타입에 따라 논리적으로 분리되지 않습니다. 
```cpp
class X {
public:
    X(Sometype);            // 일반적인 생성자
    X();                    // 기본 생성자
    X (const X&);           // 복사 생성자
    X(X&&);                 // 이동 생성자
    X& operator=(const X&); // 복사 대입: 대상을 정리하고 복사
    X& operator=(X&&);      // 이동 대입: 대상을 정리하고 이동
    ~X();                   // 소멸자: 정리 작업
    // ...
};
```
**객체가 복사되거나 이동되는 다섯가지 상황**
* 대입 연산의 원본
* 객체 초기화
* 함수 인자
* 함수의 반환 값
* 예외

대입은 복사 또는 이동 대입 연산자를 사용합니다. 원칙적으로, 대입이 아닌 다른 경우 복사나 이동 생성자를 사용합니다. 
하지만 복사 또는 이동 생성자 호출은 가끔 대상 객체에서 바로 초기화하는 데 사용되는 객체를 구성하여 최적화됩니다.
```cpp
X make(Sometype);
X x= make(value);
```

`default` 를 통해 기본 복사 생성자, 또는 이동 생성자를 만들 수 있습니다.
```cpp
class Y {
public:
    Y(Sometype);
    Y(const Y&) = defualt;
    Y(Y&&) = default;
    //  ...
}
```
클래스가 포인터 멤버를 가지고있으면 복사 또는 이동 연산에 대해서 명시적으로 구현해야합니다. 포인터는 클래스가 삭제해야 할것을 가르킬 수 있기 때문 입니다. 이 경우 기본 멤버 별 복사가 잘못됩니다.<br>
좋은 규칙은 필수연산자 모두를 정의하거나 또는 아무것도 하지않는 것(기본값 사용) 입니다.
```cpp
struct Z {
    Vector v;
    string s;
};
Z z1;       // 기본 초기화 z1.v와 z1.s
Z z2 = z1;  // 기본 복사 z1.v 와 z1.s
```
`=default`를 보완하기 위해 암시적으로 해당 연산이 생성되지 않음을 나타내는 `=delete`가 있습니다.  
 ```cpp
class Shape {
public:
    Shape(const Shape&) =delete;    // 복사연산 없음
    Shape& operator=(const Shape&) =delete;
    //...
}; 
void copy(Shape& s1, const Shape& s2)
{
    s1 = s2; 
}
```

## 변환
하나의 인자를 받는 생성자는 그것의 인자 타입변환으로 정의합니다. 예를들면 `complex`는 `double`로부터 생성자를 제공합니다.
```cpp
complex z1 = 3.14
complex z2 = z1*2;
``` 
이러한 암시적 변환은 때때로 좋지만, 항상 그런것은 아닙니다. 
```cpp
Vector v1 = 7;  // v1은 7개의 인자를 갖습니다.
```
표준라이브러리 `vector`는 이러한 `int` - `vector` 변환을 허락하지 않습니다.<br>
이러한 문제를 피하기위한 방법은 명시적인 변환만을 허락하는 것 입니다. 생성자를 다음과 같이 정의할수 있습니다.
```cpp
class Vector{
public:
    explicit Vector(int s); // no implicit conversion from int to Vector
    //...
}
```

## 멤버 초기화
클래스의 데이터 멤버가 정의될 때, 초기화 리스트를 통해 기본적인 초기화를 제공할 수 있습니다. 
```cpp
class complex {
    double re = 0;
    double im = 0; // representation: two doubles with default value 0.0
public:
    complex(double r, double i) :re{r}, im{i} {}
    complex(double r) :re{r} {}
    complex() {}
    // ...
}

```

## Copy and Move
기본적으로 객체는 복사될수 있습니다. 이것은 기본제공 타입뿐만 아니라 사용자 정의타입의 객체 또한 포함됩니다.

예를 들어 `complex`를 사용하면
```cpp
void test(complex z1)
{
    complex z2 {z1}; // 복사 초기화
    complex z3;
    z3 = z2;        // 복사 할당
    //  ...
}
``` 
클래스를 디자인 할 때 항상 객체가 복사 될 수 있는지 여부와 어떻게 복사되는지 고려해야합니다.

### 컨테이너 복사
클래스가 리소스 핸들(resource handle)일때, 포인터를 사용할때 기본적인 멤버별 복사는 문제를 발생시킵니다. 예를들어 기본 복사를 하면
`Vector`의 복사본은 원본과 같은 위치를 가리킬 것 입니다. <br>
`Vector`가 소멸자를 가지고 있다는 사실은 기본 복사 의미가 잘못되었고 우리는 더 나은 복사 구현을 정의 해야 합니다.<br>

복사 생성자와 복사 대입 연산자(copy assignment)
```cpp
class Vector {
private:
    double* elem; // elem points to an array of sz doubles
    int sz;
public:
    Vector(int s);                      // constructor: establish invariant, acquire resources
    ~Vector() { delete[] elem; }        // destructor: release resources
    Vector(const Vector& a);            // 복사 생성자
    Vector& operator=(const Vector& a); // 복사 대입 연산자

    double& operator[](int i);
    const double& operator[](int i) const;

    int size() const;
};
```

복사 생성자:
```cpp
Vector::Vector(const Vector& a) // copy constructor
    :elem{new double[a.sz]},    // allocate space for elements
    sz{a.sz}
{
    for (int i=0; i!=sz; ++i)   // 복사 요소
    elem[i] = a.elem[i];
}
```
복사 대입 연산자:
```cpp
Vector& Vector::operator=(const Vector& a)  // copy assignment
{
    double* p = new double[a.sz];
    for (int i=0; i!=a.sz; ++i)
        p[i] = a.elem[i];
    delete[] elem;          // delete old elements
    elem = p;
    sz = a.sz;
    return *this;
}
```
`this`는 멤버함수 안에 미리 정의되고 멤버 함수가 호출되는 객체를 가르킵니다.

### 컨테이너 이동 
복사는 큰 컨테이너에서는 비용이 비쌀 수 있습니다. 우리는 객체를 함수에 넘길 때 참조를 사용하여 비싼 복사를 피할 수 있지만, 리턴 값으로 지역객체 참조자를 반환받지 못합니다.

이런 경우 이동 생성자/ 이동 대입연산자를 사용 합니다
```cpp
class Vector {
    // ...
    Vector(const Vector& a);            // copy constructor
    Vector& operator=(const Vector& a); // copy assignment

    Vector(Vector&& a);                 // move constructor
    Vector& operator=(Vector&& a);      // move assignment
};
```
주어진 정의에서, 컴파일러는 함수에서 반환 값의 전송에 *이동 생성자*를 선택할 것 입니다
```cpp
Vector::Vector(Vector&& a)
    :elem{a.elem},          // "grab the elements" from a
    sz{a.sz}
{
    a.elem = nullptr;       // now a has no elements
    a.sz = 0;
}
```
`&&`는 'rvalue 참조'를 의미하며, rvalue를 바인딩 할 수 있는 참조입니다. "rvalue"라는 단어는 "lvalue"를 보완하기위한 것으로 대략
 "대입의 왼쪽에 나타날 수있는 것"을 의미합니다. 따라서 rvalue는 – 첫 번째 근사치 – 함수 호출에 의해 반환 된 정수와 같이 할당 할 수 없는 값입니다.
 
 `std::move()`: 좌측값의 이름을 가려 우측 값(rvalue)으로 만드는 함수 
 
## 자원 관리
생성자, 복사 연산, 이동 연산, 소멸자를 정의함으로써 프로그래머는 객체의 자원 생애 주기를 완벽히 제어 합니다.
많은 언어에서 자원관리는 주로 garbage collector(gc)에 위임됩니다. C++도 garbage collection 인터페이스가 제공하므로 가비지 컬렉터에 연결할 수 있습니다.
하지만 가비지 컬렉터는 자원관리에서 클리너, 더욱 일반화 하고 더나은 지역화된 대안이 소진된 후 마지막 선택입니다.

가비지 컬렉터는 기본적으로 글로벌 메모리 관리 체계입니다. 현명한 구현은 보상할 수 있지만, 시스템이 더욱 분배(캐시, 멀티코어, 클러스터) 되고 지역성이 더욱 중요해집니다.

또한 자원은 메모리만이 아닙니다. 자원은 획득해야하는 모든것이고(명시적이나 암시적인), 사용후에 해제해야 합니다. 에제는 메모리, 락, 소켓, 파일 핸들
그리고 스레드 핸들입니다.  
자원은 스코프 사이에 이동 문법 또는 "스마트 포인터"를 사용해서 이동될 수 있고, "shared pointer"를 통해 소유권이 공유될수 있습니다. 

## Conventional Opertaion 관례적인 연산
관례적 연산자들은 관례를 따르게 해야 한다.

- 비교 : ==, !=, <, <=, >, >=
- 컨테이너 연산 : size(), begin(), end()
- 입력과 출력 연산 : >>, <<
- 사용자 정의 리터럴
- swap()
- 해시 함수 : hash<>

== 를 정의할 때는 != 도 정의. a != b 는 !(a==b) 를 의미해야 합니다.

마찬가지로 <를 정의할 때는 <=, >, >= 정의해야

### 컨테이너 연산자
컨테이너 설계는 표준 라이브러리 스타일 따라야 합니다. 필수 연산을 포함한 자원 핸들로 구현하여 자원을 안전하게 관리할 수 있습니다.

탐색은 인덱스 대신 표준 알고리즘의 반복자(iterator)로 정의되는 시퀀스 개념 사용.

`c.begin(), c.end()` // end() 는 마지막 요소 다음을 가리킴.

`for (auto& x : c)` // 암묵적으로 .begin(), .end() 를 사용.

### 입출력 연산자
두개의 정수 에서 `<<`는 왼쪽 시프트를 `>>`는 오른쪽으로 쉬프트를 의미합니다.

`iostreams`에서 해당 연산자들은 출력과 입력 연산자 입니다.

### 사용자 정의 리터럴
User-Defined Literal
 
Literal Operators 를 이용해서 정의 가능합니다.

**표준 라이브러리의 리터럴 접미사**
* chrono_literals h,min,s,ms,us,ns
* string_literals s
* string_literals sv
* complex_literals i,il,if

“Surprise!”s -> std::string

123s -> second

12.7i -> imaginary. 12.7i+47 = complex. (47,12.7)

### swap()
표준 라이브러리의 `std::swap(a,b)`는 세개의 이동 연산자로 구현되있다: `(tmp=a, a=b, b=tmp)`

### hash<>
표준라이브러리 `unorderd_map<K,V>`는 `K`를 키로 가지고 `V`를 값으로 갖는 해시 테이블이다.`X`를 키로 사용하려면 `hash<X>`를 정의해야합니다.
