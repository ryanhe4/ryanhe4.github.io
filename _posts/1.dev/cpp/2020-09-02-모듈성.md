---
title: "C++  Modularity"
categories: dev
tags: c++
date: '2020-09-02 20:30:00 +0900'
image: >-
  https://raw.githubusercontent.com/cpp-tour/cpp-tour/master/docs/images/logo.png
---
C++의 모듈성에 대해 학습한다. 모듈성에는 분할컴파일, 모듈, 네임스페이스, 에러처리 등이 포함된다.

<!--more-->

* toc line
{:toc}

`C++ 프로그램`은 `함수`, `사용자 정의타입`, `클래스 계층`, `템플릿` 등 많은 개발 부분으로 구성되어있다.
가장 중요한 단계는 `인터페이스` 부분과 그것의 `구현`을 구별하는 것이다. 
언어 단계에서 C++는 인터페이스를 `선언`으로 나타낸다. `선언`은 사용하는데 필요한 모든 함수나 타입을 지정한다.

```c++
double sqrt(double); // the square root function takes a double and returns a double

class Vector {
public:
    Vector(int s);
    double& operator[](int i);
    int size();
private:
    double* elem; // elem points to an array of sz doubles
    int sz;
};
```

Example
{:.figcaption}

여기서 중요한 점은 함수 몸체(함수 정의)는 함수의 정의와 다른 곳에 존재한다는 것이다.

# 분할 컴파일
C++는 분할 컴파일 개념을 지원한다.
타입과 함수들의 정의는 소스파일을 분리하고 각각 컴파일 된다.
이러한 분리는 컴파일 시간을 최소화하고 프로그램의 완전히 논리적 구별 부분을 강요한다

인터페이스는 **.h** 파일에 저장한다.
구현은 **.cpp** 파일에 저장한다. (#include .h => 인터페이스 제공)

# 모듈(C++20)
**#include**의 사용은 굉장히 오래되고, 에러가 발생하기 쉽고, 부분적으로 프로그램 구성하는데 비용이 많이든다. 만약 `#include header.h`가
101개의 번역 단위에 있다면 `header.h`는 컴파일러에 의해 101번 처리된다. <br>
이런 문제에 대한 해결책으로 `module`이 C++에 등장했다. 모듈은 다음과 같이 사용한다.
```cpp
module;  // this compilation will define a module
// ... here we put stuff that Vector might need for its implementation ...
export module Vector; // defining the module called "Vector"
export class Vector {
public:
    Vector(int s);
    double& operator[](int i);
    int size();
private:
    double* elem; // elem points to an array of sz doubles
    int sz;
};
Vector::Vector(int s)
    :elem{new double[s]}, sz{s} // initialize members
{
}
double& Vector::operator[](int i)
{
    return elem[i];
}
int Vector::size()
{
    return sz;
}
export int size(const Vector& v) { return v.size(); }
``` 
{:.note title="file Vector.cpp"}


모든 멤버 함수 및 size함수를 포함하는 class Vertor를 export하는 Vector라는 모듈을 정의한다.<br>
이렇게 내보내진 모듈은 `import`를 통해서 사용할 수 있다.
```cpp
import Vector;  // get Vector's interface
#include <cmath> // get the standard-library math function interface including sqrt()

double sqrt_sum(Vector& v)
{
    double sum = 0;
    for (int i=0; i!=v.size(); ++i)
        sum+=std::sqrt(v[i]);// sum of square roots
    return sum;
}
```
 file user.cpp
 {:.figcaption}

**헤더와 모듈의 차이**
* 모듈을 한번만 컴파일 된다.
* 두 개의 모듈은 의미를 변경하지 않고 어느 순서로든 가져올 수 있다.
* 모듈로 무언가를 가져 오는 경우 모듈 사용자는 가져온 항목에 암시적으로 액세스 할 수 없으며 이에 의해 방해받지 않습니다

# 네임스페이스
C++는 일부 선언과 그것들이 함께 속해있는 `이름(name)`을 표시하는, 그리고 침범하지 않게 하는 매커니즘으로서 `namespace`를 제공한다.
```cpp
namespace My_code {
    class complex {
        // ...
    };
    complex sqrt(complex);
    // ...
    int main();
}
int My_code::main()
{
    complex z {1,2};
    auto z2 = sqrt(z);
    std::cout << '{' << z2.real() << ',' << z2.imag() << "}\n";
    // ...
}
int main()
{
    return My_code::main();
}
```
namespace
{:.figcaption}
 
코드를 My_Code 네임스페이스에 넣으면 해당 코드의 이름은 표준 라이브러리 이름(std)와 충돌하지 않는다.
namespace는 모든 이름을 using 구문을 통해 사용을 선언 할 수 있다.
```cpp
using namepace std;
```
using-directive를 사용하면 해당 네임 스페이스에서 이름을 선택적으로 사용할 수있는 기능을 잃게되므로이 기능은 일반적으로 응용 프로그램 (예 : std)에 널리 퍼져있는 라이브러리 또는 그렇지 않은 응용 프로그램에 대한 전환 중에 신중하게 사용해야합니다.
네임스페이즈는 주로 조직화된 큰 규모의 프로그램을 구성할 때 사용한다.(프로그램 개발 부분을 나눌 때)
# 에러 처리
오류 처리는 언어 기능을 넘어 프로그래밍 기술과 도구에 이르기까지 우려와 파급 효과가있는 크고 복잡한 주제이다.
C++는 이에 도움이 되는몇가지 특징들을 제공한다. 먼저 타입시스템 이다. C++의 기본제공타입과 구문보다 표준 라이브러리의 타입들과
알고리즘들이 프로그램에 적합하다. 이런 높은 수준의 구성들은 프로그래밍을 간편하게 하고, 실수를 줄여준다.
그리고 컴파일러는 에러를 잡아내도록 할수있다.  
## 예외
try, catch 구문
## 불변성
* 우리가 원하는것을 정확하게 이해하도록 도와준다.
* 구체적으로 우리를 강요합니다. 이는 (디버깅 및 테스트 후) 코드를 올바르게 가져올 수있는 더 나은 기회를 제공합니다.

## 에러처리 대안
에러처리에서 예외를 던지는 것은 유일한 방법이 아니다. 함수는 다음과 같은 방법으로 할당 된 작업을 수행 할 수 없음을 나타낼 수 있다.
* 예외 throw
* 실패를 나타내는 값을 반환
* 프로그램 중지(abort, exit, terminate)
에러 코드 반환 하는 경우
* 실패는 정상이며 예측 되는 경우. 예를 들어 파일 열기 요청이 실패하는 것.
* 즉각적인 호출자가 실패를 처리 할 것으로 예상 할 수 있습니다.
 
## Contract
C++ 20에 대한 Contract 메커니즘이 제안되었습니다. 목표는 테스트에 의존하여 프로그램을 올바르게 (광범위한 런타임 검사를 통해 실행) 얻은 다음
최소한의 검사로 코드를 배포하려는 사용자를 지원하는 것입니다. 이는 체계적이고 광범위한 검사에 의존하는 조직의 고성능 애플리케이션에서 널리 사용됩니다.
## Static_Assert
예외는 런타임에 발견 된 오류를 보고합니다. 컴파일 시간에 오류가 발견되면 일반적으로 그렇게하는 것이 좋습니다.
이것이 바로 사용자 정의 유형에 대한 인터페이스를 지정하기 위한 유형 시스템 및 기능의 목적입니다. 
그러나 컴파일 타임에 알려진 대부분의 속성에 대해 간단한 검사를 수행하고 컴파일러 오류 메시지로 기대를 충족하기 위해 실패를보고 할 수도 있습니다.
이때 `Static_assert`를 사용합니다.
```cpp
constexpr double C = 299792.458; // km/s
void f(double speed)
{
    constexpr double local_max = 160.0/(60*60); // 160 km/h == 160.0/(60*60) km/s
    static_assert(speed<C,"can't go that fast"); // error: speed must be a constant
    static_assert(local_max<C,"can't go that fast");
    // OK
    // ...
}
```
`static_assert(A,S)` 는 `A`가 `true`가 아닐때 `S` 메세지를 출력 합니다.

# 함수 인자와 반환 값
프로그램의 한 부분으로 부터 다른 부분으로의 주요하고 추천되는 정보 전달의 방법은 함수 호출을 통한 방법이다.
수행하는 작업들의 필요한 정보는 함수의 인자로 전달되고,생산된 결과는 리턴값으로 전달된다.

```cpp
int sum(const vector<int>& v)
{
    int s = 0;
    for (const int i : v)
        s += i;
    return s;
}
vector fib = {1,2,3,5,8,13,21};

int x = sum(fib);// x becomes 53
```  
중요한 것:
* 객체가 복사된것인가 공유된 것(reference 혹은 pointer)인가?
* 객체가 공유됐다면, 변할수 있는가?
* 객체가 move 되어 빈 객체가 뒤에 남는가?

기본적으로 인자 패싱과 값 반환의 동작은 복사이다. 그러나 일부 복사는 암시적으로 move로 최적화된다
## Argumnet Passing
가장먼저 생각해야할 것은 값들을 함수에 받는것이다. 기본적으로 pass-by-value를 통해 복사하고, 객체가 부른쪽의 환경이 되기를
원할경우 pass-by-reference로 참조한다.
```cpp
void test(vector<int> v, vector<int>& rv) // v is passed by value; rv is passed by
reference
{
    v[1] = 99; // modify v (a local variable)
    rv[2] = 66; // modify whatever rv refers to
}
int main()
{
    vector fib = {1,2,3,5,8,13,21};
    test(fib,fib);
    cout << fib[1] << '' << fib[2] << '\n'; // prints 2 66
}
```
성능적으로 봤을때, 작은 값은 by-value 로, 큰값은 by-reference로 넘긴다. `작은`은 복사의 비용이 정말 작은것을 의미한다.
"작은"의 의미는 장치 구조에 달려있다. 포인터 두개 또는 세개의 의 크기 이하는 좋은 규칙이다.

성능상의 이유로 참조로 전달하고 싶지만 인수를 수정할 필요가없는 경우 `sum()` 예제에서와 같이 상수 참조로 전달합니다. 
이것은 평범한 좋은 코드에서 가장 흔한 경우입니다. 빠르고 오류가 발생하지 않습니다.
## Value Return
결과를 계산하고 나면, 우리는 그 값을 함수 밖으로 호출자에게 돌려줘야한다. 다시말해서 기본적으로 값 반환은 복사이고 작은 객체가
복사에 이상적이다. 호출자에게 함수로의 지역에 국한되지 않은 항목에 대한 액세스 권한을 부여하려는 경우에만 `참조`로 반환합니다.
```cpp
class Vector {
public:
    // ...
    double& operator[](int i) { return elem[i]; } // return reference to ith element
private:
    double* elem;   // elem points to an array of sz
    // ...
};
```
백터의 `i`번째 요소는 첨자 연산자 호출과 독립적으로 존재하므로 참조로 반환한다. 

반면에 함수가 반환될 때 지역 변수가 사라지면 이것은 포인터 또는 참조로 반환할 수 없다. 
```cpp
int& bad()
{
    int x;
    // ...
    return x; // bad: return a reference to the local variable x
}
```
C++의 컴파일러는 분명히 `bad()` 내의 에러를 잡을것이다.

또한 함수의 반환 타입은 함수의 반환값으로부터 추론될수 있다.
```cpp
auto mul(int i, double d) { return i*d; }
``` 
이것은 generic 함수와 lamda에서 효율적이다, 그러나 사용에 주의해야한다. 왜냐하면 추론타입을 안정적인 인터페이스를 제공하지 않는다.
함수(또는 람다) 구현의 변화는 타입을 변경할 수 있다.

## Structured Binding(구조적 바인딩)
함수는 하나의 값만 반환하지만, 그 값은 많은 멤버를 가진 class 객체가 될 수 있다. 이것은 많은 값을 효율적으로 반환할 수 있게한다.
```cpp
struct Entry {
    string name;
    int value;
};
    Entry read_entry(istream& is) // naive read function (for a better version, see §10.5)
{
    string s;
    int i;
    is >> s >> i;
    return {s,i};
}

auto e = read_entry(cin);
cout << "{ " << e.name << "," << e.value << " }\n";
```   
`{s,i}` 는 `Entry`를 반환값으로 사용한다. 유사하게, 우리는 `Entry`의 멤버들을 지역 변수로 꺼낼 수 있다.
```cpp
auto [n,v] = read_entry(is);
cout << "{ " << n << "," << v << " }\n";
``` 
`auto [n, v]`는 두개의 지역변수를 선언하고 그들의 타입을 `read_entry()` 함수에서 추론하여 타입을 반환한다.<br>
이처럼 클래스 오브젝트로 부터 값을 지역변수로 꺼내는것을 `structured binding` 이라고 한다.

